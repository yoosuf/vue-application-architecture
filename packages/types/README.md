# @vue-application-architecture/types

Shared types for Shelf — the app's product/entity types — in their own
workspace package so neither the app nor the design system owns them.
**Source-first**: `exports` points at `.ts` sources — no build step,
hot-reloads everywhere.

## Public surface

| Export                                     | Contents               |
| ------------------------------------------ | ---------------------- |
| `@vue-application-architecture/types`      | `Book`, `BookCategory` |
| `@vue-application-architecture/types/book` | `Book`, `BookCategory` |

Needs the `Theme` type? That's a design-system concern — it lives in
`@vue-application-architecture/design-system/theme` alongside the StyleX theme tokens.

## Rules

- Pure types only — no runtime code, no framework dependencies.
- Used by the app's feature modules. The design system must **not** depend on
  this package (it is domain-free, enforced by its `ds/self-contained` rule).

## Local commands

```bash
pnpm --filter @vue-application-architecture/types demo         # static showcase site (Book/BookCategory)
pnpm --filter @vue-application-architecture/types demo:build   # production build of the showcase
pnpm --filter @vue-application-architecture/types typecheck
pnpm --filter @vue-application-architecture/types lint
```

## Demo

`pnpm demo:types` from the repo root (or `pnpm --filter @vue-application-architecture/types demo`)
boots a zero-dependency, vanilla-TS page that renders `Book` grid samples, the
`BookCategory` union, and the `featured` flag — every value is type-checked
against the package's public surface (`@vue-application-architecture/types` and the
`@vue-application-architecture/types/book` subpath). It contains no runtime code from the package;
only `import type`, so it proves the types compile standalone.
