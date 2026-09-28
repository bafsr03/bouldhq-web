'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Boots the ported GSAP/ScrollTrigger reveals.
 *
 * Re-runs per route: ScrollTriggers are bound to elements that client-side
 * navigation replaces, so without the pathname dependency the second page you
 * visit would have dead triggers and permanently invisible `.bould-reveal`
 * content.
 */
export default function SiteAnimations() {
  const pathname = usePathname()

  useEffect(() => {
    let cleanup: (() => void) | undefined
    let cancelled = false

    /*
      Dead-man's switch. The inline script in the layout hides the animated
      elements before paint; if this chunk never arrives — slow connection,
      blocked request, a bundle error — nothing ever brings them back. Dropping
      the class restores the final, visible state after two seconds, which is
      longer than the animation takes on any connection that works and shorter
      than a visitor will stare at an empty hero.
    */
    const failsafe = window.setTimeout(() => {
      document.documentElement.classList.remove('bould-anim-ready')
    }, 2000)

    import('@/components/animations')
      .then(({ initAnimations }) => {
        window.clearTimeout(failsafe)
        if (cancelled) return
        cleanup = initAnimations()
      })
      .catch(() => {
        window.clearTimeout(failsafe)
        // Belt and braces: drop the start state AND force the final one, in
        // case GSAP got far enough to write inline opacity before failing.
        document.documentElement.classList.remove('bould-anim-ready')
        document.documentElement.classList.add('bould-anim-fallback')
      })

    return () => {
      cancelled = true
      window.clearTimeout(failsafe)
      cleanup?.()
    }
  }, [pathname])

  return null
}
