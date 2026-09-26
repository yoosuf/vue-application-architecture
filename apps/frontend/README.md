# Shelf — A Digital Library

A small, polished digital-library reference app demonstrating modern Vue 3
tooling. It gives you a complete picture of how to build a type-safe, styled,
responsive, accessible single-page app with:

- **Vue 3** (`<script setup>`, TypeScript, Vite)
- **Vue Router** — lazy-loaded views, typed routes
- **Pinia** — catalog, favorites, and preference stores with persistence
- **StyleX** — design tokens, light/dark theme object composition, conditional
  and pseudo-state styling, responsive media queries
- **Atomic Design** — atoms → molecules → pages, with the presentational
  layer extracted into the `@vue-application-architecture/design-system` workspace package
- **Vitest + @vue/test-utils** — store, component, and routing tests

The catalog is generated deterministically with Faker (seeded, 24 books) so the
UI is lively mock data without a backend.

## Stack

| Tool          | Package                                    |
| ------------- | ------------------------------------------ |
| Framework     | Vue 3.5                                    |
| Build         | Vite 8 (rolldown) + @vitejs/plugin-vue     |
| Styling       | @stylexjs/stylex 0.19 + @stylexjs/unplugin |
| State         | Pinia 4                                    |
| Routing       | vue-router 5                               |
| Icons         | lucide-vue-next                            |
| Mock data     | @faker-js/faker                            |
| Tests         | Vitest 5, @vue/test-utils, happy-dom       |
| Lint / format | ESLint 10 (flat config), Prettier          |

## Getting started

Commands run from the workspace root (they proxy to this package) or from
`apps/frontend` directly:

```bash
pnpm install
pnpm dev        # start the dev server
pnpm test       # run tests once
pnpm test:watch # run tests in watch mode
pnpm lint       # lint + auto-fix (all workspace packages)
pnpm typecheck  # vue-tsc type check (app + design system)
pnpm build      # production build -> apps/frontend/dist/
```

> The project pins the npm registry in `.npmrc` because the environment's
> global registry is a private CodeArtifact endpoint. Keep that file if you
> re-provision dependencies.

## Architecture

Shelf is a **modular monolith** inside a **pnpm workspace**: the single
deployable app (`apps/frontend`) is organized into cohesive feature modules with
enforced boundaries, and the presentational design layer lives in its own
workspace package — `@vue-application-architecture/design-system` — so it stays reusable beyond this
app.

```
apps/frontend/src/
  app/                    # composition root — may depend on any module
    App.vue               # root: theme + route announce/focus wiring
    components/           # shell pieces: AppShell, SkipLink, MainContent, AppFooter,
                          #   StatusAnnouncer, AppHeader (wires header stores), AppLogo, NavigationLink
    router/index.ts       # appRoutes = module routes + lazy 404 catch-all
  modules/
    core/                 # app-level fallback page and preferences
      pages/NotFoundView.vue
      stores/preferences.store.ts
      index.ts            # facade: NotFoundView and preferences
    catalog/              # book components + catalog; depends on core, favorites
      stores/catalog.store.ts, mocks/ (Faker data)
      components/         # BookCard/Grid/Cover/Meta, FeaturedBook, CategoryFilter, CategoryChip, BookDetails
      pages/              # ExploreView, BookDetailsView (details + related books)
      route.ts, index.ts
    favorites/            # depends on: design-system, core, catalog (facades)
      stores/favorites.store.ts, components/FavoriteButton.vue
      pages/FavoritesView.vue
      route.ts, index.ts
packages/types/src/          # @vue-application-architecture/types — Book, BookCategory
packages/design-system/src/   # @vue-application-architecture/design-system — generic, domain-free UI kit
  styles/                 # design tokens, light/dark theme objects, shared styles
  ui/atoms/               # AppButton, IconButton, Loader, Rating, SearchField, ThemeToggle
  ui/molecules/           # SearchBar, EmptyState
```

### Module boundaries

Each module exposes a public **facade** (`index.ts`) plus its route table;
everything else is internal. Dependencies follow the module boundaries below, and
are **enforced by a custom ESLint rule** (`modular/boundaries` in
`eslint.config.ts`); the design-system package is separately enforced to be
**self-contained** (`ds/self-contained` in `packages/design-system`):

