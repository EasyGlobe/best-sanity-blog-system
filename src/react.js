import { createElement } from "react";
import { PortableText } from "@portabletext/react";
import { createSanityImageUrlResolver } from "./image.js";

export { createSanityImageUrlResolver, resolveSanityImageUrl } from "./image.js";

const defaultClassNames = {
  imageFigure: "sanity-blog-image",
  image: "sanity-blog-image-media",
  imageCaption: "sanity-blog-image-caption",
  tableScroll: "sanity-blog-table-scroll",
  table: "sanity-blog-table",
  tableCaption: "sanity-blog-table-caption",
  tableHeader: "sanity-blog-table-header",
  tableCell: "sanity-blog-table-cell"
};

export function createBlogPortableTextComponents(options = {}) {
  const imageWidth = options.imageWidth ?? 1600;
  const classNames = { ...defaultClassNames, ...options.classNames };
  const resolveImageUrl = createSanityImageUrlResolver({
    projectId: options.projectId,
    dataset: options.dataset,
    width: imageWidth
  });
  const baseComponents = options.components ?? {};

  const components = {
    ...baseComponents,
    types: {
      image: ({ value }) => renderImage(value, { resolveImageUrl, classNames }),
      table: ({ value }) => renderLegacyTable(value, classNames),
      richTableBlock: ({ value }) => renderRichTable(value, classNames, options.cellComponents),
      ...(baseComponents.types ?? {})
    }
  };

  return components;
}

function renderImage(value, { resolveImageUrl, classNames }) {
  if (!hasImageSource(value)) {
    return null;
  }

  const src = resolveImageUrl(value);
  const caption = [value.caption, value.credit ? `Credit: ${value.credit}` : undefined]
    .filter(Boolean)
    .join(" · ");

  return createElement(
    "figure",
    { className: classNames.imageFigure, style: { margin: "2rem 0" } },
    createElement("img", {
      src,
      alt: value.alt ?? "",
      loading: "lazy",
      decoding: "async",
      className: classNames.image,
      style: { display: "block", width: "100%", height: "auto" }
    }),
    caption
      ? createElement(
          "figcaption",
          { className: classNames.imageCaption, style: { marginTop: "0.5rem" } },
          caption
        )
      : null
  );
}

function renderLegacyTable(value, classNames) {
  const rows = Array.isArray(value?.rows) ? value.rows : [];
  if (!rows.length) {
    return null;
  }

  const headerRows = value.hasHeaderRow ? rows.slice(0, 1) : [];
  const bodyRows = value.hasHeaderRow ? rows.slice(1) : rows;

  return renderTableFrame({
    caption: value.caption,
    classNames,
    head: headerRows.length
      ? createElement(
          "thead",
          null,
          headerRows.map((row, rowIndex) =>
            createElement(
              "tr",
              { key: row._key ?? rowIndex },
              (row.cells ?? []).map((cell, cellIndex) =>
                createElement(
                  "th",
                  { key: cellIndex, scope: "col", className: classNames.tableHeader },
                  cell
                )
              )
            )
          )
        )
      : null,
    body: createElement(
      "tbody",
      null,
      bodyRows.map((row, rowIndex) =>
        createElement(
          "tr",
          { key: row._key ?? rowIndex },
          (row.cells ?? []).map((cell, cellIndex) =>
            createElement(
              "td",
              { key: cellIndex, className: classNames.tableCell },
              cell
            )
          )
        )
      )
    )
  });
}

function renderRichTable(value, classNames, cellComponents) {
  const rows = Array.isArray(value?.rows) ? value.rows : [];
  const headers = Array.isArray(value?.columnHeaders) ? value.columnHeaders : [];
  if (!rows.length) {
    return null;
  }

  return renderTableFrame({
    classNames,
    head: value.hasColumnTitles
      ? createElement(
          "thead",
          null,
          createElement(
            "tr",
            null,
            value.hasRowTitles
              ? createElement("th", {
                  scope: "col",
                  className: classNames.tableHeader,
                  style: widthStyle(value.rowTitleWidth)
                })
              : null,
            headers.map((header, index) =>
              createElement(
                "th",
                {
                  key: header._key ?? header.cellIndex ?? index,
                  scope: "col",
                  className: classNames.tableHeader,
                  style: widthStyle(header.width)
                },
                header.title ?? ""
              )
            )
          )
        )
      : null,
    body: createElement(
      "tbody",
      null,
      rows.map((row, rowIndex) =>
        createElement(
          "tr",
          { key: row._key ?? rowIndex },
          value.hasRowTitles
            ? createElement(
                "th",
                {
                  scope: "row",
                  className: classNames.tableHeader,
                  style: widthStyle(value.rowTitleWidth)
                },
                row.title ?? ""
              )
            : null,
          (row.cells ?? []).map((cell, cellIndex) =>
            createElement(
              "td",
              { key: cell._key ?? cellIndex, className: classNames.tableCell },
              cell.content?.length
                ? createElement(PortableText, { value: cell.content, components: cellComponents })
                : null
            )
          )
        )
      )
    )
  });
}

function renderTableFrame({ caption, classNames, head, body }) {
  return createElement(
    "div",
    { className: classNames.tableScroll, style: { margin: "2rem 0", overflowX: "auto" } },
    createElement(
      "table",
      {
        className: classNames.table,
        style: { width: "100%", minWidth: "35rem", borderCollapse: "collapse" }
      },
      caption ? createElement("caption", { className: classNames.tableCaption }, caption) : null,
      head,
      body
    )
  );
}

function hasImageSource(value) {
  return Boolean(value?.asset?._ref || value?.asset?.url || value?.url);
}

function widthStyle(width) {
  return Number.isFinite(width) && width > 0 ? { width: `${width}px` } : undefined;
}
