/**
 * Prospect engine: finds Wasatch Front service businesses, scores each one on
 * Bould's 20-point visibility audit, and ranks them into a call list.
 *
 *   npm run prospect -- --industry contractors --city "Provo, UT"
 *   npm run prospect -- --industry all --city utah --dry-run
 *
 * See README.md in this folder.
 */

import { parseArgs } from 'node:util'
import { inUtah, searchPlaces, type Place } from './discover'
import { citiesFor, tradesFor, type Trade } from './queries'
import { excludeReason, score, type Scored } from './score'
import { checkSite, pagespeed } from './siteCheck'
import { pool } from './cache'
import { toRow, upsertToSheet, writeCsv } from './sheet'
import { leadSheetConfigured } from '../../lib/leadSheet'

const HELP = `
Usage: npm run prospect -- [options]

  --industry <x>   all | contractors | home-services | auto | trade keys, comma-separated
                   (concrete, roofing, hvac, auto-repair, ...)          default: contractors
  --city <x>       utah | salt-lake | all | "Provo, UT" | "Provo;Orem"   default: utah
  --pages <n>      result pages per search, 1–3 (20 results each)        default: 1
  --limit <n>      keep at most n prospects (best first)                 default: 200
  --min-tier <t>   A | B | C — drop anything below this tier             default: C
  --no-pagespeed   skip the PageSpeed check (much faster)
  --dry-run        write the CSV only; do not touch the sheet
  --help
`

async function main() {
  const { values } = parseArgs({
    options: {
      industry: { type: 'string', default: 'contractors' },
      city: { type: 'string', default: 'utah' },
      pages: { type: 'string', default: '1' },
      limit: { type: 'string', default: '200' },
      'min-tier': { type: 'string', default: 'C' },
      'no-pagespeed': { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
  })
  if (values.help) return console.log(HELP)

  try {
    process.loadEnvFile('.env.local')
  } catch {
    /* env may come from the shell instead */
  }
  const placesKey = process.env.GOOGLE_PLACES_API_KEY
  const psiKey = process.env.PAGESPEED_API_KEY
  if (!placesKey) throw new Error('GOOGLE_PLACES_API_KEY is not set (.env.local). See scripts/prospect/README.md.')

  const trades = tradesFor(values.industry!)
  const cities = citiesFor(values.city!)
  const pages = Math.min(3, Math.max(1, Number(values.pages)))
  const limit = Number(values.limit)
  const minTier = (values['min-tier'] ?? 'C').toUpperCase()
  const runPagespeed = !values['no-pagespeed'] && Boolean(psiKey)
  const dryRun = values['dry-run']

  if (!dryRun && !leadSheetConfigured()) {
    throw new Error('LEAD_SHEET_WEBHOOK_URL / LEAD_SHEET_SECRET are not set. Use --dry-run for CSV only.')
  }

  // 1. Discover. Keep each business once, at its best rank.
  const searches = trades.flatMap((trade) =>
    cities.flatMap((city) => trade.terms.map((term) => ({ trade, city, query: `${term} in ${city}, UT` })))
  )
  console.log(`Searching ${searches.length} queries (${trades.length} trades × ${cities.length} cities)…`)

  const best = new Map<string, { place: Place; trade: Trade; city: string }>()
  const nameCounts = new Map<string, Set<string>>()
  await pool(searches, 4, async ({ trade, city, query }) => {
    const results = await searchPlaces(query, placesKey, pages)
    for (const place of results.filter(inUtah)) {
      const name = place.name.toLowerCase()
      if (!nameCounts.has(name)) nameCounts.set(name, new Set())
      nameCounts.get(name)!.add(place.id)
      const prev = best.get(place.id)
      if (!prev || place.rank < prev.place.rank) best.set(place.id, { place, trade, city })
    }
  })
  const counts = new Map([...nameCounts].map(([n, ids]) => [n, ids.size]))
  console.log(`Found ${best.size} unique businesses.`)

  // 2. Drop what nobody should call.
  const excluded = new Map<string, number>()
  const candidates = [...best.values()].filter(({ place }) => {
    const why = excludeReason(place, counts)
    if (why) excluded.set(why, (excluded.get(why) ?? 0) + 1)
    return !why
  })
  for (const [why, n] of excluded) console.log(`  excluded ${n}: ${why}`)

  // 3. Check websites and score.
  console.log(`Checking ${candidates.length} websites…`)
  let scored: Scored[] = await pool(candidates, 6, async ({ place, trade, city }) => {
    const site = await checkSite(place.website, { phone: place.phone, city, words: trade.words })
    return score(place, trade, city, site)
  })

  // PageSpeed is slow, so it runs only on the prospects that made a first cut,
  // then they are re-scored with it.
  if (runPagespeed) {
    const withSites = scored
      .filter((s) => s.site.kind === 'site' && s.site.reachable && s.tier !== 'C')
      .slice(0, limit)
    console.log(`Running PageSpeed on ${withSites.length} sites (this is the slow part)…`)
    await pool(withSites, 3, async (s) => {
      s.site.pagespeed = await pagespeed(s.site.url!, psiKey!)
    })
    scored = scored.map((s) => score(s.place, s.trade, s.city, s.site))
  } else if (!psiKey && !values['no-pagespeed']) {
    console.log('PAGESPEED_API_KEY not set; skipping speed checks.')
  }

  const tierRank = { A: 0, B: 1, C: 2 } as const
  const kept = scored
    .filter((s) => tierRank[s.tier] <= tierRank[minTier as 'A' | 'B' | 'C'])
    // Within a tier, Rubio lookalikes first: they are the first calls of the day.
    .sort(
      (a, b) =>
        tierRank[a.tier] - tierRank[b.tier] ||
        Number(b.rubioLookalike) - Number(a.rubioLookalike) ||
        b.opportunity - a.opportunity
    )
    .slice(0, limit)

  // 4. Output.
  const rows = kept.map(toRow)
  const csv = await writeCsv(rows)
  const tally = { A: 0, B: 0, C: 0 }
  kept.forEach((s) => tally[s.tier]++)
  console.log(`\n${kept.length} prospects — Tier A ${tally.A}, B ${tally.B}, C ${tally.C}`)
  const lookalikes = kept.filter((s) => s.rubioLookalike).length
  const spending = kept.filter((s) => s.adSignals.length).length
  console.log(`Rubio lookalikes: ${lookalikes} · already running ads or call tracking: ${spending}`)
  console.log(`CSV: ${csv}`)

  if (dryRun) {
    console.log('Dry run: the sheet was not touched.')
  } else {
    const { inserted, updated } = await upsertToSheet(rows)
    console.log(`Sheet: ${inserted} new, ${updated} refreshed (Status/Notes left as they were).`)
  }

  for (const s of kept.slice(0, 5)) {
    const flags = [s.rubioLookalike ? 'Rubio lookalike' : '', ...s.adSignals].filter(Boolean).join(', ')
    console.log(`\n[${s.tier} · ${s.opportunity}] ${s.place.name} — ${s.place.phone} — ${s.city}${flags ? ` (${flags})` : ''}`)
    console.log(`  ${s.siteIssues.slice(0, 3).join(' · ') || 'site looks fine'}`)
    console.log(`  ${s.opener}`)
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
