import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import { LEGAL_NAME, NAV } from '@/lib/site'

/*
  Without this the 404 inherited the layout's default title, so every dead URL
  shared a title with the homepage. That is a duplicate-title signal on a page
  that should not be competing for anything, and it tells a visitor nothing
  about where they landed.
*/
export const metadata: Metadata = {
  title: { absolute: `Page Not Found | ${LEGAL_NAME}` },
  description:
    'That page does not exist. Find websites, pricing, our work, and the free visibility audit here instead.',
  robots: { index: false, follow: true },
}

/**
 * The old store's product and collection URLs are redirected in vercel.json, but
 * anything missed lands here. A 404 that offers the real navigation recovers the
 * visit; a bare "not found" loses it.
 */
export default function NotFound() {
  return (
    <div className="bould-page-wrap">
      <PageHero
        ghost="404"
        eyebrow="Not found"
        title="That page does not exist any more."
        sub="We rebuilt this site around what Bould actually does now. The page you wanted may have moved, or may have been one of the old store pages we removed."
      />
      <section className="bould-section">
        <div className="bould-section__inner bould-section__inner--narrow">
          <ul className="bould-check-list">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="bould-inline-link bould-inline-link--tap">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
