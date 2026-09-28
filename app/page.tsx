import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'

import HeroScene from '@/components/HeroScene'
import ProofStrip from '@/components/ProofStrip'
import FormulaChart from '@/components/FormulaChart'
import WorkGrid from '@/components/WorkGrid'
import PageCta from '@/components/PageCta'
import JsonLd from '@/components/JsonLd'
import { graph, serviceSchema, webPageSchema } from '@/lib/schema'
import { PROJECTS, PROJECT_COUNT } from '@/lib/content/work'
import { PLANS } from '@/lib/content/pricing'
import {
  LEGAL_NAME,
  PHONE,
  PHONE_DISPLAY,
  SERVICE_AREA_LABEL,
  SERVICE_AREA_SHORT,
} from '@/lib/site'

/** Brief, site map — Home: title and H1 are specified verbatim. */
const TITLE = `Websites That Bring Local Businesses Leads | ${LEGAL_NAME}`
const DESCRIPTION = `${LEGAL_NAME} builds websites that turn searches into calls for contractors, auto shops, and home service businesses across ${SERVICE_AREA_LABEL}. See the Rubio Brothers case study, or get a free 20-point visibility audit.`

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/',
  absoluteTitle: true,
})

const HERO_MODELS = ['/models/b.glb', '/models/dna.glb', '/models/world.glb']

const INDUSTRIES = [
  {
    href: '/industries/contractors',
    name: 'Contractors',
    body: 'Concrete, excavation, and the trades. Estimators, local photos, and a page per service.',
    live: true,
  },
  {
    href: '/industries/contractors',
    name: 'Home services',
    body: 'Exterior cleaning, lighting, landscaping. Seasonal work needs the site ready before the season.',
    live: false,
  },
  {
    href: '/industries/contractors',
    name: 'Auto repair',
    body: 'Shops with years of reviews and no website worth the clicks they already get.',
    live: false,
  },
  {
    href: '/services/shopify-stores',
    name: 'Product brands',
    body: 'Shopify and Shopify Plus storefronts, with 3D product visuals where the product needs inspecting.',
    live: true,
  },
]

export default function HomePage() {
  const plan = PLANS[0]
  const recent = PROJECTS.slice(0, 6)

  return (
    <div className="bould-page-wrap">
      <JsonLd
        data={graph(
          webPageSchema({ path: '/', name: TITLE, description: DESCRIPTION }),
          serviceSchema({
            name: 'Website design and local SEO for local businesses',
            description:
              'Custom websites for local service businesses, with hosting, updates, Google Business Profile management, and monthly reporting.',
            path: '/',
            serviceType: 'Website design',
          })
        )}
      />

      <section className="bould-hero" id="bould-hero">
        <div className="bould-hero__bg-grid" aria-hidden="true" />
        <HeroScene models={HERO_MODELS} />

        <div className="bould-hero__content">
          <span className="bould-hero__eyebrow">
            Websites for local businesses &middot; {SERVICE_AREA_SHORT}
          </span>

          {/* Brief, site map — Home H1, verbatim. */}
          <h1 className="bould-hero__headline">
            <span className="line">
              <span className="line-inner">Your website</span>
            </span>{' '}
            <span className="line">
              <span className="line-inner">should bring you</span>
            </span>{' '}
            <span className="line line--accent">
              <span className="line-inner">customers.</span>
            </span>
          </h1>

          <p className="bould-hero__body">
            Most small-business websites are a brochure nobody asked for. We build
            the other kind: a site that turns the people already searching for you
            into phone calls and quote requests — and we keep it working after
            launch.
          </p>

          <div className="bould-hero__actions">
            <Link href="/visibility-audit" className="bould-btn bould-btn--primary">
              Get a free audit
            </Link>
            {PHONE ? (
              <a href={`tel:${PHONE}`} className="bould-btn bould-btn--ghost">
                {PHONE_DISPLAY}
              </a>
            ) : (
              <Link href="/work" className="bould-btn bould-btn--ghost">
                See the work
                <svg className="bould-btn__arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/*
          One verified number, replacing the old hero's "7+ Brands Launched"
          stat that contradicted a "5+ Brands Launched" counter further down the
          same page, and the unconfirmed "Shopify Plus Partner" badge.
        */}
        <div className="bould-hero__stats">
          <div className="bould-hero__stat">
            <span className="bould-hero__stat-num">{PROJECT_COUNT}</span>
            <span className="bould-hero__stat-label">Client sites built</span>
          </div>
          <div className="bould-hero__stat">
            <span className="bould-hero__stat-num">2 wks</span>
            <span className="bould-hero__stat-label">To Rubio&rsquo;s first lead</span>
          </div>
        </div>
      </section>

      <ProofStrip />

      {/* ── The formula ───────────────────────────────────────────────────── */}
      <section className="bould-section" aria-labelledby="formula-heading">
        <div className="bould-section__inner bould-section__inner--split">
          <div>
            <p className="bould-section-label">How this works</p>
            <h2 className="bould-section-title" id="formula-heading">
              Leads = Visibility &times; Conversion
            </h2>
            <p className="bould-section-body">
              It is a multiplication, not an addition. If nobody can find you,
              the best website in your county still produces nothing. If everyone
              finds you and the site gives them nothing to do, you get what Rubio
              Brothers got for a year: zero.
            </p>
            <p className="bould-section-body">
              We fix conversion with the build, and visibility with the work that
              runs every month after it — the Google profile, the reviews, the
              listings. Most agencies sell one half and quietly hope you do not
              notice the other.
            </p>
            <Link href="/how-it-works" className="bould-inline-link">
              See the whole process &rarr;
            </Link>
          </div>
          <FormulaChart />
        </div>
      </section>

      {/* ── What the plan includes ────────────────────────────────────────── */}
      <section className="bould-section bould-section--alt" aria-labelledby="plan-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">The monthly plan</p>
          <h2 className="bould-section-title" id="plan-heading">
            {plan.price} {plan.cadence}, and here is exactly what that buys.
          </h2>
          <ul className="bould-check-list">
            {plan.includes.map((item) => (
              <li key={item} className="bould-reveal">
                {item}
              </li>
            ))}
          </ul>
          <p className="bould-section-body">
            {plan.setup}. No lock-in contract, and you own the site and the
            domain from day one.
          </p>
          <Link href="/pricing" className="bould-inline-link">
            Full plans and pricing &rarr;
          </Link>
        </div>
      </section>

      {/* ── Industries ────────────────────────────────────────────────────── */}
      <section className="bould-section" aria-labelledby="industries-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">Who we build for</p>
          <h2 className="bould-section-title" id="industries-heading">
            Businesses where the phone ringing is the whole point.
          </h2>
          <ul className="bould-card-grid">
            {INDUSTRIES.map((ind) => (
              <li key={ind.name} className="bould-reveal">
                <Link href={ind.href} className="bould-mini-card">
                  <h3 className="bould-mini-card__title">{ind.name}</h3>
                  <p className="bould-mini-card__body">{ind.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Recent work ───────────────────────────────────────────────────── */}
      <section className="bould-work bould-section--alt" aria-labelledby="work-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">Selected work</p>
          <h2 className="bould-section-title" id="work-heading">
            {PROJECT_COUNT} sites, and the stories behind them.
          </h2>
          <WorkGrid projects={recent} />
          {/* The old "View All Projects" link pointed at "#". This one goes somewhere. */}
          <Link href="/work" className="bould-inline-link">
            See all {PROJECT_COUNT} projects &rarr;
          </Link>
        </div>
      </section>

      <PageCta
        label="Not sure whether you need a new site or more visibility?"
        cta="Take the free 20-point audit"
      />
    </div>
  )
}
