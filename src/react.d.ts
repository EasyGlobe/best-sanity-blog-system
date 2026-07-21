import type { PortableTextComponents } from "@portabletext/react";

export type BlogPortableTextClassNames = {
  imageFigure?: string;
  image?: string;
  imageCaption?: string;
  tableScroll?: string;
  table?: string;
  tableCaption?: string;
  tableHeader?: string;
  tableCell?: string;
};

export type BlogPortableTextOptions = {
  projectId: string;
  dataset: string;
  imageWidth?: number;
  classNames?: BlogPortableTextClassNames;
  components?: Partial<PortableTextComponents>;
  cellComponents?: Partial<PortableTextComponents>;
};

export function createBlogPortableTextComponents(options: BlogPortableTextOptions): PortableTextComponents;

export { createSanityImageUrlResolver, resolveSanityImageUrl } from "./image.js";
