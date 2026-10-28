import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'

import PageHero from '@/components/PageHero'
import PageCta from '@/components/PageCta'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/schema'

/**
 * Brief: "Anyone selling can walk a prospect through it top to bottom." Copy
 * from Website Fixes + Minnesota Google Ads Launch (Oct 28, 2026), 5.2. It is
 * written to be read aloud on a call as much as
 * to be read on screen, which is also why the steps are numbered and the
 * client-vs-Bould split is a real table rather than prose.
 */
const TITLE = 'How It Works'
const DESCRIPTION =
  'The free ranking check, the build, the launch, and the monthly report. Exactly how Bould works, start to finish, and what we need from you.'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/how-it-works',
})

const STEPS = [
  {
    n: '01',
    name: 'The free ranking check',
    body: "We look up where you rank on Google Maps for what you do in your city, compare you to the top 3 businesses near you, and call you with what's holding you back: reviews, rating, category, or your website. It's free whether or not you ever hire us.",
    out: "Where you stand, who's ahead of you, and what's in the way.",
  },
  {
    n: '02',
    name: 'The build',
    body: 'Three to four weeks. A page per service rather than one page listing everything, a quote path that works one-handed on a phone, real photos of your work in your towns, and speed that holds up on a truck on mobile data.',
    out: 'A site you own, on a domain registered in your name.',
  },
  {
    n: '03',
    name: 'Launch',
    body: 'We connect your domain, Google profile, and call and form tracking, and record your starting numbers so every report has something to compare against. With the Golden Formula, we also set up your review system and get your Google profile accurate and complete.',
    out: 'A live site, tracking in place, and your starting numbers.',
  },
  {
    n: '04',
    name: 'Monthly reporting',
    body: "Every month: calls, form requests, and where they came from, compared to your starting numbers. With the Golden Formula, the report also shows where you rank against your top 3 and your reviews against theirs. If a month is bad, we tell you, and what we're changing.",
    out: 'A number you can check us against.',
  },
]

const SPLIT = [
  { bould: 'Design, build, hosting, and updates', you: 'Tell us what you actually do, and for whom' },
  { bould: 'Google profile kept accurate and review replies (Golden Formula)', you: 'Send job photos when you have them' },
  { bould: 'Review link, template, and QR card', you: 'Ask happy customers — only real ones' },
  { bould: 'Monthly report against the baseline', you: 'Tell us when a lead turns into a job' },
]

export default function HowItWorksPage() {
  return (
    <div className="bould-page-wrap">
      <JsonLd
        data={graph(
          webPageSchema({ path: '/how-it-works', name: TITLE, description: DESCRIPTION }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'How it works', path: '/how-it-works' },
          ])
        )}
      />

      <PageHero
        eyebrow="How it works"
        title="How Bould works"
        sub="Four steps, in this order, every time. Here's what we do and what we need from you."
      />

      <section className="bould-section" aria-labelledby="why-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <h2 className="bould-section-title" id="why-heading">
            Why we start with your competition
          </h2>
          <p className="bould-section-body">
            Your website has two jobs: helping people find you, and giving them a
            reason to call. The free ranking check shows which one is holding you
            back, so we fix the right thing first.
          </p>
        </div>
      </section>

      <section className="bould-section bould-section--alt" aria-labelledby="steps-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">The process</p>
          <h2 className="bould-section-title" id="steps-heading">
            Four steps, in this order, every time.
          </h2>
          <ol className="bould-steps">
            {STEPS.map((s) => (
              <li key={s.n} className="bould-steps__item bould-reveal">
                <span className="bould-steps__num" aria-hidden="true">{s.n}</span>
                <div>
                  <h3 className="bould-steps__name">{s.name}</h3>
                  <p className="bould-steps__body">{s.body}</p>
                  <p className="bould-steps__out">
                    <span className="bould-steps__out-label">You end up with</span>
                    {s.out}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bould-section" aria-labelledby="split-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">Who does what</p>
          <h2 className="bould-section-title" id="split-heading">
            Your side of it is small, but it is not nothing.
          </h2>
          <table className="bould-table">
            <caption className="bould-sr-only">
              What Bould does and what the client does, side by side
            </caption>
            <thead>
              <tr>
                <th scope="col">Bould</th>
                <th scope="col">You</th>
              </tr>
            </thead>
            <tbody>
              {SPLIT.map((row) => (
                <tr key={row.bould}>
                  <td>{row.bould}</td>
                  <td>{row.you}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="bould-section-body">
            One note on reviews, because it matters legally and practically: you
            can only ask real customers, and we will never write one for you or
            buy one. A review kit that makes asking take ten seconds is the whole
            trick.
          </p>
          <Link href="/pricing" className="bould-inline-link bould-inline-link--tap">
            What it costs &rarr;
          </Link>
        </div>
      </section>

      <PageCta
        label="Step one is free, and you keep the result either way"
        cta="Get a free ranking check"
      />
    </div>
  )
}
