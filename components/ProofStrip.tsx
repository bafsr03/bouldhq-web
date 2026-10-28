import Link from 'next/link'
import { CASE_STUDIES } from '@/lib/content/work'

/**
 * One client's story, never what's typical (brand rules, Oct 28, 2026): the
 * proof line verbatim from that doc, plus Rubio's three sourced
 * numbers. These replace the old homepage's "300% avg revenue growth / 40%+
 * conversion lift / 2x add-to-cart / 98% retention" — none of which had a source
 * and all of which described ecommerce outcomes to an audience of contractors.
 */
export default function ProofStrip() {
  const rubio = CASE_STUDIES.find((c) => c.slug === 'rubio-brothers-concrete')!

  return (
    <section className="bould-proof" aria-labelledby="proof-heading">
      <div className="bould-proof__inner">
        <p className="bould-section-label">One client&rsquo;s story</p>
        <p className="bould-proof__line" id="proof-heading">
          Rubio Brothers Concrete&rsquo;s old agency site{' '}
          <strong>didn&rsquo;t bring in a single lead in a year</strong>.{' '}
          <strong>Two weeks</strong> after their Bould site went live, they got
          their first call from it. In three months, it brought{' '}
          <strong>$20,000 in new work</strong>.
        </p>

        <dl className="bould-proof__metrics">
          {rubio.metrics.map((m) => (
            <div key={m.label} className="bould-proof__metric">
              <dt className="bould-proof__metric-label">{m.label}</dt>
              <dd className="bould-proof__metric-value">{m.value}</dd>
            </div>
          ))}
        </dl>

        <p className="bould-proof__source">
          Source: Rubio Brothers Concrete. Every business is different; this
          is what happened for them.{' '}
          <Link href="/work/rubio-brothers-concrete" className="bould-inline-link bould-inline-link--tap">
            Read the full case study
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
