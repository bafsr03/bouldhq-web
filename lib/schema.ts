/**
 * Structured data.
 *
 * Brief, technical spec: "Organization / ProfessionalService markup with the
 * chosen name, logo, phone, email, service area, and links to the Google profile
 * and every listing." The Shopify theme shipped none of this for the business
 * itself — only Dawn's stock product and article markup — so search engines had
 * nothing authoritative tying bouldhq.com to a real company, a real location, or
 * the Google Business Profile.
 *
 * Every builder below omits fields that are blank rather than emitting an empty
 * string. A `telephone: ""` is worse than no telephone: it is a contradiction
 * against the Google profile, which is precisely what the brief's "same name,
 * phone, area everywhere" scorecard item penalises.
 */

import {
  EMAIL,
  LEGAL_NAME,
  PHONE,
  SAME_AS,
  SERVICE_AREAS,
  SITE_URL,
} from './site'
import type { CaseStudy } from './content/work'
import type { Faq } from './content/pricing'

const ORG_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`

function compact<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => {
      if (v === undefined || v === null || v === '') return false
      if (Array.isArray(v) && v.length === 0) return false
      return true
    })
  ) as T
}

/**
 * Utah, Texas, and Minnesota are States; Utah County and Salt Lake County are
 * AdministrativeAreas. Emitting a county as a State (or the reverse) is the kind
 * of mismatch that makes Google ignore the field rather than reconcile it, so
 * the type travels with the name in SERVICE_AREAS.
 */
function areaServed() {
  return SERVICE_AREAS.map((a) => ({ '@type': a.type, name: a.name }))
}

/**
 * ProfessionalService is a subtype of LocalBusiness, which is what a
 * service-area business should be (brief, decision 9). `areaServed` carries the
 * counties; no `address` is emitted, because the profile hides the address and
 * the two must agree.
 */
export function organizationSchema() {
  return compact({
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: LEGAL_NAME,
    alternateName: 'Bould',
    url: `${SITE_URL}/`,
    email: EMAIL,
    telephone: PHONE || undefined,
    // Profile management is only in Golden Formula, so it is not claimed for
    // the business as a whole; the pricing page scopes it to that plan.
    description:
      'Websites for local service businesses and growing brands, built to turn visitors into calls and quote requests. Based in Utah, with clients in Utah, Texas, and Minnesota. Hosting and updates included.',
    /*
      Points at /icon, the generated 512x512 PNG, not at public/bould.svg.

      Two reasons, both from Google's logo requirements. The mark in bould.svg
      is a white wordmark on transparency, and the guidance is explicit: "if the
      logo is mostly white or gray, it may not look how you want it to look when
      displayed on a white background" — on Google's white UI it renders as
      nothing at all. And the format "must be supported by Google Images", which
      does not index SVG.

      /icon is drawn from that same bould.svg at build time (see lib/logo.ts), so
      there is still one mark on disk and no second copy to drift. It is a PNG,
      it is 512px square against the requirement of 112px minimum, and the dark
      tile means the mark is visible wherever Google puts it.
    */
    logo: compact({
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon`,
      contentUrl: `${SITE_URL}/icon`,
      width: 512,
      height: 512,
    }),
    image: `${SITE_URL}/opengraph-image`,
    priceRange: '$$',
    areaServed: areaServed(),
    sameAs: SAME_AS,
    knowsAbout: [
      'Website design',
      'Local SEO',
      'Google Business Profile optimization',
      'Shopify development',
      'Ecommerce website design',
      'Website maintenance and hosting',
    ],
  })
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: LEGAL_NAME,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  }
}

/** Wraps any set of nodes in a single @graph so one <script> carries the page. */
export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  }
}

export function webPageSchema(opts: {
  path: string
  name: string
  description: string
}) {
  return {
    '@type': 'WebPage',
    '@id': `${SITE_URL}${opts.path}#webpage`,
    url: `${SITE_URL}${opts.path}`,
    name: opts.name,
    description: opts.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: 'en-US',
  }
}

export function serviceSchema(opts: {
  name: string
  description: string
  path: string
  serviceType: string
}) {
  return compact({
    '@type': 'Service',
    '@id': `${SITE_URL}${opts.path}#service`,
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    provider: { '@id': ORG_ID },
    areaServed: areaServed(),
  })
}

export function faqSchema(faqs: Faq[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

/**
 * Case studies are marked up as Articles rather than Reviews: the subject is
 * Bould's own work, and a self-authored Review of your own service is exactly
 * the kind of markup Google treats as spam.
 */
export function caseStudySchema(cs: CaseStudy) {
  const path = `/work/${cs.slug}`
  return compact({
    '@type': 'Article',
    '@id': `${SITE_URL}${path}#article`,
    headline: cs.title,
    description: cs.description,
    about: cs.client,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: `${SITE_URL}${path}`,
    inLanguage: 'en-US',
  })
}
