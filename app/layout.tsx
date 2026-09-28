import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'

import './bould.css'
import './site.css'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileCtaBar from '@/components/MobileCtaBar'
import SiteAnimations from '@/components/SiteAnimations'
import JsonLd from '@/components/JsonLd'
import { graph, organizationSchema, websiteSchema } from '@/lib/schema'
import {
  ALLOW_INDEXING,
  DEFAULT_DESCRIPTION,
  LEGAL_NAME,
  SITE_URL,
  TITLE_TEMPLATE,
} from '@/lib/site'

/**
 * Self-hosted by next/font: no render-blocking request to fonts.googleapis.com
 * (which is what the Shopify stylesheet did on every page), no layout shift, and
 * no third-party connection on the critical path.
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  /**
   * metadataBase makes every relative OG/canonical URL absolute. Without it
   * Next emits relative og:image paths, which most crawlers and every social
   * scraper refuse to resolve.
   */
  metadataBase: new URL(SITE_URL),
  title: {
    /**
     * Brief: 'Title pattern: "[Page topic] | Bould Inc" … with the service in
     * the topic, never the name alone.' The Shopify homepage title was the bare
     * word "Bould" — no service, no city, competing with Bould Design, Fred
     * Bould, and a bouldering app for its own name.
     */
    default: `Websites That Bring Local Businesses Leads | ${LEGAL_NAME}`,
    template: TITLE_TEMPLATE,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: LEGAL_NAME,
  authors: [{ name: LEGAL_NAME, url: SITE_URL }],
  creator: LEGAL_NAME,
  publisher: LEGAL_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: LEGAL_NAME,
    locale: 'en_US',
    url: SITE_URL,
    title: `Websites That Bring Local Businesses Leads | ${LEGAL_NAME}`,
    description: DEFAULT_DESCRIPTION,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Websites That Bring Local Businesses Leads | ${LEGAL_NAME}`,
    description: DEFAULT_DESCRIPTION,
    images: ['/opengraph-image'],
  },
  // Belt and braces with robots.ts: a disallowed page that is already in the
  // index stays there, because a crawler that cannot fetch it cannot read the
  // directive telling it to drop it. The meta tag travels with the page.
  robots: ALLOW_INDEXING
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
      }
    : { index: false, follow: false, nocache: true },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  category: 'business',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080808',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-US" className={spaceGrotesk.variable}>
      <head>
        {/* Which build is this? See BUILD_STAMP in next.config.ts. */}
        <meta name="build-stamp" content={process.env.NEXT_PUBLIC_BUILD_STAMP} />
        {/*
          Opt the page INTO the animated start state, synchronously, before the
          body paints.

          The hero copy, the buttons and every `.bould-reveal` are now visible in
          CSS by default; this class is what hides them so GSAP can bring them
          in. Running it here rather than from the animation module means there
          is no flash of the finished layout — and if JavaScript is off, or
          motion is reduced, the class never lands and the page simply renders
          finished. The previous arrangement had the defaults the other way
          round, so any failure to run the timelines left the page blank.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('bould-anim-ready')}}catch(e){}",
          }}
        />
      </head>
      <body>
        {/*
          Site-wide graph: the Organization/ProfessionalService node every page
          references by @id, plus the WebSite node. Emitted once in the layout so
          page-level graphs only have to carry what is specific to them.
        */}
        <JsonLd data={graph(organizationSchema(), websiteSchema())} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileCtaBar />
        <SiteAnimations />
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_ID} />
        )}
      </body>
    </html>
  )
}
