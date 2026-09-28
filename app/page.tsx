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
import { INDUSTRIES } from '@/lib/content/industries'
import { PUBLISHED_REVIEWS } from '@/lib/content/reviews'
import {
  CLIENT_STATES,
  LEGAL_NAME,
  LOCATION_SHORT,
  PHONE,
  PHONE_DISPLAY,
} from '@/lib/site'

/** Brief, site map — Home: title and H1 are specified verbatim. */
const TITLE = `Websites That Bring Local Businesses Leads | ${LEGAL_NAME}`
const DESCRIPTION = `${LEGAL_NAME} builds websites that turn searches into calls for contractors, auto shops, and home service businesses. Based in Utah, with clients in ${CLIENT_STATES}. See the Rubio Brothers case study, or get a free 20-point visibility audit.`

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/',
  absoluteTitle: true,
})

const HERO_MODELS = ['/models/b.glb', '/models/dna.glb', '/models/world.glb']

export default function HomePage() {
  const monthly = PLANS.filter((p) => p.id !== 'ecommerce')

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
            Websites for local businesses &middot; {LOCATION_SHORT}
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

      {/* ── What clients say ──────────────────────────────────────────────── */}
      {PUBLISHED_REVIEWS.length > 0 && (
        <section className="bould-section" aria-labelledby="reviews-heading">
          <div className="bould-section__inner bould-section__inner--narrow">
            <p className="bould-section-label">From our Google profile</p>
            <h2 className="bould-section-title" id="reviews-heading">
              In their words, not ours.
            </h2>
            <p className="bould-section-body">
              Both of these are on the Google profile, unedited. The first one is
              worth reading twice: it is not about us.
            </p>
            <ul className="bould-reviews">
              {PUBLISHED_REVIEWS.map((r) => (
                <li key={r.author} className="bould-review bould-reveal">
                  {r.context && (
                    <p className="bould-review__context">{r.context}</p>
                  )}
                  <blockquote className="bould-review__quote">
                    <p>&ldquo;{r.text}&rdquo;</p>
                  </blockquote>
                  <p className="bould-review__attr">
                    {r.author}
                    {r.business && (
                      <span className="bould-review__business">, {r.business}</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
            {/*
              No AggregateRating markup. These reviews already live on the Google
              profile, where they count; re-declaring them as structured data on
              our own site is self-serving review markup, which is the thing
              Google's guidelines single out.
            */}
          </div>
        </section>
      )}

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
            <Link href="/how-it-works" className="bould-inline-link bould-inline-link--tap">
              See the whole process &rarr;
            </Link>
          </div>
          <FormulaChart />
        </div>
      </section>

      {/* ── The two plans ─────────────────────────────────────────────────── */}
      <section className="bould-section bould-section--alt" aria-labelledby="plan-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">The monthly plans</p>
          <h2 className="bould-section-title" id="plan-heading">
            Two plans, and the audit tells you which one you need.
          </h2>
          <p className="bould-section-body">
            Both halves of the formula cost money to run, so they are priced
            separately. If people already find you, you only need the website
            half. If they do not, buying the website half on its own is buying a
            multiplier for a number close to zero.
          </p>

          <div className="bould-plans bould-plans--compact">
            {monthly.map((p) => (
              <article
                key={p.id}
                className={`bould-plan${p.featured ? ' bould-plan--featured' : ''} bould-reveal`}
              >
                <h3 className="bould-plan__name">{p.name}</h3>
                <p className="bould-plan__price">
                  {p.price}
                  <span className="bould-plan__cadence"> {p.cadence}</span>
                </p>
                <p className="bould-plan__tagline">{p.tagline}</p>
                <ul className="bould-check-list">
                  {p.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="bould-section-body">
            Setup is quoted per project. No long-term contracts. You own your
            website, and the domain, from day one.
          </p>
          <Link href="/pricing" className="bould-inline-link bould-inline-link--tap">
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
                <Link href={ind.href ?? '/industries'} className="bould-mini-card">
                  <h3 className="bould-mini-card__title">{ind.name}</h3>
                  <p className="bould-mini-card__body">{ind.body}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/industries" className="bould-inline-link bould-inline-link--tap">
            Everyone we build for &rarr;
          </Link>
        </div>
      </section>

      {/* ── Recent work ───────────────────────────────────────────────────── */}
      <section className="bould-work bould-section--alt" aria-labelledby="work-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">Selected work</p>
          <h2 className="bould-section-title" id="work-heading">
            {PROJECT_COUNT} sites, and the stories behind them.
          </h2>
          {/*
            All nine, not a slice. The heading above states the number, and a
            heading that says nine over a grid of six is the same self-
            contradiction the brief called out on the old site, where "7+ Brands
            Launched" sat above "5+ Brands Launched" on one page. If this ever
            needs trimming, the count in the heading has to move with it.
          */}
          <WorkGrid projects={PROJECTS} />
          {/* The old "View All Projects" link pointed at "#". This one goes somewhere. */}
          <Link href="/work" className="bould-inline-link bould-inline-link--tap">
            Read the case studies &rarr;
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
