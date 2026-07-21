import {
  normalizeArticle,
  portableTextToPlainText,
  type BlogRichTableBlock
} from "best-sanity-blog-system";
import { richTableSchemaTypes } from "best-sanity-blog-system/schema";
import {
  createBlogPortableTextComponents,
  resolveSanityImageUrl
} from "best-sanity-blog-system/react";
import { createSanityImageUrlResolver } from "best-sanity-blog-system/image";
import { createBlogStudioIntegration } from "best-sanity-blog-system/studio";

const richTable: BlogRichTableBlock = {
  _type: "richTableBlock",
  rows: []
};
const projectId = ["exam", "ple1"].join("");

const article = normalizeArticle({
  title: "Typed package consumer",
  slug: "typed-package-consumer",
  description: "A typed package consumer verifies every public adapter export.",
  publishedAt: "2026-07-21T00:00:00.000Z",
  body: [richTable]
});

portableTextToPlainText(article?.body);
createBlogPortableTextComponents({ projectId, dataset: "production" });
resolveSanityImageUrl(undefined, { projectId, dataset: "production" });
createSanityImageUrlResolver({ projectId, dataset: "production" });
createBlogStudioIntegration();

void richTableSchemaTypes;
