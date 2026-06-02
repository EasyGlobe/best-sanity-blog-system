import assert from "node:assert/strict";
import test from "node:test";
import {
  buildBlogPostingJsonLd,
  buildJsonFeed,
  buildLlmsTxt,
  buildRssFeed,
  extractToc,
  normalizeArticle,
  slugifyHeading
} from "./index.js";

const site = {
  name: "Example Blog",
  url: "https://example.com",
  description: "Example Sanity blog."
};

const article = normalizeArticle({
  title: "How to Build a Sanity Blog",
  slug: { current: "sanity-blog" },
  description: "A practical guide to building a strong Sanity blog with SEO fields and structured data.",
  publishedAt: "2026-06-02T00:00:00.000Z",
  author: { name: "Editor", url: "https://example.com/about" },
  tags: [{ title: "Sanity", slug: { current: "sanity" } }],
  body: [
    { _type: "block", style: "h2", children: [{ _type: "span", text: "Why Sanity" }] },
    { _type: "block", style: "h3", children: [{ _type: "span", text: "Portable Text" }] }
  ],
  faqItems: [{ question: "Does it work with Astro?", answer: "Yes. Use the core helpers in Astro routes." }]
});

test("normalizes article slugs and people", () => {
  assert.equal(article.slug, "sanity-blog");
  assert.equal(article.author.name, "Editor");
  assert.equal(article.tags[0].slug, "sanity");
});

test("builds stable heading slugs and toc", () => {
  assert.equal(slugifyHeading("What is E-E-A-T?"), "what-is-e-e-a-t");
  assert.deepEqual(extractToc(article), [
    { id: "why-sanity", text: "Why Sanity", level: 2 },
    { id: "portable-text", text: "Portable Text", level: 3 }
  ]);
});

test("builds article json ld", () => {
  const jsonLd = buildBlogPostingJsonLd(article, site);
  assert.equal(jsonLd["@type"], "BlogPosting");
  assert.equal(jsonLd.url, "https://example.com/blog/sanity-blog");
  assert.equal(jsonLd.author.name, "Editor");
});

test("builds rss and json feeds", () => {
  const rss = buildRssFeed({ site, articles: [article] });
  const jsonFeed = buildJsonFeed({ site, articles: [article] });

  assert.match(rss, /<rss version="2.0">/);
  assert.equal(jsonFeed.items[0].url, "https://example.com/blog/sanity-blog");
});

test("builds llms text", () => {
  const output = buildLlmsTxt({ site, articles: [article] });
  assert.match(output, /## Recent Blog Articles/);
  assert.match(output, /How to Build a Sanity Blog/);
});