| Source                             | May import from                                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| `@vue-application-architecture/design-system`             | third-party packages only                                                                       |
| `core` (NotFoundView, preferences) | design-system, `@vue-application-architecture/types`, and third-party packages                                         |
| `catalog`, `favorites`             | design-system (any file), `@vue-application-architecture/types`, sibling **facades only** (incl. `core` and `catalog`) |
| `app`                              | anything (composition root)                                                                     |

Feature modules may never reach into a sibling module's internals — only its
`index.ts`. The graph stays acyclic:

```
app → catalog / favorites / core / design-system
catalog ↔ favorites → each other through facades; both → core / design-system
core → design-system / types / third-party packages
```

### Styling with StyleX

- Design tokens live in `@vue-application-architecture/design-system/src/styles/tokens.stylex.ts`
  (colors, spacing, typography, radii, shadows, motion, layout) and are
  consumed with `stylex.create`/`stylex.attrs` throughout components.
- Light/dark themes are StyleX theme objects in `themes.stylex.ts`; `App.vue`
  binds the active theme class from the preferences store.
- Scope is the sharing concern, not layers: shared useful styles (`focusRing`,
  `reducedMotion`, resets) live in `shared.stylex.ts`.
- Components are imported from the design system by specifier
  (`@vue-application-architecture/design-system/ui/atoms/AppButton.vue`), book components from the
  `core` module facade (`@/modules/core`), and domain types from
  `@vue-application-architecture/types/*`. **StyleX-compiled token
  and theme files are instead imported by relative path** into
  `packages/design-system/src` — see below.

### StyleX + Vue integration

`@stylexjs/unplugin` compiles StyleX in `.ts(x)` files, but it does not
transform `.vue` files. A small companion Vite plugin
(`config/stylexVuePlugin.ts`) runs the StyleX Babel transform over compiled
`.vue` script modules (after `@vitejs/plugin-vue`) and merges the generated
rules into the same aggregation store, so CSS is deduplicated and emitted in
one file in both dev and build. Plugin order in `vite.config.ts`:

```ts
plugins: [vue(), stylex.vite(), stylexVue()]
```

StyleX's Babel resolver visits StyleX-using imports statically, so files that
use `stylex.create`/`defineVars` must import via **relative paths**, not the
`@/` alias. That also governs how the app reaches into the design system:
components and types come in by package specifier, while token/theme modules
referenced inside `stylex.create` are imported with relative paths into
`packages/design-system/src` (e.g. `../../../../../packages/design-system/src/styles/tokens.stylex`).
Both hop patterns are allowed by the boundary rule.

### Component design

Presentational components follow Atomic Design **within** the design system:
atoms are primitives without store or route coupling, molecules are small
compositions (e.g. the app's `BookCard` exposes a `#footer` scoped slot so
pages can inject feature-owned actions like `FavoriteButton`), and pages are
the route components that wire stores to props/slots. The generic design
system drags in no app code; Shelf-specific presentational components live in
the `core` module on top of it.

## Features

- Featured book spotlight plus a responsive 5/4/3/2-column book grid.
- Search across title, author, and category; category filter chips.
- Favorites with heart toggles, persisted to `localStorage` (`shelf:favorites`).
- Light/dark theme toggle persisted to `localStorage` (`shelf:theme`),
  defaulting to the OS preference.
- Book details page with `2/3` cover, lazy-loaded images (eager for featured),
  and related books from the same category.
- Accessible components: `aria-label`/`aria-pressed`/`aria-current`, visible
  `:focus-visible` rings, semantic landmarks, `prefers-reduced-motion` support.
- Route transitions show a loading spinner while lazy view chunks load.
- Scroll restoration and a 404 catch-all route.

## Tests

`tests/` holds Vitest suites for the Pinia stores (deterministic catalog
generation, filtering, persistence, storage corruption handling), components
(BookCard, FavoriteButton, CategoryFilter, ThemeToggle), and an end-to-end
router render (explore, favorites empty state, book details, card click-through,
and the 404 page).
