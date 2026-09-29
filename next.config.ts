import { execSync } from 'node:child_process'
import type { NextConfig } from 'next'

/**
 * A stamp identifying the build, surfaced as a <meta> tag by the root layout.
 *
 * This exists because of a specific, expensive failure mode: an orphaned
 * `next start` holding the port means a rebuild silently never takes effect,
 * and the browser keeps serving the old bundle. Everything looks broken in a
 * way that points at the code rather than at the process — we lost a round of
 * debugging to exactly that, twice, chasing logos that were already correct on
 * disk.
 *
 * Now `curl -s localhost:3000 | grep build-stamp` answers "am I looking at what
 * I just built?" in one line, and verify.sh prints it on every run.
 *
 * Vercel does not guarantee git in the build image, so its commit SHA env var
 * is preferred, with local git and then a bare timestamp as fallbacks.
 */
const BUILD_STAMP = (() => {
  const vercelSha = process.env.VERCEL_GIT_COMMIT_SHA
  if (vercelSha) return `${vercelSha.slice(0, 7)} ${new Date().toISOString()}`
  try {
    const sha = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
    const dirty = execSync('git status --porcelain', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
      ? '-dirty'
      : ''
    return `${sha}${dirty} ${new Date().toISOString()}`
  } catch {
    return `nogit ${new Date().toISOString()}`
  }
})()

/**
 * Redirects for the Shopify → Next migration.
 *
 * Brief, "Remove and redirect": every URL below is indexed by Google today.
 * Letting them 404 throws away whatever authority they have and strands anyone
 * who clicks an old result; 308s move that authority onto the new page and clear
 * the retail-technology positioning out of the index.
 *
 * They live in next.config rather than vercel.json so they survive a change of
 * host, and so `next dev` behaves the same as production.
 *
 * Ordering matters: the specific product and page rules are declared before the
 * catch-alls that would otherwise swallow them.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,

  env: { NEXT_PUBLIC_BUILD_STAMP: BUILD_STAMP },

  images: {
    // The only SVG served through next/image is our own logo from /public.
    // The CSP below is Next's documented hardening for that case.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async redirects() {
    return [
      // ── Old Shopify pages → their replacements ────────────────────────────
      { source: '/pages/studio', destination: '/about', permanent: true },
      { source: '/pages/build', destination: '/how-it-works', permanent: true },
      { source: '/pages/work', destination: '/work', permanent: true },
      { source: '/pages/contact', destination: '/contact', permanent: true },
      // Brief: "Review its contents; redirect to the closest new page."
      { source: '/pages/signal', destination: '/work', permanent: true },
      { source: '/pages/3d-store', destination: '/services/shopify-stores', permanent: true },
      { source: '/pages/demo', destination: '/work', permanent: true },

      // Client pages. Their case studies are written but unpublished (the
      // clients have not approved results), so these land on /work, where the
      // portfolio card links out to the live store.
      // Client showcase pages that were live on the storefront. They are indexed
      // and they are proof of work, so they land on /work rather than the
      // homepage — Run it Back is still a current project there.
      { source: '/pages/ghosts-vintage', destination: '/work', permanent: true },
      { source: '/pages/charlie-pike-tobacco', destination: '/work', permanent: true },
      { source: '/pages/run-it-back-classics', destination: '/work', permanent: true },

      // Shopify's CCPA opt-out page. Its subject matter is privacy, not terms.
      { source: '/pages/data-sharing-opt-out', destination: '/privacy', permanent: true },

      { source: '/pages/joon-distribution', destination: '/work', permanent: true },
      { source: '/pages/dummiez', destination: '/work', permanent: true },
      { source: '/pages/adophies', destination: '/work', permanent: true },

      // Case-study routes that existed on this site before those three were
      // unpublished. Temporary (307), not permanent: they come back at the same
      // URLs the day the clients approve, and a 308 would be cached by browsers
      // that then never re-check.
      { source: '/work/joon-distribution', destination: '/work', permanent: false },
      { source: '/work/dummiez', destination: '/work', permanent: false },
      { source: '/work/adophies', destination: '/work', permanent: false },
      // Renamed: Avion trades as Avio Supply Co.
      { source: '/work/avion', destination: '/work', permanent: true },
      // JCK Approved is permanently offline.
      { source: '/work/jck-approved', destination: '/work', permanent: true },

      // The nav used to point Industries straight at the contractors page.
      { source: '/industries/home-services', destination: '/industries', permanent: false },
      { source: '/industries/auto-repair', destination: '/industries', permanent: false },

      // ── The four $0.00 try-on products ────────────────────────────────────
      // Brief: "Delete products; redirect each to /". The virtual fitting room
      // is switched off and these pages are indexed as if it were not.
      { source: '/products/button-up-casual-winter-2026', destination: '/', permanent: true },
      { source: '/products/classic-shorts-spring-2026', destination: '/', permanent: true },
      { source: '/products/globalheart', destination: '/', permanent: true },
      { source: '/products/tennisclub-tshirt', destination: '/', permanent: true },

      // ── Store policies → services policies ────────────────────────────────
      { source: '/policies/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/policies/refund-policy', destination: '/terms', permanent: true },
      { source: '/policies/terms-of-service', destination: '/terms', permanent: true },
      { source: '/policies/shipping-policy', destination: '/terms', permanent: true },
      { source: '/policies/:slug*', destination: '/terms', permanent: true },

      // ── Everything else the storefront generated ──────────────────────────
      { source: '/collections/all', destination: '/work', permanent: true },
      { source: '/collections/:slug*', destination: '/work', permanent: true },
      { source: '/products/:slug*', destination: '/', permanent: true },
      { source: '/cart', destination: '/', permanent: true },
      { source: '/cart/:slug*', destination: '/', permanent: true },
      { source: '/account/:slug*', destination: '/', permanent: true },
      { source: '/apps/:slug*', destination: '/', permanent: true },
      // The storefront blog. It has an index but no articles; there is no blog on
      // the new site, so the index and any future article URL both go home.
      { source: '/blogs/:slug*', destination: '/', permanent: true },
      { source: '/search', destination: '/work', permanent: true },
      // Declared last so every named /pages rule above wins.
      { source: '/pages/:slug*', destination: '/', permanent: true },
    ]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        // The hero models are content-addressed by filename and never change in
        // place, so they can be cached hard. This is most of the hero's weight.
        source: '/models/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig
