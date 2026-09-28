import Link from 'next/link'
import { CASE_STUDIES } from '@/lib/content/work'

/**
 * Brief, messaging: the proof line, verbatim, plus Rubio's three sourced
 * numbers. These replace the old homepage's "300% avg revenue growth / 40%+
 * conversion lift / 2x add-to-cart / 98% retention" — none of which had a source
 * and all of which described ecommerce outcomes to an audience of contractors.
 */
export default function ProofStrip() {
  const rubio = CASE_STUDIES.find((c) => c.slug === 'rubio-brothers-concrete')!

  return (
    <section className="bould-proof" aria-labelledby="proof-heading">
      <div className="bould-proof__inner">
        <p className="bould-section-label">Proof</p>
        <p className="bould-proof__line" id="proof-heading">
          Rubio Brothers Concrete&rsquo;s old site brought{' '}
          <strong>zero leads in a year</strong>. Their Bould site brought the
          first lead in <strong>two weeks</strong>, and{' '}
          <strong>$20k+ in new work</strong> in three months.
        </p>

        <dl className="bould-proof__metrics">
          {rubio.metrics.map((m) => (
            <div key={m.label} className="bould-proof__metric bould-reveal">
              <dt className="bould-proof__metric-label">{m.label}</dt>
              <dd className="bould-proof__metric-value">{m.value}</dd>
            </div>
          ))}
        </dl>

        <p className="bould-proof__source">
          Source: Rubio Brothers Concrete.{' '}
          <Link href="/work/rubio-brothers-concrete" className="bould-inline-link">
            Read the full case study
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
