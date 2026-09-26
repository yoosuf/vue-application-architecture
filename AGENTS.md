# AGENTS.md

Guidance for AI agents working in the Shelf monorepo. Read this before editing.

## Repository layout

pnpm workspace hosting a Vue 3 modular-monolith app and its design system.

- `apps/frontend/` — the deployable app (Vue 3 + TypeScript + Vite 8 + Pinia +
  vue-router 5 + StyleX). Owns `src/`, `tests/`, `vite.config.ts`,
  `config/stylexVuePlugin.ts`, its own tsconfigs and `eslint.config.ts`.
- `packages/design-system/` — `@vue-application-architecture/design-system`: a **generic,
  domain-free** presentational UI kit (atoms/molecules) and StyleX
  tokens/themes, plus a plain-CSS token layer (`styles/tokens.css`).
  **Source-first**: `exports` points at `.vue`/`.ts` sources, no build step,
  hot-reloads in the app. Owns its component tests (`tests/`, vitest) and a
  `vitest.config.ts` that compiles StyleX in the test pipeline. Does not know
  about books or shelves.
- `packages/types/` — `@vue-application-architecture/types`: pure shared domain types (`Book`,
  `BookCategory`). Also source-first (`.ts` only, no build step).
- Root `package.json` holds shared tooling (vite, typescript, eslint, prettier,
  vue-tsc, @stylexjs/*). Runtime deps live in each package.

## Commands

Run from the repo root (they proxy to packages):

```bash
pnpm dev          # vite dev server (apps/frontend)
pnpm build        # production build -> apps/frontend/dist/
pnpm test         # vitest once (every package: app + design system)
pnpm test:watch   # vitest watch
pnpm lint         # eslint --fix for every package
pnpm typecheck    # vue-tsc for every package
pnpm format       # prettier across sources
```

Package-scoped: `pnpm --filter frontend ...`, `pnpm --filter @vue-application-architecture/design-system ...`

After finishing a task, run `pnpm lint`, `pnpm typecheck`, `pnpm test` (and
`pnpm build` when relevant) and leave all green.

## Architecture and import rules

The app is a modular monolith: feature modules (`catalog`, `favorites`) depend on `@vue-application-architecture/design-system`, on `@vue-application-architecture/types`,
and on sibling modules — including the `core` module — **only through their
public `index.ts` facade**. `catalog/` owns Shelf-specific book presentation (`BookCard`/`BookGrid`/
`BookCover`/`BookMeta`). `core/` owns the `NotFoundView` and preferences store. `app/` is the composition root. Rules are enforced by a custom
ESLint rule (`modular/boundaries` in `apps/frontend/eslint.config.ts`) and the
design-system package is self-contained (`ds/self-contained` in its eslint
config).

- Feature modules must never import from `app/` or a sibling module's
  internals.
- Design-system files may depend only on third-party packages
  (`@stylexjs/stylex`, `lucide-vue-next`, `vue-router`) — never app code or
  `@vue-application-architecture/types`.
- `core` files may depend on the design system, `@vue-application-architecture/types`, and third-party
  packages, but never on app or feature modules.
- Routes are lazy-loaded per module (`route.ts`); page components import
  feature stores, design-system components, and the `core` facade; domain
  types come from `@vue-application-architecture/types/*`, the `Theme` type from
  `@vue-application-architecture/design-system/theme`.

## StyleX specifics (read before touching styles)

- `@stylexjs/unplugin` compiles StyleX in `.ts(x)` files only. A companion
  plugin (`apps/frontend/config/stylexVuePlugin.ts`, `enforce: 'post'`) compiles
  `.vue` files and merges rules into the same aggregation store so the app
  emits **one** stylesheet (`virtual:stylex.css` dev, single CSS file build).
  Plugin order in `vite.config.ts` must stay `[vue(), stylex.vite(), stylexVue()]`.
- StyleX's resolver is static and **cannot resolve aliases or package
  specifiers** for imports used inside `stylex.create`/`defineVars`. Such
  imports (tokens, themes, shared styles) must be **relative paths**:
  - within `packages/design-system/src`, relative as usual
    (`../../styles/tokens.stylex`),
  - from app feature files, relative hops into the package
    (`../../../../../packages/design-system/src/styles/tokens.stylex`).
- Components, types, and `global.css` may use the package specifier
  (`@vue-application-architecture/design-system/ui/atoms/AppButton.vue`) or the `core` facade;
  `.vue`/type specifiers are safe because they are not resolved by the StyleX
  compiler.
- Token objects come from `tokens.stylex.ts` (colors, spacing, typography,
  radii, shadows, motion, layout), themes from `themes.stylex.ts`, utility
  styles (`focusRing`, `reducedMotion`, resets) from `shared.stylex.ts`.
- `App.vue` binds the active theme class from the preferences store.

## Gotchas

- `.npmrc` pins the npm registry (environment default is a private 401
  endpoint). Never change the registry; reinstalls must go through npmjs.
- Do not add comments to code unless asked.
- Stores: `catalog` (books, `filteredBooks`, `featuredBook`, search/category
  setters), `favorites` (heart toggles), `preferences` (theme). Persisted to
  `localStorage` keys `shelf:favorites` and `shelf:theme`.
- The design system keeps its defaults domain-neutral (e.g. the search
  placeholder is `Search…`); Shelf passes its own copy to `SearchBar`.
- Mock catalog data is deterministic (faker seed 2026, 24 books, one featured).
- vue-router 5: `router.isReady()` resolves only after the app is mounted; in
  tests, mount before awaiting `isReady()` and `await router.push()` before
  asserting (lazy components load async).
- Test framework: Vitest + @vue/test-utils + happy-dom; setup in
  `apps/frontend/tests/setup.ts` (matchMedia mock, localStorage cleanup).
- `lucide-vue-next` is pinned to `^0.577.0`; icon components are named imports.
- Node version is pinned in `.nvmrc` (use `nvm use`). Every config file is
  TypeScript (`vite.config.ts`, `eslint.config.ts`) — never add `.js`/`.cjs`/`.mjs`;
  ESLint loads `eslint.config.ts` via `jiti` (a root devDependency).
- Keep the boundary lint rules working: category/feature changes may need
  updates to `modular/boundaries` (path detection) and the design-system
  self-contained rule.