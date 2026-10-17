---
title: Post template
description: Reference post that exercises every frontmatter field and Markdown element. Draft only, never published.
pubDate: 2026-10-12
tags:
  - template
draft: true
---

Copy this file to start a new post, rename it to the post's URL slug (for example `power-bi-refresh-failures.md` becomes `/blog/power-bi-refresh-failures/`), replace the frontmatter and delete this body.

## Frontmatter fields

| Field | Required | Rules |
| --- | --- | --- |
| `title` | Yes | Up to 90 characters |
| `description` | Yes | Up to 160 characters, used for search results and cards |
| `pubDate` | Yes | `YYYY-MM-DD` |
| `updatedDate` | No | Not earlier than `pubDate` |
| `tags` | No | Lowercase kebab-case, e.g. `power-automate` |
| `draft` | No | `true` hides the post from the live site |
| `heroImage` | No | Relative path to an image beside the post |
| `heroAlt` | With `heroImage` | Describes the image |
| `heroCredit` | No | `author`, `authorUrl`, `source`, `sourceUrl`: renders "Photo by … on …" under the hero |
| `medium` | No | The same article on Medium; see below |

## Posts that are also on Medium

Add a `medium` block to the frontmatter. The post page then shows a note linking to the Medium version.

```yaml
medium:
  url: https://medium.com/<publication>/<story-slug>
  publication: Open AI # optional: the Medium publication's name
  original: true # true if Medium had it first
```

- **Medium first** (`original: true`): the note reads "Originally published in Open AI on Medium", and this page's canonical link points to Medium, so search engines credit the original.
- **This site first** (`original: false`, the default): the note reads "Also published in Open AI on Medium", and the canonical link stays on this site. On Medium, use **Import a story** with this post's URL so Medium's own canonical link points here.
- Set `pubDate` to the date the article was first published, wherever that was.

## Figures, tables and formulas

These patterns are written as HTML inside the Markdown. Keep each block free of blank lines.

- **Diagram with a caption:** put the image in `public/blog/<slug>/` and use `<figure class="figure-diagram">` with an `<img>` (`width`, `height`, `alt`, `loading="lazy"`) and a `<figcaption>`. The image sits on a white panel, so dark lines stay visible in dark mode.
- **Data table with a caption:** `<figure class="figure-table">` containing one or more `<table>`s. Give each table a `<caption>`, mark row headers with `<th scope="row">`, and add a `<figcaption>`. Wide tables scroll sideways on phones.
- **Formula:** wrap MathML in `<div class="math-block">`, with `<math display="block" alttext="…">` written out in words. Browsers render MathML natively, with no scripts, so it works under the CSP and follows the theme. Don't use formula images: they are unreadable in dark mode.
- **Never** embed third-party scripts (GitHub Gists, CodePen, tweets): the CSP blocks them. Copy the content into the post instead.

## Markdown elements

Body text with **bold**, *italic*, `inline code` and a [link](https://vasnik.net/).

### Third-level heading

- Unordered item
- Unordered item

1. Ordered item
2. Ordered item

> Blockquote text.

```sql
SELECT service, COUNT(*) AS discharges
FROM episodes
GROUP BY service;
```

---
