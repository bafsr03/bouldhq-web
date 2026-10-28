/**
 * Plans and FAQs for /pricing, the homepage and /web-design-minnesota.
 *
 * Website Fixes + Minnesota Google Ads Launch (Oct 28, 2026), section 4: two
 * website plans picked by the size of the business, the same price
 * everywhere, and the Golden Formula as a $200/month add-on to either one.
 * The ranking check decides the add-on, not the plan: it measures where a
 * business stands against the top 3 near it, which says nothing about how many
 * services it sells.
 */

/** The button every local plan card ends on. */
const CTA = 'Get a free ranking check'

export type Plan = {
  id: string
  name: string
  price: string
  cadence: string
  setup: string
  /** Only the ecommerce card has one; the local plans lead with who they are for. */
  tagline?: string
  includes: string[]
  best: string
  /** Golden Formula: added to a plan, never bought on its own. */
  addon?: boolean
  /** A line under the price, e.g. what the add-on comes to with each plan. */
  note?: string
  /** Where the card's button goes, and what it says. */
  cta: { href: string; label: string }
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$250',
    cadence: 'per month',
    setup: '$750 setup',
    includes: [
      'Custom website, up to 5 pages',
      'Click-to-call and quote forms that work on a phone',
      'Hosting, security and updates (up to 1 hour of changes a month)',
      'Call and form tracking',
      'Monthly report: calls, form requests, and where they came from',
    ],
    best: 'Smaller shops with one main service.',
    cta: { href: '/visibility-audit', label: CTA },
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$450',
    cadence: 'per month',
    setup: '$1,250 setup',
    includes: [
      'Everything in Starter',
      'Up to 15 pages: a page for each service and the main towns you serve',
      'Up to 3 hours of changes a month',
      'One new page or site improvement every month',
      'Same-day response on changes',
      'A 20-minute call every quarter',
      'Instant Google Search Submission & Indexing',
    ],
    best: 'Established businesses with several services or crews.',
    cta: { href: '/visibility-audit', label: CTA },
  },
  {
    id: 'golden-formula',
    name: 'Golden Formula',
    price: '+$200',
    cadence: 'per month',
    setup: 'No setup fee',
    note: 'Starter + Golden Formula = $450 a month. Growth + Golden Formula = $650 a month.',
    includes: [
      'Monthly ranking check: where you rank against the top 3 for your 2–3 main searches',
      'Review system: review link, text template and QR card, a monthly review goal, and reminders to you',
      'Replies to every Google review within 48 hours',
      'Google profile kept accurate: categories, services, service areas, hours and photos',
      'Rankings and reviews added to your monthly report',
    ],
    best: 'Businesses behind the top 3 near them on Google Maps.',
    addon: true,
    cta: { href: '/visibility-audit', label: CTA },
  },
  {
    id: 'ecommerce',
    name: 'Ecommerce Build',
    price: 'Quoted per project',
    cadence: '',
    setup: 'Monthly care plan available after launch',
    tagline:
      'Shopify storefronts for product brands, with 3D product visuals where they earn their place.',
    includes: [
      'Custom Shopify build',
      'Migration from your existing store',
      'Merchandising and navigation built around how people actually browse',
      '3D product visuals for products that need inspecting',
      'Speed work and Core Web Vitals',
      'Optional monthly care plan for updates and support',
    ],
    best: 'Product brands selling online.',
    /*
      Not the ranking check. It compares a business to the top 3 on Google
      Maps near it, and a Shopify brand selling nationally has no map pack to
      be in. Sending them there produces a meaningless result and a bad first
      conversation.
    */
    cta: { href: '/contact', label: 'Book a call' },
  },
]

export type Faq = { q: string; a: string }

/** Brief: "Ownership and transparency were open advantages in the competitive report." */
export const PRICING_FAQS: Faq[] = [
  {
    q: 'Who owns my site and my domain?',
    a: 'You do. The domain is registered in your name, and the site is yours. If you leave, you take it with you — we hand over the files and the accounts. Ownership is not something we hold over clients, and you should be suspicious of anyone who does.',
  },
  {
    q: 'Which plan do I need?',
    a: "Starter fits smaller shops with one main service. Growth fits established businesses with several services or crews, who need more pages and more done each month. If the free ranking check shows you're behind the top 3 near you, add the Golden Formula.",
  },
  {
    q: 'Shopify or custom — which one do I need?',
    a: 'If you sell products online, Shopify is almost always right: you get checkout, inventory, and payments without paying us to rebuild them. If you sell a service and take inquiries by phone or form, a custom site is faster, cheaper to run, and easier to make rank. We will tell you which one you need on the first call, including when the answer costs us money.',
  },
  {
    q: 'What happens if I cancel?',
    a: 'You keep the site and the domain. We export everything, hand over the accounts, and help you move to your own hosting. You own your website, and the plan should earn its place every month.',
  },
  {
    q: 'Why is there a monthly fee at all? Can I just buy a website?',
    a: "You can buy a site and walk away, and some people should. The monthly plan keeps your site fast, secure and up to date, makes changes when your business changes, and sends you a report every month so you can see what it's doing.",
  },
  {
    q: 'How long does it take?',
    a: 'A typical local service site is live three to four weeks after the go-ahead.',
  },
  {
    q: 'Do you work outside Utah?',
    a: "Yes. We're based in Utah and serve clients in Utah, Texas, and Minnesota. In-person work is along the Wasatch Front; everything else we do remotely.",
  },
]
