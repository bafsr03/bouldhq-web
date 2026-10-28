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
    /** Meta Pixel (components/MetaPixel.tsx), when NEXT_PUBLIC_META_PIXEL_ID is set. */
    fbq?: (...args: unknown[]) => void
  }
}

/**
 * Google Ads conversions (Minnesota launch, Oct 28, 2026, section 7). The tag
 * itself loads in components/GoogleTag.tsx; each conversion is an
 * "AW-…/label" pair from the Ads account, and stays silent until both are set.
 */
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const ADS_PHONE_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_LABEL
const ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL

function adsConversion(label: string | undefined) {
  if (ADS_ID && label) emit('conversion', { send_to: `${ADS_ID}/${label}` })
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
  if (method === 'phone') adsConversion(ADS_PHONE_LABEL)
}

/**
 * `source` identifies which form produced the lead: ranking check, contact,
 * results-page callback. Also the Meta Pixel "Lead" event the ads optimize for.
 */
export function trackLeadSubmit(source: string, extra: Record<string, unknown> = {}) {
  emit('generate_lead', { lead_source: source, ...extra })
  // Only the Minnesota landing page's form counts as an ad conversion.
  if (source === 'minnesota-quote') adsConversion(ADS_LEAD_LABEL)
  try {
    window.fbq?.('track', 'Lead', { content_name: source })
  } catch {
    /* analytics must never break a submit */
  }
}
