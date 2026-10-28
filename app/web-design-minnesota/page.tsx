import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

import LeadForm from '@/components/LeadForm'
import PlanCards from '@/components/PlanCards'
import Team from '@/components/Team'
import TrackedContact from '@/components/TrackedContact'
import JsonLd from '@/components/JsonLd'
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  serviceSchema,
  webPageSchema,
} from '@/lib/schema'
import { MINNESOTA_QUOTE_FIELDS } from '@/lib/formFields'
import type { Faq } from '@/lib/content/pricing'
import { PUBLISHED_REVIEWS } from '@/lib/content/reviews'
import { PHONE, PHONE_DISPLAY } from '@/lib/site'

/**
 * Where every Minnesota Google Ads click lands (Website Fixes + Minnesota
 * Google Ads Launch, Oct 28, 2026, section 6). The copy is from that doc,
 * verbatim.
 *
 * Built for a phone first: the call button and the top of the quote form have
 * to be on screen without scrolling, so the top section is a short stack with
 * no 3D scene behind it. Two rules from the doc hold for every line: we never
 * say we're based in Minnesota or give an address there, and we promise no
 * leads, rankings or customers.
 */
const TITLE = 'Web Design for Minnesota Businesses'
const DESCRIPTION =
  "Custom websites for Minnesota businesses from $750. No long-term contracts, you own your site, and we build around who you're up against on Google."
const PATH = '/web-design-minnesota'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
})

const INCLUDES = [
  'A custom design, not a template, with a page for each service',
  'One-tap calling and quick estimate forms',
  'Fast pages that work well on phones',
  'Your domain, Google profile and tracking connected at launch',
  'A monthly report: calls, form requests, and where they came from',
]

const STEPS = [
  { name: 'Quick call', body: 'We learn your business and look at where you rank on Google.' },
  { name: 'Build', body: 'Three to four weeks. You review everything before it goes live.' },
  { name: 'Launch', body: 'Domain, Google profile and tracking connected.' },
  { name: 'Keep it working', body: 'Updates, plus a monthly report.' },
]

const MINNESOTA_FAQS: Faq[] = [
  { q: 'Do I own my site?', a: 'Yes, the site and the domain, from day one.' },
  { q: 'Is there a contract?', a: 'No. Monthly, cancel anytime.' },
  { q: 'How long does it take?', a: 'Usually three to four weeks once we have your content.' },
  { q: 'I already have a site. Can you redo it?', a: 'Yes. Most of our builds are rebuilds.' },
]

const cesar = PUBLISHED_REVIEWS.find((r) => r.author === 'Cesar Rubio')

function QuoteForm({ formId }: { formId: string }) {
  return (
    <div className="bould-contact__form-wrap bould-mn-form">
      <LeadForm
        source="minnesota-quote"
        formId={formId}
        fields={MINNESOTA_QUOTE_FIELDS}
        submitLabel="Get my quote"
        successTitle="Got it."
        successBody="We'll call you within one business day."
      />
      <p className="bould-mn-form__note">We&rsquo;ll call you within one business day.</p>
    </div>
  )
}

