'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PHONE, PHONE_DISPLAY } from '@/lib/site'
import { trackContactClick } from '@/lib/track'

/**
 * The two things a visitor on a phone is ever here to do, pinned where the
 * thumb already is.
 *
 * Shown only under 900px (CSS); `body` gets bottom padding to match so the
 * footer is never covered. Hidden on /contact, /visibility-audit and the
 * /check/ results pages, where the page IS the call to action and a floating
 * bar just covers the form the visitor is filling in.
 */
export default function MobileCtaBar() {
  const pathname = usePathname()
  if (pathname === '/contact' || pathname === '/visibility-audit' || pathname.startsWith('/check/')) return null

  return (
    <div className="bould-mobile-cta" role="complementary" aria-label="Contact Bould">
      {PHONE && (
        <a
          href={`tel:${PHONE}`}
          className="bould-mobile-cta__call"
          onClick={() => trackContactClick('phone', 'mobile-bar')}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6.5 3h3l1.5 4-2 1.5a12 12 0 006.5 6.5L17 13l4 1.5v3a2 2 0 01-2.2 2A17 17 0 013.5 5.2 2 2 0 015.5 3h1z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          Call {PHONE_DISPLAY}
        </a>
      )}
      <Link href="/visibility-audit" className="bould-mobile-cta__audit">
        Free ranking check
      </Link>
    </div>
  )
}
