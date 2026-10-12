import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { CASE_STUDIES } from '@/lib/content/work'

/**
 * Brief, technical spec: "submit the sitemap on launch day."
 *
 * Priorities encode the brief's own ordering: the audit and the Rubio case study
 * are the two pages the sales playbook actually runs on, so they sit level with
 * the commercial pages rather than being buried with the policies.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, freq: 'weekly' },
    { path: '/how-it-works', priority: 0.9, freq: 'monthly' },
    { path: '/visibility-audit', priority: 0.9, freq: 'monthly' },
    { path: '/pricing', priority: 0.9, freq: 'monthly' },
    { path: '/work', priority: 0.8, freq: 'weekly' },
    { path: '/industries', priority: 0.8, freq: 'monthly' },
    { path: '/industries/contractors', priority: 0.8, freq: 'monthly' },
    { path: '/web-design-utah-county', priority: 0.8, freq: 'monthly' },
    { path: '/web-design-west-jordan', priority: 0.8, freq: 'monthly' },
    { path: '/services/shopify-stores', priority: 0.7, freq: 'monthly' },
    { path: '/about', priority: 0.6, freq: 'yearly' },
    { path: '/contact', priority: 0.7, freq: 'yearly' },
    { path: '/privacy', priority: 0.2, freq: 'yearly' },
    { path: '/terms', priority: 0.2, freq: 'yearly' },
  ]

  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...CASE_STUDIES.map((cs) => ({
      url: `${SITE_URL}/work/${cs.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: cs.slug === 'rubio-brothers-concrete' ? 0.9 : 0.7,
    })),
  ]
}
