# Blog source

The journal articles, kept here as plain HTML so they can be edited, reviewed
and version-controlled alongside the theme.

`posts.json` holds the metadata for each one; the `file` key points at the HTML
body. These files are the source of truth. If you edit a post in the Shopify
admin, paste the change back in here too so the two do not drift apart.

## Metadata fields

| Field | Goes where in Shopify |
|---|---|
| `title` | Article title |
| `handle` | Article URL handle — do not change one after it is published |
| `tags` | Article tags |
| `excerpt` | Excerpt / summary |
| `seo_title` | Search engine listing → Page title. Kept under 60 characters |
| `seo_description` | Search engine listing → Meta description. Kept under 160 characters |
| `target_keyword` | Not published. The search phrase the article is written for |
| `links` | Not published. The internal links the body contains, for link auditing |

`seo_title`, `target_keyword` and `links` are only present on posts 07 onwards.
They are optional — anything reading this file should not assume they exist.

## What is in here

**01–06** are legacy. They were written when the shop sold pet bandanas and
they do not match the current catalogue. They exist in the Shopify admin as
unpublished drafts. Delete or rewrite them; do not publish them.

**07–26** are the duck-season SEO set: twenty articles covering every product
type in the shop (hats, caps, shirts, socks, slippers, mugs, posters, tin
signs, pins, stickers, charms, car ornaments) plus top-of-funnel and gift-intent
topics. Each one is written around a single search phrase, carries an FAQ
section for rich results and AI overviews, and links to at least one collection
and one other article.

The six duck articles already published in the admin (`what-a-season-means`,
`how-to-buy-a-bucket-hat-that-fits`, `hanging-a-print`, `what-gets-checked`,
`washing-printed-cotton`, `ducks-ranked`) are not in this folder yet. Posts
07–26 link to them, so those handles must not change.

## Publishing

Article bodies here are body HTML only — no `<h1>`, no wrapping `<article>`.
The theme's `sections/main-article.liquid` supplies the title, date, hero image
and BlogPosting schema, so pasting a file straight into the admin rich text
editor is correct.
