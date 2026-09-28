# Client logos

One file per project, named for its `slug` in `lib/content/work.ts`, referenced
there as `logo: '/logos/<slug>.png'`.

A project with no `logo` renders a monogram instead of a broken image. That is a
deliberate fallback, not a bug — but a real logo is always better.

## Current state

All present except **JCK Approved**, whose site (`jckapproved.com`) did not
resolve when these were collected. Drop `jck-approved.png` in here and add
`logo: '/logos/jck-approved.png'` to that project to complete the set.

## Adding or replacing one

These were pulled from each client's live storefront, which is the same image
the old Shopify theme referenced from `shopify://shop_images/`. To refresh one:

```bash
# Shopify's CDN resizes on demand — ask for a large render, not the 36px one
# the site's header happens to use.
curl -L "https://<client-domain>/cdn/shop/files/<file>.png?width=800" \
  -o public/logos/<slug>.png
```

Prefer a transparent PNG at roughly 800px on its longest edge. The card caps
display at 8rem tall and uses `object-fit: contain`, so any aspect ratio works
without distortion — but a logo baked onto a white rectangle will show that
rectangle against the dark card.
