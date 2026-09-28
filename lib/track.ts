/**
 * Brief, technical spec: "Tracking: click events on phone and email; form
 * submissions tagged by source."
 *
 * For a local business the phone tap IS the conversion, and it is invisible to
 * every default analytics setup — the visitor leaves for the dialer and nothing
 * is ever recorded. These helpers make calls and emails countable so the monthly
 * report the plan promises has something real in it.
 *
 * Deliberately provider-agnostic and failure-tolerant: if GA4 is not configured
 * yet, or an ad blocker removed gtag, a missed analytics event must never break
 * the link the user actually clicked.
 */

type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    gtag?: Gtag
    dataLayer?: unknown[]
  }
}

function emit(event: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  try {
    window.gtag?.('event', event, params)
  } catch {
    /* analytics must never break a click */
  }
}

export function trackContactClick(method: 'phone' | 'email', location: string) {
  emit(method === 'phone' ? 'phone_click' : 'email_click', {
    method,
    link_location: location,
  })
}

/** `source` identifies which form produced the lead: audit, contact, industry page. */
export function trackLeadSubmit(source: string, extra: Record<string, unknown> = {}) {
  emit('generate_lead', { lead_source: source, ...extra })
}

export function trackAuditComplete(score: number, verdict: string) {
  emit('audit_complete', { score, verdict })
}
