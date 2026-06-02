# Best Sanity Blog System

Best Sanity Blog System is an open source Sanity blog foundation for teams that want one strong content engine across Next.js, Astro, and other modern web stacks.

It is built for SEO, E-E-A-T, AI citation readiness, Portable Text editing, structured data, RSS, JSON Feed, and llms.txt. The project was extracted from lessons learned across product blogs using Sanity, Next.js, and Astro.

## Why This Exists

Most Sanity blog starters stop at "render a post." Ranking-focused blogs need more:

- Portable Text as the primary editing format
- Author, reviewer, credentials, sources, and updated dates
- BlogPosting, FAQPage, Breadcrumb, CollectionPage, and ItemList JSON-LD
- Category and tag archives
- Automatic table of contents
- Related articles and contextual CTAs
- RSS, JSON Feed, sitemap support, and llms.txt
- Framework adapters for Next.js and Astro

This repository keeps those pieces small and portable.

## What Is Included

- Sanity schema objects for `article`, `author`, `category`, `tag`, and `blockContent`
- Article normalization helpers
- Portable Text and Markdown text extraction
- Table of contents generation
- JSON-LD builders for article, FAQ, breadcrumb, and collection pages
- RSS 2.0 feed builder
- JSON Feed 1.1 builder
- llms.txt builder
- Next.js and Astro integration notes

## Install

```bash
npm install best-sanity-blog-system
```

For local usage before publishing to npm:

```js
import {
  buildBlogPostingJsonLd,
  buildRssFeed,
  extractToc,
  normalizeArticle
} from "best-sanity-blog-system";
```

## Sanity Studio Usage

```js
import { schemaTypes } from "best-sanity-blog-system/schema";

export default defineConfig({
  name: "content",
  title: "Content Studio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  schema: {
    types: schemaTypes
  }
});
```

Do not hardcode project IDs or tokens in open source code.

## Article Model

The shared article model is intentionally conservative:

- Core: `title`, `slug`, `description`, `status`, `publishedAt`, `updatedAt`
- Media: `mainImage` with `alt`, `caption`, `credit`
- Content: `keyTakeaways`, `body`, `faqItems`, `relatedArticles`, `primaryCta`
- SEO: `metaTitle`, `metaDescription`, `canonicalUrl`, `noindex`, `ogImage`
- E-E-A-T: `author`, `reviewedBy`, `reviewedAt`, `factChecked`, `sources`, `contentRisk`
- Taxonomy: `category`, `tags`

## Next.js Integration

Use the core helpers in app routes:

```js
import { buildJsonFeed } from "best-sanity-blog-system";

export async function GET() {
  const articles = await getArticles();
  return Response.json(buildJsonFeed({ site, articles }));
}
```

Recommended routes:

- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/blog/category/[slug]/page.tsx`
- `app/blog/tag/[slug]/page.tsx`
- `app/rss.xml/route.ts`
- `app/feed.json/route.ts`
- `app/llms.txt/route.ts`

## Astro Integration

Astro can use the same core helpers. Only the route files change:

- `src/pages/blog/index.astro`
- `src/pages/blog/[slug].astro`
- `src/pages/blog/category/[slug].astro`
- `src/pages/blog/tag/[slug].astro`
- `src/pages/rss.xml.ts`
- `src/pages/feed.json.ts`
- `src/pages/llms.txt.ts`

See `examples/astro/README.md`.

## SEO Checklist

- Every article has a stable canonical URL.
- Every image has descriptive alt text.
- Every article has an author.
- High-risk content has reviewer and sources.
- FAQ content produces FAQPage JSON-LD when used.
- Category and tag pages produce CollectionPage and ItemList JSON-LD.
- Feed endpoints expose current posts.
- llms.txt lists core pages and recent articles for AI crawlers.

## Privacy And Secret Safety

This repository must never include:

- Sanity write tokens or read tokens
- GitHub tokens
- Cloudflare tokens
- Project-specific private environment files
- Private customer data
- Private analytics IDs unless intentionally public

Before pushing, run:

```bash
npm run secret-scan
```

The command should return no matches.

## Support

If this Sanity blog system saves you time, you can support continued maintenance:

- Buy Me a Coffee: https://buymeacoffee.com/zhaoluhao9g

Maintainers can replace this link with another donation, sponsor, or appreciation link in `.github/FUNDING.yml`.
