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
2. **Set the phone number** (`NEXT_PUBLIC_BOULD_PHONE` +
   `NEXT_PUBLIC_BOULD_PHONE_DISPLAY`). Until it is set, the header, footer,
   contact page, and `telephone` in the schema all omit it — deliberately. It
   must match the Google Business Profile exactly, digit for digit.
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

- **Phone number.** Nothing renders one until it exists.
- **Cesar's quote** for the Rubio case study — the numbers are in, the quote is
  not; `pending` on that case study says so on the page.
- **Metrics for Joon, Dummiez, and Adophies**, pending client permission.
- **Reviews section on the homepage.** The brief asks for one "as they come in".
  At zero reviews there is nothing honest to render, so it is not built yet.
- **Setup fee.** `/pricing` says "quoted per project"; fill `setup` in
  `lib/content/pricing.ts` once it is set.
- **Google Business Profile management in the plan** (brief decision 4) is
  written into the Website Plan. If the hours do not work for two people, those
  lines are isolated in `PLANS[0].includes` and can move to a higher tier.
