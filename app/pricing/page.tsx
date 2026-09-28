import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'

import PageHero from '@/components/PageHero'
import PageCta from '@/components/PageCta'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema, faqSchema, graph, webPageSchema } from '@/lib/schema'
import { PLANS, PRICING_FAQS } from '@/lib/content/pricing'

/**
 * Brief, site map — Pricing.
 *
 * The FAQPage schema here is doing real work: "who owns my site" and "what
 * happens if I cancel" are questions people type into Google verbatim when they
 * are unhappy with their current provider. Marking them up is how this page
 * shows up for that search.
 */
const TITLE = 'Website Plans & Pricing'
const DESCRIPTION =
  'Website plans from $250/month including hosting, updates, Google Business Profile management, and monthly reporting. You own the site and the domain. No lock-in contract.'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/pricing',
})

export default function PricingPage() {
  return (
    <div className="bould-page-wrap">
      <JsonLd
        data={graph(
          webPageSchema({ path: '/pricing', name: TITLE, description: DESCRIPTION }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Pricing', path: '/pricing' },
          ]),
          faqSchema(PRICING_FAQS)
        )}
      />

      <PageHero
        ghost="Pricing"
        eyebrow="Plans"
        title="What it costs, before you have to ask."
        sub="Most local agencies will not put a number on a page. We would rather you knew now than after a sales call."
      />

      <section className="bould-section" aria-labelledby="plans-heading">
        <div className="bould-section__inner">
          <h2 className="bould-sr-only" id="plans-heading">
            Plans
          </h2>
          <div className="bould-plans">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`bould-plan${plan.featured ? ' bould-plan--featured' : ''} bould-reveal`}
              >
                {plan.featured && <span className="bould-plan__flag">Most businesses</span>}
                <h3 className="bould-plan__name">{plan.name}</h3>
                <p className="bould-plan__price">
                  {plan.price}
                  {plan.cadence && (
                    <span className="bould-plan__cadence"> {plan.cadence}</span>
                  )}
                </p>
                <p className="bould-plan__setup">{plan.setup}</p>
                <p className="bould-plan__tagline">{plan.tagline}</p>
                <ul className="bould-check-list">
                  {plan.includes.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                <p className="bould-plan__best">
                  <span className="bould-plan__best-label">Best for</span>
                  {plan.best}
                </p>
                <Link href="/visibility-audit" className="bould-btn bould-btn--primary">
                  Start with the free audit
                </Link>
              </article>
            ))}
          </div>

          <p className="bould-section-body bould-section-body--narrow">
            Prices start where they say they start. What moves them is scope —
            how many services you offer, whether you are migrating an existing
            store, and how much of the visibility work is already done. The audit
            tells us which of those apply before anyone quotes anything.
          </p>
        </div>
      </section>

      <section className="bould-section bould-section--alt" aria-labelledby="faq-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">Straight answers</p>
          <h2 className="bould-section-title" id="faq-heading">
            The questions worth asking any agency.
          </h2>
          <dl className="bould-faq">
            {PRICING_FAQS.map((f) => (
              <div key={f.q} className="bould-faq__item bould-reveal">
                <dt className="bould-faq__q">{f.q}</dt>
                <dd className="bould-faq__a">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <PageCta label="Find out which plan you actually need" cta="Take the free audit" />
    </div>
  )
}
