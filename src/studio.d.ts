import type { PortableTextPluginsProps, PluginOptions } from "sanity";
import type { RichTablePluginOptions } from "sanity-plugin-rich-table";
import type { ReactNode } from "react";

export function BlogPortableTextPlugins(props: PortableTextPluginsProps): ReactNode;

export function createBlogStudioIntegration(options?: {
  richTable?: RichTablePluginOptions;
}): {
  plugins: PluginOptions[];
  form: {
    components: {
      portableText: {
        plugins: typeof BlogPortableTextPlugins;
      };
    };
  };
  schemaTypes: Array<Record<string, unknown>>;
};
