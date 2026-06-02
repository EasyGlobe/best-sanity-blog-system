export function normalizeArticle(input) {
  const slug = normalizeSlug(input?.slug);

  if (!slug || !input?.title || !input?.description) {
    return undefined;
  }

  return {
    slug,
    title: input.title,
    description: input.description,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    canonicalUrl: input.canonicalUrl,
    noindex: input.noindex === true,
    publishedAt: input.publishedAt ?? input._createdAt,
    updatedAt: input.updatedAt ?? input._updatedAt ?? input.publishedAt,
    author: normalizePerson(input.author, input.authorName),
    reviewedBy: normalizePerson(input.reviewedBy, input.reviewedByName),
    reviewedAt: input.reviewedAt,
    category: normalizeTerm(input.category),
    tags: Array.isArray(input.tags) ? input.tags.map(normalizeTerm).filter(Boolean) : [],
    image: normalizeImage(input.mainImage ?? input.image),
    ogImage: normalizeImage(input.ogImage ?? input.mainImage ?? input.image),
    keyTakeaways: Array.isArray(input.keyTakeaways) ? input.keyTakeaways.filter(Boolean) : [],
    body: Array.isArray(input.body) ? input.body : [],
    faqItems: normalizeFaqItems(input.faqItems),
    sources: normalizeSources(input.sources),
    factChecked: input.factChecked === true,
    contentRisk: input.contentRisk ?? "general",
    relatedArticles: Array.isArray(input.relatedArticles)
      ? input.relatedArticles.map(normalizeArticle).filter(Boolean)
      : [],
    primaryCta: input.primaryCta
  };
}

export function extractToc(article, options = {}) {
  const maxDepth = options.maxDepth ?? 3;
  const headings = Array.isArray(article?.body) && article.body.length > 0
    ? article.body
        .filter((block) => block?._type === "block" && /^h[2-6]$/.test(block.style ?? ""))
        .map((block) => ({
          text: portableTextBlockText(block),
          level: Number((block.style ?? "h2").replace("h", ""))
        }))
    : extractMarkdownHeadings(article?.content ?? "");

  return headings
    .filter((heading) => heading.text && heading.level <= maxDepth)
    .map((heading) => ({
      ...heading,
      id: slugifyHeading(heading.text)
    }));
}

export function portableTextToPlainText(blocks = []) {
  return blocks
    .map((block) => {
      if (block?._type === "block") {
        return portableTextBlockText(block);
      }

      if (block?._type === "callout") {
        return block.body ?? "";
      }

      return "";
    })
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugifyHeading(value) {
  return (
    stripMarkdown(String(value ?? ""))
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

export function buildBlogPostingJsonLd(article, site) {
  const url = articleUrl(article, site);
  const author = article.author?.url
    ? {
        "@type": "Person",
        name: article.author.name,
        jobTitle: article.author.title,
        url: article.author.url,
        sameAs: article.author.sameAs
      }
    : {
        "@type": "Person",
        name: article.author?.name ?? site.name
      };

  return removeUndefined({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author,
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: site.logo ? { "@type": "ImageObject", url: absoluteUrl(site.logo, site) } : undefined
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    url,
    image: article.image?.url ? absoluteUrl(article.image.url, site) : undefined,
    articleSection: article.category?.title,
    keywords: article.tags?.map((tag) => tag.title),
    isAccessibleForFree: true,
    citation: article.sources?.map((source) => source.url),
    reviewedBy: article.reviewedBy
      ? {
          "@type": "Person",
          name: article.reviewedBy.name,
          jobTitle: article.reviewedBy.title,
          url: article.reviewedBy.url
        }
      : undefined
  });
}

export function buildFaqJsonLd(faqItems = []) {
  if (!faqItems.length) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function buildBreadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function buildCollectionPageJsonLd({ title, description, url, articles }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: article.url,
        name: article.title
      }))
    }
  };
}

