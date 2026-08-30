# GRAIN — Digicam Archive

A fictional storefront for restored Y2K-era compact digital cameras, built as a
front-end / UI showcase. **No backend.** All catalogue data, reviews, stock levels
and the checkout flow are dummy data held in the client.

There are **zero image assets** in this project. Every camera and every "sample
photograph" is drawn procedurally in SVG from each product's spec.

---

## Run it

```bash
npm install      # already done
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

Node 18+ required. Built with Next.js 15 (App Router), React 19, TypeScript,
Tailwind CSS v4, Motion (Framer Motion) and Zustand.

---

## Pages

| Route | What's there |
|---|---|
| `/` | Interactive hero (cursor-tilt 3D stage, working shutter button that adds frames to a roll, live colour swap), promise band, drag-scroll product rails, "pick a look" selector, tabbed grid, condition-grading explorer, review marquee, trade-in band |
| `/shop` | Faceted catalogue — keyword, price slider, brand, era, condition, body style, feature tags, in-stock. Seven sort orders, 3/4-column density toggle, removable filter chips, animated re-layout, mobile filter drawer, empty state |
| `/product/[slug]` | Gallery with front/rear views, cursor tilt, thumbnail strip, lightbox; colour variants with per-variant stock; quantity stepper; tabbed story / specs / in-the-box; generated sample-frame gallery; rating distribution and reviews; related products. Statically generated for all 26 cameras |
| `/looks` | The colour-science gallery — scene switcher, feature frame, 18-frame contact sheet |
| `/compare` | Up to three bodies side by side, 14 spec rows with best-value highlighting, camera picker modal, preset comparisons |
| `/cart` | Line editing, discount codes (`GRAIN10`, `FIRSTROLL`), free-shipping progress, live totals |
| `/checkout` | Three-step flow with real inline validation, shipping options, formatted card inputs, order confirmation |
| `/saved` | Wishlist |
| `/about` | Process, honest FAQ, and a plain statement that this is a demo |

Global: sticky nav with announcement marquee, animated cart drawer, Cmd-K command
palette with search, quick-view modal, toast system, light/dark theme with no
flash of the wrong theme, film-grain overlay.

---

## The two SVG renderers

**`src/components/camera/CameraArt.tsx`** — takes a body style, three colours and
a seed, returns a camera. Six body families (slim, compact, boxy, rugged, bridge,
swivel); the seed then varies body proportions, corner radius, lens size and
position, flash shape, faceplate treatment, viewfinder and badge placement, so no
two models render alike. Renders a front and a rear view (LCD, mode dial, D-pad).

**`src/components/camera/SampleFrame.tsx`** — takes a camera's `look`
(highlight tint, midtone, shadow tint, bloom, contrast) and returns a synthetic
photograph. Five scene templates — horizon, night bokeh, flash portrait, interior,
street — plus split toning, vignette, fine grain and a period date stamp.

Both are pure, seeded and deterministic, so server and client render byte-identical
markup (all trigonometry is rounded via `r3()` for exactly this reason).

---

## Where things live

```
src/
  app/            routes
  components/
    camera/       the two SVG renderers
    home/         hero, rails, look selector, grading, testimonials
    shop/         product card, filter primitives
    product/      gallery
    site/         nav, footer, cart drawer, command palette, quick view
    ui/           button, badge, stars, marquee, reveal, toaster
  data/           products.ts (26 cameras), reviews.ts
  lib/            store.ts (zustand: cart, saved, compare, ui), utils.ts
```

## Editing the catalogue

Everything is in `src/data/products.ts`. Add an object to the `products` array —
`form` picks the body family, `colors` drive the artwork, `look` drives the sample
photographs. Nothing else needs touching; the shop facets, compare rows, command
palette and related-products all derive from it.
