'use client'

import { useEffect, useRef } from 'react'

/**
 * The Three.js particle hero, lifted from the Shopify theme.
 *
 * Two deliberate choices, both for the LCP the brief asks us to measure:
 *  - three.js is `import()`ed inside the effect, so ~600KB of WebGL never lands
 *    in the initial bundle and never blocks the H1.
 *  - the H1 and copy are server-rendered by the parent; this component owns only
 *    the canvas. The headline is real text in the HTML source on first byte,
 *    which is what both Google and the LCP measurement want.
 */
export default function HeroScene({ models }: { models: (string | null)[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let scene: { destroy?: () => void } | null = null
    let cancelled = false

    // The FLIP choreography must run before the scene boots: it records the
    // hero's centred position, animates to the final layout, and only then
    // fires `bould:hero-revealed`, which is the scene's cue to converge.
    import('@/components/hero/heroChoreography')
      .then(({ runHeroChoreography }) => {
        if (!cancelled) runHeroChoreography()
      })
      .catch(() => {})

    import('@/components/hero/bouldScene')
      .then(({ bootBouldScene }) => {
        if (cancelled) return
        scene = bootBouldScene(canvas, models)
      })
      .catch(() => {
        // WebGL unavailable or the chunk failed: the hero copy is server
        // rendered and the canvas is decorative, so there is nothing to do but
        // leave the text hero in place.
      })

    return () => {
      cancelled = true
      scene?.destroy?.()
    }
  }, [models])

  return (
    <canvas
      ref={canvasRef}
      id="bould-hero-canvas"
      className="bould-hero__canvas"
      aria-hidden="true"
    />
  )
}
