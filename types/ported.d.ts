/**
 * Types for the three modules ported verbatim from the Shopify theme.
 *
 * These stay as plain JavaScript on purpose: they are ~1,200 lines of working,
 * reviewed animation and WebGL code, and rewriting them in TypeScript during a
 * platform migration would mean debugging a rewrite and a migration at the same
 * time. Declaring their surface here gives every call site full type safety at
 * the boundary, which is where it matters.
 */

declare module '@/components/hero/bouldScene' {
  export interface BouldSceneInstance {
    reveal(): void
    destroy(): void
  }
  export function bootBouldScene(
    canvas: HTMLCanvasElement | null,
    urls: (string | null)[]
  ): BouldSceneInstance | null
  const BouldScene: new (
    canvas: HTMLCanvasElement,
    urls: (string | null)[]
  ) => BouldSceneInstance
  export default BouldScene
}

declare module '@/components/hero/heroChoreography' {
  export function runHeroChoreography(): void
}

declare module '@/components/animations' {
  /** Returns a cleanup that kills every ScrollTrigger it created. */
  export function initAnimations(): () => void
}
