import Link from 'next/link'
import { PLANS } from '@/lib/content/pricing'

/**
 * The plan cards, from one price list, so the homepage, /pricing and the
 * Minnesota landing page can never quote different numbers.
 *
 * `compact` is the short version: Starter, Growth and the Golden Formula
 * add-on, with no "Best for" line or button. /pricing gets the full cards,
 * including Ecommerce.
 */
export default function PlanCards({ compact = false }: { compact?: boolean }) {
  const plans = compact ? PLANS.filter((p) => p.id !== 'ecommerce') : PLANS

  return (
    <div className={`bould-plans${compact ? ' bould-plans--compact' : ''}`}>
      {plans.map((plan) => (
        <article
          key={plan.id}
          className={`bould-plan${plan.addon ? ' bould-plan--addon' : ''} bould-reveal`}
        >
          {plan.addon && <span className="bould-plan__flag">Add-on</span>}
          <h3 className="bould-plan__name">{plan.name}</h3>
          <p className="bould-plan__price">
            {plan.price}
            {plan.cadence && <span className="bould-plan__cadence"> {plan.cadence}</span>}
          </p>
          <p className="bould-plan__setup">{plan.setup}</p>
          {plan.note && <p className="bould-plan__note">{plan.note}</p>}
          {compact ? (
            <p className="bould-plan__tagline">{plan.best}</p>
          ) : (
            plan.tagline && <p className="bould-plan__tagline">{plan.tagline}</p>
          )}
          <ul className="bould-check-list">
            {plan.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {!compact && (
            <>
              <p className="bould-plan__best">
                <span className="bould-plan__best-label">Best for</span>
                {plan.best}
              </p>
              <Link href={plan.cta.href} className="bould-btn bould-btn--primary">
                {plan.cta.label}
              </Link>
            </>
          )}
        </article>
      ))}
    </div>
  )
}
