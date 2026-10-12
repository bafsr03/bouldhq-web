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
import { hasCaseStudy, PROJECTS, RUBIO_REVIEWS_LABEL } from '@/lib/content/work'
import type { Faq } from '@/lib/content/pricing'
import { IN_PERSON_AREA, PHONE_DISPLAY } from '@/lib/site'

/**
 * Brief, site map — Utah location. "Backs up the Google profile's service area
 * with real local work."
 *
 * The brief listed Pete's Auto Repair here as a future entry. It is deliberately
 * absent: Pete's is not a site Bould manages, and a location page that names a
 * business we did not build for is the kind of thin, unearned local page the
 * brief warns Google penalises.
 *
 * That constraint shapes the whole page. The obvious way to bulk out a location
 * page is a list of towns — Provo, Orem, Lehi, American Fork — and it is exactly
 * the pattern Google treats as doorway content when there is nothing behind the
 * names. There are only two local clients to point at, so the depth here comes
 * from explaining what local search actually rewards and answering the questions
 * a local owner really asks. Every claim on this page is about work we did.
 */
const TITLE = 'Utah County & Salt Lake Web Design'
const DESCRIPTION =
  'Website design and local SEO for Utah County and Salt Lake County businesses. Local work you can drive to, and someone you can actually meet in person.'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/web-design-utah-county',
})

/**
 * What decides local rankings, in the order a business owner can act on them.
 * Deliberately not a feature list — these are the things that move the needle
 * whether or not Bould is the one doing them.
 */
const LOCAL_SIGNALS: { name: string; body: string }[] = [
  {
    name: 'A Google Business Profile that is actually filled in',
    body: 'For most local searches the profile outranks the website. Categories, service areas, hours, photos and the services list all feed it. A half-finished profile is the single most common reason a business with a decent website still cannot be found.',
  },
  {
    name: 'Reviews, and replies to them',
    body: `Volume, recency and rating all count, and so does answering them. Rubio Brothers had ${RUBIO_REVIEWS_LABEL} before we touched anything — the reviews were never the problem there, which is exactly why the website was.`,
  },
  {
    name: 'A page per service, not one page listing services',
    body: 'Somebody searching "stamped concrete patio" and somebody searching "concrete driveway replacement" are two different customers. One page mentioning both competes for neither. Separate pages give each search something to match.',
  },
  {
    name: 'Listings that agree with each other',
    body: 'Your name, address and phone number have to be identical everywhere they appear — profile, website, directories, old listings you forgot about. Google reads inconsistency as uncertainty about whether you are one business or two.',
  },
  {
    name: 'A site that loads on a phone on job-site signal',
    body: 'Most local searches happen on a phone, often on a bad connection. A site that takes eight seconds has already lost the call, and Google measures that experience directly.',
  },
  {
    name: 'Somewhere obvious to tap',
    body: 'A phone number in the header that dials when tapped, a form that works with one thumb, and no interstitial between wanting to call you and calling you. Visibility gets them there; this is what turns up as a lead.',
  },
]

/** What "in person" actually means, so it is a commitment and not a slogan. */
const IN_PERSON: string[] = [
  'The first conversation, at your shop or on a job site',
  'Photography of your real work, rather than stock images of someone else’s',
  'Sitting down together over the audit findings',
  'A walkthrough when the site goes live',
]

