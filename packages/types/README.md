# @vue-application-architecture/types

Shared types for Shelf — the app's product/entity types — in their own
workspace package so neither the app nor the design system owns them.
**Source-first**: `exports` points at `.ts` sources — no build step,
hot-reloads everywhere.

## Public surface

| Export              | Contents               |
| ------------------- | ---------------------- |
| `@vue-application-architecture/types`      | `Book`, `BookCategory` |
| `@vue-application-architecture/types/book` | `Book`, `BookCategory` |

Needs the `Theme` type? That's a design-system concern — it lives in
`@vue-application-architecture/design-system/theme` alongside the StyleX theme tokens.

## Rules

- Pure types only — no runtime code, no framework dependencies.
- Used by `@vue-application-architecture/design-system` (components that receive `Book` props) and by
  app feature modules.

## Local commands

```bash
pnpm --filter @vue-application-architecture/types typecheck
pnpm --filter @vue-application-architecture/types lint
```
