import type { NextConfig } from 'next'

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

      // Client pages that became case studies.
      { source: '/pages/joon-distribution', destination: '/work/joon-distribution', permanent: true },
      { source: '/pages/dummiez', destination: '/work/dummiez', permanent: true },
      { source: '/pages/adophies', destination: '/work/adophies', permanent: true },

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
