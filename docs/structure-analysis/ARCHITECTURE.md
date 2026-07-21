# Best Sanity Blog System Architecture

This package is a flat, adapter-oriented ESM library. It keeps the framework-neutral blog model
independent from optional Sanity Studio and React dependencies.

## Discovered Layers

```text
┌──────────────────────────────────────────────────────────────────┐
│ L1 Public package entries                         package.json     │
│    ., ./schema, ./image, ./react, ./studio                        │
├──────────────────────────────────────────────────────────────────┤
│ L2 Optional runtime adapters                    src/{image,react, │
│    Sanity CDN URLs, React rendering, Studio paste  studio}.js     │
├──────────────────────────────────────────────────────────────────┤
│ L3 Framework-neutral capabilities               src/{index,      │
│    content normalization, SEO/feed builders,       schema}.js     │
│    legacy schema, rich-compatible schema                         │
├──────────────────────────────────────────────────────────────────┤
│ L4 Verification and adoption                    src/*.test.js,   │
│    unit/SSR tests, real Studio build, examples     tests/, docs/  │
└──────────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

| Layer | Location | Responsibility | Isolation |
|---|---|---|---|
| Public entries | `package.json` | Expose small opt-in import paths | Consumers load only the adapter they import |
| Runtime adapters | `src/image.js`, `src/react.js`, `src/studio.js` | Bind core shapes to external runtimes | One-way dependencies on core/schema or external peers |
| Core capabilities | `src/index.js`, `src/schema.js` | Stateless normalization, metadata, feeds, schema objects | No required runtime dependency |
| Verification | `src/*.test.js`, `tests/studio/`, `scripts/` | Lock contracts and build the real Studio integration | Does not ship as runtime logic |

## Dependency Flow

```text
consumer
  ├─→ core entry (.) ───────────────→ no external runtime
  ├─→ schema entry (./schema) ──────→ no external runtime
  ├─→ image entry (./image) ────────→ @sanity/image-url
  ├─→ react entry (./react) ────────→ React + @portabletext/react + ./image
  └─→ studio entry (./studio) ──────→ React + sanity-plugin-rich-table + ./schema
```

Rules:

- Core and schema code must not import React or Sanity Studio packages.
- Public examples must receive `projectId` and `dataset` from the consuming application.
- `schemaTypes` remains the legacy-compatible default; the Studio adapter opts into the richer schema.
- React output is semantic and minimally styled; brand presentation remains in the consuming site.

## Module Isolation

```text
src/index.js  ───── isolated from ───── src/schema.js
     │                                      │
     └─ pure content utilities              └─ schema data objects

src/image.js ── independent optional adapter
     ↑
src/react.js ── uses image resolver, not Studio

src/studio.js ─ uses schema, not React renderer or content utilities
```

There are no circular imports. React and Studio adapters can evolve independently.

## Architecture Patterns

| Pattern | Implementation | Purpose |
|---|---|---|
| Optional adapter | Package subpath exports | Keep core installs small while supporting real runtimes |
| Configuration factory | `createBlogStudioIntegration()` | Return mergeable Studio plugins, form config, and schema types |
| Component factory | `createBlogPortableTextComponents()` | Bind public Sanity configuration once and return renderer components |
| Resolver factory | `createSanityImageUrlResolver()` | Reuse one image builder across many image blocks |
| Backward-compatible schema variant | `schemaTypes` / `richTableSchemaTypes` | Preserve legacy table documents while adding rich tables |

## Extension Path

Example: add a video block without coupling core to a video vendor.

| Layer | Add | Reuse |
|---|---|---|
| Core/schema | Optional video block and plain-text fallback | Existing article and block-content model |
| Runtime adapter | `./video` or a custom `components.types.video` renderer | Adapter export pattern |
| Verification | SSR output test and optional Studio build fixture | Existing test/build scripts |
| Adoption | Next/Astro examples | Existing migration checklist |