const UTAH_FAQS: Faq[] = [
  {
    q: 'Do you only work with businesses in Utah County?',
    a: 'No. We are based in Utah and serve clients in Utah, Texas, and Minnesota. In-person work is along the Wasatch Front; everything else we do remotely, and the build and the visibility work translate anywhere.',
  },
  {
    q: 'How long before I show up in local search?',
    a: 'The website goes live in three to four weeks. Local visibility moves on its own schedule: Google Business Profile changes can show within days, while ranking for competitive service terms is a matter of months, not weeks. Anyone promising you page one in thirty days is selling you something.',
  },
  {
    q: 'I already rank fine. Do I need this?',
    a: 'Maybe not. Take the free audit first — it scores you out of 20 on the things that decide local visibility, and if you score well it will tell you so. Rubio Brothers scored badly on the website while their Google profile was already strong, which is why the fix was a new site rather than more marketing.',
  },
  {
    q: 'Do I have to hand over my Google Business Profile?',
    a: 'You stay the owner. We are added as a manager, which lets us post updates, reply to reviews and keep the information current. You can remove that access at any time, and the profile remains yours.',
  },
  {
    q: 'What if my business has no address customers visit?',
    a: 'That is most of our clients. Contractors, mobile services and trades are service-area businesses — Google lets you hide the address and list the areas you serve instead. It is set up differently from a storefront, and getting it wrong is a common reason a profile underperforms.',
  },
  {
    q: 'Can I just talk to someone?',
    a: `Yes. Call ${PHONE_DISPLAY} and you will get Jake or Brian, not a call centre. If it is easier to meet, we will come to you anywhere along ${IN_PERSON_AREA}.`,
  },
]

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
            { name: 'Utah County', path: '/web-design-utah-county' },
          ]),
          serviceSchema({
            name: 'Web design in Utah County and Salt Lake County',
            description: DESCRIPTION,
            path: '/web-design-utah-county',
            serviceType: 'Website design',
          }),
          faqSchema(UTAH_FAQS)
        )}
      />

      <PageHero
        ghost="Utah"
        eyebrow="Wasatch Front"
        title="Web design for Utah County & Salt Lake businesses."
        sub="Based in Utah. The clients below are along the Wasatch Front, and you can drive to any of the work."
      />

      {/* Rubio's sourced numbers, the same component the homepage uses. A
          location page's first job is proving the work is real and nearby. */}
      <ProofStrip />

      <section className="bould-section bould-section--alt" aria-labelledby="signals-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">What actually decides it</p>
          <h2 className="bould-section-title" id="signals-heading">
            Local search rewards six things.
          </h2>
          <p className="bould-section-body bould-section-body--narrow">
            None of them is a trick, and none of them needs you to understand
            SEO. They are the things Google uses to decide which local business
            to put in front of someone who is ready to call one.
          </p>
          <ul className="bould-card-grid">
            {LOCAL_SIGNALS.map((s) => (
              <li key={s.name} className="bould-mini-card bould-reveal">
                <h3 className="bould-mini-card__title">{s.name}</h3>
                <p className="bould-mini-card__body">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

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
                  {hasCaseStudy(c.slug) ? (
                    <Link href={`/work/${c.slug}`} className="bould-inline-link bould-inline-link--tap">
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
        </div>
      </section>

      {/* Previously an unlabelled <h2> inside the section above, so the
          section's aria-labelledby covered only the first heading. It is its
          own section now, with its own label. */}
      <section className="bould-section bould-section--alt" aria-labelledby="in-person-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <p className="bould-section-label">In person</p>
          <h2 className="bould-section-title" id="in-person-heading">
            Meeting face to face.
          </h2>
          <p className="bould-section-body">
            {IN_PERSON_AREA[0].toUpperCase() + IN_PERSON_AREA.slice(1)} is where
            we meet clients face to face. For businesses here, the first
            conversation is usually in person — at your shop, at a job site, or
            over coffee somewhere between the two. It is faster than three rounds
            of email, and it is how we find out what you actually sell rather
            than what your old website says you sell.
          </p>
          <ul className="bould-check-list">
            {IN_PERSON.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="bould-section-body">
            Based in Utah. We also work with clients in Texas and Minnesota — the
            build and the visibility work translate anywhere — but this is where
            we can show up in person.
          </p>
        </div>
      </section>

      <section className="bould-section" aria-labelledby="utah-faq-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">Straight answers</p>
          <h2 className="bould-section-title" id="utah-faq-heading">
            What local business owners ask us.
          </h2>
          <dl className="bould-faq">
            {UTAH_FAQS.map((f) => (
              <div key={f.q} className="bould-faq__item bould-reveal">
                <dt className="bould-faq__q">{f.q}</dt>
                <dd className="bould-faq__a">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <PageCta label="Start with your score" cta="Take the free audit" />
    </div>
  )
}
