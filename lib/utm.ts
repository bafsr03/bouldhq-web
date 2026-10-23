/**
 * First-touch campaign attribution.
 *
 * Spec (Competitor Check v2, Part 3): "Save the UTM source" on every request.
 * The visitor usually lands on one page from an ad or a profile link and fills
 * the form on another, by which point the query string is gone — so the
 * parameters are kept in sessionStorage from the first page of the visit.
 *
 * sessionStorage can be missing or throw (private mode, blocked storage); a
 * lost UTM must never stop a lead from being sent, so every access is guarded.
 */

import type { LeadUtm } from './leads'

const KEY = 'bould:utm'
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as const

/** Store this page's campaign parameters, unless an earlier page of the visit already did. */
export function captureUtm(): void {
  try {
    if (sessionStorage.getItem(KEY)) return
    const q = new URLSearchParams(window.location.search)
    const utm: LeadUtm = {}
    for (const p of PARAMS) {
      const v = q.get(p)?.trim()
      if (v) utm[p] = v.slice(0, 200)
    }
    if (Object.keys(utm).length === 0) return
    utm.landing = window.location.pathname
    sessionStorage.setItem(KEY, JSON.stringify(utm))
  } catch {
    /* attribution is best-effort */
  }
}

export function readUtm(): LeadUtm | undefined {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as LeadUtm) : undefined
  } catch {
    return undefined
  }
}

/** "facebook / paid / fall-promo": one line for the email and the sheet. */
export function utmLine(utm: LeadUtm | undefined): string {
  if (!utm) return ''
  const parts = [utm.utm_source, utm.utm_medium, utm.utm_campaign].filter(Boolean)
  if (utm.gclid) parts.push('gclid')
  if (utm.fbclid) parts.push('fbclid')
  return parts.join(' / ')
}
