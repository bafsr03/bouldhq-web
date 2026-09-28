import type { Metadata } from 'next'
import { LEGAL_NAME } from './site'

/**
 * Builds a page's metadata.
 *
 * This helper exists because of a sharp edge in Next's metadata merging: a page
 * that declares its own `openGraph` object REPLACES the parent's wholesale
 * rather than merging field by field. Setting `openGraph: { title, description }`
 * on a page therefore silently drops the inherited `opengraph-image`, and the
 * page shares with no picture at all — which was happening on every page except
 * the homepage before this was introduced.
 *
 * Routing every page through one builder means the share card, the Twitter card,
 * and the canonical URL cannot be forgotten on a new page.
 */
export function pageMetadata(opts: {
  title: string
  description: string
  path: string
  /** True when `title` already contains the business name. */
  absoluteTitle?: boolean
  type?: 'website' | 'article'
}): Metadata {
  const { title, description, path, absoluteTitle, type = 'website' } = opts
  const fullTitle = absoluteTitle ? title : `${title} | ${LEGAL_NAME}`

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: LEGAL_NAME,
      locale: 'en_US',
      title: fullTitle,
      description,
      url: path,
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ['/opengraph-image'],
    },
  }
}
