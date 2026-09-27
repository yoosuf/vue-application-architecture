# Architecture

How the monorepo is put together and what the boundaries actually mean. Read
`../AGENTS.md` first.

## The app as a modular monolith

`apps/frontend/src` has two halves:

```
src/
  main.ts               createApp -> pinia -> router -> global.css
  app/                  the composition root: shell, header, footer, router/appRoutes
  modules/              feature modules, each behind a public index.ts facade
```

`app/` may import anything — it is where modules are wired together. Feature
modules may **not** import `app/`, and may only reach each other through
facades. That single rule is what keeps the app decomposable; everything else
here follows from it.

### Module map

| Module      | Owns                                                                                                                        | Public surface (`index.ts`)                                                                                                                                      |
| ----------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `core`      | `NotFoundView`, the preferences store (theme), shared formatters (`utils/format.ts`)                                        | `NotFoundView`, `usePreferencesStore`, `THEME_STORAGE_KEY`, `formatCurrency`, `formatDate`, …, `Theme` (re-exported from the design system)                      |
| `catalog`   | book data (deterministic faker mocks), search/category/sort state, all `Book*` components, `ExploreView`, `BookDetailsView` | `useCatalogStore`, `ALL_CATEGORIES`, `BookCard`, `BookGrid`, `BookCover`, `BookMeta`, `BookGallery`, `SortControl`, `catalogRoutes`                              |
| `favorites` | the heart toggle and its persistence                                                                                        | `useFavoritesStore`, `FavoriteButton`                                                                                                                            |
| `cart`      | cart lines + totals, shipping constants, the slide-over drawer, `CartView`                                                  | `useCartStore`, `AddToCartButton`, `CartLineRow`, `CartDrawer`, `CartLink`, `OrderSummary`, `FLAT_SHIPPING_CENTS`, `SHIPPING_FREE_THRESHOLD_CENTS`, `cartRoutes` |
| `checkout`  | order placement and the receipt                                                                                             | `useCheckoutStore`, `checkoutRoutes` (which lazily load `CheckoutView`), `CheckoutDetails`/`Order`/`OrderLine` types                                             |
| `customer`  | magic-link auth, the address book, notification prefs, the account sections                                                 | `useCustomerStore`, storage-key constants, `LoginView`, `LoginVerifyView`, `AccountView`, `customerRoutes`, `Customer`/`Address` types                           |

Notes that are easy to get wrong:

- `CartLine.vue` is exported as `CartLineRow` because the `CartLine` _type_
  is already exported from the same facade.
- `catalog` is the only module with a `mocks/` directory; the app has no
  backend, so "data" means a seeded faker catalog.
- `favorites` has no page or route — the favorites UI is a section inside
  `AccountView` that reuses `BookGrid` + `FavoriteButton`.

### Facade contract

A facade is the module's `index.ts`. Sibling modules import the facade and
nothing else:

```ts
import { AddToCartButton, useCartStore } from '../../cart' // ok
import { formatCurrency } from '../../core' // ok
import { useCartStore } from '../../cart/stores/cart.store' // lint error
```

Internals may of course import each other (`components/…` from `stores/…`).
When you add something a sibling needs, export it from the facade — and keep
the facade to a curated public surface, not a `export *` dump.

### Routes

Each module ships a `route.ts` exporting `*Routes` as
`RouteRecordRaw[]`, with lazily imported page components:

```ts
component: () => import('./pages/ExploreView.vue')
```

`app/router/index.ts` composes `appRoutes` from every module's array plus a
catch-all `not-found` route that lazily imports `NotFoundView` from the `core`
facade. `router.afterEach` sets `document.title` from `meta.title`.

Route names in use: `explore`, `collection`, `book-details`, `cart`,
`checkout`, `login`, `login-verify`, `account-orders`, `account-profile`,
`account-favorites`, `account-settings`, `account-addresses`, `not-found`.
Guarded account routes redirect to `login` with a `redirect` query param.

## Stores

Setup-style Pinia stores (`defineStore('name', () => { … })`), one per
concern, each parsing its persisted state defensively (try/catch + shape
checks) because `localStorage` is user-writable.

| Store         | Key surface                                                                                                                                                                                                                      | Persistence                                                                      |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `catalog`     | `books`, `filteredBooks`, `sortedBooks`, `featuredBook`, `categories`, `searchQuery`, `selectedCategory`, `sortOrder`; `setSearchQuery`, `setCategory`, `setSortOrder`, `findBookById`, `relatedBooks`; `ALL_CATEGORIES = 'All'` | in-memory (seeded faker catalog)                                                 |
| `favorites`   | heart toggles per book                                                                                                                                                                                                           | `shelf:favorites`                                                                |
| `preferences` | `theme` (`'light' \| 'dark'`), defaults to the OS `prefers-color-scheme`                                                                                                                                                         | `shelf:theme`                                                                    |
| `cart`        | `items`, `entries`, `lineCount`, `count`, `subtotalCents`, `shippingCents`, `totalCents`; `addBook`, `setQuantity`, `removeBook`, `clear`, `openCart`, `closeCart`, `toggleCart`, `isCartOpen`                                   | `shelf:cart` (`isCartOpen` is a non-persisted UI flag)                           |
| `checkout`    | `lastOrder`; `placeOrder(details)` snapshots the cart and clears it, `clearOrder`                                                                                                                                                | in-memory only                                                                   |
| `customer`    | magic-link auth, addresses, notification prefs, `recordOrder`                                                                                                                                                                    | `shelf:customers`, `shelf:customer-session`, `shelf:magic-login` (15-min expiry) |

