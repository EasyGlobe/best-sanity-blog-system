import { createElement, Fragment } from "react";
import { RichTablePastePlugin, richTablePlugin } from "sanity-plugin-rich-table";
import { richTableSchemaTypes } from "./schema.js";

export function BlogPortableTextPlugins(props) {
  return createElement(
    Fragment,
    null,
    props.renderDefault(props),
    createElement(RichTablePastePlugin)
  );
}

export function createBlogStudioIntegration(options = {}) {
  return {
    plugins: [richTablePlugin(options.richTable ?? {})],
    form: {
      components: {
        portableText: { plugins: BlogPortableTextPlugins }
      }
    },
    schemaTypes: richTableSchemaTypes
  };
}
