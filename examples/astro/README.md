# Astro Example

Use the core helpers in Astro routes and keep UI styling inside your Astro project.

## Blog Article Route

```astro
---
import { buildBlogPostingJsonLd, extractToc, normalizeArticle } from "best-sanity-blog-system";
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
      {toc.length > 0 && (
        <nav aria-label="Table of contents">
          {toc.map((item) => <a href={`#${item.id}`}>{item.text}</a>)}
        </nav>
      )}
      <!-- Render Portable Text with your preferred Astro renderer. -->
    </article>
  </body>
</html>
```

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