The cart cross-reads the catalog store (through the `catalog` facade) to
resolve each line's book, so a cart line always renders current book data.

`normalizeCustomer` fills defaults when reading `shelf:customers`, because
records written by older versions may lack newer fields. Apply the same
defensive posture to any new persisted shape.

## How the boundary rule works

`modular/boundaries` lives in `apps/frontend/eslint.config.ts` and runs on
`ImportDeclaration`, `ExportNamedDeclaration`, and `ExportAllDeclaration`:

- It only checks files under `src/modules/<name>/**`. Bare package specifiers
  (`vue`, `pinia`, `@vue-application-architecture/*`) are ignored; only `@/…`
  and relative paths are resolved.
- A target is a "facade" when the resolved path is the module directory or its
  `index.ts`.
- Forbidden: feature → `app`, feature → sibling internals, feature → `core`
  internals, and any `core` file importing a feature or `app` file.
- Allowed: feature → design system (package specifier _or_ relative hop into
  `packages/design-system/src`), feature → sibling facades, feature → types,
  and anything inside `app/`.

**Adding a module:** create `src/modules/<name>/` with an `index.ts` facade,
then add `<name>` to `FEATURE_MODULES` in `apps/frontend/eslint.config.ts` —
otherwise the rule will not check it and mistakes pass silently.

The rule reads `process.cwd()`, so always lint through the package
(`pnpm --filter frontend lint`), never from the repo root.

## Design system and types packages

Both are source-first workspace packages linked with `workspace:*`:

- `@vue-application-architecture/design-system` — generic, domain-free UI kit
  plus StyleX tokens/themes. Self-contained: only `@stylexjs/stylex`,
  `lucide-vue-next`, and `vue-router` (`ds/self-contained` rule). See
  `design-system.md`.
- `@vue-application-architecture/types` — `Book`, `BookCategory`. Domain types
  only, importable from anywhere including the app; the design system may not
  depend on it.

The app resolves both packages to source via the `vite.config.ts` aliases
(`@vue-application-architecture/types` → `packages/types/src`,
`@vue-application-architecture/design-system` → `packages/design-system/src`),
so edits hot-reload with no build step; TypeScript follows the same source
through pnpm's workspace links and each package's `exports` map.
`apps/frontend/tsconfig.app.json` adds the `@/*` alias for
`apps/frontend/src/*`.

## Boundary audit checklist

When reviewing a change, verify:

1. `pnpm --filter frontend lint` and
   `pnpm --filter @vue-application-architecture/design-system lint` are clean
   (run them from their own package directories).
2. No import from `src/modules/x/...` reaches into `src/app/`.
3. No import from one module reaches another module's internals — facades
   only.
4. `core` imports no feature module and no `app` file.
5. `packages/design-system` imports no app path and no
   `@vue-application-architecture/types`.
6. Imports used _inside_ `stylex.create`/`defineVars` are relative paths, not
   `@/` or package specifiers (see `styling.md`).
7. New cross-module dependencies are added to `FEATURE_MODULES` in the app's
   ESLint config, and any new package export path exists in that package's
   `package.json` `exports`.

Report a violation as
`<file>:<line> — <source module> -> <target> — why it is forbidden`, with the
fix (correct facade, package specifier, or relative StyleX path).

## Build, CI and deployment

Three repo-root files decide how the app is verified and published:

| File                           | Role                                                                                                                                                                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vercel.json`                  | `buildCommand` `pnpm --filter frontend build`, `outputDirectory` `apps/frontend/dist`, and a catch-all rewrite to `index.html` (the router uses `createWebHistory()`, so `/cart` and `/account/orders` must survive a hard refresh) |
| `.github/workflows/ci.yml`     | every push/PR to `main`: install, `format:check`, `lint`, `typecheck`, `test`, `build`, then upload `apps/frontend/dist`                                                                                                            |
| `.github/workflows/deploy.yml` | after a green `CI` on `main` (or manually): publish to Vercel, skipping cleanly when the Vercel secrets are absent                                                                                                                  |

The build output is `apps/frontend/dist`, **not** a root `dist/` — the
workspace root holds no app output, which is what makes a Vercel project
configured with the default `dist` fail with "No Output Directory named dist
found". Details, including the required secrets, are in
[`testing.md`](testing.md#ci-and-publishing).
