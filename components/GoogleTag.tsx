import Script from 'next/script'

/**
 * The Google tag, on every page: GA4 and Google Ads share one gtag.js load,
 * each with its own `config` call. Replaces <GoogleAnalytics> from
 * @next/third-parties, whose fixed script ids allow only one tag ID per page —
 * a second one for Ads would have been silently dropped.
 *
 * Loaded after the page is interactive, like the Meta Pixel. Conversions
 * (phone tap, Minnesota quote form) are sent from lib/track.ts.
 */
export default function GoogleTag({ ids }: { ids: string[] }) {
  if (ids.length === 0) return null
  return (
    <>
      <Script
        id="google-tag"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids[0])}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
${ids.map((id) => `gtag('config',${JSON.stringify(id)});`).join('\n')}`}
      </Script>
    </>
  )
}
