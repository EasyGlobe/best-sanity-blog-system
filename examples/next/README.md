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

Render Portable Text images and both table formats with the optional React adapter:

```tsx
import { PortableText } from "@portabletext/react";
import { createBlogPortableTextComponents } from "best-sanity-blog-system/react";

const components = createBlogPortableTextComponents({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!
});

export function ArticleBody({ body }) {
  return <PortableText value={body} components={components} />;
}
```

The generated image URLs default to a 1600-pixel maximum width with automatic AVIF/WebP selection.
Override the semantic class names through the adapter's `classNames` option.

Keep site-specific CTA mapping inside your app instead of the shared package.
