import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'

import PageHero from '@/components/PageHero'
import PageCta from '@/components/PageCta'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/schema'
import { INDUSTRIES, INDUSTRIES_CATCH_ALL } from '@/lib/content/industries'
import { CLIENT_STATES } from '@/lib/site'

/**
 * The industries hub.
 *
 * "Industries" in the nav used to go straight to /industries/contractors, which
 * told an auto shop that Bould builds for concrete contractors. The hub says who
 * Bould actually builds for, and only the industries with a real page of their
 * own link away from it.
 */
const TITLE = 'Industries We Build Websites For'
const DESCRIPTION =
  'Websites for contractors, home services, auto repair, and product brands. Based in Utah. If your business depends on the phone ringing, we build for you.'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/industries',
})

export default function IndustriesPage() {
  return (
    <div className="bould-page-wrap">
      <JsonLd
        data={graph(
          webPageSchema({ path: '/industries', name: TITLE, description: DESCRIPTION }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Industries', path: '/industries' },
          ]),
          {
            '@type': 'ItemList',
            itemListElement: INDUSTRIES.map((ind, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: ind.name,
              ...(ind.href ? { url: ind.href } : {}),
            })),
          }
        )}
      />

      <PageHero
        ghost="Who"
        eyebrow="Industries"
        title="Who we build for."
        sub="Different trades, one problem: the people already looking for you are not calling. Here is how that looks in each."
      />

      <section className="bould-section" aria-labelledby="industries-heading">
        <div className="bould-section__inner">
          <h2 className="bould-sr-only" id="industries-heading">
            Industries
          </h2>
          <ul className="bould-card-grid">
            {INDUSTRIES.map((ind) => {
              const body = (
                <>
                  <h3 className="bould-mini-card__title">{ind.name}</h3>
                  <p className="bould-mini-card__body">{ind.body}</p>
                  {ind.proof && (
                    <p className="bould-mini-card__proof">Built for {ind.proof}</p>
                  )}
                </>
              )

              /*
                Only the industries with their own page are links. A card that
                looks clickable and goes nowhere is worse than a card that does
                not, and linking every card back to this same page would be a
                loop.
              */
              return ind.href ? (
                <li key={ind.name} className="bould-reveal">
                  <Link href={ind.href} className="bould-mini-card">
                    {body}
                  </Link>
                </li>
              ) : (
                <li key={ind.name} className="bould-mini-card bould-reveal">
                  {body}
                </li>
              )
            })}
          </ul>

          <p className="bould-section-body bould-section-body--narrow">
            {INDUSTRIES_CATCH_ALL} We build new industry pages when there is a
            real client in that industry to put on them, because a page with no
            local proof on it is just this page with the nouns swapped.
          </p>
        </div>
      </section>

      <PageCta
        label="Find out whether your problem is the site or the visibility"
        cta="Get a free ranking check"
      />
    </div>
  )
}
