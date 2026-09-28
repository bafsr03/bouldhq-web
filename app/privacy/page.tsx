import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import PageHero from '@/components/PageHero'
import { EMAIL, LEGAL_NAME, SERVICE_AREA_LABEL } from '@/lib/site'

const TITLE = 'Privacy Policy'
const DESCRIPTION = `How ${LEGAL_NAME} collects, uses, and stores the information you send through this website.`

export const metadata: Metadata = {
  ...pageMetadata({ title: TITLE, description: DESCRIPTION, path: '/privacy' }),
  // Indexable and followable, but never snippeted: policy text must
  // not be what Google shows for a query about Bould's services.
  robots: { index: true, follow: true, googleBot: { 'max-snippet': 0 } },
}

export default function PrivacyPage() {
  return (
    <div className="bould-page-wrap">
      <PageHero eyebrow="Legal" title="Privacy policy" />
      <section className="bould-section">
        <div className="bould-section__inner bould-section__inner--narrow bould-prose">
          <p>
            {LEGAL_NAME} is a website design and local marketing business serving{' '}
            {SERVICE_AREA_LABEL} and clients beyond it. This policy explains what
            we do with information you give us through this site.
          </p>

          <h2>What we collect</h2>
          <p>
            Only what you type into a form: your name, business name, email
            address, and optionally a phone number, website, industry, city, how
            you heard about us, and your message. If you complete the visibility
            audit, we also receive your answers to the twelve questions and the
            resulting score.
          </p>
          <p>
            We do not sell anything on this site, so there is no payment
            information, no cart, and no account to create.
          </p>

          <h2>Why we collect it</h2>
          <p>
            To reply to you, to prepare the audit you asked for, and to follow up
            once about it. That is the whole list. We do not sell, rent, or share
            your details with anyone else for their own marketing.
          </p>

          <h2>Analytics</h2>
          <p>
            We use privacy-respecting analytics to count page views and to record
            when someone taps a phone number, an email address, or submits a
            form. This tells us which pages produce enquiries. We do not use it to
            identify you personally.
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