export default function MinnesotaPage() {
  return (
    <div className="bould-page-wrap">
      <JsonLd
        data={graph(
          webPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Minnesota', path: PATH },
          ]),
          serviceSchema({
            name: 'Web design for Minnesota businesses',
            description:
              'Custom websites for Minnesota businesses, with hosting, updates, call and form tracking, and a monthly report.',
            path: PATH,
            serviceType: 'Website design',
          }),
          faqSchema(MINNESOTA_FAQS)
        )}
      />

      <section className="bould-page-hero bould-mn-hero">
        <div className="bould-mn-hero__grid">
          <div className="bould-mn-hero__text">
            <p className="bould-section-label">Websites for Minnesota businesses</p>
            <h1 className="bould-page-hero__title bould-mn-hero__title">
              Websites for Minnesota businesses, built with your competition in mind.
            </h1>
            <p className="bould-page-hero__sub">
              Custom websites from $750. No long-term contracts, and you own your
              site. We look at who you&rsquo;re up against on Google, build around
              it, and keep it working after launch.
            </p>
            <div className="bould-mn-hero__actions">
              {PHONE && (
                <TrackedContact
                  method="phone"
                  location="mn-hero"
                  value={PHONE}
                  display={`Call ${PHONE_DISPLAY}`}
                  className="bould-btn bould-btn--primary"
                />
              )}
              <a href="#quote" className="bould-btn bould-btn--ghost">
                Get a quote
              </a>
            </div>
          </div>
          <div id="quote" className="bould-mn-hero__form">
            <QuoteForm formId="mn-quote-top" />
          </div>
        </div>
      </section>

      <section className="bould-section" aria-labelledby="mn-includes-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <h2 className="bould-section-title" id="mn-includes-heading">
            What every site includes
          </h2>
          <ul className="bould-check-list">
            {INCLUDES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bould-section bould-section--alt" aria-labelledby="mn-plans-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">Pricing</p>
          <h2 className="bould-section-title" id="mn-plans-heading">
            Pick the plan that fits your size.
          </h2>
          <PlanCards compact />
          <p className="bould-section-body">
            No long-term contracts. You own your website and domain from day one.
          </p>
        </div>
      </section>

      <section className="bould-section" aria-labelledby="mn-story-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <p className="bould-section-label">One client&rsquo;s story</p>
          <h2 className="bould-section-title" id="mn-story-heading">
            What happened for Rubio Brothers Concrete
          </h2>
          <p className="bould-section-body">
            Their old agency site cost $600 a month and didn&rsquo;t bring in a
            single lead in a year. Two weeks after their Bould site went live,
            they got their first call from it. In three months, it brought
            $20,000 in new work. Every business is different; this is what
            happened for them.
          </p>
          {cesar && (
            <ul className="bould-reviews">
              <li className="bould-review bould-reveal">
                {cesar.context && <p className="bould-review__context">{cesar.context}</p>}
                <blockquote className="bould-review__quote">
                  <p>&ldquo;{cesar.text}&rdquo;</p>
                </blockquote>
                <p className="bould-review__attr">
                  {cesar.author}
                  {cesar.business && (
                    <span className="bould-review__business">, {cesar.business}</span>
                  )}
                </p>
              </li>
            </ul>
          )}
        </div>
      </section>

      <section className="bould-section bould-section--alt" aria-labelledby="mn-steps-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <h2 className="bould-section-title" id="mn-steps-heading">
            How it works
          </h2>
          <ol className="bould-steps">
            {STEPS.map((step, i) => (
              <li key={step.name} className="bould-steps__item bould-reveal">
                <span className="bould-steps__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="bould-steps__name">{step.name}</h3>
                  <p className="bould-steps__body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bould-section" aria-labelledby="mn-team-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <h2 className="bould-section-title" id="mn-team-heading">
            Who you&rsquo;ll work with
          </h2>
          <Team heading={null} />
          <p className="bould-section-body">
            We&rsquo;re based in Utah and work with businesses across Minnesota by
            phone and video, and in person when it makes sense.
          </p>
        </div>
      </section>

      <section className="bould-section bould-section--alt" aria-labelledby="mn-faq-heading">
        <div className="bould-section__inner">
          <h2 className="bould-section-title" id="mn-faq-heading">
            Questions
          </h2>
          <dl className="bould-faq">
            {MINNESOTA_FAQS.map((f) => (
              <div key={f.q} className="bould-faq__item bould-reveal">
                <dt className="bould-faq__q">{f.q}</dt>
                <dd className="bould-faq__a">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bould-section" aria-labelledby="mn-close-heading">
        <div className="bould-section__inner bould-mn-close">
          <div>
            <h2 className="bould-section-title" id="mn-close-heading">
              Ready to talk?
            </h2>
            {PHONE && (
              <p className="bould-section-body">
                Call{' '}
                <TrackedContact
                  method="phone"
                  location="mn-closing"
                  value={PHONE}
                  display={PHONE_DISPLAY}
                  className="bould-inline-link bould-inline-link--tap"
                />
                , or send the form and we&rsquo;ll call you.
              </p>
            )}
          </div>
          <QuoteForm formId="mn-quote-bottom" />
        </div>
      </section>
    </div>
  )
}
