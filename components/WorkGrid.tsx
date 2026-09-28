import Link from 'next/link'
import type { Project } from '@/lib/content/work'

function initials(name: string) {
  return name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
}

/**
 * A project links internally to its case study when one exists, and out to the
 * live site otherwise.
 *
 * The internal link matters more than it looks: the brief flags that the old
 * site's "View All Projects" pointed at "#", a dead end on the most important
 * section. Internal links are also how link equity reaches the case studies,
 * which are the pages meant to rank.
 */
export default function WorkGrid({ projects }: { projects: readonly Project[] }) {
  return (
    <ul className="bould-work__grid">
      {projects.map((p) => {
        const href = p.hasCaseStudy ? `/work/${p.slug}` : p.liveUrl
        const external = !p.hasCaseStudy
        const Card = external ? 'a' : Link

        return (
          <li key={p.slug} className="bould-reveal">
            <Card
              href={href}
              className="bould-work-card"
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <div className="bould-work-card__logo-wrap" aria-hidden="true">
                <span className="bould-work-card__initials">{initials(p.name)}</span>
              </div>
              <div className="bould-work-card__body">
                <h3 className="bould-work-card__name">{p.name}</h3>
                <p className="bould-work-card__result">{p.blurb}</p>
              </div>
              <div className="bould-work-card__footer">
                <span className="bould-work-card__type">{p.category}</span>
                <span className="bould-work-card__year">{p.year}</span>
              </div>
              <span className="bould-work-card__cta-icon" aria-hidden="true">
                {p.hasCaseStudy ? 'Read the case study' : 'Visit the site'} &rarr;
              </span>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
