/**
 * Step 4: hand the call list to the salesperson.
 *
 * Always writes a CSV (scripts/prospect/out/, gitignored) so a run is never
 * lost, then upserts into the "Prospects" tab through the same Apps Script the
 * site uses. Keys must match PROSPECT_DATA_COLUMNS in
 * integrations/lead-sheet/Code.gs.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { postToLeadSheet } from '../../lib/leadSheet'
import { PROSPECT_DIR } from './cache'
import type { Scored } from './score'

export type ProspectRow = Record<string, string | number>

export function toRow(s: Scored): ProspectRow {
  const p = s.place
  return {
    Tier: s.tier,
    Opportunity: s.opportunity,
    Business: p.name,
    Phone: p.phone ?? '',
    City: s.city,
    Industry: `${s.trade.industry} — ${s.trade.key}`,
    Opener: s.opener,
    'Top gaps': s.gaps.join('\n'),
    'Ask on call': s.askOnCall.join('\n'),
    'Est. score': `≈${s.estimate}/20 (${s.known} confirmed, ${s.unknownPoints} pts unchecked)`,
    Verdict: s.verdict,
    Plan: s.plan,
    Rating: p.rating ?? '',
    Reviews: p.reviews,
    'Map rank': p.rank,
    Website: s.site.url ?? '',
    'Site issues': s.siteIssues.join('\n'),
    'PageSpeed (mobile)': s.site.pagespeed ?? '',
    'Google category': p.category ?? p.primaryType ?? '',
    'Maps link': p.mapsUrl ?? '',
    Query: p.query,
    'Place ID': p.id,
    Refreshed: new Date().toISOString().slice(0, 10),
  }
}

export async function writeCsv(rows: ProspectRow[]): Promise<string> {
  const dir = path.join(PROSPECT_DIR, 'out')
  await mkdir(dir, { recursive: true })
  const file = path.join(dir, `prospects-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.csv`)
  const cols = rows.length ? Object.keys(rows[0]) : []
  const esc = (v: unknown) => {
    let s = String(v ?? '')
    // Same formula guard as the sheet: a phone like "+1 801…" opened in Excel
    // would otherwise be read as a formula.
    if (/^[=+\-@]/.test(s)) s = `'${s}`
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n')
  await writeFile(file, csv)
  return file
}

export async function upsertToSheet(rows: ProspectRow[]): Promise<{ inserted: number; updated: number }> {
  let inserted = 0
  let updated = 0
  // Apps Script requests time out at about 6 minutes of execution; 200 rows
  // per call stays far inside that.
  for (let i = 0; i < rows.length; i += 200) {
    const r = await postToLeadSheet({ action: 'upsert_prospects', prospects: rows.slice(i, i + 200) })
    if (!r.ok) throw new Error(`Sheet upload failed: ${r.error}`)
    inserted += Number(r.inserted ?? 0)
    updated += Number(r.updated ?? 0)
  }
  return { inserted, updated }
}
