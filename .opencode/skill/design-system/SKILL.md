---
name: design-system
description: Edit @vue-application-architecture/design-system (packages/design-system): a generic, domain-free UI kit — StyleX tokens/themes, atoms/molecules, the Theme type, and the source-first exports map. Use when touching packages/design-system/src, adding a shared component, or deciding what belongs in the kit versus the app.
---

# Design System

`@vue-application-architecture/design-system` is a **self-contained, domain-free** workspace package:
it may depend only on third-party packages (`@stylexjs/stylex`,
`lucide-vue-next`, `vue-router`) — never app code or Shelf types
(`@vue-application-architecture/types`). Enforced by its `ds/self-contained` ESLint rule. It owns its
Vitest suite (`tests/`, mounting components through a StyleX-compiling
`vitest.config.ts`).

## Public surface (`exports` in package.json, all → `src/`)

- `.` → `src/index.ts` (all atoms/molecules + `Theme` type)
- `./theme` → `Theme` (`'light' | 'dark'`)
- `./styles/global.css`, `./styles/tokens.css` (CSS custom properties,
  `data-ds-theme="dark"` switch), and the StyleX files `./styles/tokens.stylex`,
  `./styles/themes.stylex`, `./styles/shared.stylex`
- `./ui/atoms[/X.vue]` — AppButton, IconButton, Loader, Rating, SearchField, ThemeToggle
- `./ui/molecules[/X.vue]` — EmptyState, SearchBar

Shelf's product domain types (`Book`, `BookCategory`) live in `@vue-application-architecture/types`,
and domain-bound presentational components live in the app's `shared` module
(`apps/frontend/src/modules/shared`) — neither belongs in the kit.

Source-first: no build step, hot-reloads in the app. App.ts tsconfig/alias
resolve the package to source. Tokens have **two faces** — StyleX vars
(`tokens.stylex.ts`, used by components) and CSS custom properties
(`tokens.css`, for plain CSS/HTML) — kept in sync with each other and with
`themes.stylex.ts`.

## Rules for new components

- **Atomic Design within the package**: atoms are primitives with no store or
  router coupling; molecules compose atoms.
- Components are **presentational**: data in as props, actions out via events
  or slots. Never `import` a Pinia store, a feature, or `@vue-application-architecture/types` here.
- StyleX files import tokens/themes/shared styles by **relative path** within
  the package (`../../styles/tokens.stylex`); never aliases or package
  specifiers inside `stylex.create`/`defineVars`.
- New exports must be added to `package.json` `exports` (explicit keys first,
  wildcards last, e.g. `./ui/atoms/*`) or they are unreachable.
- `vue-router` may be used for `RouteLocationRaw`-typed links (AppButton);
  `lucide-vue-next` icons are named imports, pinned `^0.577.0`.
- Keep defaults domain-neutral (e.g. search placeholder is `Search…`, not
  book-specific copy).

## Verification

```bash
pnpm --filter @vue-application-architecture/design-system typecheck|lint|test
```

A component change is fully validated when the app gates pass, because the app
bundles the design-system sources in its own single stylesheet build.

Token writes (StyleX or CSS) must keep `tokens.stylex.ts`, `themes.stylex.ts`,
and `tokens.css` in sync.