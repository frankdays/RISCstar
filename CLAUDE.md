# Working on riscstar.com

Astro static site (see README.md). Build with `npm run build`; check with `npm run dev`.
Keep the Elementor class names and markup intact — the original WordPress/Elementor CSS in `public/wp-content/` styles everything.

## Adding a blog post

1. Create `src/content/blog/<slug>.md`. The file name is the URL: `/blog/<slug>/`. Use lowercase words joined by hyphens.
2. Front matter:

```yaml
---
title: "Post title as it appears on the page"
date: "2026-10-01T09:00:00+00:00"        # publish date (UTC)
author: "Daniel Thompson"
authorSlug: "daniel"                     # see existing authors below
categories: ["power-management", "risc-v"]   # slugs from src/data/categories.json
image: "/wp-content/uploads/2026/10/my-image.png"   # featured image, put the file in public/…
imageAlt: "Describe the image"
imageWidth: 1920
imageHeight: 1080
description: "One or two sentences for search engines and social previews."
excerpt: "Optional. Summary shown on category pages. Defaults to the first 55 words."
---
```

3. Write the body in Markdown. Use `##`/`###` headings, lists, links, images (`![alt](/wp-content/uploads/...)`),
   tables and fenced code blocks. Raw HTML is allowed when Markdown can't express something.
4. Set `draft: true` to keep a post out of the build.

Existing authors (`author` / `authorSlug`): Alex Elder / alex, Daniel Thompson / daniel, Erik Wierich / erik-schilling,
Guodong Xu / guodong-xu, Joe Bates / joe-bates, Michael Liu / michael, Raymond Mao / raymondmao, Scott Bambrough / scott.
Optional per-author fields: `authorBio`, `authorAvatar`.

New categories: add `{ "slug": "...", "name": "..." }` to `src/data/categories.json`.

## Migrated posts

Posts carried over from WordPress may have `legacyStyles`, `legacyScripts` or `classic` in their front matter, and some have
their original Elementor wrapper in `src/data/post-wrappers/<slug>.html` or their whole body in `src/content/blog-html/<slug>.html`.
These keep the old posts pixel-identical to the WordPress site. New posts don't need any of this.

## Blog comments

Comment forms post to Formspree. To publish an approved comment, add it to `src/data/comments/<slug>.html`
using the same markup as `src/data/comments/power-management-on-embedded-linux-systems.html`.
