import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'

import './bould.css'
import './site.css'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SiteAnimations from '@/components/SiteAnimations'
import JsonLd from '@/components/JsonLd'
import { graph, organizationSchema, websiteSchema } from '@/lib/schema'
import {
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
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
        <SiteAnimations />
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_ID} />
        )}
      </body>
    </html>
  )
}
