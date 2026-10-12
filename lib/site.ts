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
 * Where Bould is, and who it serves.
 *
 * Jake's answer (Sep 2026) settles a factual problem the audit found: several
 * pages said "based in Utah County" or "we work from Utah County", but the
 * business is in West Jordan, which is in Salt Lake County. The approved
 * wording is "Based in Utah" — never a county — and the client states are named
 * explicitly, because Bould now has clients in Texas and Minnesota.
 *
 * Brief, decision 9: a home-office business registers with Google as a
 * service-area business — the street address stays hidden and the service areas
 * are listed instead. `SERVICE_AREAS` feeds the JSON-LD `areaServed` and must
 * match the profile's service areas. The two Utah counties stay listed because
 * they are the real in-person radius; the three states are added because that is
 * where the clients are.
 */
export const SERVICE_AREAS = [
  { name: 'Utah', type: 'State' },
  { name: 'Texas', type: 'State' },
  { name: 'Minnesota', type: 'State' },
  { name: 'Utah County', type: 'AdministrativeArea' },
  { name: 'Salt Lake County', type: 'AdministrativeArea' },
] as const

/** The approved sentence. Footer, contact page, and anywhere NAP is printed. */
export const LOCATION_LINE = 'Based in Utah. Serving Utah, Texas, and Minnesota.'

/** Short form for tight spaces such as the hero eyebrow, which must not wrap. */
export const LOCATION_SHORT = 'Based in Utah'

/** For prose and meta descriptions: "...clients in Utah, Texas, and Minnesota." */
export const CLIENT_STATES = 'Utah, Texas, and Minnesota'

/** Where in-person work happens. Not a claim about where the office is. */
export const IN_PERSON_AREA = 'the Wasatch Front'

export const GBP_URL = process.env.NEXT_PUBLIC_GBP_URL ?? ''

/**
 * Whether this deployment may be indexed. Opt-IN, and deliberately so.
 *
 * Every staging copy of a site is a duplicate of it. Left indexable, a
 * `*.vercel.app` build competes with the real domain, splits its signals, and
 * can outrank it while the real one is still being set up — and the cleanup is
 * slower than the mistake. Canonical tags reduce the risk but do not remove it,
 * especially here, where the canonical currently points at a bouldhq.com that
 * is still serving the old Shopify store.
 *
 * So the default is noindex, and indexing is switched on deliberately, once, on
 * the deployment that actually serves bouldhq.com:
 *
 *   vercel env add NEXT_PUBLIC_ALLOW_INDEXING production   # value: true
 *
 * Forgetting to set it costs a day of not being indexed. Forgetting the inverse
 * — shipping a staging site that Google eats — costs considerably more.
 */
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'

/**
 * Brief, technical spec: the Google Business Profile link carries UTM so profile
 * traffic is separable from organic in analytics. Applied to any outbound link
 * that Bould controls the destination of.
 */
export const GBP_UTM =
  '?utm_source=google&utm_medium=business_profile&utm_campaign=website'

/**
 * Bould's own profiles. Each URL was checked to be Bould Inc's (it names the
 * business and links back to bouldhq.com) before it went in; a profile that
 * merely shares the name — LinkedIn's /company/bould, Crunchbase's
 * /organization/bould — belongs to someone else, and claiming it in `sameAs`
 * tells Google the two are the same entity.
 *
 * Left blank on purpose:
 *  - `bing`: Bing Places has no stable public URL for a listing, only search
 *    URLs whose parameters change. Fill it if Bing ever issues one.
 *  - `crunchbase`, `instagram`: no profile verified as Bould Inc's yet.
 */
export const SOCIAL = {
  facebook: 'https://www.facebook.com/bouldhq',
  linkedin: 'https://www.linkedin.com/company/bould-inc',
  youtube: 'https://www.youtube.com/@bouldhq',
  bing: '',
  crunchbase: '',
  instagram: '',
} as const

/**
 * `sameAs` in the Organization schema is how Google reconciles the site with
 * every listing and profile — the "own your own name" half of the brief's
 * visibility plan. Blank entries are filtered out so the schema never ships a
 * dangling URL.
 */
export const SAME_AS: string[] = [
  GBP_URL,
  SOCIAL.facebook,
  SOCIAL.linkedin,
  SOCIAL.youtube,
  SOCIAL.bing,
  SOCIAL.crunchbase,
  SOCIAL.instagram,
].filter(Boolean)

/** Brief, site map: "Nav: How it works, Pricing, Work, Industries, Free audit, Contact." */
export const NAV = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/work', label: 'Work' },
  { href: '/industries', label: 'Industries' },
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
      { href: '/web-design-utah-county', label: 'Utah (home base)' },
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

/**
 * The homepage title, and the default for any route without its own. One
 * constant because the layout, its Open Graph and Twitter cards, and the
 * homepage all print it, and four copies had already drifted into carrying the
 * same grammar slip ("Businesses Leads", corrected by Brian, Oct 2026).
 */
export const HOME_TITLE = `Websites That Bring Local Businesses More Leads | ${LEGAL_NAME}`

export const DEFAULT_DESCRIPTION = `${LEGAL_NAME} builds and manages websites for local service businesses and growing brands. Based in Utah, with clients in ${CLIENT_STATES}. Sites built to turn visitors into calls and quote requests. Free website and visibility audit.`
