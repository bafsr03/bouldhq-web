import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import PageHero from '@/components/PageHero'
import LeadForm from '@/components/LeadForm'
import TrackedContact from '@/components/TrackedContact'
import CheckOpenBeacon from '@/components/CheckOpenBeacon'
import { CALLBACK_FIELDS } from '@/lib/formFields'
import { bouldLeadsConfigured, fetchCheck, type PublicCheck } from '@/lib/bouldleads'
import { LEGAL_NAME, PHONE, PHONE_DISPLAY } from '@/lib/site'

/**
 * A lead's results link (Competitor Check spec v2, Part 2).
 *
 * Jake texts this to an owner during or after the call, from "Copy results
 * link" on the BouldLeads lead card. It shows the saved check — no new Google
 * call — so it always matches what was said on the phone. Never indexed: these
 * are one owner's results, not pages for search.
 */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { absolute: `Your Google ranking check | ${LEGAL_NAME}` },
  description: 'How your business compares to the top 3 near you on Google Maps.',
  robots: { index: false, follow: false, nocache: true },
}

const SLUG_RE = /^[a-z0-9-]{3,120}$/

function headline(c: PublicCheck): string {
  const near = c.city ? ` near ${c.city}` : ' near you'
  if (c.case === 'A') return `Not on Google Maps yet for “${c.query}”${near}`
  if (c.rank == null) return `Not in the top 20 for “${c.query}”${near}`
  return `Around #${c.rank} for “${c.query}”${near}`
}

const fmtRating = (r: number | null) => (r == null ? '—' : r.toFixed(1))
const fmtReviews = (n: number | null) => (n == null ? '—' : String(n))

export default async function CheckPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SLUG_RE.test(slug) || !bouldLeadsConfigured()) notFound()
  const check = await fetchCheck(slug)
  if (!check) notFound()

  const checked = new Date(check.checkedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/Denver',
  })

  return (
    <div className="bould-page-wrap">
      <CheckOpenBeacon slug={slug} />
      <PageHero eyebrow="Your free ranking check" title={check.name} sub={headline(check)} />

      <section className="bould-section bould-check" aria-labelledby="check-top3">
        <div className="bould-section__inner bould-section__inner--narrow">
          <h2 className="bould-section-label" id="check-top3">
            You and the top 3 on Google Maps
          </h2>
          <div className="bould-check__table-wrap">
            <table className="bould-check__table">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Business</th>
                  <th scope="col">Rating</th>
                  <th scope="col">Reviews</th>
                </tr>
              </thead>
              <tbody>
                {check.rows.map((r, i) => (
                  <tr key={`${r.name}-${i}`} className={r.you ? 'is-you' : undefined}>
                    <td>{r.rank == null ? '—' : `#${r.rank}`}</td>
                    <th scope="row">
                      {r.name}
                      {r.you && <span className="bould-check__you">You</span>}
                    </th>
                    <td>{fmtRating(r.rating)}★</td>
                    <td>{fmtReviews(r.reviews)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bould-check__finding">
            <p className="bould-section-label">{check.title}</p>
            <p className="bould-check__say">{check.say}</p>
          </div>

          <p className="bould-section-body bould-section-body--muted bould-check__fine">
            Checked {checked}. Rankings change with who is searching and from where, so
            treat the number as &ldquo;around,&rdquo; not exact. We never promise a ranking or a
            number of leads.
          </p>

          <div className="bould-check__next">
            <h2 className="bould-section-title">Want to close the gap?</h2>
            <p className="bould-section-body">
              Call us at{' '}
              <TrackedContact
                method="phone"
                location="check-page"
                value={PHONE}
                display={PHONE_DISPLAY}
                className="bould-inline-link"
              />{' '}
              or leave your number and we&apos;ll call you back.
            </p>
            <LeadForm
              source="check-callback"
              fields={CALLBACK_FIELDS}
              extra={{ checkSlug: slug, business: check.name, city: check.city ?? undefined }}
              submitLabel="Call me back"
              successTitle="Got it."
              successBody="We'll call you back within one business day."
              note="We use your number to call you about this check. Nothing else."
            />
          </div>
        </div>
      </section>
    </div>
  )
}
