import { createImageUrlBuilder } from "@sanity/image-url";

export function createSanityImageUrlResolver(options = {}) {
  const projectId = requiredOption(options.projectId, "projectId");
  const dataset = requiredOption(options.dataset, "dataset");
  const width = options.width ?? 1600;
  const fit = options.fit ?? "max";
  const autoFormat = options.autoFormat !== false;
  const imageBuilder = createImageUrlBuilder({ projectId, dataset });

  return (source) => {
    if (!hasImageSource(source)) {
      return undefined;
    }

    const builder = imageBuilder.image(builderSource(source)).width(width).fit(fit);
    return autoFormat ? builder.auto("format").url() : builder.url();
  };
}

export function resolveSanityImageUrl(source, options = {}) {
  return createSanityImageUrlResolver(options)(source);
}

function requiredOption(value, name) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`${name} is required`);
  }

  return value.trim();
}

function hasImageSource(value) {
  return Boolean(
    (typeof value === "string" && value) || value?.asset?._ref || value?.asset?.url || value?.url
  );
}

function builderSource(value) {
  if (typeof value === "string" || value?.asset?._ref) {
    return value;
  }

  return value?.asset?.url ?? value?.url;
}
