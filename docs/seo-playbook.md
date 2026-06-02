# SEO Playbook

The blog system is designed around search visibility, E-E-A-T, and AI citation readiness.

## Required Page Types

- Blog index
- Article page
- Category archive
- Tag archive
- RSS feed
- JSON Feed
- llms.txt
- Sitemap

## Required Structured Data

- `BlogPosting` on article pages
- `FAQPage` when article FAQ is present
- `BreadcrumbList` on article pages
- `CollectionPage` and `ItemList` on category and tag pages

## Content Quality Rules

- Use one clear H1.
- Use H2 and H3 headings for extractable sections.
- Keep paragraphs short enough for scanning.
- Add sources for claims, numbers, and high-risk topics.
- Add reviewer fields for regulated or high-risk content.
- Add related articles for internal linking.
- Add a contextual CTA that matches the article intent.

## Freshness Rules

- Keep `updatedAt` current when revising content.
- Use latest article dates for category and tag `lastModified`.
- Rebuild or revalidate feed endpoints after publishing.
