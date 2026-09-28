/**
 * Plans and FAQs for /pricing.
 *
 * Two monthly plans, named by Jake (Sep 2026): **Website Build** at $250 and
 * **Golden Formula** at $450. The split follows the formula the whole site
 * sells — Leads = Visibility x Conversion. Website Build fixes conversion for a
 * business people already find. Golden Formula adds the visibility half for a
 * business they do not.
 *
 * That is also why the audit recommends between them by score rather than by
 * budget: the score measures visibility, so it is the correct input. See
 * PLAN_FOR_SCORE below and VERDICTS in ./audit.
 *
 * The setup fee is deliberately "quoted per project" rather than invented — it
 * is a real number that does not exist yet, and printing a guess is worse than
 * printing nothing.
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
  /** Where the card's button goes, and what it says. */
  cta: { href: string; label: string }
}

/**
 * The audit score at which the recommendation flips.
 *
 * 14+ means visibility is already working, so the website is what is losing the
 * leads: Website Build. Under 14 means a new site would multiply a small
 * number, so the visibility work has to come with it: Golden Formula.
 */
export const PLAN_SCORE_THRESHOLD = 14

export const PLANS: Plan[] = [
  {
    id: 'website-build',
    name: 'Website Build',
    price: '$250',
    cadence: 'per month',
    setup: 'Setup quoted per project',
    tagline:
      'For businesses people already find. A site built to turn those visits into calls, and kept working after launch.',
    includes: [
      'Custom website built for your business',
      'A page for every service',
      'Click-to-call and quote forms that work on a phone',
      'Hosting, security, and updates',
      'Call and form tracking',
      'Monthly report: calls, forms, and where they came from',
    ],
    best: `Local service businesses scoring ${PLAN_SCORE_THRESHOLD} or higher on the free audit.`,
    cta: { href: '/visibility-audit', label: 'Start with the free audit' },
  },
  {
    id: 'golden-formula',
    name: 'Golden Formula',
    price: '$450',
    cadence: 'per month',
    setup: 'Setup quoted per project',
    tagline:
      'For businesses that need to be found. Everything in Website Build, plus the visibility half of the formula.',
    includes: [
      'Everything in Website Build',
      'Google Business Profile setup and ongoing management',
      'Profile updates and review responses',
      'Review kit: link, text template, and QR card',
      'Directory listings kept consistent',
    ],
    best: `Local service businesses scoring under ${PLAN_SCORE_THRESHOLD} on the free audit.`,
    featured: true,
    cta: { href: '/visibility-audit', label: 'Start with the free audit' },
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
      Not the audit. The audit is a LOCAL visibility scorecard — map pack,
      service-area listings, "do you serve one clear market" — and a Shopify
      brand selling nationally scores badly on it for reasons that say nothing
      about their store. Sending them there produces a bad number and a bad
      first conversation.
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
    a: `The free audit answers it in about five minutes. Score ${PLAN_SCORE_THRESHOLD} or higher and people are already finding you, so the website is what is losing them: Website Build. Score under ${PLAN_SCORE_THRESHOLD} and a new site on its own would multiply a very small number, so the visibility work has to come with it: Golden Formula.`,
  },
  {
    q: 'Shopify or custom — which one do I need?',
    a: 'If you sell products online, Shopify is almost always right: you get checkout, inventory, and payments without paying us to rebuild them. If you sell a service and take inquiries by phone or form, a custom site is faster, cheaper to run, and easier to make rank. We will tell you which one you need on the first call, including when the answer costs us money.',
  },
  {
    q: 'What happens if I cancel?',
    a: 'You keep the site and the domain. We export everything, hand over the accounts, and help you move to your own hosting. No long-term contracts. You own your website, and the plan should earn its place every month.',
  },
  {
    q: 'Why is there a monthly fee at all? Can I just buy a website?',
    a: 'You can, and some people should. But a site on its own is only half the formula. The monthly plan is what keeps the site running and the reporting honest, and on Golden Formula it is what keeps the Google profile active and the reviews coming — the half that decides how many people ever see the site. A one-time build with nothing behind it is how most small-business websites end up producing nothing, which is the exact situation we were hired to fix at Rubio Brothers Concrete.',
  },
  {
    q: 'How long does it take?',
    a: 'A typical local service site is live in three to four weeks from the go-ahead, then a 60-day plan runs after launch: profile, listings, reviews, and reporting.',
  },
  {
    q: 'Do you work outside Utah?',
    a: "Yes. We're based in Utah and serve clients in Utah, Texas, and Minnesota. In-person work is along the Wasatch Front; everything else we do remotely.",
  },
]
