# bouldhq.com

The Bould Inc website: Next.js 16 (App Router) on Vercel, replacing the Shopify
Spotlight theme.

## Why this exists

Bould sells websites, not products. The old site ran on Shopify, which meant
paying a platform fee for a cart nobody used and carrying store furniture —
`/cart`, `/collections`, four $0.00 try-on products, a refund policy — that made
a services business look unfinished.

It also carried the wrong positioning entirely. The homepage title was the single
word "Bould"; the H1 said "We Build The Future Of Commerce"; the services list
led with 3D stores and virtual try-on, neither of which is sold any more and the
second of which is switched off. A contractor landing there did not see
themselves in it, and Google read the site as a retail-technology company.

This rebuild implements `bouldhq-redesign-brief.html` (22 September 2026): the
repositioning, the Phase 1 site map, the removal-and-redirect list, and the
technical SEO spec.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run typecheck
```

Copy `.env.example` to `.env.local` and fill in what exists. Nothing in the app
requires an env var to run — every integration degrades rather than throws.

## Testing it

```bash
npm run verify
```

Builds, serves, runs every check, tears the server down. Use this rather than
chaining the steps by hand — `next start` blocks forever, so
`npm run build && npm start && ./scripts/verify.sh` never reaches the last step,
and running them as separate lines races the server's startup.

Two terminals, if you want the site up while you poke at it:

```bash
npm run build && npm start -- -p 3000       # terminal 1
./scripts/verify.sh http://localhost:3000   # terminal 2
```

> **`NODE_ENV`**: the `build` and `start` scripts pin `NODE_ENV=production`
> themselves. A shell that exports `NODE_ENV=development` — a common dotfile
> habit — otherwise makes `next build` emit a build whose server and client
> React copies disagree, and it dies at prerender with `Cannot read properties
> of null (reading 'useContext')` on `/_global-error`. The error names nothing
> you wrote, so it is worth knowing the cause.

`scripts/verify.sh` checks the things that are easy to break and impossible to
spot by eye: every page returns 200 with exactly one `<h1>` and a title that is
not the bare brand name, canonicals resolve to the right path, every page has a
share image, the homepage JSON-LD parses and still carries `telephone` and
`areaServed`, all nine Shopify redirects return 308 to the right place, robots
allows crawling and does not block AI crawlers, the sitemap is populated, and
`/api/lead` accepts a valid lead, rejects an invalid one, and silently drops a
honeypot hit. It exits non-zero on failure, so it can gate a promotion.

### On Vercel

```bash
vercel link                       # once, to create/attach the project
vercel                            # preview deploy; prints a URL
./scripts/verify.sh https://<preview-url>
vercel --prod                     # promote once the checks pass
```

Two things to expect on a preview:

- **Canonicals point at `https://bouldhq.com`, not at the preview URL.** That is
  correct and the script reports it as a note. A preview that declared itself
  canonical would compete with production in the index.
- **Deployment Protection returns 401/403 to `curl`.** The script detects this
  and tells you; either turn protection off for the preview or use
  `vercel curl <url>`, which attaches your Vercel session.

Set environment variables per target before the production deploy:

```bash
vercel env add NEXT_PUBLIC_SITE_URL production        # https://bouldhq.com
vercel env add RESEND_API_KEY production
vercel env add LEAD_TO_EMAIL production
vercel env add NEXT_PUBLIC_GA4_ID production
vercel env add NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION production
vercel env add NEXT_PUBLIC_GBP_URL production
```

Then check by hand what a script cannot: submit a real lead through `/contact`
and through `/visibility-audit` and confirm both arrive in the inbox, run
Lighthouse on `/` and `/visibility-audit`, and paste `/` and
`/work/rubio-brothers-concrete` into Google's Rich Results Test.

## Structure

| Path | What is in it |
|---|---|
| `lib/site.ts` | NAP, nav, service areas. **Single source of truth** — the footer, the contact page, and the JSON-LD all read from here so they cannot drift. |
| `lib/content/` | Audit questions, portfolio, case studies, plans, FAQs. Editing copy means editing these, not JSX. |
| `lib/schema.ts` | JSON-LD builders (Organization/ProfessionalService, Service, FAQPage, Article, BreadcrumbList). |
| `lib/seo.ts` | `pageMetadata()` — every page's title, description, canonical, and share card. |
| `components/hero/` | The Three.js particle scene and FLIP choreography, ported from the theme. |
| `app/bould.css` | The ported design system, near-verbatim from the Shopify theme. |
| `app/site.css` | Styles for surfaces the theme had no equivalent of (header, audit tool, plans, tables). |

