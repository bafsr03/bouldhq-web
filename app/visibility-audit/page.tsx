import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

import PageHero from '@/components/PageHero'
import LeadForm from '@/components/LeadForm'
import TrackedContact from '@/components/TrackedContact'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/schema'
import { RANKING_CHECK_FIELDS } from '@/lib/formFields'
import { PHONE, PHONE_DISPLAY } from '@/lib/site'

/**
 * Free ranking check (Competitor Check spec v2, Part 3).
 *
 * This URL used to hold a 12-question self-scored quiz. It stays at
 * /visibility-audit so every "Free audit" link already out there still works,
 * but it is now a request form: we run the top-3 check in BouldLeads and call
 * the owner with the one thing between them and the top 3.
 */
const TITLE = 'Free Google Ranking Check for Local Businesses'
const DESCRIPTION =
  'See where you rank on Google Maps against the top 3 businesses near you. We run the check and call you with the one thing holding you back. Free.'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/visibility-audit',
})

export default function RankingCheckPage() {
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
            { name: 'Free ranking check', path: '/visibility-audit' },
          ])
        )}
      />

      <PageHero
        ghost="Top 3"
        eyebrow="Free ranking check"
        title="See how you stack up against the top 3 businesses near you."
        sub="We'll check where you rank on Google Maps, compare you to the top 3, and call you with the one thing holding you back. Free."
      />

      <section className="bould-section" aria-labelledby="check-form-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <h2 className="bould-section-title bould-ranking__title" id="check-form-heading">
            Request your check
          </h2>

          <LeadForm
            source="ranking-check"
            fields={RANKING_CHECK_FIELDS}
            submitLabel="Get my free ranking check"
            successTitle="Got it."
            successBody={
              <>
                <p>We&apos;ll run your check and call you within one business day.</p>
                <p>
                  Rather call now?{' '}
                  <TrackedContact
                    method="phone"
                    location="ranking-check-success"
                    value={PHONE}
                    display={PHONE_DISPLAY}
                    className="bould-inline-link"
                  />
                </p>
              </>
            }
            note="We use your details to run your check and call you about it. Nothing else."
          />

          <div className="bould-ranking__example">
            <p className="bould-section-label">What the check looks like</p>
            <p className="bould-section-body">
              We ran it on ourselves first. For &ldquo;web design west jordan ut&rdquo;
              Bould showed up around <strong>#4</strong> on Google Maps. The top 3 had{' '}
              <strong>21 to 31 reviews</strong>. We had <strong>5</strong>. Right category,
              right area: the gap is reviews, and that is the one thing to fix.
            </p>
            <p className="bould-section-body bould-section-body--muted">
              Rankings move with who is searching and from where, so we say
              &ldquo;around&rdquo; and &ldquo;near you.&rdquo; We never promise a ranking or a
              number of leads.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
