/**
 * Cloudflare Turnstile verification for the lead forms.
 *
 * Off until TURNSTILE_SECRET_KEY is set (local dev, previews), in which case
 * every request passes and the honeypot + timing checks in lib/leads.ts are the
 * only bot filter. If Cloudflare itself can't be reached the lead is let
 * through: losing a real enquiry costs more than one spam email.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(token: string | undefined, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip) body.set('remoteip', ip)
    const res = await fetch(VERIFY_URL, { method: 'POST', body, signal: AbortSignal.timeout(5_000) })
    const json = (await res.json()) as { success?: boolean }
    return json.success === true
  } catch (err) {
    console.error('[lead] turnstile unreachable, letting the lead through', err)
    return true
  }
}
