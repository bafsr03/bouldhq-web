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
import { PROJECTS } from '@/lib/content/work'
import { SERVICE_AREA_LABEL } from '@/lib/site'

/**
 * Brief, site map — Utah location. "Backs up the Google profile's service area
 * with real local work."
 *
 * The brief listed Pete's Auto Repair here as a future entry. It is deliberately
 * absent: Pete's is not a site Bould manages, and a location page that names a
 * business we did not build for is the kind of thin, unearned local page the
 * brief warns Google penalises.
 */
const TITLE = 'Web Design for Utah County & Salt Lake Businesses'
const DESCRIPTION = `Website design and local SEO for businesses in ${SERVICE_AREA_LABEL}. Local clients, local work, and a founder you can actually meet in person.`

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/web-design-utah-county',
})

export default function UtahCountyPage() {
  const localClients = PROJECTS.filter((p) => p.segment === 'local')

  return (
    <div className="bould-page-wrap">
      <JsonLd
        data={graph(
          webPageSchema({
            path: '/web-design-utah-county',
            name: TITLE,
            description: DESCRIPTION,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Utah County & Salt Lake', path: '/web-design-utah-county' },
          ]),
          serviceSchema({
            name: 'Web design in Utah County and Salt Lake County',
            description: DESCRIPTION,
            path: '/web-design-utah-county',
            serviceType: 'Website design',
          })
        )}
      />

      <PageHero
        ghost="Utah"
        eyebrow="Home base"
        title="Web design for Utah County & Salt Lake businesses."
        sub="We are based here. The clients below are too, and you can drive to any of the work."
      />

      <section className="bould-section" aria-labelledby="local-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <p className="bould-section-label">Local clients</p>
          <h2 className="bould-section-title" id="local-heading">
            Work you can go and look at.
          </h2>
          <ul className="bould-local-list">
            {localClients.map((c) => (
              <li key={c.slug} className="bould-reveal">
                <h3 className="bould-local-list__name">
                  {c.hasCaseStudy ? (
                    <Link href={`/work/${c.slug}`} className="bould-inline-link">
                      {c.name}
                    </Link>
                  ) : (
                    <a
                      href={c.liveUrl}
                      className="bould-inline-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {c.name}
                    </a>
                  )}
                </h3>
                <p className="bould-local-list__body">{c.blurb}</p>
              </li>
            ))}
          </ul>

          <h2 className="bould-section-title">Meeting in person</h2>
          <p className="bould-section-body">
            We work from Utah County and cover the Wasatch Front. For clients
            here, the first conversation is usually in person — at your shop, at
            a job site, or over coffee somewhere between the two. It is faster
            than three rounds of email, and it is how we find out what you
            actually sell rather than what your old website says you sell.
          </p>
          <p className="bould-section-body">
            Serving {SERVICE_AREA_LABEL}. We work with clients outside Utah too —
            the build and the visibility work translate anywhere — but this is
            where we can show up.
          </p>
        </div>
      </section>

      <PageCta label="Start with your score" cta="Take the free audit" />
    </div>
  )
}
