# Best Sanity Blog System Capabilities

Reusable functions and integration factories currently provided by the package.

## Content and SEO Core

| Capability | File | Input | Output | Independent |
|---|---|---|---|:---:|
| Article normalization | `src/index.js` | `Record<string, unknown>` | `BlogArticle \| undefined` | Yes |
| TOC extraction | `src/index.js` | `BlogArticle`, options | `TocItem[]` | Yes |
| Portable Text extraction | `src/index.js` | `unknown[]` | `string` | Yes |
| Pasted legacy table normalization | `src/index.js` | TSV/CSV/HTML/rows | `BlogTableBlock \| undefined` | Yes |
| BlogPosting JSON-LD | `src/index.js` | article + site | JSON object | Yes |
| FAQ/Breadcrumb/Collection JSON-LD | `src/index.js` | normalized values | JSON object | Yes |
| RSS / JSON Feed / llms.txt | `src/index.js` | site + articles | string or JSON object | Yes |

Typical chain: `Sanity query → normalizeArticle() → JSON-LD/feed builders`.

## Schema Capabilities

| Capability | File | Input | Output | Independent |
|---|---|---|---|:---:|
| Legacy-compatible schema | `src/schema.js` | none | `schemaTypes` | Yes |
| Rich-compatible schema | `src/schema.js` | none | `richTableSchemaTypes` | Requires plugin when registered |
| Body images | `src/schema.js` | author/editor input | image block with alt/caption/credit | Yes |
| Legacy tables | `src/schema.js` | author/editor input | plain string cell table | Yes |
| Rich table member | `src/schema.js` | plugin registration | Portable Text cell table | No |

## Image Adapter

| Capability | File | Input | Output | Independent |
|---|---|---|---|:---:|
| One-off image URL | `src/image.js` | image source + public config | `string \| undefined` | Yes |
| Reusable URL resolver | `src/image.js` | public config | `(source) => string \| undefined` | Yes |

Typical chain: `Sanity image asset._ref → createSanityImageUrlResolver() → optimized CDN URL`.

## React Adapter

| Capability | File | Input | Output | Independent |
|---|---|---|---|:---:|
| Portable Text component factory | `src/react.js` | project/dataset and overrides | `PortableTextComponents` | No |
| Body image renderer | `src/react.js` | Sanity image block | semantic figure/image/caption | No |
| Legacy table renderer | `src/react.js` | `table` block | semantic responsive table | No |
| Rich table renderer | `src/react.js` | `richTableBlock` | semantic table with nested Portable Text | No |

Typical chain: `createBlogPortableTextComponents() → <PortableText components={...}>`.

## Studio Adapter

| Capability | File | Input | Output | Independent |
|---|---|---|---|:---:|
| Rich table plugin registration | `src/studio.js` | plugin options | Sanity plugin array | No |
| Direct paste behavior | `src/studio.js` | Portable Text plugin props | composed editor plugin UI | No |
| Schema/plugin/form bundle | `src/studio.js` | integration options | mergeable Studio configuration | No |

Typical chain: `createBlogStudioIntegration() → defineConfig({plugins, form, schema})`.

## Reusable Patterns

| Pattern | Implementation | Reuse |
|---|---|---|
| Optional package adapter | `./image`, `./react`, `./studio` exports | Add a new runtime without loading it from core |
| Compatibility variant | legacy and rich schema exports | Introduce richer storage without deleting old documents |
| Configuration factory | image/React/Studio creators | Bind environment once, reuse for every article |
| Real runtime smoke test | `scripts/studio-check.mjs` | Validate plugin wiring through the actual Studio build |

## Capability Matrix

| Scenario | Core SEO | Schema | Image adapter | React adapter | Studio adapter |
|---|:---:|:---:|:---:|:---:|:---:|
| Next.js blog with rich tables | Yes | Yes | Yes | Yes | Yes |
| Astro blog with custom renderer | Yes | Yes | Yes | Adapt | Yes |
| Feed-only content service | Yes | Optional | No | No | No |
| Existing legacy-table blog | Yes | Yes | Optional | Yes | Optional |

Legend: **Yes** direct reuse, **Adapt** use the documented data shape with a framework renderer,
**Optional** only when that surface is present, **No** not required.
