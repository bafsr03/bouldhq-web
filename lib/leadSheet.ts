/**
 * The "Bould Leads" Google Sheet — the one place the salesperson works from.
 *
 * Inbound leads (from /api/lead) and outbound prospects (from
 * scripts/prospect) both land here, through the Apps Script web app in
 * integrations/lead-sheet/Code.gs. One transport for both, so the sheet's
 * columns are defined in exactly one place: that script.
 *
 * The secret travels in the body, not a header: Apps Script's doPost cannot
 * read request headers.
 *
 * Like Resend delivery, this degrades rather than throws. A lead must never be
 * lost because the sheet was slow or misconfigured — callers log the failure
 * and carry on, and the email (or runtime log) still has the lead.
 */

import type { LeadPayload } from './leads'

const URL_ENV = 'LEAD_SHEET_WEBHOOK_URL'
const SECRET_ENV = 'LEAD_SHEET_SECRET'

/** Apps Script cold starts can take a few seconds; past this, give up. */
const TIMEOUT_MS = 10_000

export function leadSheetConfigured(): boolean {
  return Boolean(process.env[URL_ENV] && process.env[SECRET_ENV])
}

export type SheetAction =
  | { action: 'append_lead'; lead: Omit<LeadPayload, 'company_website_confirm' | 'elapsedMs'> }
  | { action: 'upsert_prospects'; prospects: Record<string, string | number>[] }

export type SheetResult = { ok: true; [k: string]: unknown } | { ok: false; error: string }

export async function postToLeadSheet(payload: SheetAction): Promise<SheetResult> {
  const url = process.env[URL_ENV]
  const secret = process.env[SECRET_ENV]
  if (!url || !secret) return { ok: false, error: 'lead sheet not configured' }

  try {
    const res = await fetch(url, {
      method: 'POST',
      // text/plain avoids a CORS preflight and is what Apps Script reads as postData.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret, ...payload }),
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    const text = await res.text()
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 200)}` }
    try {
      return JSON.parse(text) as SheetResult
    } catch {
      // A wrong deployment URL returns Google's HTML sign-in page with a 200.
      return { ok: false, error: `unexpected response: ${text.slice(0, 200)}` }
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/** The lead as the sheet should see it: no anti-spam fields. */
export function leadForSheet(lead: LeadPayload) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { company_website_confirm, elapsedMs, ...rest } = lead
  return rest
}
