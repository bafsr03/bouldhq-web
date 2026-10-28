import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'

import HeroScene, { HeroStill } from '@/components/HeroScene'
import ProofStrip from '@/components/ProofStrip'
import PlanCards from '@/components/PlanCards'
import Team from '@/components/Team'
import WorkGrid from '@/components/WorkGrid'
import TrackedContact from '@/components/TrackedContact'
import PageCta from '@/components/PageCta'
import JsonLd from '@/components/JsonLd'
import { graph, serviceSchema, webPageSchema } from '@/lib/schema'
import { PROJECTS, PROJECT_COUNT } from '@/lib/content/work'
import { INDUSTRIES } from '@/lib/content/industries'
import { PUBLISHED_REVIEWS } from '@/lib/content/reviews'
import {
  HOME_TITLE,
  LEGAL_NAME,
  PHONE,
  PHONE_DISPLAY,
} from '@/lib/site'

/**
 * Website Fixes + Minnesota Google Ads Launch (Oct 28, 2026), 5.1: the title,
 * hero, proof, comparison, steps and plans copy are specified verbatim.
 */
const TITLE = HOME_TITLE
const DESCRIPTION = `${LEGAL_NAME} builds websites for local businesses in Utah, Texas, and Minnesota. We look at who you're up against on Google, then build around it.`

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/',
  absoluteTitle: true,
})

const HERO_MODELS = ['/models/b.glb', '/models/dna.glb', '/models/world.glb']

const HOME_STEPS = [
  {
    name: 'Free ranking check.',
    body: 'We look at where you rank on Google Maps and who’s ahead of you.',
  },
  {
    name: 'Build.',
    body: 'A custom site with a page for each service, one-tap calling, and quick estimate forms. Three to four weeks.',
  },
  {
    name: 'Launch.',
    body: 'We connect your domain, Google profile and tracking, and record your starting numbers.',
  },
  {
    name: 'Keep it working.',
    body: 'Updates every month, plus a report showing calls, form requests, and where they came from.',
  },
]

export default function HomePage() {
  return (
    <div className="bould-page-wrap">
      <JsonLd
        data={graph(
          webPageSchema({ path: '/', name: TITLE, description: DESCRIPTION }),
          serviceSchema({
            name: 'Website design and local SEO for local businesses',
            description:
              'Custom websites for local service businesses, with hosting, updates, and monthly reporting.',
            path: '/',
            serviceType: 'Website design',
          })
        )}
      />

      <section className="bould-hero" id="bould-hero">
        <div className="bould-hero__bg-grid" aria-hidden="true" />
        <HeroStill />
        <HeroScene models={HERO_MODELS} />

        <div className="bould-hero__content">
          <span className="bould-hero__eyebrow">
            Websites for local businesses &middot; Utah, Texas &amp; Minnesota
          </span>

          {/* The main line (brand rules, section 3), verbatim. */}
          <h1 className="bould-hero__headline bould-hero__headline--long">
            <span className="line">
              <span className="line-inner">We build websites</span>
            </span>{' '}
            <span className="line">
              <span className="line-inner">that fix what&rsquo;s</span>
            </span>{' '}
            <span className="line">
              <span className="line-inner">holding you back</span>
            </span>{' '}
            <span className="line line--accent">
              <span className="line-inner">and keep working</span>
            </span>{' '}
            <span className="line line--accent">
              <span className="line-inner">long after launch.</span>
            </span>
          </h1>

          <p className="bould-hero__body">
            Before we build, we look at who you&rsquo;re up against on Google.
            Then we build around it, and we stay on after launch to keep your
            site working.
          </p>

          <div className="bould-hero__actions">
            <Link href="/visibility-audit" className="bould-btn bould-btn--primary">
              Get a free ranking check
            </Link>
            {PHONE ? (
              <TrackedContact
                method="phone"
                location="home-hero"
                value={PHONE}
                display={PHONE_DISPLAY}
                className="bould-btn bould-btn--ghost"
              />
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
              Both are on our Google profile, unedited. Cesar&rsquo;s is about the
              agency he had before us.
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

      {/* ── Us vs. them ───────────────────────────────────────────────────── */}
      {/*
        How we work, never what we promise. Every line in the left column has
        to stay true for every client; contract terms stay off the site.
      */}
      <section className="bould-section bould-section--alt" aria-labelledby="different-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <h2 className="bould-section-title" id="different-heading">
            How we&rsquo;re different.
          </h2>
          <div className="bould-two-col">
            <div>
              <h3 className="bould-mini-card__title">Bould (us)</h3>
              <ul className="bould-check-list">
                <li>You deal directly with the people who design and build your site, from the first call through launch and after. Nobody in between.</li>
                <li>Before we talk price, we look up where you rank on Google Maps and show you the top 3 near you, with their names and review counts.</li>
                <li>You hear back within the day. Changes are made by the person who built the page.</li>
                <li>In Utah, we meet you in person. Everywhere else, you still talk directly to the people building your site.</li>
                <li>Your site and your domain are yours. If you ever leave, you take them with you.</li>
                <li>We won&rsquo;t promise you a ranking or a number of leads. We&rsquo;ll show you the gap, and what we&rsquo;re doing about it.</li>
              </ul>
            </div>
            <div>
              <h3 className="bould-mini-card__title">A typical agency (them)</h3>
              <ul className="bould-x-list">
                <li>A salesperson closes the deal. Then you&rsquo;re handed to an account manager who passes your notes to people you never meet.</li>
                <li>The pitch starts with a package and a price, before anyone has looked at how you show up today.</li>
                <li>A simple change becomes a support ticket, and the ticket sits.</li>
                <li>You never talk to the person actually building your site.</li>
                <li>The domain is in their name. Leaving means starting over.</li>
                <li>You&rsquo;re promised page one. A few months in, you&rsquo;re told SEO takes a year.</li>
              </ul>
            </div>
          </div>
          <Team />
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="bould-section" aria-labelledby="steps-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <p className="bould-section-label">How it works</p>
          <h2 className="bould-section-title" id="steps-heading">
            Four steps, every time.
          </h2>
          <ol className="bould-steps">
            {HOME_STEPS.map((step, i) => (
              <li key={step.name} className="bould-steps__item bould-reveal">
                <span className="bould-steps__num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="bould-steps__name">{step.name}</h3>
                  <p className="bould-steps__body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/how-it-works" className="bould-inline-link bould-inline-link--tap">
            See the whole process &rarr;
          </Link>
        </div>
      </section>

      {/* ── The plans ─────────────────────────────────────────────────────── */}
      <section className="bould-section bould-section--alt" aria-labelledby="plan-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">The plans</p>
          <h2 className="bould-section-title" id="plan-heading">
            Pick the plan that fits your size.
          </h2>
          <p className="bould-section-body">
            Add the Golden Formula if you&rsquo;re behind the top 3 near you on
            Google.
          </p>

          <PlanCards compact />

          <p className="bould-section-body">
            No long-term contracts. You own your website and domain from day one.
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
        label="See where you stand against the top 3 near you."
        cta="Get a free ranking check"
      />
    </div>
  )
}
