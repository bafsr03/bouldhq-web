import Link from 'next/link'
import Image from 'next/image'
import {
  EMAIL,
  FOOTER_NAV,
  LEGAL_NAME,
  PHONE,
  PHONE_DISPLAY,
  LOCATION_LINE,
} from '@/lib/site'
import TrackedContact from './TrackedContact'

/**
 * Brief: "Footer: name, phone, email, and service area on every page, identical
 * to the Google profile." The Shopify footer carried a tagline ("Retail tech.
 * 3D stores. Virtual try-on.") and no contact details at all, which cost a point
 * on the visibility scorecard and gave Google nothing to match the profile to.
 *
 * The NAP block below is also marked up in JSON-LD from the same constants, so
 * the two can never drift apart.
 */
export default function Footer() {
  return (
    <footer className="bould-footer" aria-label="Site footer">
      <div className="bould-footer__hero">
        <div className="bould-footer__hero-inner">
          <p className="bould-footer__eyebrow bould-reveal">See how you stack up</p>
          <h2 className="bould-footer__headline">
            <span className="bould-line-reveal">
              <span className="bould-line-reveal-inner">Get a free</span>
            </span>
            <span className="bould-line-reveal">
              <span className="bould-line-reveal-inner bould-footer__headline-accent">
                ranking check.
              </span>
            </span>
          </h2>
          <p className="bould-footer__hero-body bould-reveal">
            Where you rank on Google Maps, how you compare to the top 3 near you,
            and the one thing holding you back. We run it and call you.
          </p>
          <Link
            href="/visibility-audit"
            className="bould-btn bould-btn--primary bould-footer__cta bould-reveal"
          >
            Get a free ranking check
            <svg
              className="bould-btn__arrow"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 7H13M13 7L7 1M13 7L7 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>

      <div className="bould-footer__body">
        <div className="bould-footer__brand">
          <Image
            src="/bould.svg"
            alt={LEGAL_NAME}
            className="bould-footer__logo-img"
            width={141}
            height={40}
          />
          <p className="bould-footer__tagline">
            Websites for local service businesses and growing brands.
          </p>

          {/* NAP — must stay byte-identical to the Google Business Profile. */}
          <address className="bould-footer__nap">
            <span className="bould-footer__nap-name">{LEGAL_NAME}</span>
            <span className="bould-footer__nap-area">{LOCATION_LINE}</span>
            {PHONE && (
              <TrackedContact
                method="phone"
                location="footer"
                value={PHONE}
                display={PHONE_DISPLAY}
                className="bould-footer__nap-link"
              />
            )}
            <TrackedContact
              method="email"
              location="footer"
              value={EMAIL}
              display={EMAIL}
              className="bould-footer__nap-link"
            />
          </address>
        </div>

        {FOOTER_NAV.map((col) => (
          <nav key={col.heading} className="bould-footer__nav-col" aria-label={col.heading}>
            <p className="bould-footer__nav-heading">{col.heading}</p>
            <ul className="bould-footer__nav-list">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="bould-footer__nav-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="bould-footer__bottom">
        <small className="bould-footer__copy">
          &copy; {new Date().getFullYear()} {LEGAL_NAME}. All rights reserved.
        </small>
      </div>
    </footer>
  )
}
