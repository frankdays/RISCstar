# riscstar.com

Static rebuild of [riscstar.com](https://riscstar.com) with [Astro](https://astro.build), replacing WordPress.
Hosted on GitHub Pages; every push to `main` builds and deploys automatically.
The forums stay on WordPress at [forums.riscstar.com](https://forums.riscstar.com).

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321, live reload
npm run build      # outputs the static site to dist/
npm run preview    # serves dist/
```

## Where things live

| What | Where |
|---|---|
| Blog posts | `src/content/blog/<url-slug>.md` (one Markdown file per post) |
| Blog categories | `src/data/categories.json` |
| Page content (Home, About, Solutions, …) | `src/fragments/pages/<page>.html` |
| Page title / SEO tags / stylesheets | `src/data/pages/<page>.json` |
| Header / footer | `src/fragments/header.html`, `src/fragments/footer.html` |
| Blog post / archive templates | `src/fragments/post-template.html`, `src/fragments/archive-template.html` |
| Images, fonts, original theme CSS | `public/wp-content/…` (same paths as the WordPress site, so old URLs keep working) |
| Site behaviour (menu, animations, forms) | `public/js/site.js` |
| Small CSS additions | `public/css/site.css` |

Page file names use `__` for `/`, e.g. `solutions__power-management.html` is `/solutions/power-management/`.

## Adding a blog post

See [CLAUDE.md](CLAUDE.md) — it's written so you can just ask Claude to "add a blog post" and paste the text.
In short: add `src/content/blog/my-post-slug.md` with the front matter shown there, put the featured image in
`public/wp-content/uploads/<year>/<month>/`, commit, and push. The blog index, category pages, homepage "latest posts",
RSS feed and sitemap update automatically.

## Forms

All forms (contact, training enquiry, newsletter, blog comments) submit to Formspree form `xzezyply`
(<https://formspree.io/f/xzezyply>). The hidden `_subject`/`form` fields say which form a submission came from.
Blog comments are not published automatically: approved comments are added to `src/data/comments/<post-slug>.html`.

## Analytics

Google Analytics (`G-0DNZ1PLLQP`), Leadfeeder and Albacross are loaded in `src/layouts/Base.astro`.

## Deploying

GitHub → Settings → Pages → Source: **GitHub Actions**. `public/CNAME` sets the custom domain `riscstar.com`.
Point the domain's DNS at GitHub Pages; leave the `forums` DNS record as it is.
