/**
 * Plans and FAQs for /pricing.
 *
 * Brief, decision 6, answered "starting at" prices: enough to filter out
 * bad-fit leads and make the sale repeatable for anyone selling, without
 * printing a number that removes all room to negotiate.
 *
 * The only price the brief states as real is the $250/month plan. The setup fee
 * is deliberately "quoted per project" rather than invented — fill `setup` in
 * once Jake and Brian set it.
 *
 * Brief, decision 4, is resolved here in favour of including Google Business
 * Profile management in the plan: it is the visibility half of the formula and
 * the thing that separates this from a $175/month hosting-only competitor. If
 * the hours do not work, move the profile lines into a higher tier — they are
 * isolated in `includes` for exactly that reason.
 */

export type Plan = {
  id: string
  name: string
  price: string
  cadence: string
  setup: string
  tagline: string
  includes: string[]
  best: string
  featured?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'website',
    name: 'Website Plan',
    price: 'From $250',
    cadence: 'per month',
    setup: 'Setup quoted per project',
    tagline: 'A site built to turn visitors into calls, and kept working after launch.',
    includes: [
      'Custom website designed and built for your business',
      'Service pages written per job, not one page listing everything',
      'Click-to-call and quote forms that work on a phone',
      'Hosting, security, and updates',
      'Google Business Profile setup and ongoing management',
      'Profile updates and review responses',
      'Monthly report: calls, forms, and where they came from',
      'Review kit — link, text template, and a QR card for the counter or truck',
    ],
    best: 'Local service businesses: contractors, auto repair, home services.',
    featured: true,
  },
  {
    id: 'ecommerce',
    name: 'Ecommerce Build',
    price: 'Quoted per project',
    cadence: '',
    setup: 'Monthly care plan available after launch',
    tagline: 'Shopify storefronts for product brands, with 3D product visuals where they earn their place.',
    includes: [
      'Custom Shopify or Shopify Plus build',
      'Migration from your existing store',
      'Merchandising and navigation built around how people actually browse',
      '3D product visuals for products that need inspecting',
      'Speed work and Core Web Vitals',
      'Optional monthly care plan for updates and support',
    ],
    best: 'Product brands selling online — see the ecommerce page.',
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
    q: 'Shopify or custom — which one do I need?',
    a: 'If you sell products online, Shopify is almost always right: you get checkout, inventory, and payments without paying us to rebuild them. If you sell a service and take enquiries by phone or form, a custom site is faster, cheaper to run, and easier to make rank. We will tell you which one you need on the first call, including when the answer costs us money.',
  },
  {
    q: 'What happens if I cancel?',
    a: 'You keep the site and the domain. We export everything, hand over the accounts, and help you move to your own hosting. There is no long lock-in contract — the plan is monthly, and it should earn its place every month.',
  },
  {
    q: 'Why is there a monthly fee at all? Can I just buy a website?',
    a: 'You can, and some people should. But a site on its own is only half the formula. The monthly plan is what keeps the Google profile active, the reviews coming, and the reporting honest — that is the half that decides how many people ever see the site. A one-time build with nothing behind it is how most small-business websites end up producing nothing, which is the exact situation we were hired to fix at Rubio Brothers Concrete.',
  },
  {
    q: 'How long does it take?',
    a: 'A typical local service site is live in three to four weeks from the go-ahead, then a 60-day plan runs after launch: profile, listings, reviews, and reporting.',
  },
  {
    q: 'Do you work outside Utah?',
    a: 'Yes. We are based in Utah County and most of our in-person work is along the Wasatch Front, but industry pages and Shopify builds work anywhere, and we have clients outside the state.',
  },
]
