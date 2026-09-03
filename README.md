# Julia Mind — Shopify theme

A custom Shopify Online Store 2.0 theme for a shop that runs **one subject at a
time**. Every quarter the whole range is rebuilt around a single season; the
theme is built so that changing the season is a settings change, not a code
change.

Season 01 is **Ducks**.

---

## The look

Quiet editorial. Warm paper, deep ink, one seasonal accent, and type doing
almost all of the work.

| | |
|---|---|
| **Display** | Fraunces — variable, low WONK, used for headlines and pull quotes only |
| **Text / UI** | Inter — body copy, labels, buttons, prices |
| **Paper** | `#FAF8F3` · tinted band `#F4F1EA` · deep band `#EDE9DF` |
| **Ink** | `#17171A`, used at five opacities and no other colours |
| **Accent** | Set per season. Season 01 is pond ochre `#B8863C` |

There are no drop shadows, no rounded pill buttons and no bounce easing
anywhere in the theme. Separation is done with hairline rules and whitespace;
emphasis is done with scale and one accent. Radii are 2–4px — near-square by
intent, because the softness is meant to come from spacing.

Small tracked capitals (`.label`) carry every eyebrow, meta line and column
heading, and they are what hold the layout together across pages.

## The season system

Everything about the current quarter lives in **Customise → Season**:

| Setting | Does what |
|---|---|
| Season number | The `01` beside the wordmark, and the opening line of the home page |
| Season name | `Ducks` — used in the season line, product kickers and fallbacks |
| Runs | `Autumn — Winter 2026` — the dates in the season line |
| Motif | The line drawing used as the season's ornament and as the image fallback |
| Season accent | The one chromatic colour on the site |
| Season collection | Linked from the wordmark area, announcement bar, footer and menu drawer |

**One colour is picked, not four.** `layout/theme.liquid` derives the rest from
it: a darker version for accent text (contrast-checked against the paper), a
pale tint for season bands, and black or white for text placed on top of it. A
new season needs one colour picked and nothing else reasoned about.

### The motifs

`snippets/season-motif.liquid` holds ten line drawings on a shared 64 × 64 grid
with the same 1.4px stroke and no fill, so swapping the season swaps the drawing
without changing the weight or scale of anything around it:

> duck · leaf · mushroom · flower · cherry · bee · shell · star · moon · snowflake

They appear as the hero watermark, the ornament above the season note, the
fallback on collection tiles and article cards with no photograph, and the mark
on empty states and the 404 page.

To add one: add a `when` branch in `season-motif.liquid`, then add the same
value to the `season_motif` select in `config/settings_schema.json`.

### Changing the season

1. **Customise → Season** — set the number, name, dates, motif and accent.
2. Point **Season collection** at the new quarter's collection.
3. Update the home page hero heading, season note and CTA banner text.
4. Rewrite journal posts 1 and 6 (see `blog-source/README.md`).

No code changes, no CSS edits, no new colour decisions.

## Structure

```
assets/       base.css      tokens, type scale, buttons, forms, rich text
              components.css header, drawers, hero, cards, grids, footer
              pages.css     product, collection, cart, blog, account
              theme.js      dependency-free behaviour
              logo.svg      standalone wordmark for socials and packaging
config/       settings_schema.json, settings_data.json
layout/       theme.liquid  — derives the season colours
locales/      en.default.json
sections/     header/footer groups, home sections, main-* page sections
snippets/     logo, season-line, season-motif, collection-tile, product-card,
              article-card, icon, cart drawer, pagination, meta tags
templates/    JSON templates for every page type + customer account templates
blog-source/  the journal articles as HTML, with posts.json metadata
```

`assets/theme.js` has no dependencies and everything degrades to working HTML
without it: forms still post, links still navigate, the cart still works.

## Behaviour worth knowing about

- The header hides on scroll down and returns on scroll up.
- Product rows are swipeable snap rails on phones and grids from 750px.
- The collection index is 2 columns on phones, 3 at 750px, 4 at 1100px.
- The product gallery is a swipe rail with dashes on mobile and a stacked
  column on desktop.
- A sticky add-to-cart bar appears once the real button scrolls out of view.
- **Variant options with more than 12 values render as a dropdown** rather than
  a wall of swatches. Several products in this catalogue carry 40–80 variants
  and buttons are unusable at that size.
- Product card titles are clamped to two lines, because supplier titles are
  keyword lists rather than names.
- The journal runs its newest post wide above the grid on page one.
- Drawers trap focus, lock background scroll and respect the iPhone safe area.
- Inputs are 16px so iOS Safari never zooms the page on focus.
- Everything animated is disabled under `prefers-reduced-motion`, including the
  announcement strip.

## Working on it

Theme Check runs clean:

```bash
npx @shopify/cli theme check
```

To develop against the store:

```bash
npx @shopify/cli theme dev  --store cwvsqu-nk.myshopify.com
npx @shopify/cli theme push --store cwvsqu-nk.myshopify.com
```

`.theme-check.yml` disables only `RemoteAsset`, and says why: Fraunces is loaded
from Google Fonts with its optical-size, SOFT and WONK axes, which Shopify's
hosted font library does not expose.

## Journal

The articles live in `blog-source/` as HTML plus `posts.json`. They are the
source of truth — if one is edited in the Shopify admin, paste the change back
here so the two do not drift apart. See `blog-source/README.md`.
