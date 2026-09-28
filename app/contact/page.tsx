import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

import PageHero from '@/components/PageHero'
import JsonLd from '@/components/JsonLd'
import LeadForm from '@/components/LeadForm'
import { CORE_FIELDS, QUALIFY_FIELDS } from '@/lib/formFields'
import TrackedContact from '@/components/TrackedContact'
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/schema'
import {
  EMAIL,
  LEGAL_NAME,
  PHONE,
  PHONE_DISPLAY,
  SERVICE_AREA_LABEL,
} from '@/lib/site'

/** Brief, site map — Contact, including the "How did you hear about us?" field. */
const TITLE = `Contact ${LEGAL_NAME} | Free Website Audit`
const DESCRIPTION = `Talk to Jake and Brian about your website. Serving ${SERVICE_AREA_LABEL} and clients beyond. We reply within one business day.`

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
        ghost="Talk"
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
              <p className="bould-contact__detail-area">
                Serving {SERVICE_AREA_LABEL}
              </p>
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
              <a href="/visibility-audit" className="bould-inline-link">
                free visibility audit
              </a>{' '}
              gives you a score and a verdict without speaking to anyone.
            </p>
          </div>

          <div className="bould-contact__form-wrap">
            <LeadForm
              source="contact"
              fields={[
                ...CORE_FIELDS,
                ...QUALIFY_FIELDS,
                {
                  name: 'message',
                  label: 'What is going on with your website?',
                  type: 'textarea',
                  placeholder:
                    'No site yet, a site that gets no calls, a rebuild, a Shopify store…',
                },
              ]}
              submitLabel="Send it over"
              successTitle="Got it."
              successBody="We read every one of these ourselves. Expect a reply within one business day."
              note="We use your details to reply to this enquiry. We do not sell or share them."
            />
          </div>
        </div>
      </section>
    </div>
  )
}
