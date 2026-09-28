/**
 * Who Bould builds for.
 *
 * `href` is the single source of truth for where an industry card points, and
 * it points at the hub until a real page exists. The homepage previously sent
 * Home services and Auto repair to /industries/contractors, which promised a
 * page about their trade and delivered a page about concrete.
 *
 * A new industry page gets built when there is a real client in that industry
 * to put on it. An industry page with no local proof on it is the thin,
 * unearned local page the brief warns Google discounts — and it would be the
 * same page four times with the nouns swapped.
 */

export type Industry = {
  name: string
  body: string
  /** Set only when a dedicated page exists. Otherwise the card links to the hub. */
  href?: string
  proof?: string
}

export const INDUSTRIES: Industry[] = [
  {
    name: 'Contractors',
    href: '/industries/contractors',
    body: 'Concrete, excavation, and the trades. Estimators, local photos, and a page per service.',
    proof: 'Rubio Brothers Concrete, Pleasant Grove.',
  },
  {
    name: 'Home services',
    body: 'Exterior cleaning, lighting, landscaping. Seasonal work needs the site ready before the season.',
    proof: 'Kilowash.',
  },
  {
    name: 'Auto repair',
    body: 'Shops with years of reviews and no website worth the clicks they already get.',
  },
  {
    name: 'Product brands',
    href: '/services/shopify-stores',
    body: 'Shopify storefronts, with 3D product visuals where the product needs inspecting.',
  },
]

export const INDUSTRIES_CATCH_ALL =
  "Don't see your industry? If your business depends on the phone ringing, we build for you."
