import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import PageHero from '@/components/PageHero'
import { ALLOW_INDEXING, EMAIL, LEGAL_NAME } from '@/lib/site'

const TITLE = 'Terms & Cancellation'
const DESCRIPTION = `Plan terms, ownership, and cancellation for ${LEGAL_NAME} website plans.`

export const metadata: Metadata = {
  ...pageMetadata({ title: TITLE, description: DESCRIPTION, path: '/terms' }),
  // Indexable and followable, but never snippeted: policy text must not be
  // what Google shows for a query about Bould's services. Still gated on
  // ALLOW_INDEXING — a page-level override would otherwise punch a hole in the
  // staging noindex the root layout applies.
  robots: ALLOW_INDEXING
    ? { index: true, follow: true, googleBot: { 'max-snippet': 0 } }
    : { index: false, follow: false },
}

export default function TermsPage() {
  return (
    <div className="bould-page-wrap">
      <PageHero eyebrow="Legal" title="Terms & cancellation" />
      <section className="bould-section">
        <div className="bould-section__inner bould-section__inner--narrow bould-prose">
          <p>
            These terms cover website plans and project work from {LEGAL_NAME}.
            They replace the refund policy that belonged to our old online store —
            we do not sell products, so there is nothing to refund in that sense.
          </p>

          <h2>Ownership</h2>
          <p>
            You own your website and your domain. The domain is registered in your
            name. If you leave, you take the site with you: we export the files,
            hand over the accounts, and help you move to hosting of your choice.
            We do not hold a client&rsquo;s site hostage, and you should be wary of
            anyone who does.
          </p>

          <h2>Monthly plans</h2>
          <p>
            Plans are billed monthly in advance and run month to month. There is
            no minimum term and no lock-in contract. If a month has not earned its
            place, you should be able to stop, and you can.
          </p>

          <h2>Cancelling</h2>
          <p>
            Tell us in writing before your next billing date and the plan stops at
            the end of the current month. We do not pro-rate part months. Within
            fourteen days of cancellation we hand over the site files, transfer
            the domain, and give you admin access to the Google Business Profile
            and any listings we created for you.
          </p>

          <h2>Project work</h2>
          <p>
            Project work is quoted in advance with a fixed scope. Changes to that
            scope are quoted before they are started, never after.
          </p>

          <h2>What we will not do</h2>
          <p>
            We will not write reviews for you, buy reviews, ask anyone who is not
            a real customer to leave one, or use a virtual office address to claim
            a Google Business Profile. These things get profiles suspended, and a
            suspended profile costs more than it ever gained.
          </p>

          <h2>Questions</h2>
          <p>
            Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>
        </div>
      </section>
    </div>
  )
}
