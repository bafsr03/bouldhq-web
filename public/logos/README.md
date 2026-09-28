# Client logos

One file per project, named for its `slug` in `lib/content/work.ts`, referenced
there as `logo: '/logos/<slug>.png'`.

A project with no `logo` renders a monogram instead of a broken image. That is a
deliberate fallback, not a bug — but a real logo is always better.

## Current state

All nine present.

**ROSN by O's** is the one worth replacing when possible. Its logo is gold on a
baked-in black rectangle, which shows as a visible box against the card. Every
other logo is transparent. The fix is to ask the client for a transparent PNG —
not to paint over it here, and not to lighten the card, because half the set is
white-on-transparent and needs the dark plate.

## Adding or replacing one

Most were pulled from each client's live storefront. Two came from bouldhq.com's
own Shopify CDN, which is the better source when a client's site is down or its
asset has a background baked in — it serves exactly the files the old theme
referenced as `shopify://shop_images/`:

```bash
# JCK Approved's storefront returns 403; its logo is still on Bould's CDN as
# title.png, the same file templates/index.json pointed at.
curl -L "https://bouldhq.com/cdn/shop/files/title.png?width=800" \
  -o public/logos/jck-approved.png
```

To refresh one from the client's own site:

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
