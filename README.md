# Julia Mind — Shopify theme

A custom Shopify Online Store 2.0 theme for a small shop of hand-drawn cute
things — stickers, prints, keyrings, pins, totes and bandanas — organised into
ten illustrated categories. Built mobile-first: every layout starts at 390px
wide and grows from there.

---

## The look

| | |
|---|---|
| **Type** | Dosis, everywhere, in black. 400–800 weights. |
| **Pink** | `#FFC9DE` pastel · `#FF8FBA` accent |
| **Yellow** | `#FFEAA3` pastel · `#FFD84D` accent |
| **Green** | `#BCE7CB` pastel · `#7FD8A4` accent |
| **Ink / page** | `#101010` on `#FFFCF5` |

Colour blocks do the shouting; the type stays quiet and black. Sections
alternate between pastel bands, cards get chunky black outlines and a hard drop
shadow, and product, category and article tiles cycle through the three pastels
so a grid stays colourful even with plain photography.

Every colour is a theme setting, so all of this is editable in **Customise →
Colours** without touching code.

## The logo

Text only — no image file. `snippets/logo.liquid` splits the wordmark into
characters and colours them pink → yellow → green → black on a loop, so it stays
sharp at any size, recolours with the theme, and remains real selectable text
for SEO and screen readers.

Change the words in **Customise → Brand → Logo text**. Three colour patterns are
available: cycle by letter, colour by word, or all black.

`assets/logo.svg` is the same wordmark as a standalone file for socials,
packaging and email signatures.

## The categories

Ten categories, each with its own hand-drawn illustration built as inline SVG in
`snippets/category-art.liquid`:

> ducks · mushrooms · frogs · snails · bees · cats · bears · strawberries ·
> moons & stars · tiny snacks

They are drawn on a shared 100 × 100 grid with the same 4px black outline and
the same palette, so the ten of them read as one set. The **Category grid**
section places them on the home page; each tile falls back to its drawing when
the collection has no image of its own, so the grid never looks empty.

To add an eleventh category: draw it into `category-art.liquid` as a new
`when` branch, add it to the `art` select in `sections/category-grid.liquid`,
then add a block in the theme editor.

## Structure

```
assets/       base.css (tokens + primitives), components.css, pages.css, theme.js
              logo.svg, bandana-*.svg (placeholder product artwork)
config/       settings_schema.json, settings_data.json
layout/       theme.liquid
locales/      en.default.json
sections/     header/footer groups, home sections, main-* page sections
snippets/     logo, icon, category-art, category-tile, product-card,
              article-card, cart drawer, pagination
templates/    JSON templates for every page type + customer account templates
blog-source/  the six launch articles as HTML, with posts.json metadata
```

`assets/theme.js` is dependency-free and everything degrades to working HTML
without it: forms still post, links still navigate, the cart still works.

## Mobile behaviour worth knowing about

- The header hides on scroll down and returns on scroll up.
- Product rows are swipeable snap rails on phones and grids on desktop.
- The category grid is 2 columns on phones, 3 at 560px, 4 at 750px, 5 at 990px.
- The product gallery is a swipe rail with dots; on desktop it stacks.
- A sticky add-to-cart bar appears once the real button scrolls out of view.
- Drawers trap focus, lock background scroll, and respect the iPhone safe area.
- Inputs are 16px so iOS Safari never zooms the page on focus.
- Everything animated is disabled under `prefers-reduced-motion`.

## Working on it

Theme Check runs clean:

```bash
npx @shopify/cli theme check
```

To develop against the store:

```bash
npx @shopify/cli theme dev --store cwvsqu-nk.myshopify.com
npx @shopify/cli theme push --store cwvsqu-nk.myshopify.com
```

`.theme-check.yml` disables only `RemoteAsset`, and says why: Dosis is loaded
from Google Fonts because the full 400–800 weight range is needed.

## Blog

The six launch articles live in `blog-source/` as HTML plus `posts.json`. They
are the source of truth — if you edit one in the Shopify admin, paste the change
back here so the two do not drift apart.
