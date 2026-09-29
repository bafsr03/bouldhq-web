import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

import PageHero from '@/components/PageHero'
import AuditTool from '@/components/AuditTool'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/schema'
import { AUDIT_QUESTIONS, TOTAL_POINTS } from '@/lib/content/audit'

/** Brief, site map — Free visibility audit. "Lead magnet and qualifier in one." */
const TITLE = 'Free Local Visibility Audit for Your Business'
const DESCRIPTION = `Score your business out of ${TOTAL_POINTS} on what decides whether local customers find you: your Google profile, reviews, and listings. Free, about five minutes.`

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/visibility-audit',
})

export default function VisibilityAuditPage() {
  return (
    <div className="bould-page-wrap">
      <JsonLd
        data={graph(
          webPageSchema({
            path: '/visibility-audit',
            name: TITLE,
            description: DESCRIPTION,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Free visibility audit', path: '/visibility-audit' },
          ]),
          /*
            The twelve questions are also emitted as an FAQPage. They genuinely
            are questions with answers, and each one matches something owners
            actually search ("why doesn't my business show up on Google maps").
            The `help` text is the answer, not marketing copy, which is the
            condition for this markup being legitimate rather than spam.
          */
          {
            '@type': 'FAQPage',
            mainEntity: AUDIT_QUESTIONS.map((q) => ({
              '@type': 'Question',
              name: q.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: `${q.help} ${q.fix}`,
              },
            })),
          }
        )}
      />

      <PageHero
        ghost="Audit"
        eyebrow={`${TOTAL_POINTS}-point visibility audit`}
        title="Can your customers actually find you?"
        sub="Twelve questions, twenty points, about five minutes. You get the score and the verdict for free — no email required to see your number."
      />

      <section className="bould-section" aria-labelledby="audit-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <h2 className="bould-sr-only" id="audit-heading">
            The audit
          </h2>
          <p className="bould-section-body">
            This is the same scorecard we run on every business before we quote
            anything. It is deliberately about being <em>found</em>, not about how
            the website looks — because a beautiful site nobody sees is the most
            expensive thing a small business can buy.
          </p>
          <p className="bould-section-body bould-section-body--muted">
            Answer honestly. &ldquo;Not sure&rdquo; counts as no, which is the
            right call: if you are not sure, a customer searching at 8pm
            definitely is not.
          </p>

          <AuditTool />
        </div>
      </section>
    </div>
  )
}
