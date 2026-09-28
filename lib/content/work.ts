/**
 * Portfolio and case studies.
 *
 * Two rules from the brief govern this file:
 *  1. "Replace with Rubio's real numbers" — no metric appears without a source.
 *     A case study with `metrics: []` renders without a results block rather
 *     than with an invented one.
 *  2. 3D is a feature of a website, not a product of its own. Categories say
 *     "3D product visuals", never "3D store".
 */

export type Segment = 'local' | 'ecommerce'

export type Project = {
  slug: string
  name: string
  category: string
  year: string
  segment: Segment
  liveUrl: string
  /** Set when a full case study page exists at /work/[slug]. */
  hasCaseStudy?: boolean
  blurb: string
  /**
   * Path under /public. Omit it and the card renders a monogram instead — see
   * public/logos/README.md for how to add the rest.
   */
  logo?: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'rubio-brothers-concrete',
    name: 'Rubio Brothers Concrete',
    category: 'Web design + local SEO',
    year: '2026',
    segment: 'local',
    liveUrl: 'https://rubiobrothersconcrete.com/',
    hasCaseStudy: true,
    logo: '/logos/rubio-brothers-concrete.png',
    blurb:
      'A concrete contractor whose old site produced nothing for a year. First lead in about two weeks.',
  },
  {
    slug: 'kilowash',
    name: 'Kilowash',
    category: 'Web design + local SEO',
    year: '2026',
    segment: 'local',
    liveUrl: 'https://kilowashutah.com',
    logo: '/logos/kilowash.png',
    blurb:
      'Exterior cleaning and lighting. A site that converts, now working through the visibility half.',
  },
  {
    slug: 'joon-distribution',
    name: 'Joon Distribution',
    category: 'Shopify Plus + 3D product visuals',
    year: '2026',
    segment: 'ecommerce',
    liveUrl: 'https://joondistro.com/',
    logo: '/logos/joon-distribution.png',
    hasCaseStudy: true,
    blurb:
      'Wholesale buyers who needed to inspect products closely before committing.',
  },
  {
    slug: 'dummiez',
    name: 'Dummiez',
    category: 'Shopify Plus + 3D product visuals',
    year: '2026',
    segment: 'ecommerce',
    liveUrl: 'https://www.dummiez.co/',
    logo: '/logos/dummiez.png',
    hasCaseStudy: true,
    blurb:
      'A design-led brand whose product is the whole pitch, flattened by a stock theme.',
  },
  {
    slug: 'adophies',
    name: 'Adophies',
    category: 'Shopify Plus',
    year: '2025',
    segment: 'ecommerce',
    liveUrl: 'https://adophies.com/',
    logo: '/logos/adophies.png',
    hasCaseStudy: true,
    blurb:
      'A catalogue that had outgrown its theme, migrated onto editor-configurable sections.',
  },
  {
    slug: 'jck-approved',
    name: 'JCK Approved',
    category: 'Custom Shopify build',
    year: '2026',
    segment: 'ecommerce',
    liveUrl: 'https://jckapproved.com/',
    logo: '/logos/jck-approved.png',
    blurb: 'A custom storefront built around the brand rather than a theme.',
  },
  {
    slug: 'run-it-back-classics',
    name: 'Run it Back Classics',
    category: 'Shopify Plus',
    year: '2025',
    segment: 'ecommerce',
    liveUrl: 'https://run-it-back-classics.myshopify.com/',
    logo: '/logos/run-it-back-classics.png',
    blurb: 'Vintage sportswear, merchandised for a catalogue that changes constantly.',
  },
  {
    slug: 'avion',
    name: 'Avion',
    category: 'Custom development',
    year: '2026',
    segment: 'ecommerce',
    liveUrl: 'https://aviosupply.co/',
    logo: '/logos/avion.png',
    blurb: 'Custom development in a category with unusual compliance constraints.',
  },
  {
    slug: 'rosn-by-os',
    name: "ROSN by O's",
    category: 'Custom Shopify build',
    year: '2026',
    segment: 'ecommerce',
    liveUrl: 'https://os-supply.com/',
    logo: '/logos/rosn-by-os.png',
    blurb: 'A brand-first storefront built from the ground up.',
  },
]

export type Metric = { value: string; label: string; source: string }

