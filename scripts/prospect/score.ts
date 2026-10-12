/**
 * Step 3: score each prospect on the same 20-point audit the website runs.
 *
 * AUDIT_QUESTIONS, verdictFor, and planFor are imported from the site, not
 * copied, so the score a prospect hears on a cold call is computed exactly the
 * way the /visibility-audit page will compute it when they fill it in — and
 * the plan the salesperson pitches is the one the pricing page recommends.
 *
 * Only six of the twelve questions can be answered from outside the business.
 * The rest become "Ask on call": the discovery questions for the first call.
 * The estimate counts half the points of every unanswered question, and the
 * sheet says so, so nobody quotes it as a measurement.
 */

import { AUDIT_QUESTIONS, TOTAL_POINTS, planFor, verdictFor } from '../../lib/content/audit'
import type { Place } from './discover'
import type { Trade } from './queries'
import type { SiteCheck } from './siteCheck'
import { CHAINS } from './queries'

type Answer = 'yes' | 'no' | 'unknown'

export type Scored = {
  place: Place
  trade: Trade
  city: string
  site: SiteCheck
  answers: Record<string, Answer>
  known: number
  unknownPoints: number
  estimate: number
  verdict: string
  plan: string
  siteIssues: string[]
  gaps: string[]
  askOnCall: string[]
  opener: string
  opportunity: number
  tier: 'A' | 'B' | 'C'
}

const Q = Object.fromEntries(AUDIT_QUESTIONS.map((q) => [q.id, q]))

/**
 * Why a prospect is dropped before scoring, or null to keep it. `nameCounts`
 * is how many times each lower-cased name appears across the whole run: the
 * same name in 4+ places is a chain whatever it is called.
 */
export function excludeReason(p: Place, nameCounts: Map<string, number>): string | null {
  const name = p.name.toLowerCase()
  if (p.status && p.status !== 'OPERATIONAL') return `not operational (${p.status})`
  if (!p.phone) return 'no phone number to call'
  if (CHAINS.some((c) => name.includes(c))) return 'national chain or franchise'
  if ((nameCounts.get(name) ?? 0) >= 4) return 'multi-location business'
  return null
}

export function score(place: Place, trade: Trade, city: string, site: SiteCheck): Scored {
  const name = place.name.toLowerCase()
  const category = `${place.category ?? ''} ${place.primaryType?.replace(/_/g, ' ') ?? ''}`.toLowerCase()
  const hasSite = site.kind === 'site' && site.reachable === true

  const answers: Record<string, Answer> = {
    'gbp-verified': 'unknown',
    'gbp-category': !category.trim() ? 'unknown' : trade.words.some((w) => category.includes(w)) ? 'yes' : 'no',
    reviews: place.reviews >= 20 && (place.rating ?? 0) >= 4.5 ? 'yes' : 'no',
    'recent-activity': 'unknown',
    'map-pack': place.rank <= 3 ? 'yes' : 'no',
    'own-name': 'unknown',
    listings: 'unknown',
    'nap-consistent': hasSite && site.phoneMatches !== undefined ? (site.phoneMatches ? 'yes' : 'no') : 'unknown',
    'name-says': trade.words.some((w) => name.includes(w)) ? 'yes' : 'no',
    'one-market': 'unknown',
    timing: trade.seasonal ? 'no' : 'yes',
    baseline: 'unknown',
  }

  let known = 0
  let unknownPoints = 0
  for (const q of AUDIT_QUESTIONS) {
    if (answers[q.id] === 'yes') known += q.points
    if (answers[q.id] === 'unknown') unknownPoints += q.points
  }
  const estimate = Math.round(known + unknownPoints / 2)
  const verdict = verdictFor(estimate)
  const plan = planFor(estimate)

  const siteIssues = describeSite(site)

  // Gaps the business can act on, heaviest first. Seasonality is a fact about
  // the trade, not a gap, so it shapes timing rather than the pitch.
  const gaps = AUDIT_QUESTIONS.filter((q) => answers[q.id] === 'no' && q.id !== 'timing')
    .sort((a, b) => b.points - a.points)
    .map((q) => `${shortGap(q.id, place, trade, city)} → ${q.fix}`)

  const askOnCall = AUDIT_QUESTIONS.filter((q) => answers[q.id] === 'unknown').map((q) => q.question)

  const opportunity = opportunityScore(place, site, answers)
  const tier: Scored['tier'] =
    opportunity >= 60 && place.reviews >= 10 ? 'A' : opportunity >= 40 && place.reviews >= 5 ? 'B' : 'C'

  return {
    place,
    trade,
    city,
    site,
    answers,
    known,
    unknownPoints,
    estimate,
    verdict: verdict.label,
    plan: `${plan.name} (${plan.price}/mo)`,
    siteIssues,
    gaps: gaps.slice(0, 3),
    askOnCall,
    opener: opener(place, trade, city, site, answers, estimate),
    opportunity,
    tier,
  }
}

