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

    import('@/components/animations')
      .then(({ initAnimations }) => {
        if (cancelled) return
        cleanup = initAnimations()
      })
      .catch(() => {
        // Same safety net the theme had: force the final, visible state rather
        // than leave reveal-on-scroll copy stuck at opacity 0.
        document.documentElement.classList.add('bould-anim-fallback')
      })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [pathname])

  return null
}
