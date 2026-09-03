# Julia Mind — Shopify theme

A custom Shopify Online Store 2.0 theme for a shop that runs **one subject at a
time**. Every quarter the whole range is rebuilt around a single season; the
theme is built so that changing the season is a settings change, not a code
change.

Season 01 is **Ducks**.

---

## The look

Bold flat colour, editorial type. The palette shouts; the typography and the
spacing keep it grown-up rather than cartoonish.

| | |
|---|---|
| **Display** | Fraunces — headlines and pull quotes only, weight 600 |
| **Text / UI** | Inter — body copy, labels, buttons, prices |
| **Ground** | `#FFFCF2` warm white · quiet band `#FFF6DF` |
| **Ink** | `#111111`, used at five opacities |

### Season 01 palette

Taken from what the shop actually sells — rubber-duck yellow, the glitter-pink
cowboy ducks, pond blue, and the deep green of the wall prints.

| | Hex | Text on it | Contrast |
|---|---|---|---|
| Colour 1 — duck yellow | `#FFC72C` | ink | 12.1:1 |
| Colour 2 — hot pink | `#FF4D8D` | ink | 6.0:1 |
| Colour 3 — pond blue | `#1D5CE8` | white | 5.6:1 |
| Colour 4 — deep green | `#0F7A4F` | white | 5.4:1 |
| Accent text | `#D6006E` | on the ground | 5.0:1 |

**Colour is used as fields, never as outlines or drop shadows.** Full-bleed
bands, and a thin border of colour around product photography — supplier shots
are mostly on white, so the colour does the work the photography does not. The
four cycle across grids so no two neighbours ever match.

How much colour shows is adjustable, and can be turned off entirely:

- **Customise → Cards → Colour border** sets it for product cards, journal
  images and the product gallery.
- **The Collection index section** has its own, alongside an image-shape
  control: landscape, square, portrait, or *match the image* — which crops
  nothing and lets each collection photo keep its own proportions. Tiles in a
  row then differ in height, but the names still line up.

At `0%` the border disappears and the photograph fills the card. Collections
with no photograph still show the season motif on a full colour field, so a
grid never looks half-finished.

There are no chunky borders, no hard drop shadows and no bouncy easing
anywhere. Radii are 2–4px. Separation is hairline rules and whitespace;
energy comes from the colour and the scale of the type.

**Yellow and orange are never small text** — they fail contrast on the cream.
That is what `--mark` exists for: the one accent that stays readable at 12px.

## The season system

Everything about the current quarter lives in **Customise → Season**:

| Setting | Does what |
|---|---|
| Season number | The `01` beside the wordmark, and the opening line of the home page |
| Season name | `Ducks` — used in the season line, product kickers and fallbacks |
| Runs | `Autumn — Winter 2026` — the dates in the season line |
| Motif | The line drawing used as the season's ornament and as the image fallback |
| Colours 1–4 | The four field colours, cycled across bands, tiles and cards |
| Accent text colour | Small accent text on the page background |
| Season collection | Linked from the announcement bar, footer and menu drawer |

**A field can never end up unreadable.** For each of the four colours,
`layout/theme.liquid` measures its brightness and picks the only text colour
that clears roughly 4.5:1 against it — ink on light fields, white on dark ones.
Whatever gets chosen in the editor, the text on top of it stays legible.

The one thing that is *not* derived is the accent text colour, because it sits
on the page background rather than on a field. Keep it dark enough to read at
12px; bright yellows and oranges will not work there.

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
3. Set the four colours and the accent text colour for the new subject.
4. Update the home page hero heading, season note and CTA banner text.
5. Rewrite journal posts 1 and 6 (see `blog-source/README.md`).

No code changes and no CSS edits — the contrast maths is handled for you.

## What you can change without touching code

Everything visual is a setting. The panels in **Customise**:

| Panel | Controls |
|---|---|
| **Season** | Number, name, dates, motif, the four palette colours, the accent text colour, the season collection |
| **Brand** | Wordmark, whether the season number shows beside it, its size, favicon |
| **Colours** | Page background, quiet band, ink |
| **Cards** | Colour border thickness on product cards, journal images and the gallery |
| **Buttons** | Background, text, border, both hover colours, and whether buttons auto-adapt on coloured bands |
| **Layout** | Products per row and posts per row (desktop and phone), space between sections, corner rounding |
| **Effects** | Image hover zoom, scroll-in fades |
| **Typography** | Base size, headline weight, headline character |
| **Social**, **Cart** | Links, cart drawer, cart note |

### Every surface is a band

The announcement bar, the header, the hero, the footer and every content
section take the same **Background** setting: page background, quiet band, any
of the four season colours, or ink.

Picking one re-points *everything* inside it — body text, muted text,
hairlines, links, form fields, the season motif, buttons, and the pink accent
(which becomes ink on a light field and yellow on a dark one). So a header on
ink or a footer on yellow stays readable without a single extra colour being
chosen.

Buttons on a coloured band fall back to black or white by default, because a
yellow button on a yellow band is invisible. **Buttons → Keep buttons readable
on coloured bands** turns that off if you want your exact colours everywhere.

### Per-row counts

- **Collection index** — collections per row, desktop (2–6) and phone (1–3)
- **Featured collection** — products per row, plus whether phones get a swipe
  rail or a grid
- **Journal posts** — posts per row
- **Layout panel** — the defaults for collection, search and journal pages

The tablet count is capped at 3 automatically, so a 6-across desktop grid does
not try to fit six tiles onto a 750px screen.

One thing worth knowing: the colour border is a percentage of the tile, so
fewer columns means a proportionally thicker border. If you drop to 2 or 3 per
row and it looks heavy, take the border down a point or two.

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
- Collection tiles, product cards, blog cards and the product gallery all put
  the photo on a colour border, cycling through the four season colours. The
  thickness is a setting in both places, and `0%` removes it.
- Collection tiles stretch to the row height, so the names sit on one line
  across a row even when the images are their own natural shapes.
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
