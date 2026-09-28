/**
 * Lead payload shape and validation, shared by the client forms and the API
 * route so the two can never disagree about what a lead is.
 */

export type LeadSource = 'visibility-audit' | 'contact' | 'industry' | 'pricing'

export type AuditAnswerSummary = {
  id: string
  question: string
  answer: 'yes' | 'no'
  points: number
}

export type LeadPayload = {
  source: LeadSource
  name: string
  business: string
  email: string
  phone?: string
  website?: string
  industry?: string
  city?: string
  /** Brief, contact page: "How did you hear about us?" — the attribution question. */
  heardVia?: string
  message?: string
  /** Present only for audit submissions. */
  audit?: {
    score: number
    total: number
    verdict: string
    answers: AuditAnswerSummary[]
  }
  /** Honeypot: must be empty. Real users never see this field. */
  company_website_confirm?: string
  /** Milliseconds the form was on screen before submit. */
  elapsedMs?: number
}

export type LeadResult =
  | { ok: true }
  | { ok: false; error: string; fields?: Record<string, string> }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateLead(input: Partial<LeadPayload>): {
  fields: Record<string, string>
} {
  const fields: Record<string, string> = {}

  if (!input.name?.trim()) fields.name = 'Please tell us your name.'
  if (!input.business?.trim()) fields.business = 'Please tell us your business name.'
  if (!input.email?.trim()) {
    fields.email = 'We need an email to send the audit to.'
  } else if (!EMAIL_RE.test(input.email.trim())) {
    fields.email = 'That email address does not look right.'
  }

  return { fields }
}

/**
 * Anti-spam, deliberately silent.
 *
 * Two signals, neither of which inconveniences a real person: an input that is
 * hidden from humans and must stay empty, and a minimum time on the form. Bots
 * fill every field and submit instantly. When either trips we return success to
 * the client and drop the lead — telling a bot why it failed only helps it.
 */
const MIN_FILL_MS = 2_000

export function looksAutomated(input: Partial<LeadPayload>): boolean {
  if (input.company_website_confirm) return true
  if (typeof input.elapsedMs === 'number' && input.elapsedMs < MIN_FILL_MS) return true
  return false
}
