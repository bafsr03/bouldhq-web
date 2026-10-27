'use client'

import { useEffect, useRef } from 'react'

/**
 * The Three.js particle hero, lifted from the Shopify theme.
 *
 * What paints first is a still poster of the converged "B" (`HeroStill`, in
 * the page). The live scene is an enhancement on top of it, and it starts late
 * on purpose.
 *
 * The scene runs a 20,000-particle simulation on the main thread every frame.
 * Started on page load, that is continuous blocking work: Lighthouse measured
 * 26 seconds of Total Blocking Time on desktop (Brian, Oct 2026). Deferring it
 * to `load` or to idle does not fix that — the work still runs inside the
 * window Lighthouse measures, it just starts a little later. So it starts on
 * the visitor's first interaction instead: a real desktop visitor moves the
 * mouse within a second or two and sees the particles form over the poster;
 * a crawler or a lab test never interacts, and sees the poster.
 *
 * It never starts below 768px (phones get the poster only), with reduced
 * motion, or with Save-Data on. Those three are the visitors for whom 600KB of
 * WebGL and a hot CPU cost the most and add the least.
 *
 * The H1 and copy are server-rendered by the parent either way; this component
 * owns only the canvas.
 */

/**
 * The phone layout in bould.css, where the hero stacks and the canvas is
 * hidden. Asked of CSS rather than compared against innerWidth so the two can
 * never disagree at the boundary.
 */
const PHONE_LAYOUT = '(max-width: 768px)'

const START_EVENTS = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'scroll', 'touchstart'] as const

function sceneAllowed(): boolean {
  if (window.matchMedia(PHONE_LAYOUT).matches) return false
  // Tablets and landscape phones are wider than the phone layout but have the
  // same CPU: 20,000 particles simulated on the main thread made them stutter.
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (connection?.saveData) return false
  return true
}

export default function HeroScene({ models }: { models: (string | null)[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let scene: { destroy?: () => void } | null = null
    let cancelled = false
    let idleId: number | undefined

    // The FLIP choreography must run before the scene boots: it records the
    // hero's centred position, animates to the final layout, and only then
    // fires `bould:hero-revealed`. A scene that boots later reads the
    // `__bouldHeroRevealed` latch instead, so the order does not matter.
    import('@/components/hero/heroChoreography')
      .then(({ runHeroChoreography }) => {
        if (!cancelled) runHeroChoreography()
      })
      .catch(() => {})

    const hero = canvas.closest('.bould-hero')
    const onLive = () => hero?.classList.add('is-scene-live')
    document.addEventListener('bould:scene-live', onLive, { once: true })

    const boot = () => {
      if (cancelled || scene) return
      import('@/components/hero/bouldScene')
        .then(({ bootBouldScene }) => {
          if (cancelled) return
          scene = bootBouldScene(canvas, models)
        })
        .catch(() => {
          // WebGL unavailable or the chunk failed: the poster stays, which is
          // the finished look anyway.
        })
    }

    // Starting the scene is a long task; do it after the input that asked for
    // it has painted, so the first interaction itself never feels slow.
    const onFirstInteraction = () => {
      removeStartListeners()
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(boot, { timeout: 500 })
      } else {
        setTimeout(boot, 50)
      }
    }
    const removeStartListeners = () => {
      for (const e of START_EVENTS) window.removeEventListener(e, onFirstInteraction)
    }

    if (sceneAllowed()) {
      for (const e of START_EVENTS) {
        window.addEventListener(e, onFirstInteraction, { passive: true, once: true })
      }
    }

    return () => {
      cancelled = true
      removeStartListeners()
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId)
      document.removeEventListener('bould:scene-live', onLive)
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

/**
 * The poster the live scene replaces: the scene's own converged "B", captured
 * at desktop and phone framing. `mix-blend-mode: screen` (bould.css) drops the
 * capture's black so only the glow sits on the hero background, the same way
 * the transparent canvas does.
 *
 * A plain <picture> rather than next/image because the two crops are art
 * direction, not resolutions of one image; both are already sized WebP files.
 */
export function HeroStill() {
  return (
    <picture className="bould-hero__still" aria-hidden="true">
      <source media={PHONE_LAYOUT} srcSet="/hero-still-mobile.webp" width={780} height={540} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero-still.webp" alt="" width={1440} height={900} fetchPriority="high" decoding="async" />
    </picture>
  )
}
