# Astro Example

Use the core helpers in Astro routes and keep UI styling inside your Astro project.

## Blog Article Route

```astro
---
import { buildBlogPostingJsonLd, extractToc, normalizeArticle } from "best-sanity-blog-system";
import { resolveSanityImageUrl } from "best-sanity-blog-system/image";
import { getArticleBySlug } from "../lib/sanity";

const rawArticle = await getArticleBySlug(Astro.params.slug);
const article = normalizeArticle(rawArticle);

if (!article) {
  return Astro.redirect("/404");
}

const site = {
  name: "Your Site",
  url: "https://example.com",
  description: "Your site description."
};
const toc = extractToc(article);
const jsonLd = buildBlogPostingJsonLd(article, site);
const mainImageUrl = rawArticle?.mainImage
  ? resolveSanityImageUrl(rawArticle.mainImage, {
      projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
      dataset: import.meta.env.PUBLIC_SANITY_DATASET
    })
  : undefined;
---

<html lang="en">
  <head>
    <title>{article.metaTitle ?? article.title}</title>
    <meta name="description" content={article.metaDescription ?? article.description} />
    <link rel="canonical" href={`${site.url}/blog/${article.slug}`} />
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body>
    <article>
      <h1>{article.title}</h1>
      {mainImageUrl && <img src={mainImageUrl} alt={rawArticle.mainImage.alt ?? ""} />}
      {toc.length > 0 && (
        <nav aria-label="Table of contents">
          {toc.map((item) => <a href={`#${item.id}`}>{item.text}</a>)}
        </nav>
      )}
      <!-- Register image, table, and richTableBlock components with your Astro Portable Text renderer. -->
    </article>
  </body>
</html>
```

The framework-neutral image helper accepts the normal Sanity image object, including `asset._ref`,
and does not require React. For body content, map all three custom block types:

- `image`: call `resolveSanityImageUrl(value, config)` and render `alt`, `caption`, and `credit`.
- `table`: render `rows[].cells[]`; use the first row as `<th>` when `hasHeaderRow` is true.
- `richTableBlock`: render `columnHeaders`, optional row titles, and each cell's Portable Text `content`.

Keep horizontal overflow on the table wrapper so wide pasted spreadsheets remain usable on mobile.

## RSS Route

Create `src/pages/rss.xml.ts`:

```ts
import { buildRssFeed, normalizeArticle } from "best-sanity-blog-system";
import { getArticles } from "../lib/sanity";

export async function GET() {
  const articles = (await getArticles()).map(normalizeArticle).filter(Boolean);
  const xml = buildRssFeed({
    site: {
      name: "Your Site",
      url: "https://example.com",
      description: "Your site description."
    },
    articles
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
```
