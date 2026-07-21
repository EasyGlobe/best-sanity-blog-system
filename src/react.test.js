import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PortableText } from "@portabletext/react";
import { createBlogPortableTextComponents } from "./react.js";

const textBlock = (key, text) => ({
  _type: "block",
  _key: key,
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-span`, marks: [], text }]
});

const projectId = ["exam", "ple1"].join("");

const components = createBlogPortableTextComponents({
  projectId,
  dataset: "production"
});

test("renders Sanity body images from asset references", () => {
  const html = renderToStaticMarkup(
    createElement(PortableText, {
      components,
      value: [
        {
          _type: "image",
          _key: "image-1",
          alt: "A descriptive workflow diagram",
          caption: "Workflow overview",
          credit: "Example team",
          asset: {
            _type: "reference",
            _ref: "image-0123456789abcdef0123456789abcdef01234567-1200x800-jpg"
          }
        }
      ]
    })
  );

  assert.match(html, /<img/);
  assert.match(html, /alt="A descriptive workflow diagram"/);
  assert.match(html, new RegExp(`cdn\\.sanity\\.io/images/${projectId}/production`));
  assert.match(html, /w=1600/);
  assert.match(html, /Workflow overview/);
  assert.match(html, /Example team/);
});

test("renders legacy and rich table blocks", () => {
  const html = renderToStaticMarkup(
    createElement(PortableText, {
      components,
      value: [
        {
          _type: "table",
          _key: "legacy-table",
          caption: "Legacy comparison",
          hasHeaderRow: true,
          rows: [
            { _type: "tableRow", _key: "legacy-row-1", cells: ["Feature", "Basic"] },
            { _type: "tableRow", _key: "legacy-row-2", cells: ["Forms", "Yes"] }
          ]
        },
        {
          _type: "richTableBlock",
          _key: "rich-table",
          hasColumnTitles: true,
          hasRowTitles: true,
          columnHeaders: [
            { _type: "columnHeader", _key: "header-1", title: "Plan", cellIndex: 0 },
            { _type: "columnHeader", _key: "header-2", title: "Price", cellIndex: 1 }
          ],
          rows: [
            {
              _type: "row",
              _key: "row-1",
              title: "Starter",
              cells: [
                { _type: "richTableCell", _key: "cell-1", content: [textBlock("p-1", "Basic")] },
                { _type: "richTableCell", _key: "cell-2", content: [textBlock("p-2", "$49")] }
              ]
            }
          ]
        }
      ]
    })
  );

  assert.match(html, /<caption[^>]*>Legacy comparison<\/caption>/);
  assert.match(html, /<th scope="col"[^>]*>Feature<\/th>/);
  assert.match(html, /<th scope="col"[^>]*>Plan<\/th>/);
  assert.match(html, /<th scope="row"[^>]*>Starter<\/th>/);
  assert.match(html, /Basic/);
  assert.match(html, /\$49/);
});
