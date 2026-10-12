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