export function buildRssFeed({ site, articles }) {
  const items = articles
    .map((article) => {
      const url = articleUrl(article, site);

      return `<item><title>${escapeXml(article.title)}</title><link>${url}</link><guid>${url}</guid><description>${escapeXml(article.description)}</description><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate></item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(site.name)} Blog</title><link>${site.url}/blog</link><description>${escapeXml(site.description ?? "")}</description><lastBuildDate>${new Date(newestDate(articles)).toUTCString()}</lastBuildDate>${items}</channel></rss>`;
}

export function buildJsonFeed({ site, articles }) {
  return {
    version: "https://jsonfeed.org/version/1.1",
    title: `${site.name} Blog`,
    home_page_url: `${site.url}/blog`,
    feed_url: `${site.url}/feed.json`,
    description: site.description,
    items: articles.map((article) => ({
      id: articleUrl(article, site),
      url: articleUrl(article, site),
      title: article.title,
      summary: article.description,
      image: article.image?.url ? absoluteUrl(article.image.url, site) : undefined,
      date_published: new Date(article.publishedAt).toISOString(),
      date_modified: new Date(article.updatedAt ?? article.publishedAt).toISOString(),
      tags: article.tags?.map((tag) => tag.title) ?? []
    }))
  };
}

export function buildLlmsTxt({ site, articles, pages = [] }) {
  return [
    `# ${site.name}`,
    "",
    site.description ?? "",
    "",
    "## Core Pages",
    `- Home: ${site.url}/`,
    `- Blog: ${site.url}/blog`,
    ...pages.map((page) => `- ${page.title}: ${absoluteUrl(page.url, site)}`),
    "",
    "## Recent Blog Articles",
    ...articles.slice(0, 20).map((article) => `- ${article.title}: ${articleUrl(article, site)}`),
    "",
    "## Editorial Notes",
    "- Articles should include author attribution, updated dates, sources when available, and structured data."
  ].join("\n");
}

export function newestDate(articles) {
  return Math.max(
    ...articles
      .map((article) => new Date(article.updatedAt ?? article.publishedAt).getTime())
      .filter(Number.isFinite),
    0
  );
}

function normalizeSlug(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (value?.current) {
    return value.current.trim();
  }

  return undefined;
}

function normalizePerson(value, fallbackName) {
  if (!value && !fallbackName) {
    return undefined;
  }

  if (typeof value === "string") {
    return { name: value };
  }

  return {
    name: value?.name ?? fallbackName,
    title: value?.title,
    url: value?.url,
    sameAs: Array.isArray(value?.sameAs) ? value.sameAs : [],
    bio: value?.bio,
    credentials: Array.isArray(value?.credentials) ? value.credentials : []
  };
}

function normalizeTerm(value) {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return { title: value };
  }

  return {
    title: value.title ?? value.name,
    slug: normalizeSlug(value.slug),
    description: value.description
  };
}

function normalizeImage(value) {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return { url: value };
  }

  return {
    url: value.url ?? value.asset?.url,
    alt: value.alt,
    caption: value.caption,
    credit: value.credit
  };
}

function normalizeFaqItems(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const answer = item.answer ?? portableTextToPlainText(item.answerBody ?? []);
      return item.question && answer ? { question: item.question, answer, answerBody: item.answerBody } : undefined;
    })
    .filter(Boolean);
}

function normalizeSources(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((source) => source?.title && source?.url);
}

function extractMarkdownHeadings(markdown) {
  return [...markdown.matchAll(/^(#{2,6})\s+(.+)$/gm)].map((match) => ({
    level: match[1].length,
    text: stripMarkdown(match[2])
  }));
}

function portableTextBlockText(block) {
  return (block.children ?? [])
    .map((child) => child.text ?? "")
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function stripMarkdown(value) {
  return String(value)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function articleUrl(article, site) {
  return article.url ?? `${site.url}/blog/${article.slug}`;
}

function absoluteUrl(value, site) {
  return value.startsWith("http://") || value.startsWith("https://") ? value : `${site.url}${value}`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function removeUndefined(value) {
  return JSON.parse(JSON.stringify(value));
}
