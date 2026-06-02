# Next.js Example

Use the core helpers in Next.js App Router pages and route handlers.

## Feed Route

Create `app/feed.json/route.ts`:

```ts
import { buildJsonFeed, normalizeArticle } from "best-sanity-blog-system";
import { getArticles } from "@/lib/sanity";

export const revalidate = 3600;

export async function GET() {
  const articles = (await getArticles()).map(normalizeArticle).filter(Boolean);

  return Response.json(
    buildJsonFeed({
      site: {
        name: "Your Site",
        url: "https://example.com",
        description: "Your site description."
      },
      articles
    })
  );
}
```

## Article Page

Use `buildBlogPostingJsonLd`, `buildFaqJsonLd`, `buildBreadcrumbJsonLd`, and `extractToc` inside `app/blog/[slug]/page.tsx`.

Keep site-specific CTA mapping inside your app instead of the shared package.