export type CaseStudy = {
  slug: string
  client: string
  category: string
  year: string
  segment: Segment
  liveUrl: string
  /** Page <title>, taken from the brief's site map where it specifies one. */
  title: string
  description: string
  h1: string
  problem: { heading: string; body: string[] }
  build: { heading: string; body: string[] }
  /** Empty until real, sourced numbers exist. Renders nothing when empty. */
  metrics: Metric[]
  quote?: { text: string; attribution: string }
  /** Shown as an editorial note where results are still pending. */
  pending?: string
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'rubio-brothers-concrete',
    client: 'Rubio Brothers Concrete',
    category: 'Web design + local SEO',
    year: '2026',
    segment: 'local',
    liveUrl: 'https://rubiobrothersconcrete.com/',
    title: 'Rubio Brothers Concrete: From 0 to 6 Leads',
    description:
      'Rubio Brothers Concrete had 44+ Google reviews and a year of zero leads from their old website. Their Bould site brought the first lead in about two weeks and $20k+ in new work in three months.',
    h1: 'A year of zero leads, then the first one in two weeks',
    problem: {
      heading: 'The problem',
      body: [
        'Rubio Brothers Concrete was not hard to find. More than 44 Google reviews, six directory listings, years of history online — by the scorecard, strong visibility. Their Google Business Profile pointed at their website, and people clicked it.',
        'In a year, that website produced zero leads. Every bit of demand their reviews and listings had built arrived at a page that gave visitors nothing to do, and left.',
        'This is the half of the formula a redesign actually fixes. The traffic already existed. The site was where it died.',
      ],
    },
    build: {
      heading: 'What we built',
      body: [
        'A project estimator on the homepage, so a homeowner with a driveway in mind gets a number instead of a contact form.',
        'Call buttons that stay reachable on a phone, because most of this traffic is someone standing in their own driveway.',
        'Service pages written per job type rather than one page listing everything, so each one can rank and each one can answer a specific question.',
        'Real photos of Rubio jobs in Pleasant Grove and the surrounding towns — local proof that a stock photo cannot provide.',
      ],
    },
    metrics: [
      { value: '~2 weeks', label: 'to the first lead', source: 'Rubio Brothers Concrete' },
      { value: '6', label: 'leads in 3 months', source: 'Rubio Brothers Concrete' },
      { value: '$20k+', label: 'in new work', source: 'Rubio Brothers Concrete' },
    ],
    pending:
      'Cesar’s quote is being finalised and will be added here. Every number above comes directly from Rubio Brothers Concrete.',
  },
  {
    slug: 'joon-distribution',
    client: 'Joon Distribution',
    category: 'Shopify Plus + 3D product visuals',
    year: '2026',
    segment: 'ecommerce',
    liveUrl: 'https://joondistro.com/',
    title: 'Joon Distribution: 3D Product Visuals for Wholesale Buyers',
    description:
      'Joon Distribution sells a catalogue buyers need to inspect before committing. We rebuilt the storefront on Shopify Plus with interactive 3D product visuals at real scale.',
    h1: 'Letting wholesale buyers inspect the product before they commit',
    problem: {
      heading: 'The challenge',
      body: [
        'Joon Distribution sells a catalogue that buyers need to inspect closely before committing. A flat product grid gave wholesale customers no way to judge scale, finish, or detail, so the sales conversation kept moving off the site and into email threads.',
      ],
    },
    build: {
      heading: 'What we built',
      body: [
        'We rebuilt the storefront on Shopify Plus and layered 3D product visuals over the catalogue. Products are presented as interactive models a buyer can rotate and inspect at real scale, running on a WebGL pipeline tuned to load progressively so the page stays fast on mobile.',
      ],
    },
    metrics: [],
    pending:
      'Sales figures for this build are pending the client’s permission to publish. We do not put a number on this page until it has a source.',
  },
  {
    slug: 'dummiez',
    client: 'Dummiez',
    category: 'Shopify Plus + 3D product visuals',
    year: '2026',
    segment: 'ecommerce',
    liveUrl: 'https://www.dummiez.co/',
    title: 'Dummiez: A Storefront Where the Product Is the Interface',
    description:
      'A design-led brand flattened into thumbnails by a stock Shopify theme. We built a custom Shopify Plus storefront around a real-time 3D stage.',
    h1: 'When the product is the whole pitch, thumbnails are not enough',
    problem: {
      heading: 'The challenge',
      body: [
        'Dummiez is a design-led brand whose products are the whole pitch, but a conventional Shopify theme flattened them into thumbnails. The brand read as generic in the first five seconds, and the storefront did nothing to communicate the craft behind the product.',
      ],
    },
    build: {
      heading: 'What we built',
      body: [
        'We built a custom Shopify Plus storefront around a real-time 3D stage, so the product is the interface rather than a picture of the product. The build pairs a bespoke theme with a WebGL scene that respects reduced-motion preferences and degrades to static imagery where WebGL is unavailable.',
      ],
    },
    metrics: [],
    pending:
      'Results for this build are pending the client’s permission to publish.',
  },
  {
    slug: 'adophies',
    client: 'Adophies',
    category: 'Shopify Plus',
    year: '2025',
    segment: 'ecommerce',
    liveUrl: 'https://adophies.com/',
    title: 'Adophies: A Catalogue That Had Outgrown Its Theme',
    description:
      'Adophies had expanded faster than its theme could handle. We migrated onto Shopify Plus with a custom theme built around editor-configurable sections.',
    h1: 'A catalogue that had outgrown its theme',
    problem: {
      heading: 'The challenge',
      body: [
        'Adophies had outgrown its original storefront. The catalogue had expanded faster than the theme’s navigation and merchandising could handle, leaving customers unable to find products and the team unable to change the site without a developer.',
      ],
    },
    build: {
      heading: 'What we built',
      body: [
        'We migrated Adophies onto Shopify Plus with a custom theme built around editor-configurable sections, so the team can restructure pages without touching code. Navigation, collection merchandising, and the product template were rebuilt around how customers actually browse the catalogue.',
      ],
    },
    metrics: [],
    pending:
      'Results for this build are pending the client’s permission to publish.',
  },
]

export function caseStudyBySlug(slug: string) {
  return CASE_STUDIES.find((c) => c.slug === slug)
}

/** Brief, homepage: "recent work (from the current 9 projects)" and "Use one verified number." */
export const PROJECT_COUNT = PROJECTS.length
