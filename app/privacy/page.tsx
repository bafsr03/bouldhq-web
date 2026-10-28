import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import PageHero from '@/components/PageHero'
import { ALLOW_INDEXING, CLIENT_STATES, EMAIL, LEGAL_NAME } from '@/lib/site'

const TITLE = 'Privacy Policy'
const DESCRIPTION = `How ${LEGAL_NAME} collects, uses, and stores the information you send through this website.`

export const metadata: Metadata = {
  ...pageMetadata({ title: TITLE, description: DESCRIPTION, path: '/privacy' }),
  // Indexable and followable, but never snippeted: policy text must not be
  // what Google shows for a query about Bould's services. Still gated on
  // ALLOW_INDEXING — a page-level override would otherwise punch a hole in the
  // staging noindex the root layout applies.
  robots: ALLOW_INDEXING
    ? { index: true, follow: true, googleBot: { 'max-snippet': 0 } }
    : { index: false, follow: false },
}

export default function PrivacyPage() {
  return (
    <div className="bould-page-wrap">
      <PageHero eyebrow="Legal" title="Privacy policy" />
      <section className="bould-section">
        <div className="bould-section__inner bould-section__inner--narrow bould-prose">
          <p>
            {LEGAL_NAME} is a website design and local marketing business based
            in Utah, with clients in {CLIENT_STATES}. This policy explains what we
            do with information you give us through this site.
          </p>

          <h2>What we collect</h2>
          <p>
            Only what you type into a form: your name, business name, email
            address, and optionally a phone number, website, industry, city, how
            you heard about us, and your message. If you request a ranking check,
            we also look up your business&apos;s public Google listing and the
            businesses ranking near it. If you arrived from an ad or a link with
            campaign tags, we note which one, so we know where enquiries come
            from.
          </p>
          <p>
            We do not sell anything on this site, so there is no payment
            information, no cart, and no account to create.
          </p>

          <h2>Why we collect it</h2>
          <p>
            To reply to you, to run the ranking check you asked for and call you
            about it, and to follow up once. That is the whole list. We do not sell, rent, or share
            your details with anyone else for their own marketing.
          </p>

          <h2>Analytics</h2>
          <p>
            We use privacy-respecting analytics to count page views and to record
            when someone taps a phone number, an email address, or submits a
            form. This tells us which pages produce inquiries. We do not use it to
            identify you personally.
          </p>
          <p>
            When it is switched on, the Meta (Facebook) pixel records page views
            and form submissions so we can measure our Facebook and Instagram
            ads. Meta processes that data under its own privacy policy. Our forms
            are protected from spam by Cloudflare Turnstile, which checks your
            browser without a puzzle in most cases.
          </p>
          <p>
            We use Google Analytics to count visits, and Google Ads conversion
            tracking to see which of our ads led to a call or a quote request.
            Google processes that data under its own privacy policy. If you ask
            for a quote, we send one text message to the number you gave us to
            confirm we got your request.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Enquiries are kept for as long as we might reasonably still be talking
            to you about the work, and client records for as long as we are
            working together plus whatever our accountants require afterwards.
          </p>

          <h2>Your choices</h2>
          <p>
            Ask us to delete what we hold about you and we will, unless we are
            legally required to keep it. Ask us what we hold and we will tell you.
            Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>

          <h2>Changes</h2>
          <p>
            If this policy changes in a way that affects what we do with your
            information, we will update this page.
          </p>
        </div>
      </section>
    </div>
  )
}
