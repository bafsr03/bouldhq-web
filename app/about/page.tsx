import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'

import PageHero from '@/components/PageHero'
import PageCta from '@/components/PageCta'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/schema'
import { CLIENT_STATES, LEGAL_NAME } from '@/lib/site'

/**
 * Brief, site map — About: "About Bould Inc | Jake Knudsen & Brian". Replaces
 * the old /pages/studio, whose label said nothing about what was inside.
 *
 * The title is `absolute` because it already carries the business name; running
 * it through the "%s | Bould Inc" template would print the name twice.
 */
const TITLE = `About ${LEGAL_NAME} | Jake Knudsen & Brian Ellsworth`
const DESCRIPTION = `${LEGAL_NAME} is Jake Knudsen and Brian Ellsworth — two people who build and manage every website themselves. Based in Utah, with clients in ${CLIENT_STATES}. No account managers, no offshore team, no handoff after launch.`

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/about',
  absoluteTitle: true,
})

export default function AboutPage() {
  return (
    <div className="bould-page-wrap">
      <JsonLd
        data={graph(
          webPageSchema({ path: '/about', name: TITLE, description: DESCRIPTION }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ])
        )}
      />

      <PageHero
        ghost="About"
        eyebrow="About"
        title="Two people. Every site."
        sub={`${LEGAL_NAME} is Jake Knudsen and Brian Ellsworth. We design it, we build it, we run it, and we are the ones who answer when you call.`}
      />

      <section className="bould-section" aria-labelledby="story-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <h2 className="bould-section-title" id="story-heading">
            How we got here
          </h2>
          <p className="bould-section-body">
            We started out building ecommerce storefronts — Shopify, custom
            themes, 3D product visuals for brands whose products need inspecting
            before anyone buys them. That work is still here, and we still take
            it on.
          </p>
          <p className="bould-section-body">
            What changed is what we found underneath it. Local businesses kept
            coming to us with the same problem in different clothes: a site that
            looked fine and produced nothing, or a site that worked fine and
            nobody could find. One contractor had 40+ Google reviews at 4.8
            stars and a year of zero leads. Once you have seen that a few times you stop
            selling websites and start selling the thing the website is supposed
            to do.
          </p>
          <p className="bould-section-body">
            So that is what Bould does now: websites for local service businesses
            and growing brands, plus the visibility work that decides how many
            people ever see them. Based in Utah. We meet clients along the
            Wasatch Front in person and work with clients in Texas and Minnesota
            remotely.
          </p>

          <h2 className="bould-section-title">What you get from a two-person shop</h2>
          <ul className="bould-check-list">
            <li>The person who built your site is the person who answers the phone.</li>
            <li>No account manager relaying your question to someone else.</li>
            <li>We take on fewer clients than we could, on purpose.</li>
            <li>You own the site and the domain. Always. Including if you leave.</li>
          </ul>

          <p className="bould-section-body">
            <Link href="/work" className="bould-inline-link bould-inline-link--tap">
              See what we have built &rarr;
            </Link>
          </p>
        </div>
      </section>

      <PageCta />
    </div>
  )
}
