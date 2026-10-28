/**
 * The BouldLeads app (the call list Jake works from), over its small public API.
 *
 * Three uses, all server-side:
 *   - intake: every ranking-check request and results-page callback is saved
 *     there as a lead, and BouldLeads runs the top-3 check on it straight away;
 *   - check: the saved check behind a results page (/check/[slug]);
 *   - open: "the owner opened their link", shown on the lead card.
 *
 * BOULDLEADS_URL is the app's origin; BOULDLEADS_SECRET must equal its
 * PUBLIC_API_SECRET. Like the sheet and the email, this degrades rather than
 * throws: a lead is never lost because BouldLeads was slow or unconfigured.
 */

import type { LeadPayload } from './leads'

const TIMEOUT_MS = 20_000 // intake runs the Google check inline before answering

export function bouldLeadsConfigured(): boolean {
  return Boolean(process.env.BOULDLEADS_URL && process.env.BOULDLEADS_SECRET)
}

async function call(path: string, init: RequestInit = {}, timeoutMs = TIMEOUT_MS): Promise<Response | null> {
  const base = process.env.BOULDLEADS_URL
  const secret = process.env.BOULDLEADS_SECRET
  if (!base || !secret) return null
  return fetch(new URL(path, base), {
    ...init,
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json', ...init.headers },
    cache: 'no-store',
    signal: AbortSignal.timeout(timeoutMs),
  })
}

export type IntakeResult = { ok: true; id?: number; case?: string | null } | { ok: false; error: string }

/**
 * BouldLeads tags a lead by its kind: "Site request", "Google ads MN" for the
 * Minnesota ad landing page, or a callback on an existing check.
 */
function intakeKind(source: LeadPayload['source']) {
  if (source === 'check-callback') return 'callback'
  if (source === 'minnesota-quote') return 'google-ads-mn'
  return 'site'
}

/** Save a site lead in BouldLeads. */
export async function sendToBouldLeads(lead: LeadPayload): Promise<IntakeResult> {
  try {
    const res = await call('/api/public/intake', {
      method: 'POST',
      body: JSON.stringify({
        kind: intakeKind(lead.source),
        business: lead.business,
        // The quote form doesn't ask for a city; the state still narrows the profile lookup.
        city: lead.city ?? (lead.source === 'minnesota-quote' ? 'Minnesota' : undefined),
        service: lead.industry,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        website: lead.website,
        message: lead.need ? `What they need: ${lead.need}` : lead.message,
        slug: lead.checkSlug,
        utm: lead.utm,
        formSource: lead.source,
      }),
    })
    if (!res) return { ok: false, error: 'BouldLeads not configured' }
    const text = await res.text()
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 200)}` }
    return JSON.parse(text) as IntakeResult
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/** What a results page shows. Mirrors GET /api/public/check/[slug] in BouldLeads. */
export type PublicCheck = {
  name: string
  city: string | null
  query: string
  rank: number | null
  case: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
  title: string
  say: string
  rows: { name: string; rating: number | null; reviews: number | null; rank: number | null; you: boolean }[]
  checkedAt: number
}

/** null = no such link (404). Throws when BouldLeads can't be reached, so the page errors instead of lying. */
export async function fetchCheck(slug: string): Promise<PublicCheck | null> {
  const res = await call(`/api/public/check/${encodeURIComponent(slug)}`, {}, 8_000)
  if (!res) throw new Error('BouldLeads not configured (BOULDLEADS_URL / BOULDLEADS_SECRET)')
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`BouldLeads check ${res.status}`)
  return (await res.json()) as PublicCheck
}

export async function logCheckOpen(slug: string): Promise<void> {
  try {
    await call(`/api/public/check/${encodeURIComponent(slug)}/open`, { method: 'POST' }, 5_000)
  } catch {
    /* an uncounted open is not worth an error */
  }
}
