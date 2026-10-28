/**
 * Lead payload shape and validation, shared by the client forms and the API
 * route so the two can never disagree about what a lead is.
 */

export type LeadSource =
  | 'ranking-check'
  | 'check-callback'
  | 'contact'
  | 'industry'
  | 'pricing'
  /** The quote form on /web-design-minnesota, where every Minnesota ad click lands. */
  | 'minnesota-quote'

/** First-touch campaign parameters, captured by components/UtmCapture.tsx. */
export type LeadUtm = Partial<
  Record<
    'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content' | 'gclid' | 'fbclid' | 'landing',
    string
  >
>

export type LeadPayload = {
  source: LeadSource
  name: string
  business: string
  email: string
  phone?: string
  website?: string
  /** Ranking check: "What you do", in the owner's words ("concrete contractor"). */
  industry?: string
  city?: string
  /** Brief, contact page: "How did you hear about us?" — the attribution question. */
  heardVia?: string
  message?: string
  /** Minnesota quote form: "What do you need?" (New website / Redo my website / Not sure). */
  need?: string
  /** Callbacks from a results page: which check the owner was looking at. */
  checkSlug?: string
  utm?: LeadUtm
  /** Cloudflare Turnstile token; the widget adds it to the form under this name. */
  'cf-turnstile-response'?: string
  /** Honeypot: must be empty. Real users never see this field. */
  company_website_confirm?: string
  /** Milliseconds the form was on screen before submit. */
  elapsedMs?: number
}

export type LeadResult =
  | { ok: true }
  | { ok: false; error: string; fields?: Record<string, string> }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /\d.*\d.*\d.*\d.*\d.*\d.*\d/ // at least seven digits, any formatting

export function validateLead(input: Partial<LeadPayload>): {
  fields: Record<string, string>
} {
  const fields: Record<string, string> = {}
  const callback = input.source === 'check-callback'
  const check = input.source === 'ranking-check'
  const quote = input.source === 'minnesota-quote'

  if (!input.name?.trim()) fields.name = 'Please tell us your name.'

  // A callback from a results page only needs a name and a number to call.
  if (!callback) {
    if (!input.business?.trim()) fields.business = 'Please tell us your business name.'
    if (!input.email?.trim()) {
      fields.email = 'We need an email so we can reach you.'
    } else if (!EMAIL_RE.test(input.email.trim())) {
      fields.email = 'That email address does not look right.'
    }
  }

  // The ranking check is run from the city and the service, and ends in a call.
  if (check) {
    if (!input.city?.trim()) fields.city = 'Which city are your customers in?'
    if (!input.industry?.trim()) fields.industry = 'Tell us what you do, like "concrete contractor".'
  }
  // An ad lead gets a call back within a business day, so it needs a number and an answer.
  if (quote && !input.need?.trim()) fields.need = 'Tell us what you need.'
  if (check || callback || quote) {
    if (!input.phone?.trim()) fields.phone = 'We need a number to call you back.'
    else if (!PHONE_RE.test(input.phone)) fields.phone = 'That phone number does not look right.'
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
