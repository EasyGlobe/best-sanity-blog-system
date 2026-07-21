# Best Sanity Blog System Conventions

Use these rules to decide where new code belongs.

## Placement Decision

```text
What does the code do?
  │
  ├─ Pure input → output transformation, SEO, feed, or text extraction
  │   └─→ src/index.js + src/index.d.ts
  │
  ├─ Defines Sanity document or Portable Text data shapes only
  │   └─→ src/schema.js + src/schema.d.ts
  │
  ├─ Needs one optional external runtime
  │   ├─ Sanity image pipeline ─→ src/image.js
  │   ├─ React rendering ───────→ src/react.js
  │   └─ Sanity Studio UI ──────→ src/studio.js
  │
  ├─ Demonstrates framework adoption
  │   └─→ examples/{framework}/
  │
  └─ Verifies a public contract
      └─→ src/*.test.js or tests/studio/
```

## Core vs Adapter

| Dimension | Core/schema | Optional adapter |
|---|---|---|
| State | Stateless | Stateless configuration bound to a runtime |
| Responsibility | Portable data transformations | React, Studio, or CDN integration |
| Reuse | Any JavaScript stack | Only consumers of that peer dependency |
| Typical signature | `(input, options) => output` | `(config) => renderer/integration` |
| Dependency rule | No runtime dependency | Declare optional peer and exact dev dependency |

## Actual Code Placement

| Code | Location | Reason |
|---|---|---|
| `portableTextToPlainText()` | `src/index.js` | Pure Portable Text transformation |
| `richTableSchemaTypes` | `src/schema.js` | Schema data, no Studio runtime import |
| `resolveSanityImageUrl()` | `src/image.js` | Requires only the Sanity image SDK |
| `createBlogPortableTextComponents()` | `src/react.js` | React-specific renderer factory |
| `createBlogStudioIntegration()` | `src/studio.js` | Studio plugin and paste behavior composition |
| Real plugin compilation | `tests/studio/` | A build seam is more accurate than a shallow object mock |

## Placement Rules

### Core and schema — `src/index.js`, `src/schema.js`

- Keep functions deterministic and side-effect free.
- Preserve existing exported shapes or add a named compatibility variant.
- Update the matching `.d.ts` and a Node test in the same change.
- Do not hardcode project IDs, datasets, URLs, tokens, or brand classes.

### Optional adapters — `src/{image,react,studio}.js`

- Expose an explicit package subpath in `package.json`.
- Put external packages in optional peer dependencies and exact dev dependencies.
- Receive public configuration from the consumer.
- Render semantic HTML before adding customization hooks.
- Preserve a consumer's default behavior when wrapping Studio or Portable Text components.

### Examples and documentation — `examples/`, `docs/`

- Show environment-driven configuration.
- Keep framework-specific routing and styling outside core code.
- Explain both storage shape and frontend renderer requirements.
- Include a migration path when a new schema variant is introduced.

## New Module Checklist

```text
□ Confirm whether the capability is pure core logic or an optional runtime adapter.
□ Choose a non-breaking export name and package subpath.
□ Add implementation and matching .d.ts declarations.
□ Declare optional peers; pin exact versions only for development verification.
□ Write a failing contract test before implementation.
□ Test legacy data when changing Portable Text or article shapes.
□ Build the real runtime integration when shallow tests cannot reproduce it.
□ Update Next.js, Astro, or generic usage documentation as applicable.
□ Run npm test, npm run studio:check, npm run secret-scan, and npm run pack:check.
```
