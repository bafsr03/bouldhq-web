import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'

import PageHero from '@/components/PageHero'
import PageCta from '@/components/PageCta'
import FormulaChart from '@/components/FormulaChart'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/schema'

/**
 * Brief: "This page is the sales formula. Anyone selling can walk a prospect
 * through it top to bottom." It is written to be read aloud on a call as much as
 * to be read on screen, which is also why the steps are numbered and the
 * client-vs-Bould split is a real table rather than prose.
 */
const TITLE = 'How We Get Local Businesses More Leads'
const DESCRIPTION =
  'The Visibility × Conversion formula, the free audit, the build, the 60-day launch plan, and what you get in the monthly report. Exactly how Bould works, start to finish.'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/how-it-works',
})

const STEPS = [
  {
    n: '01',
    name: 'The free audit',
    body: 'We score your business out of 20 on the things that decide whether people find you: the Google profile, reviews, listings, the map pack, and whether you own your own name in search. It takes about five minutes and you get the number whether or not you ever hire us.',
    out: 'A score, a verdict, and a list of gaps in priority order.',
  },
  {
    n: '02',
    name: 'The build',
    body: 'Three to four weeks. A page per service rather than one page listing everything, a quote path that works one-handed on a phone, real photos of your work in your towns, and speed that holds up on a truck on mobile data.',
    out: 'A site you own, on a domain registered in your name.',
  },
  {
    n: '03',
    name: 'The 60-day launch plan',
    body: 'Launch is the start. We finish the Google profile, create the listings with identical details everywhere, set up the review kit, and keep the profile current. This is the visibility half, and it is the half that decides how many people ever see what we built.',
    out: 'A verified profile, consistent listings, and reviews starting to come in.',
  },
  {
    n: '04',
    name: 'Monthly reporting',
    body: 'Every month: calls, form submissions, and where they came from, against the baseline we recorded before launch. If a month is bad we tell you it was bad, and what we are changing.',
    out: 'A number you can check us against.',
  },
]

const SPLIT = [
  { bould: 'Design, build, hosting, and updates', you: 'Tell us what you actually do, and for whom' },
  { bould: 'Google profile setup, updates, and review responses', you: 'Send job photos when you have them' },
  { bould: 'Listings created with identical details', you: 'Confirm the phone number and service area' },
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
        ghost="Method"
        eyebrow="How it works"
        title={
          <>
            Visibility &times; Conversion: <br />
            how Bould works
          </>
        }
        sub="Two halves, multiplied. Most agencies sell one of them. Here is the whole thing, including the parts we do not do."
      />

      <section className="bould-section" aria-labelledby="formula-heading">
        <div className="bould-section__inner bould-section__inner--split">
          <div>
            <h2 className="bould-section-title" id="formula-heading">
              Why a website alone is not enough
            </h2>
            <p className="bould-section-body">
              Leads are visibility multiplied by conversion. Visibility is how
              many people find you. Conversion is how many of them do something
              about it. Multiply, do not add: if either one is near zero, the
              answer is near zero, no matter how good the other one is.
            </p>
            <p className="bould-section-body">
              Rubio Brothers Concrete had strong visibility — 44 Google reviews,
              six listings, years online — and a website that converted nothing.
              A year, zero leads. Kilowash is the mirror image: a site that
              converts well, and almost nobody finding it. Same formula, opposite
              halves missing.
            </p>
            <p className="bould-section-body">
              That is why the monthly plan exists. The build fixes conversion once.
              Visibility has to be worked at.
            </p>
          </div>
          <FormulaChart />
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
          <Link href="/pricing" className="bould-inline-link">
            What it costs &rarr;
          </Link>
        </div>
      </section>

      <PageCta
        label="Step one is free, and you keep the result either way"
        cta="Score your business out of 20"
      />
    </div>
  )
}
