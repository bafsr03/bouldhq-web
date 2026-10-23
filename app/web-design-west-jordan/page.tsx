import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'

import PageHero from '@/components/PageHero'
import PageCta from '@/components/PageCta'
import ProofStrip from '@/components/ProofStrip'
import JsonLd from '@/components/JsonLd'
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  serviceSchema,
  webPageSchema,
} from '@/lib/schema'
import { PLANS, type Faq } from '@/lib/content/pricing'
import { CLIENT_STATES, PHONE_DISPLAY } from '@/lib/site'

/**
 * West Jordan: where Bould actually works from (lib/site.ts), and where Jake's
 * October 2026 audit had Bould at #6 on the map. A local page plus reviews is
 * how a #6 becomes a top 3.
 *
 * What this page can honestly stand on is narrower than the Utah County page:
 * no Salt Lake County client is named here, because none has been confirmed
 * for publication. So the page does not borrow one. Its substance is being
 * here — meeting in person across the southwest valley — and the part of local
 * search that is specific to a city like this one: proximity, and what to do
 * about the factors that are not proximity. Rubio appears, labelled as the
 * Utah County work it is.
 *
 * Written fresh rather than adapted from /web-design-utah-county. Two location
 * pages sharing paragraphs with the place names swapped is the doorway pattern
 * the brief warns about, and it would put the two pages in competition.
 *
 * The street address stays off the page: Bould is a service-area business and
 * the profile hides it. When a Salt Lake County client agrees to be named, add
 * them here — that is the single change that would most strengthen this page.
 */
const PATH = '/web-design-west-jordan'
const TITLE = 'Web Design in West Jordan, UT'
const DESCRIPTION =
  'Website design and local SEO from a West Jordan business. We meet owners in person across the southwest valley. Start with a free ranking check.'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
})

/** Where "come to you" is a short drive rather than a promise. */
const NEARBY = [
  'West Jordan',
  'South Jordan',
  'Riverton',
  'Herriman',
  'Taylorsville',
  'Kearns',
  'Sandy',
  'Draper',
]

/**
 * How a search in this part of the valley is actually decided. Distinct from
 * the Utah County page's list on purpose: that one covers what local search
 * rewards in general; this one is about competing inside one city when the
 * business next door in the next city is a mile away.
 */
const CITY_SEARCH: { name: string; body: string }[] = [
  {
    name: 'Distance is decided before anything else',
    body: 'When someone in West Jordan searches for a plumber, Google leans toward businesses near where they are standing. A shop in South Jordan can show up first for someone a few blocks away and not at all for someone across town. You cannot move your shop, so the factors that are not distance carry everything else.',
  },
  {
    name: 'Category and services do the matching',
    body: 'Your profile’s primary category and its services list decide which searches you are even eligible for. A roofer listed only as "Contractor" is not in the running for "roof repair West Jordan", however close they are.',
  },
  {
    name: 'Reviews break the tie',
    body: 'Between businesses at a similar distance, the one with more recent reviews and a better rating tends to win the map spot. It is the factor most owners can move fastest, by asking every finished job for one.',
  },
  {
    name: 'A city page has to be about real work there',
    body: 'A page that says "West Jordan" with nothing behind it is easy for Google to discount. A page showing jobs you actually did in West Jordan, with photos and the street-level detail only a local business has, gives the search something real to match.',
  },
]

const WEST_JORDAN_FAQS: Faq[] = [
  {
    q: 'Are you actually in West Jordan?',
    a: 'Yes. Bould works from West Jordan. Like most of our clients we have no storefront customers visit, so our profile lists the areas we serve rather than a street address. In practice that means we come to you.',
  },
  {
    q: 'Do you only work with West Jordan businesses?',
    a: `No. We are based in Utah and work with clients in ${CLIENT_STATES}. West Jordan and the rest of the southwest valley are simply where we can meet you in person, usually within the week.`,
  },
  {
    q: 'I am in West Jordan but I work the whole valley. Do I need a page for every city?',
    a: 'Only for the cities where you have real work to show. One strong page per market you genuinely serve, backed by jobs and photos from there, beats a page for every town with nothing behind it. We will tell you which ones are worth it.',
  },
  {
    q: 'Why does a business from the next city over show up before me?',
    a: 'Usually distance to the searcher, a better-matched category, or more recent reviews. The free ranking check compares your reviews and category to the top 3 near you, and those are the two you can change.',
  },
  {
    q: 'What does it cost?',
    a: `Monthly plans start at ${PLANS[0].price} a month for ${PLANS[0].name} and ${PLANS[1].price} for ${PLANS[1].name}, with the setup quoted per project. The free ranking check is what decides which one fits.`,
  },
  {
    q: 'Can we meet first?',
    a: `Yes. Call ${PHONE_DISPLAY} and you will get Jake or Brian. We will come to your shop or a job site anywhere in the southwest valley.`,
  },
]

