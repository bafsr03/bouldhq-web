import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMetadata } from '@/lib/seo'

import PageHero from '@/components/PageHero'
import JsonLd from '@/components/JsonLd'
import LeadForm from '@/components/LeadForm'
import { CONTACT_FIELDS } from '@/lib/formFields'
import TrackedContact from '@/components/TrackedContact'
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/schema'
import {
  CLIENT_STATES,
  EMAIL,
  LEGAL_NAME,
  LOCATION_LINE,
  PHONE,
  PHONE_DISPLAY,
} from '@/lib/site'

/** Brief, site map — Contact, including the "How did you hear about us?" field. */
const TITLE = `Contact ${LEGAL_NAME} | Web Design Based in Utah`
const DESCRIPTION = `Talk to Jake and Brian about your website. Based in Utah, with clients in ${CLIENT_STATES}. We reply within one business day.`

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/contact',
  absoluteTitle: true,
})

export default function ContactPage() {
  return (
    <div className="bould-page-wrap">
      <JsonLd
        data={graph(
          webPageSchema({ path: '/contact', name: TITLE, description: DESCRIPTION }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
          { '@type': 'ContactPage', url: '/contact' }
        )}
      />

      <PageHero
        eyebrow="Contact"
        title="Tell us what is not working."
        sub="The more you tell us up front, the more useful the first conversation is. We reply within one business day."
      />

      <section className="bould-section" aria-labelledby="contact-heading">
        <div className="bould-section__inner bould-section__inner--split">
          <div>
            <h2 className="bould-section-title" id="contact-heading">
              Get in touch
            </h2>

            {/* NAP block, identical to the footer and the Google profile. */}
            <address className="bould-contact__details">
              <p className="bould-contact__detail-name">{LEGAL_NAME}</p>
              <p className="bould-contact__detail-area">{LOCATION_LINE}</p>
              {PHONE && (
                <p>
                  <TrackedContact
                    method="phone"
                    location="contact-page"
                    value={PHONE}
                    display={PHONE_DISPLAY}
                    className="bould-contact__email"
                  />
                </p>
              )}
              <p>
                <TrackedContact
                  method="email"
                  location="contact-page"
                  value={EMAIL}
                  display={EMAIL}
                  className="bould-contact__email"
                />
              </p>
            </address>

            <p className="bould-section-body bould-section-body--muted">
              Not ready to talk yet? The{' '}
              <Link href="/visibility-audit" className="bould-inline-link bould-inline-link--tap">
                free ranking check
              </Link>{' '}
              shows how you compare to the top 3 businesses near you on Google.
            </p>
          </div>

          <div className="bould-contact__form-wrap">
            <LeadForm
              source="contact"
              fields={CONTACT_FIELDS}
              submitLabel="Send it over"
              successTitle="Got it."
              successBody="We read every one of these ourselves. Expect a reply within one business day."
              note="We use your details to reply to this inquiry. We do not sell or share them."
            />
          </div>
        </div>
      </section>
    </div>
  )
}
