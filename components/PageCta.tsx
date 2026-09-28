import Link from 'next/link'

/**
 * Brief: the old site's closing ask was "Ready to go 3D? Book a Demo" — the
 * wrong request for a contractor. Every page now ends on the free audit, which
 * is both the lead magnet and the first step of the sales playbook.
 */
export default function PageCta({
  label = 'Find out where you stand',
  href = '/visibility-audit',
  cta = 'Get a free website audit',
}: {
  label?: string
  href?: string
  cta?: string
}) {
  return (
    <section className="bould-page-cta">
      <div className="bould-page-cta__inner">
        <p className="bould-page-cta__label">{label}</p>
        <Link href={href} className="bould-btn bould-btn--primary bould-page-cta__btn">
          {cta}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="bould-btn__arrow">
            <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
