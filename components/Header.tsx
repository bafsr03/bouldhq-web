'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NAV, PHONE, PHONE_DISPLAY } from '@/lib/site'
import { trackContactClick } from '@/lib/track'

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // The theme faded the header in on scroll via a class toggle. Same behaviour,
  // but the initial call matters: a deep link that restores scroll position
  // would otherwise render a transparent header over content.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile drawer on navigation, and stop the page scrolling behind it.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`header-wrapper${scrolled ? ' scrolled' : ''}${open ? ' is-open' : ''}`}
    >
      <a href="#main" className="bould-skip-link">
        Skip to content
      </a>
      <div className="bould-header">
        <Link href="/" className="bould-header__logo" aria-label={`Bould Inc — home`}>
          <Image src="/bould.svg" alt="Bould" width={127} height={36} priority />
        </Link>

        <nav className="bould-header__nav" aria-label="Main">
          {NAV.map((item) => {
            // Every NAV entry is a section root, so a prefix match also marks
            // the parent active on nested pages (/work/rubio… highlights Work).
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`bould-header__link${active ? ' is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/*
          On a phone the header used to show the logo and a burger, nothing
          else: the number and the audit CTA were both behind a tap. Both are
          now in the bar itself, and the burger moves to the right edge so the
          thumb finds it where it expects to.
        */}
        <div className="bould-header__actions">
          {PHONE && (
            <a
              href={`tel:${PHONE}`}
              className="bould-header__phone"
              onClick={() => trackContactClick('phone', 'header')}
            >
              <span className="bould-header__phone-full">{PHONE_DISPLAY}</span>
              <span className="bould-header__phone-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6.5 3h3l1.5 4-2 1.5a12 12 0 006.5 6.5L17 13l4 1.5v3a2 2 0 01-2.2 2A17 17 0 013.5 5.2 2 2 0 015.5 3h1z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="bould-sr-only">Call {PHONE_DISPLAY}</span>
            </a>
          )}
          <Link href="/visibility-audit" className="bould-btn bould-btn--primary bould-header__cta">
            Get a free ranking check
          </Link>
          <button
            type="button"
            className="bould-header__burger"
            aria-expanded={open}
            aria-controls="bould-mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        id="bould-mobile-nav"
        className={`bould-mobile-nav${open ? ' is-open' : ''}`}
        hidden={!open}
      >
        <nav aria-label="Mobile">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="bould-mobile-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/visibility-audit"
          className="bould-btn bould-btn--primary bould-mobile-nav__cta"
        >
          Get a free ranking check
        </Link>
        {PHONE && (
          <a
            href={`tel:${PHONE}`}
            className="bould-mobile-nav__phone"
            onClick={() => trackContactClick('phone', 'mobile-nav')}
          >
            {PHONE_DISPLAY}
          </a>
        )}
      </div>
    </header>
  )
}
