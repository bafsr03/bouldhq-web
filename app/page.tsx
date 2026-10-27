import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'

import HeroScene, { HeroStill } from '@/components/HeroScene'
import ProofStrip from '@/components/ProofStrip'
import FormulaCheck from '@/components/FormulaCheck'
import Team from '@/components/Team'
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
  HOME_TITLE,
  LEGAL_NAME,
  LOCATION_SHORT,
  PHONE,
  PHONE_DISPLAY,
} from '@/lib/site'

/**
 * Brief, site map — Home: the H1 is specified verbatim. The title follows the
 * brief's wording with Brian's correction (Oct 2026): "Local Businesses Leads"
 * read as a typo, so it says "More Leads".
 */
const TITLE = HOME_TITLE
const DESCRIPTION = `${LEGAL_NAME} builds websites that turn local searches into phone calls for contractors, auto shops, and home services. Based in Utah. Free ranking check.`

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
            Most local websites look fine and never ring the phone. We build sites
            that turn the people already searching for you into calls and quote
            requests, and we stay on after launch to keep them working.
          </p>

          <div className="bould-hero__actions">
            <Link href="/visibility-audit" className="bould-btn bould-btn--primary">
              Get a free ranking check
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
          <p className="bould-section-label">How we&rsquo;re different</p>
          <h2 className="bould-section-title" id="different-heading">
            Cesar&rsquo;s story is common. Here&rsquo;s what we do about it.
          </h2>
          <div className="bould-two-col">
            <div>
              <h3 className="bould-mini-card__title">Bould (us)</h3>
              <ul className="bould-check-list">
                <li>You deal directly with the people who design and build your site, from the first call through launch and after. Nobody in between.</li>
                <li>Before we talk price, we look up where you rank on Google Maps and show you the top 3 near you, with their names and review counts.</li>
                <li>You hear back within the day. Changes are made by the person who built the page.</li>
                <li>If you&rsquo;re in Utah, we meet you in person. On the job, at the shop, wherever&rsquo;s easy.</li>
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
                <li>Every meeting is a video call with someone in another state.</li>
                <li>The domain is in their name. Leaving means starting over.</li>
                <li>You&rsquo;re promised page one. A few months in, you&rsquo;re told SEO takes a year.</li>
              </ul>
            </div>
          </div>
          <Team />
        </div>
      </section>

      {/* ── The formula ───────────────────────────────────────────────────── */}
      <section className="bould-section" aria-labelledby="formula-heading">
        <div className="bould-section__inner bould-section__inner--split">
          <div>
            <p className="bould-section-label">How this works</p>
            <h2 className="bould-section-title" id="formula-heading">
              Leads = Visibility &times; Conversion
            </h2>
            <p className="bould-section-body">
              You need both halves. If nobody can find you, even a great website
              brings in nothing. If people find you and the site gives them no
              reason to call, you get what Rubio Brothers got for a year: no leads
              at all.
            </p>
            <p className="bould-section-body">
              The website takes care of the second half. The monthly work on your
              Google profile, reviews and listings takes care of the first. A lot
              of agencies only sell you one of them.
            </p>
            <Link href="/how-it-works" className="bould-inline-link bould-inline-link--tap">
              See the whole process &rarr;
            </Link>
          </div>
          <FormulaCheck />
        </div>
      </section>

      {/* ── The two plans ─────────────────────────────────────────────────── */}
      <section className="bould-section bould-section--alt" aria-labelledby="plan-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">The monthly plans</p>
          <h2 className="bould-section-title" id="plan-heading">
            Two plans, and the free ranking check tells you which one you need.
          </h2>
          <p className="bould-section-body">
            If people already find you, Website Build is enough. If they
            don&rsquo;t, a new site on its own won&rsquo;t fix that, so Golden
            Formula adds the work that gets you found.
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
            Setup is quoted per project. You own your website and your domain
            from day one.
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
        cta="Get a free ranking check"
      />
    </div>
  )
}
