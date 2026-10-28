import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'

import PageHero from '@/components/PageHero'
import PageCta from '@/components/PageCta'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema, faqSchema, graph, webPageSchema } from '@/lib/schema'
import PlanCards from '@/components/PlanCards'
import { PRICING_FAQS } from '@/lib/content/pricing'

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
  'Starter at $250/month ($750 setup), Growth at $450/month ($1,250 setup), plus the Golden Formula add-on at $200/month. No contracts. You own the site.'

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
        eyebrow="Plans"
        title="What it costs, before you have to ask."
        sub="Most local agencies will not put a number on a page. We would rather you knew now than after a sales call."
      />

      <section className="bould-section" aria-labelledby="plans-heading">
        <div className="bould-section__inner">
          <h2 className="bould-sr-only" id="plans-heading">
            Plans
          </h2>
          <PlanCards />

          <p className="bould-section-body bould-section-body--narrow">
            <strong>Which one?</strong> Pick the website plan by your size:
            Starter for one main service, Growth for several services or crews.
            If the free ranking check shows you&rsquo;re behind the top 3 near
            you, add the Golden Formula.
          </p>
          <p className="bould-section-body bould-section-body--narrow">
            Setup is $750 on Starter and $1,250 on Growth. Ecommerce builds are
            quoted per project. You own your website.
          </p>
          <p className="bould-section-body bould-section-body--narrow">
            Selling products online instead?{' '}
            <Link href="/services/shopify-stores" className="bould-inline-link bould-inline-link--tap">
              See the ecommerce page
            </Link>
            .
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

      <PageCta label="Find out which plan you actually need" />
    </div>
  )
}
