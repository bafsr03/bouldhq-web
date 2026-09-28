import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'

import PageHero from '@/components/PageHero'
import PageCta from '@/components/PageCta'
import JsonLd from '@/components/JsonLd'
import {
  breadcrumbSchema,
  graph,
  serviceSchema,
  webPageSchema,
} from '@/lib/schema'

/**
 * Brief, site map — Contractors.
 *
 * "Industry pages rank anywhere, which suits clients spread across states."
 * That is the point of this page: it competes nationally on the job type rather
 * than locally on a city, which is a fight Bould can actually win today.
 */
const TITLE = 'Websites for Contractors'
const DESCRIPTION =
  'Websites for concrete, excavation, and trade contractors: instant estimators, call buttons that work on a phone, a page per service, and real local job photos. See what it did for Rubio Brothers Concrete.'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/industries/contractors',
})

const NEEDS = [
  {
    name: 'An estimator, not a contact form',
    body: 'A homeowner standing on a cracked driveway wants a number. A form that promises a reply "within 48 hours" loses them to whoever gives one first.',
  },
  {
    name: 'A page per service',
    body: 'Driveways, patios, stamped concrete, and foundations are four different searches. One page listing all four ranks for none of them.',
  },
  {
    name: 'Call buttons that survive a work glove',
    body: 'Most of this traffic is on a phone, outdoors, one-handed. The number has to be reachable without pinching and zooming.',
  },
  {
    name: 'Photos of your jobs, in your towns',
    body: 'Stock photography of someone else’s concrete tells a local customer nothing. Your work in streets they recognise tells them everything.',
  },
  {
    name: 'Speed on a bad connection',
    body: 'Job sites do not have good signal. A site that needs four seconds and a strong connection is a site that gets closed.',
  },
]

export default function ContractorsPage() {
  return (
    <div className="bould-page-wrap">
      <JsonLd
        data={graph(
          webPageSchema({
            path: '/industries/contractors',
            name: TITLE,
            description: DESCRIPTION,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Industries', path: '/industries/contractors' },
            { name: 'Contractors', path: '/industries/contractors' },
          ]),
          serviceSchema({
            name: 'Website design for contractors',
            description: DESCRIPTION,
            path: '/industries/contractors',
            serviceType: 'Website design for contractors',
          })
        )}
      />

      <PageHero
        ghost="Trades"
        eyebrow="Industries"
        title="Websites for contractors."
        sub="Built around how people actually hire a contractor: on a phone, in a hurry, comparing three of you at once."
      />

      <section className="bould-section" aria-labelledby="needs-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">What a contractor site needs</p>
          <h2 className="bould-section-title" id="needs-heading">
            Five things, and most contractor sites have none of them.
          </h2>
          <ul className="bould-card-grid">
            {NEEDS.map((n) => (
              <li key={n.name} className="bould-mini-card bould-reveal">
                <h3 className="bould-mini-card__title">{n.name}</h3>
                <p className="bould-mini-card__body">{n.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bould-section bould-section--alt" aria-labelledby="proof-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <p className="bould-section-label">The proof</p>
          <h2 className="bould-section-title" id="proof-heading">
            Rubio Brothers Concrete, Pleasant Grove
          </h2>
          <p className="bould-section-body">
            Forty-four Google reviews. Six listings. Years online. Their Google
            profile pointed at their website, and people clicked it — and in a
            full year, that website produced zero leads.
          </p>
          <p className="bould-section-body">
            We rebuilt it around an estimator, reachable call buttons, a page per
            service, and photos of their own jobs. First lead in about two weeks.
            Six leads and more than $20,000 in new work within three months.
          </p>
          <p className="bould-proof__source">
            Source: Rubio Brothers Concrete.{' '}
            <Link href="/work/rubio-brothers-concrete" className="bould-inline-link">
              Read the full case study
            </Link>
            .
          </p>
        </div>
      </section>

      <PageCta
        label="Find out whether your problem is the site or the visibility"
        cta="Score your contracting business"
      />
    </div>
  )
}
