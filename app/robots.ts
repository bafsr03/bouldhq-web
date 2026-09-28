import type { MetadataRoute } from 'next'
import { ALLOW_INDEXING, SITE_URL } from '@/lib/site'

/**
 * Brief, technical spec: "AI crawlers: keep them allowed."
 *
 * The brief calls this out as the one thing the current site already gets right
 * — once the content says what Bould actually does, AI search tools can read and
 * cite the new positioning. So the default rule is open, and the exceptions are
 * only the routes that must never be indexed: the lead API and anything under
 * Next's internals.
 *
 * Note the deliberate absence of a GPTBot / CCBot / ClaudeBot / PerplexityBot
 * disallow block. Adding one is the reflex for a store protecting a catalogue;
 * for a services business that wants to be recommended by an assistant, it is
 * self-harm.
 */
export default function robots(): MetadataRoute.Robots {
  // Staging, previews, and any deployment that has not explicitly opted in are
  // closed to crawlers entirely. See ALLOW_INDEXING in lib/site.ts.
  if (!ALLOW_INDEXING) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
