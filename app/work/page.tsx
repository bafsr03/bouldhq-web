import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'

import PageHero from '@/components/PageHero'
import PageCta from '@/components/PageCta'
import WorkGrid from '@/components/WorkGrid'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/schema'
import { CASE_STUDIES, PROJECTS, PROJECT_COUNT } from '@/lib/content/work'

/** Brief, site map — Work: "Case studies first; then the portfolio." */
const TITLE = 'Our Work: Websites for Local Businesses and Brands'
const DESCRIPTION = `${PROJECT_COUNT} websites for contractors, home service businesses, and Shopify brands — including how Rubio Brothers Concrete went from a year of zero leads to $20,000 in new work. Based in Utah.`

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/work',
})

export default function WorkPage() {
  const local = PROJECTS.filter((p) => p.segment === 'local')
  const ecommerce = PROJECTS.filter((p) => p.segment === 'ecommerce')

  return (
    <div className="bould-page-wrap">
      <JsonLd
        data={graph(
          webPageSchema({ path: '/work', name: TITLE, description: DESCRIPTION }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
          ]),
          {
            '@type': 'ItemList',
            itemListElement: CASE_STUDIES.map((cs, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `/work/${cs.slug}`,
              name: cs.title,
            })),
          }
        )}
      />

      <PageHero
        ghost="Work"
        eyebrow="Selected work"
        title="The sites, and what happened after they launched."
        sub="Case studies first, because a screenshot proves nothing. Where a client has not yet given us numbers to publish, we say so instead of inventing one."
      />

      <section className="bould-section" aria-labelledby="cs-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">Case studies</p>
          <h2 className="bould-section-title" id="cs-heading">
            The full stories.
          </h2>
          <ul className="bould-cs-list">
            {CASE_STUDIES.map((cs) => (
              <li key={cs.slug} className="bould-reveal">
                <Link href={`/work/${cs.slug}`} className="bould-cs-teaser">
                  <span className="bould-cs-teaser__meta">
                    {cs.category} &middot; {cs.year}
                  </span>
                  <h3 className="bould-cs-teaser__title">{cs.client}</h3>
                  <p className="bould-cs-teaser__line">{cs.h1}</p>
                  {cs.metrics.length > 0 && (
                    <ul className="bould-cs-teaser__metrics">
                      {cs.metrics.map((m) => (
                        <li key={m.label}>
                          <strong>{m.value}</strong> {m.label}
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="bould-cs-teaser__cta" aria-hidden="true">
                    Read it &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Brief: "the portfolio, filterable into local service businesses and
          ecommerce brands." Two headed sections rather than a JS filter: the
          split is permanent, and two crawlable headings beat one list behind a
          toggle. */}
      <section className="bould-work bould-section--alt" aria-labelledby="local-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">Local service businesses</p>
          <h2 className="bould-section-title" id="local-heading">
            Contractors and home services.
          </h2>
          <WorkGrid projects={local} />
        </div>
      </section>

      <section className="bould-work" aria-labelledby="ecom-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">Product brands</p>
          <h2 className="bould-section-title" id="ecom-heading">
            Shopify storefronts.
          </h2>
          <WorkGrid projects={ecommerce} />
          <Link href="/services/shopify-stores" className="bould-inline-link bould-inline-link--tap">
            More on ecommerce builds &rarr;
          </Link>
        </div>
      </section>

      <PageCta />
    </div>
  )
}