## Before launch

Ordered by how much each one costs if it is skipped.

1. **Point `NEXT_PUBLIC_SITE_URL` at the real origin.** Canonicals, the sitemap,
   and every JSON-LD `@id` are built from it. Wrong value means wrong canonicals
   on every page.
2. **Put `+1 801-200-4716` on the Google Business Profile and every listing**,
   formatted exactly as the site shows it. The site already carries it
   (`lib/site.ts`); the scorecard docks a point when the number on a listing and
   the number on the site disagree, and one stale entry splits the business's
   search presence in two.
3. **Set `NEXT_PUBLIC_GBP_URL`** once the profile is verified. It feeds
   `sameAs`, which is how Google ties this site to the profile.
4. **Provision lead delivery** (`RESEND_API_KEY`, `LEAD_TO_EMAIL`) and send a
   real test through `/contact` and `/visibility-audit`. Without them leads are
   accepted and written to the runtime log — recoverable, but nobody is watching
   a log at 9pm.
5. **Verify in Search Console** (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`) and
   submit `/sitemap.xml` on launch day.
6. **Record the baseline** the brief asks for, before the DNS cutover: current
   organic sessions, profile views and calls, review count, inbound leads.
   Afterwards it is gone.

## Migrating the domain

1. Deploy to Vercel and confirm the preview URL renders (`vercel --prod` once
   the project is linked).
2. Check the redirects on the preview — every old URL in `next.config.ts` should
   return 308 to its replacement:
   ```bash
   for u in /pages/studio /pages/build /pages/work /collections/all \
            /products/globalheart /cart /policies/refund-policy; do
     curl -s -o /dev/null -w "$u -> %{http_code} %{redirect_url}\n" "$PREVIEW$u"
   done
   ```
3. Add `bouldhq.com` and `www.bouldhq.com` to the Vercel project.
4. Move DNS. Lower the TTL a day beforehand so the cutover is quick to reverse.
5. Remove the domain from Shopify **after** DNS has propagated, not before.
6. Resubmit the sitemap and use the URL Inspection tool on `/`,
   `/visibility-audit`, and `/work/rubio-brothers-concrete` first.

Shopify keeps billing until the store is closed in the admin. Cancelling the
domain is not cancelling the subscription.

## Rules this codebase holds itself to

These come from the brief and are worth keeping when adding pages.

- **No number without a source.** `metrics: []` on a case study renders no
  results block. The old homepage claimed "300% avg revenue growth" and "98%
  retention" with nothing behind them; those claims are gone and should not come
  back in another form.
- **3D is a feature, never a product.** "3D product visuals", on the ecommerce
  page, attached to Joon and Dummiez. The words "3D store", "virtual try-on",
  "AR", and "headless" do not appear on this site.
- **One name everywhere.** `LEGAL_NAME` in `lib/site.ts`. If it ever becomes a
  "Bould Websites" DBA, change it there and update the profile and every listing
  in the same week — a half-finished rename is worse than either name.
- **Titles carry the service, never the bare brand.** `pageMetadata()` enforces
  the `[topic] | Bould Inc` pattern.
- **AI crawlers stay allowed.** `app/robots.ts` deliberately has no GPTBot /
  ClaudeBot / PerplexityBot block. For a business that wants to be recommended by
  an assistant, blocking them is self-harm.
- **Every page ends on the free audit**, not "book a demo".

## Still open

- **Lead delivery is not configured.** `RESEND_API_KEY` + `LEAD_TO_EMAIL` are
  unset, so audit and contact submissions are written to the runtime log instead
  of emailed. `GET /api/lead` reports which mode it is in, and `verify.sh` fails
  the run if production is still log-only.
- **JCK Approved has no logo** — `jckapproved.com` did not resolve when the
  others were collected. Its card renders a monogram until one is added; see
  `public/logos/README.md`.
- **Cesar's quote** for the Rubio case study — the numbers are in, the quote is
  not; `pending` on that case study says so on the page.
- **Metrics for Joon, Dummiez, and Adophies**, pending client permission.
- **Reviews section on the homepage.** The brief asks for one "as they come in".
  At zero reviews there is nothing honest to render, so it is not built yet.
- **Setup fee.** `/pricing` says "quoted per project"; fill `setup` in
  `lib/content/pricing.ts` once it is set.
- **Google Business Profile management** is in the Website Plan (brief decision
  4), but a *weekly* posting cadence deliberately is not — across every client
  that is more hours than two people have, and a promised weekly post that never
  appears hurts the profile more than never promising one. The plan says
  "profile updates and review responses" instead.
