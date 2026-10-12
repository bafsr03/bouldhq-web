/**
 * Step 2: look at the prospect's website the way a customer on a phone would.
 *
 * This is the "conversion" half of Leads = Visibility x Conversion. One GET of
 * the homepage, plus an optional PageSpeed run. Every check here is something
 * the salesperson can say out loud and the owner can verify in ten seconds —
 * "there's no tap-to-call button on your site" — which is what makes it an
 * opener rather than a pitch.
 */

import { cached } from './cache'

export type SiteCheck = {
  /** none: no website on the listing. social: the "website" is Facebook, Yelp, etc. */
  kind: 'none' | 'social' | 'site'
  url?: string
  reachable?: boolean
  https?: boolean
  mobileViewport?: boolean
  title?: string
  titleNamesService?: boolean
  titleNamesCity?: boolean
  telLink?: boolean
  form?: boolean
  copyrightYear?: number
  platform?: string
  /** The Google listing's phone number appears on the page. */
  phoneMatches?: boolean
  /** Lighthouse mobile performance, 0–100. */
  pagespeed?: number
  error?: string
}

const SOCIAL = /(facebook|instagram|yelp|linktr\.ee|nextdoor|business\.site|google\.com|tiktok|x\.com|twitter)\./i

const PLATFORMS: [string, RegExp][] = [
  ['Wix', /wixstatic\.com|_wixCssImports|wix-code|X-Wix/i],
  ['Squarespace', /static1\.squarespace\.com|squarespace-cdn/i],
  ['GoDaddy', /img1\.wsimg\.com|GoDaddy Website Builder|godaddysites/i],
  ['Weebly', /weebly\.com|editmysite\.com/i],
  ['Duda', /multiscreensite|dudaone|dudamobile/i],
  ['Shopify', /cdn\.shopify\.com/i],
  ['WordPress', /wp-content|wp-includes/i],
]

const UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'

export async function checkSite(
  website: string | undefined,
  ctx: { phone?: string; city: string; words: string[] }
): Promise<SiteCheck> {
  if (!website) return { kind: 'none' }
  let host: string
  try {
    host = new URL(website).hostname
  } catch {
    return { kind: 'site', url: website, reachable: false, error: 'invalid URL on the listing' }
  }
  if (SOCIAL.test(host)) return { kind: 'social', url: website }

  return cached('site', website, 14, async (): Promise<SiteCheck> => {
    try {
      const res = await fetch(website, {
        headers: { 'User-Agent': UA, Accept: 'text/html' },
        redirect: 'follow',
        signal: AbortSignal.timeout(15_000),
      })
      const html = (await res.text()).slice(0, 2_000_000)
      const finalUrl = res.url || website
      const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '')
        .replace(/\s+/g, ' ')
        .trim()
      const lowerTitle = title.toLowerCase()
      const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')

      const years = [...text.matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/gi)]
        .map((m) => Number(m[1]))
        .filter((y) => y > 1995 && y <= new Date().getFullYear() + 1)

      const headers = [...res.headers.entries()].map(([k, v]) => `${k}: ${v}`).join('\n')

      return {
        kind: 'site',
        url: finalUrl,
        reachable: res.ok,
        https: finalUrl.startsWith('https://'),
        mobileViewport: /<meta[^>]+name=["']viewport["']/i.test(html),
        title,
        titleNamesService: ctx.words.some((w) => lowerTitle.includes(w)),
        titleNamesCity: lowerTitle.includes(ctx.city.toLowerCase()),
        telLink: /href=["']tel:/i.test(html),
        // Static HTML only: builders that inject forms with JavaScript read as
        // "no form", which is why the sheet calls it "no form found".
        form: /<form[\s>]/i.test(html),
        copyrightYear: years.length ? Math.max(...years) : undefined,
        platform: PLATFORMS.find(([, re]) => re.test(html) || re.test(headers))?.[0],
        phoneMatches: ctx.phone ? phonePattern(ctx.phone).test(text) : undefined,
        error: res.ok ? undefined : `HTTP ${res.status}`,
      }
    } catch (err) {
      return {
        kind: 'site',
        url: website,
        reachable: false,
        error: err instanceof Error ? err.message : String(err),
      }
    }
  })
}

/** "(801) 555-1234" → matches 801-555-1234, 801.555.1234, (801) 555 1234, 8015551234, tel:+18015551234. */
function phonePattern(phone: string): RegExp {
  const d = phone.replace(/\D/g, '').slice(-10)
  if (d.length !== 10) return /$^/
  const sep = '[\\s.\\-()]*'
  return new RegExp(`${d.slice(0, 3)}${sep}${d.slice(3, 6)}${sep}${d.slice(6)}`)
}

/**
 * Lighthouse mobile performance via the PageSpeed Insights API. Slow (10–40 s
 * per URL), so it runs only for prospects that survive the first cut, and is
 * cached for two weeks.
 */
export async function pagespeed(url: string, apiKey: string): Promise<number | undefined> {
  return cached('pagespeed', url, 14, async () => {
    const q = new URLSearchParams({ url, key: apiKey, strategy: 'mobile', category: 'performance' })
    try {
      const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`, {
        signal: AbortSignal.timeout(90_000),
      })
      if (!res.ok) return undefined
      const data = (await res.json()) as {
        lighthouseResult?: { categories?: { performance?: { score?: number } } }
      }
      const score = data.lighthouseResult?.categories?.performance?.score
      return typeof score === 'number' ? Math.round(score * 100) : undefined
    } catch {
      return undefined
    }
  })
}
