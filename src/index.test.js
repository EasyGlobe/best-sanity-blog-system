import assert from "node:assert/strict";
import test from "node:test";
import {
  buildBlogPostingJsonLd,
  buildJsonFeed,
  buildLlmsTxt,
  buildRssFeed,
  extractToc,
  normalizePastedTable,
  normalizeArticle,
  portableTextToPlainText,
  slugifyHeading
} from "./index.js";
import { blockContentType } from "./schema.js";

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

test("includes table blocks in portable text schema", () => {
  assert.ok(blockContentType.of.some((block) => block.name === "table"));
});

test("normalizes pasted tsv tables", () => {
  const table = normalizePastedTable("Feature\tBasic\tPro\nForms\tYes\tYes", {
    caption: "Plan comparison",
    hasHeaderRow: true,
    includeKeys: false
  });

  assert.deepEqual(table, {
    _type: "table",
    caption: "Plan comparison",
    hasHeaderRow: true,
    rows: [
      { _type: "tableRow", cells: ["Feature", "Basic", "Pro"] },
      { _type: "tableRow", cells: ["Forms", "Yes", "Yes"] }
    ]
  });
});

test("normalizes csv and html pasted tables", () => {
  assert.deepEqual(normalizePastedTable('"Feature, name",Basic\nForms,Yes', { includeKeys: false })?.rows[0].cells, [
    "Feature, name",
    "Basic"
  ]);

  assert.deepEqual(
    normalizePastedTable("<table><tr><th>Name</th><th>Price</th></tr><tr><td>Pro</td><td>$20</td></tr></table>", {
      includeKeys: false
    })?.rows[1].cells,
    ["Pro", "$20"]
  );
});

test("extracts table text from portable text", () => {
  const output = portableTextToPlainText([
    {
      _type: "table",
      rows: [
        { _type: "tableRow", cells: ["Feature", "Basic"] },
        { _type: "tableRow", cells: ["Forms", "Yes"] }
      ]
    }
  ]);

  assert.equal(output, "Feature Basic Forms Yes");
});

test("extracts rich table text from portable text", () => {
  const output = portableTextToPlainText([
    {
      _type: "richTableBlock",
      hasColumnTitles: true,
      hasRowTitles: true,
      columnHeaders: [{ title: "Plan" }, { title: "Price" }],
      rows: [
        {
          title: "Starter",
          cells: [
            { content: [{ _type: "block", children: [{ _type: "span", text: "Basic" }] }] },
            { content: [{ _type: "block", children: [{ _type: "span", text: "$49" }] }] }
          ]
        }
      ]
    }
  ]);

  assert.equal(output, "Plan Price Starter Basic $49");
});

test("keeps Sanity image references during article normalization", () => {
  const normalized = normalizeArticle({
    title: "Article with a Sanity image",
    slug: "sanity-image",
    description: "A sufficiently descriptive summary for a portable Sanity image reference.",
    publishedAt: "2026-06-02T00:00:00.000Z",
    mainImage: {
      asset: { _type: "reference", _ref: "image-abc123-1200x800-jpg" },
      alt: "A useful image description"
    }
  });

  assert.equal(normalized.image.assetRef, "image-abc123-1200x800-jpg");
  assert.equal(normalized.image.alt, "A useful image description");
});
