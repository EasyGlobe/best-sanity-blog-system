export type BlogSite = {
  name: string;
  url: string;
  description?: string;
  logo?: string;
};

export type BlogArticle = {
  slug: string;
  title: string;
  description: string;
  url?: string;
  publishedAt: string;
  updatedAt?: string;
  content?: string;
  body?: unknown[];
  author?: BlogPerson;
  reviewedBy?: BlogPerson;
  reviewedAt?: string;
  category?: BlogTerm;
  tags?: BlogTerm[];
  image?: BlogImage;
  ogImage?: BlogImage;
  faqItems?: BlogFaqItem[];
  sources?: BlogSource[];
  relatedArticles?: BlogArticle[];
  primaryCta?: { label?: string; href?: string };
};

export type BlogPerson = {
  name: string;
  title?: string;
  url?: string;
  sameAs?: string[];
  bio?: string;
  credentials?: string[];
};

export type BlogTerm = {
  title: string;
  slug?: string;
  description?: string;
};

export type BlogImage = {
  url?: string;
  alt?: string;
  caption?: string;
  credit?: string;
};

export type BlogFaqItem = {
  question: string;
  answer: string;
  answerBody?: unknown[];
};

export type BlogSource = {
  title: string;
  url: string;
  publisher?: string;
  accessedAt?: string;
};

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export function normalizeArticle(input: Record<string, unknown>): BlogArticle | undefined;
export function extractToc(article: Partial<BlogArticle>, options?: { maxDepth?: number }): TocItem[];
export function portableTextToPlainText(blocks?: unknown[]): string;
export function slugifyHeading(value: string): string;
export function buildBlogPostingJsonLd(article: BlogArticle, site: BlogSite): Record<string, unknown>;
export function buildFaqJsonLd(faqItems?: BlogFaqItem[]): Record<string, unknown> | undefined;
export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): Record<string, unknown>;
export function buildCollectionPageJsonLd(input: { title: string; description?: string; url: string; articles: Array<{ title: string; url: string }> }): Record<string, unknown>;
export function buildRssFeed(input: { site: BlogSite; articles: BlogArticle[] }): string;
export function buildJsonFeed(input: { site: BlogSite; articles: BlogArticle[] }): Record<string, unknown>;
export function buildLlmsTxt(input: { site: BlogSite; articles: BlogArticle[]; pages?: Array<{ title: string; url: string }> }): string;
export function newestDate(articles: BlogArticle[]): number;
