export type SanityImageUrlOptions = {
  projectId: string;
  dataset: string;
  width?: number;
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "min" | "scale";
  autoFormat?: boolean;
};

export function createSanityImageUrlResolver(
  options: SanityImageUrlOptions
): (source: unknown) => string | undefined;

export function resolveSanityImageUrl(source: unknown, options: SanityImageUrlOptions): string | undefined;