/**
 * Who is worth the salesperson's first hour: a real, established business
 * (it can pay, and it has something to lose) with a gap they can see.
 * 0–100. Independent of the audit estimate on purpose: a 4/20 business with
 * three reviews is less likely to buy than a 9/20 one with ninety.
 */
function opportunityScore(p: Place, site: SiteCheck, a: Record<string, Answer>): number {
  let need = 0
  if (site.kind === 'none') need += 35
  else if (site.kind === 'social') need += 30
  else if (!site.reachable) need += 30
  else {
    if (site.pagespeed !== undefined && site.pagespeed < 50) need += 10
    if (!site.telLink) need += 6
    if (!site.mobileViewport) need += 8
    if (!site.https) need += 4
    if (site.copyrightYear && site.copyrightYear < new Date().getFullYear() - 1) need += 5
    if (!site.titleNamesService) need += 3
  }
  if (a['map-pack'] === 'no') need += 15
  if (p.reviews < 20) need += 8
  if ((p.rating ?? 5) < 4.3) need += 4
  if (a['gbp-category'] === 'no') need += 4
  if (a['nap-consistent'] === 'no') need += 4
  need = Math.min(need, 70)

  // Established and earning: reviews are the best outside proxy for both.
  const established = p.reviews >= 50 ? 30 : p.reviews >= 15 ? 22 : p.reviews >= 5 ? 12 : 0

  // Already winning on every visible front: nothing to sell yet.
  const strong =
    (p.rating ?? 0) >= 4.7 &&
    p.reviews >= 100 &&
    a['map-pack'] === 'yes' &&
    site.kind === 'site' &&
    site.reachable &&
    (site.pagespeed ?? 100) >= 80
  if (strong) return 5

  return Math.min(100, need + established)
}

function describeSite(s: SiteCheck): string[] {
  if (s.kind === 'none') return ['No website on the Google listing']
  if (s.kind === 'social') return [`"Website" is a social page: ${s.url}`]
  if (!s.reachable) return [`Website does not load (${s.error ?? 'error'})`]
  const out: string[] = []
  if (s.pagespeed !== undefined) out.push(`Mobile speed ${s.pagespeed}/100`)
  if (!s.mobileViewport) out.push('Not mobile-friendly (no viewport tag)')
  if (!s.telLink) out.push('No tap-to-call link')
  if (!s.form) out.push('No contact form found')
  if (!s.https) out.push('Not secure (no HTTPS)')
  if (s.copyrightYear && s.copyrightYear < new Date().getFullYear() - 1) out.push(`Footer says © ${s.copyrightYear}`)
  if (!s.titleNamesService) out.push(`Page title doesn't name the service ("${s.title?.slice(0, 60) ?? ''}")`)
  if (s.platform) out.push(`Built on ${s.platform}`)
  return out
}

function shortGap(id: string, p: Place, t: Trade, city: string): string {
  switch (id) {
    case 'reviews':
      return `${p.reviews} reviews, ${p.rating ?? '–'}★`
    case 'map-pack':
      return `#${p.rank} for "${t.terms[0]} in ${city}"`
    case 'gbp-category':
      return `Google category is "${p.category ?? p.primaryType}"`
    case 'nap-consistent':
      return 'Listing phone not found on website'
    case 'name-says':
      return "Name doesn't say the trade"
    default:
      return Q[id]?.question ?? id
  }
}

/**
 * The first sentence of the call. Built from the two most concrete, checkable
 * facts, so the owner can confirm them while still on the phone.
 */
function opener(
  p: Place,
  t: Trade,
  city: string,
  site: SiteCheck,
  a: Record<string, Answer>,
  estimate: number
): string {
  const facts: string[] = []
  if (site.kind === 'none') facts.push("people who find you on Google have no website to click through to")
  else if (site.kind === 'social') facts.push('your Google listing sends people to a social page instead of a website')
  else if (!site.reachable) facts.push("the website on your Google listing isn't loading")
  if (a['map-pack'] === 'no') facts.push(`you're #${p.rank} when someone searches "${t.terms[0]} in ${city}" — the map box only shows three`)
  if (a.reviews === 'no') facts.push(p.reviews < 20 ? `you have ${p.reviews} Google reviews, and the businesses above you have more` : `your rating is ${p.rating}★`)
  if (site.kind === 'site' && site.reachable) {
    if (site.pagespeed !== undefined && site.pagespeed < 50) facts.push(`your site scores ${site.pagespeed}/100 for speed on a phone`)
    else if (!site.telLink) facts.push("there's no tap-to-call button on your site")
  }
  const why =
    facts.length >= 2
      ? `The two big ones: ${facts[0]}, and ${facts[1]}.`
      : facts.length === 1
        ? `The big one: ${facts[0]}.`
        : 'You are in decent shape, but there are a couple of gaps worth five minutes.'
  return (
    `Hi, is this the owner of ${p.name}? This is [your name] with Bould — we're based here in Utah. ` +
    `I ran ${p.name} through the same 20-point Google visibility check we use for our clients — ` +
    `you came out around ${estimate} out of ${TOTAL_POINTS}. ${why} ` +
    `Can I send you the full breakdown? It's free.`
  )
}
