import Image from 'next/image'
import Link from 'next/link'
import { hasCaseStudy, type Project } from '@/lib/content/work'

function monogram(name: string) {
  return name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
}

/**
 * The portfolio grid.
 *
 * The logo <Image> deliberately carries no `sizes`. With `sizes` set, Next
 * treats the image as fluid and its fallback `src` becomes the largest
 * candidate — it was requesting a 3840px render of a logo displayed at 220px.
 * Fixed width/height instead makes Next emit a plain 1x/2x srcset, which is
 * what a fixed-size logo actually wants.
 *
 * Uses its own `bould-project-*` classes rather than the theme's
 * `.bould-work-card`. Those rules were written for the Liquid section's markup —
 * the card itself was the flex item, and the whole thing was an overlay layout.
 * Wrapping them in a <ul>/<li> for semantics made the <li> the flex item
 * instead, so the sizing never applied, the grid collapsed to one column, and
 * the card's link styling leaked over every line of text inside it.
 *
 * Logos live at /logos/<slug>.png. Where a client's logo has not been exported
 * from Shopify yet, the card falls back to a designed monogram rather than a
 * broken image — a deliberate placeholder reads as a choice; a missing one reads
 * as a bug.
 */
export default function WorkGrid({ projects }: { projects: readonly Project[] }) {
  return (
    <ul className="bould-project-grid">
      {projects.map((p) => {
        const internal = hasCaseStudy(p.slug)
        const href = internal ? `/work/${p.slug}` : p.liveUrl

        const inner = (
          <>
            <span className="bould-project-card__logo">
              {p.logo ? (
                <Image
                  src={p.logo}
                  alt={`${p.name} logo`}
                  width={220}
                  height={110}
                  className="bould-project-card__logo-img"
                />
              ) : (
                <span className="bould-project-card__monogram" aria-hidden="true">
                  {monogram(p.name)}
                </span>
              )}
            </span>

            <span className="bould-project-card__body">
              <span className="bould-project-card__name">{p.name}</span>
              <span className="bould-project-card__blurb">{p.blurb}</span>
            </span>

            <span className="bould-project-card__footer">
              <span className="bould-project-card__tag">{p.category}</span>
              <span className="bould-project-card__year">{p.year}</span>
            </span>

            <span className="bould-project-card__cta">
              {internal ? 'Read the case study' : 'Visit the site'}
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M1 7H13M13 7L7 1M13 7L7 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </>
        )

        return (
          <li key={p.slug} className="bould-project-grid__item bould-reveal">
            {internal ? (
              <Link href={href} className="bould-project-card">
                {inner}
              </Link>
            ) : (
              <a
                href={href}
                className="bould-project-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                {inner}
                <span className="bould-sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </li>
        )
      })}
    </ul>
  )
}
