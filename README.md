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
- Backward-compatible basic tables plus rich table paste support for Sanity Studio 6
- Portable Text React renderers for Sanity images, basic tables, and rich tables
- Framework-neutral Sanity image URL resolution for Astro and other stacks
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

The core entry has no required runtime dependency. Install only the adapter peers you use:

```bash
# Sanity Studio 6 rich-table editing and paste support
npm install sanity@^6 react@^19 react-dom@^19 styled-components@^6 sanity-plugin-rich-table@^2

# React / Next.js Portable Text rendering
npm install react@^19 @portabletext/react@^6 @sanity/image-url@^2

# Astro or another non-React frontend that only needs Sanity image URLs
npm install @sanity/image-url@^2
```

## Sanity Studio Usage

For the original dependency-free schema with basic tables:

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

For the recommended Studio 6 setup with spreadsheet, HTML, Markdown, CSV, and Excel table imports:

```js
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { createBlogStudioIntegration } from "best-sanity-blog-system/studio";

const blog = createBlogStudioIntegration();

export default defineConfig({
  name: "content",
  title: "Content Studio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  plugins: [structureTool(), ...blog.plugins],
  form: blog.form,
  schema: {
    types: blog.schemaTypes
  }
});
```

`createBlogStudioIntegration()` preserves the legacy `table` schema and adds `richTableBlock`.
Its Portable Text plugin calls Sanity's default renderer before adding paste behavior, so normal
editing features remain available.

## Table Blocks

The default `blockContent` includes a legacy `table` block with `caption`, `hasHeaderRow`, and
`rows[].cells[]`.
Use `normalizePastedTable()` when you need to convert pasted spreadsheet content into the same Sanity shape:

```js
import { normalizePastedTable } from "best-sanity-blog-system";

const tableBlock = normalizePastedTable("Feature\tBasic\tPro\nForms\tYes\tYes", {
  caption: "Plan comparison",
  hasHeaderRow: true
});
```

The Studio adapter adds the newer `richTableBlock` format. Rich cells contain Portable Text,
column and row titles remain semantic headers, and existing legacy table documents continue to render.

## Portable Text Rendering

The React adapter renders body images from their normal Sanity `asset._ref`, applies hotspot/crop
metadata through Sanity's image builder, and renders both table formats:

```tsx
import { PortableText } from "@portabletext/react";
import { createBlogPortableTextComponents } from "best-sanity-blog-system/react";

const components = createBlogPortableTextComponents({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  imageWidth: 1600,
  classNames: {
    image: "article-image",
    table: "article-table"
  }
});

export function ArticleBody({ value }) {
  return <PortableText value={value} components={components} />;
}
```

The adapter emits semantic `figure`, `figcaption`, `table`, `caption`, `th`, and `td` elements.
It includes only functional responsive styles; use `classNames` to apply site-specific design.

Astro and other renderers can resolve Sanity image references without loading React:

```js
import { resolveSanityImageUrl } from "best-sanity-blog-system/image";

const src = resolveSanityImageUrl(imageBlock, {
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  width: 1600
});
```

Never copy a project ID from an example application. Pass the consuming Studio's public project ID
and dataset explicitly.

## Migrating Existing Blogs

1. Keep `schemaTypes` if you only need the legacy table format.
2. Switch to `createBlogStudioIntegration()` to add rich tables without deleting legacy blocks.
3. Register the React adapter's components on the frontend before authors publish images or rich tables.
4. Query the complete Portable Text `body`; `@sanity/image-url` can resolve image `asset._ref` values directly.
5. Verify one pasted spreadsheet table and one uploaded body image from Studio through the published page.

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
