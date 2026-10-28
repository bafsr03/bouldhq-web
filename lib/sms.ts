/**
 * The automatic text a Minnesota ad lead gets the moment they ask for a quote
 * (Website Fixes + Minnesota Google Ads Launch, Oct 28, 2026, section 7).
 *
 * Sent through Twilio's REST API with a plain fetch, the same way the email
 * goes through Resend: no SDK for one POST. Needs TWILIO_ACCOUNT_SID,
 * TWILIO_AUTH_TOKEN and TWILIO_FROM_NUMBER (a number registered for A2P 10DLC,
 * or US carriers filter the message). Like the other deliveries it degrades
 * rather than throws: a text that fails never costs us the lead.
 */

const SID = process.env.TWILIO_ACCOUNT_SID
const TOKEN = process.env.TWILIO_AUTH_TOKEN
const FROM = process.env.TWILIO_FROM_NUMBER

export const QUOTE_TEXT =
  "Hey, it's Jake with Bould. Got your request. I'll call you shortly. If you want to talk now, call me at 801-200-4716."

export function smsConfigured(): boolean {
  return Boolean(SID && TOKEN && FROM)
}

/** US numbers as typed ("(612) 555-0134", "1-612-555-0134") to E.164, or null. */
export function toE164(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}

export async function sendText(phone: string, body: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!SID || !TOKEN || !FROM) return { ok: false, error: 'Twilio not configured' }
  const to = toE164(phone)
  if (!to) return { ok: false, error: `Not a US number: ${phone}` }
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${SID}:${TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: FROM, Body: body }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}: ${(await res.text()).slice(0, 200)}` }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
