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
          <Image src="/bould.svg" alt="Bould" width={104} height={28} priority />
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

        <div className="bould-header__actions">
          {PHONE && (
            <a
              href={`tel:${PHONE}`}
              className="bould-header__phone"
              onClick={() => trackContactClick('phone', 'header')}
            >
              {PHONE_DISPLAY}
            </a>
          )}
          <Link href="/visibility-audit" className="bould-btn bould-btn--primary bould-header__cta">
            Get a free audit
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
