/**
 * Single source of truth for NAP (name / address / phone), navigation, and
 * positioning copy.
 *
 * The redesign brief's visibility plan turns on one rule: the business name,
 * phone, and service area must be byte-identical on the site, in the JSON-LD,
 * on the Google Business Profile, and in every directory listing. Anything that
 * appears in more than one of those places is defined here once and imported —
 * so a later switch to a "Bould Websites" DBA (brief, decision 1) is a one-file
 * change rather than a hunt through templates.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bouldhq.com'
).replace(/\/$/, '')

/**
 * Brief, decision 1: use the incorporated name "Bould Inc" everywhere now, with
 * the option to switch to a registered "Bould Websites" DBA later. Google
 * requires the profile name to match the real-world name, so this string is the
 * one that has to match the profile — not a marketing variant.
 */
export const LEGAL_NAME = 'Bould Inc'
export const BRAND = 'Bould'

/**
 * The business phone.
 *
 * Two forms, because they are read by different things. `PHONE` is E.164 and is
 * what `tel:` links and the JSON-LD `telephone` field use — no spaces, no
 * punctuation, country code included, which is the only format every dialer and
 * every crawler parses the same way. `PHONE_DISPLAY` is what a human reads.
 *
 * This number must stay byte-identical to the one on the Google Business
 * Profile and on every directory listing. The brief's scorecard docks a point
 * for inconsistency here, and one stale number on one old listing is enough to
 * split a business's search presence in two.
 *
 * Hard-coded rather than env-only so it cannot go missing in an environment
 * that was provisioned without it; the env vars remain as an override for
 * previews or a future number change.
 */
export const PHONE = process.env.NEXT_PUBLIC_BOULD_PHONE || '+18012004716'
export const PHONE_DISPLAY =
  process.env.NEXT_PUBLIC_BOULD_PHONE_DISPLAY || '(801) 200-4716'
export const EMAIL = 'jake@bouldhq.com'

/**
 * Brief, decision 9: a home-office business registers with Google as a
 * service-area business — the street address stays hidden and the service areas
 * are listed instead. These strings feed both the footer and the JSON-LD
 * `areaServed`, and must match the profile's service areas.
 */
export const SERVICE_AREAS = [
  { name: 'Utah County', region: 'UT' },
  { name: 'Salt Lake County', region: 'UT' },
] as const

export const SERVICE_AREA_LABEL = 'Utah County & Salt Lake County, Utah'

/** Short form for tight spaces such as the hero eyebrow, which must not wrap. */
export const SERVICE_AREA_SHORT = 'Utah County & Salt Lake'

export const GBP_URL = process.env.NEXT_PUBLIC_GBP_URL ?? ''

/**
 * Brief, technical spec: the Google Business Profile link carries UTM so profile
 * traffic is separable from organic in analytics. Applied to any outbound link
 * that Bould controls the destination of.
 */
export const GBP_UTM =
  '?utm_source=google&utm_medium=business_profile&utm_campaign=website'

export const SOCIAL = {
  linkedin: '',
  instagram: '',
  facebook: '',
} as const

/**
 * `sameAs` in the Organization schema is how Google reconciles the site with
 * every listing and profile — the "own your own name" half of the brief's
 * visibility plan. Blank entries are filtered out so the schema never ships a
 * dangling URL.
 */
export const SAME_AS: string[] = [
  GBP_URL,
  SOCIAL.linkedin,
  SOCIAL.instagram,
  SOCIAL.facebook,
].filter(Boolean)

/** Brief, site map: "Nav: How it works, Pricing, Work, Industries, Free audit, Contact." */
export const NAV = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/work', label: 'Work' },
  { href: '/industries/contractors', label: 'Industries' },
  { href: '/visibility-audit', label: 'Free audit' },
  { href: '/contact', label: 'Contact' },
] as const

/** Brief, site map: "Footer: the nav plus Locations, About, service area, and the name, phone, and email." */
export const FOOTER_NAV = [
  {
    heading: 'Services',
    links: [
      { href: '/how-it-works', label: 'How it works' },
      { href: '/pricing', label: 'Pricing & plans' },
      { href: '/services/shopify-stores', label: 'Ecommerce websites' },
      { href: '/visibility-audit', label: 'Free visibility audit' },
    ],
  },
  {
    heading: 'Proof',
    links: [
      { href: '/work', label: 'Our work' },
      { href: '/work/rubio-brothers-concrete', label: 'Rubio case study' },
      { href: '/industries/contractors', label: 'Websites for contractors' },
    ],
  },
  {
    heading: 'Locations',
    links: [
      { href: '/web-design-utah-county', label: 'Utah County & Salt Lake' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About Bould' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
] as const

/**
 * Brief, messaging: "Title pattern: '[Page topic] | Bould Inc' … with the
 * service in the topic, never the name alone." The current Shopify homepage
 * title is the bare word "Bould", which is the single largest ranking problem
 * the brief identifies.
 */
export const TITLE_TEMPLATE = `%s | ${LEGAL_NAME}`

export const DEFAULT_DESCRIPTION = `${LEGAL_NAME} builds and manages websites for local service businesses and growing brands across ${SERVICE_AREA_LABEL}. Sites built to turn visitors into calls and quote requests. Free website and visibility audit.`
