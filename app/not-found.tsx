import Link from 'next/link'
import PageHero from '@/components/PageHero'
import { NAV } from '@/lib/site'

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
                <Link href={n.href} className="bould-inline-link">
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
