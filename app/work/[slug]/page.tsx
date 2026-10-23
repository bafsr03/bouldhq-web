import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import PageCta from '@/components/PageCta'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema, caseStudySchema, graph, webPageSchema } from '@/lib/schema'
import { CASE_STUDIES, caseStudyBySlug } from '@/lib/content/work'

type Props = { params: Promise<{ slug: string }> }

/** Fully static: there are four of them and they change rarely. */
export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cs = caseStudyBySlug(slug)
  if (!cs) return {}

  return pageMetadata({
    title: cs.title,
    description: cs.description,
    path: `/work/${cs.slug}`,
    type: 'article',
  })
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const cs = caseStudyBySlug(slug)
  if (!cs) notFound()

  return (
    <article className="bould-page-wrap">
      <JsonLd
        data={graph(
          webPageSchema({
            path: `/work/${cs.slug}`,
            name: cs.title,
            description: cs.description,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: cs.client, path: `/work/${cs.slug}` },
          ]),
          caseStudySchema(cs)
        )}
      />

      <header className="bould-page-hero">
        <span className="bould-page-hero__ghost" aria-hidden="true">
          {cs.client.split(' ')[0]}
        </span>
        <div className="bould-page-hero__inner">
          <p className="bould-section-label">
            Case study &middot; {cs.category} &middot; {cs.year}
          </p>
          <h1 className="bould-page-hero__title">{cs.h1}</h1>
          <p className="bould-page-hero__sub">{cs.description}</p>
          <p className="bould-cs-meta">
            <a
              href={cs.liveUrl}
              className="bould-cs-meta__live"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit {cs.client} &rarr;
            </a>
          </p>
        </div>
      </header>

      {cs.metrics.length > 0 && (
        <section className="bould-section" aria-labelledby="results-heading">
          <div className="bould-section__inner">
            <p className="bould-section-label" id="results-heading">
              Results
            </p>
            {/*
              Deliberately NOT a `.bould-reveal`. These three numbers are the
              entire argument of the page, and a scroll-triggered fade means
              they are invisible at opacity 0 until the trigger fires — which is
              how they were reported as "very low contrast" on a phone. Proof
              does not wait for an animation.
            */}
            <dl className="bould-proof__metrics">
              {cs.metrics.map((m) => (
                <div key={m.label} className="bould-proof__metric">
                  <dt className="bould-proof__metric-label">{m.label}</dt>
                  <dd className="bould-proof__metric-value">{m.value}</dd>
                </div>
              ))}
            </dl>
            <p className="bould-proof__source">
              Source: {cs.metrics[0].source}.
            </p>
          </div>
        </section>
      )}

      <section className="bould-section bould-section--alt">
        <div className="bould-section__inner bould-section__inner--narrow">
          <h2 className="bould-section-title">{cs.problem.heading}</h2>
          {cs.problem.body.map((p) => (
            <p key={p} className="bould-section-body">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="bould-section">
        <div className="bould-section__inner bould-section__inner--narrow">
          <h2 className="bould-section-title">{cs.build.heading}</h2>
          {cs.build.body.map((p) => (
            <p key={p} className="bould-section-body">
              {p}
            </p>
          ))}

          {cs.quote && (
            <blockquote className="bould-cs-quote">
              <p className="bould-cs-quote__text">{cs.quote.text}</p>
              <cite className="bould-cs-quote__attr">{cs.quote.attribution}</cite>
            </blockquote>
          )}

          {/*
            Brief: "No sources" was one of the failures of the old homepage. Where
            a number does not exist yet, this page says so in plain language
            rather than leaving a gap that reads like a claim.
          */}
          {cs.pending && <p className="bould-cs-pending">{cs.pending}</p>}

          <p className="bould-section-body">
            <Link href="/work" className="bould-inline-link">
              &larr; All work
            </Link>
          </p>
        </div>
      </section>

      <PageCta
        label={`Want to know where your business scores?`}
        cta="Get a free ranking check"
      />
    </article>
  )
}