export default function WestJordanPage() {
  return (
    <div className="bould-page-wrap">
      <JsonLd
        data={graph(
          webPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'West Jordan', path: PATH },
          ]),
          serviceSchema({
            name: 'Web design and local SEO in West Jordan, Utah',
            description: DESCRIPTION,
            path: PATH,
            serviceType: 'Website design',
          }),
          faqSchema(WEST_JORDAN_FAQS)
        )}
      />

      <PageHero
        ghost="West Jordan"
        eyebrow="Home base"
        title="Web design in West Jordan, from a West Jordan business."
        sub="Bould works from West Jordan. If your business is in the southwest valley, the first meeting can be at your shop this week."
      />

      <section className="bould-section" aria-labelledby="nearby-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <p className="bould-section-label">In person</p>
          <h2 className="bould-section-title" id="nearby-heading">
            Close enough to come to you.
          </h2>
          <p className="bould-section-body">
            Most of what a website needs is easier to get in person: what you
            actually sell, which jobs you want more of, and photos of your real
            work instead of stock images. Across these cities, that first
            conversation happens at your shop or on a job site, not over three
            rounds of email.
          </p>
          <ul className="bould-check-list">
            {NEARBY.map((city) => (
              <li key={city}>{city}</li>
            ))}
          </ul>
          <p className="bould-section-body">
            The southwest valley keeps adding new neighborhoods, and a household
            that just moved in has no plumber, roofer or landscaper to call yet.
            They search. Being the business that shows up for them is what this
            work is for.
          </p>
        </div>
      </section>

      <section className="bould-section bould-section--alt" aria-labelledby="city-search-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">How a city search works</p>
          <h2 className="bould-section-title" id="city-search-heading">
            Winning the map in one city.
          </h2>
          <p className="bould-section-body bould-section-body--narrow">
            In a valley where the next city is a mile away, the map pack is
            close. These are the four things that decide it, in the order they
            apply.
          </p>
          <ul className="bould-card-grid">
            {CITY_SEARCH.map((s) => (
              <li key={s.name} className="bould-mini-card bould-reveal">
                <h3 className="bould-mini-card__title">{s.name}</h3>
                <p className="bould-mini-card__body">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bould-section" aria-labelledby="proof-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <p className="bould-section-label">The work</p>
          <h2 className="bould-section-title" id="proof-heading">
            What it looks like when it works.
          </h2>
          <p className="bould-section-body">
            Our nearest published case study is in Utah County: Rubio Brothers
            Concrete in Pleasant Grove.{' '}
            <Link href="/work/rubio-brothers-concrete" className="bould-inline-link bould-inline-link--tap">
              Read how their site went from zero leads to six in three months
            </Link>
            , or see{' '}
            <Link href="/web-design-utah-county" className="bould-inline-link">
              our Utah County work
            </Link>
            .
          </p>
        </div>
      </section>

      <ProofStrip />

      <section className="bould-section bould-section--alt" aria-labelledby="wj-faq-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">Straight answers</p>
          <h2 className="bould-section-title" id="wj-faq-heading">
            What West Jordan owners ask us.
          </h2>
          <dl className="bould-faq">
            {WEST_JORDAN_FAQS.map((f) => (
              <div key={f.q} className="bould-faq__item bould-reveal">
                <dt className="bould-faq__q">{f.q}</dt>
                <dd className="bould-faq__a">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <PageCta label="See how you stack up in West Jordan" />
    </div>
  )
}
