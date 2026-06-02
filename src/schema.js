export const blockContentType = {
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" }
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Number", value: "number" }
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" }
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              { name: "href", title: "URL", type: "url", validation: (Rule) => Rule.required() },
              { name: "blank", title: "Open in new tab", type: "boolean", initialValue: false }
            ]
          }
        ]
      }
    },
    imageBlock(),
    {
      name: "callout",
      title: "Callout",
      type: "object",
      fields: [
        {
          name: "tone",
          title: "Tone",
          type: "string",
          initialValue: "note",
          options: {
            list: [
              { title: "Note", value: "note" },
              { title: "Source", value: "source" },
              { title: "Warning", value: "warning" }
            ]
          }
        },
        { name: "body", title: "Body", type: "text", rows: 3, validation: (Rule) => Rule.required() }
      ]
    }
  ]
};

export const authorType = {
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: (Rule) => Rule.required() },
    { name: "title", title: "Title", type: "string" },
    { name: "bio", title: "Bio", type: "text", rows: 4 },
    { name: "credentials", title: "Credentials", type: "array", of: [{ type: "string" }] },
    imageField("image", "Image"),
    { name: "url", title: "Profile URL", type: "url" },
    { name: "sameAs", title: "Same as", type: "array", of: [{ type: "url" }] }
  ]
};

export const categoryType = {
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (Rule) => Rule.required() },
    { name: "description", title: "Description", type: "text", rows: 3 }
  ]
};

export const tagType = {
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (Rule) => Rule.required() }
  ]
};

export const articleType = {
  name: "article",
  title: "Article",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
    { name: "eeat", title: "E-E-A-T" },
    { name: "taxonomy", title: "Taxonomy" }
  ],
  fields: [
    { name: "title", title: "Title", type: "string", group: "content", validation: (Rule) => Rule.required().min(8).max(90) },
    { name: "slug", title: "Slug", type: "slug", group: "content", options: { source: "title", maxLength: 96 }, validation: (Rule) => Rule.required() },
    { name: "description", title: "Description", type: "text", rows: 3, group: "content", validation: (Rule) => Rule.required().min(80).max(180) },
    {
      name: "status",
      title: "Status",
      type: "string",
      group: "content",
      initialValue: "published",
      options: {
        layout: "radio",
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
          { title: "Archived", value: "archived" }
        ]
      },
      validation: (Rule) => Rule.required()
    },
    { name: "publishedAt", title: "Published at", type: "datetime", group: "content", validation: (Rule) => Rule.required() },
    { name: "updatedAt", title: "Updated at", type: "datetime", group: "content" },
    imageField("mainImage", "Main image", "content"),
    { name: "keyTakeaways", title: "Key takeaways", type: "array", group: "content", of: [{ type: "string" }], validation: (Rule) => Rule.max(6) },
    { name: "body", title: "Body", type: "blockContent", group: "content", validation: (Rule) => Rule.required() },
    faqItemsField(),
    { name: "relatedArticles", title: "Related articles", type: "array", group: "content", of: [{ type: "reference", to: [{ type: "article" }] }], validation: (Rule) => Rule.unique().max(4) },
    primaryCtaField(),
    { name: "metaTitle", title: "Meta title", type: "string", group: "seo", validation: (Rule) => Rule.max(70).warning("Keep titles under about 70 characters.") },
    { name: "metaDescription", title: "Meta description", type: "text", rows: 3, group: "seo" },
    { name: "canonicalUrl", title: "Canonical URL", type: "url", group: "seo" },
    { name: "noindex", title: "Noindex", type: "boolean", group: "seo", initialValue: false },
    imageField("ogImage", "Open Graph image", "seo"),
    { name: "author", title: "Author", type: "reference", to: [{ type: "author" }], group: "eeat", validation: (Rule) => Rule.required() },
    { name: "reviewedBy", title: "Reviewed by", type: "reference", to: [{ type: "author" }], group: "eeat" },
    { name: "reviewedAt", title: "Reviewed at", type: "datetime", group: "eeat" },
    { name: "contentRisk", title: "Content risk", type: "string", group: "eeat", initialValue: "general", options: { list: ["general", "legal", "financial", "medical", "regulated"] }, validation: (Rule) => Rule.required() },
    { name: "factChecked", title: "Fact checked", type: "boolean", group: "eeat", initialValue: false },
    sourcesField(),
    { name: "category", title: "Category", type: "reference", to: [{ type: "category" }], group: "taxonomy" },
    { name: "tags", title: "Tags", type: "array", of: [{ type: "reference", to: [{ type: "tag" }] }], group: "taxonomy", validation: (Rule) => Rule.unique().max(8) }
  ]
};

export const schemaTypes = [articleType, authorType, categoryType, tagType, blockContentType];

function imageField(name, title, group) {
  return {
    name,
    title,
    type: "image",
    group,
    options: { hotspot: true },
    fields: [
      { name: "alt", title: "Alt text", type: "string", validation: (Rule) => Rule.required().min(8) },
      { name: "caption", title: "Caption", type: "string" },
      { name: "credit", title: "Credit", type: "string" }
    ]
  };
}

function imageBlock() {
  return imageField("image", "Image");
}

function faqItemsField() {
  return {
    name: "faqItems",
    title: "FAQ items",
    type: "array",
    group: "content",
    of: [
      {
        type: "object",
        fields: [
          { name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required() },
          { name: "answerBody", title: "Answer", type: "blockContent" },
          { name: "answer", title: "Legacy plain-text answer", type: "text", rows: 3 }
        ]
      }
    ]
  };
}

function primaryCtaField() {
  return {
    name: "primaryCta",
    title: "Primary CTA",
    type: "object",
    group: "content",
    fields: [
      { name: "label", title: "Label", type: "string" },
      { name: "href", title: "URL", type: "url" }
    ]
  };
}

function sourcesField() {
  return {
    name: "sources",
    title: "Sources",
    type: "array",
    group: "eeat",
    of: [
      {
        type: "object",
        fields: [
          { name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() },
          { name: "url", title: "URL", type: "url", validation: (Rule) => Rule.required() },
          { name: "publisher", title: "Publisher", type: "string" },
          { name: "accessedAt", title: "Accessed at", type: "date" }
        ]
      }
    ]
  };
}
