---
name: shelf-app
description: Build and edit the Shelf app (apps/frontend): a Vue 3 + TypeScript modular monolith with Pinia stores and lazy vue-router routes. Use when working in apps/frontend/src, adding feature modules, routes, stores, pages, or test specs, or when the modular/boundaries lint rule is involved.
---

# Shelf App

Work inside `apps/frontend/`. The app is a **modular monolith** whose feature
modules may not reach into `app/` or each other's internals.

## Module layout

```
src/
  app/                    # composition root (shell, header, router/appRoutes)
  modules/
    core/                 # NotFoundView + preferences store (Theme comes from design-system)
    catalog/              # store, mocks, BookCard/Grid/Cover/Meta/Details, CategoryChip/Filter,
                          #   FeaturedBook, ExploreView + BookDetailsView (route.ts holds both routes)
    favorites/            # store, FavoriteButton, FavoritesView
    cart/                 # store (shelf:cart), money util, AddToCartButton/CartLink/CartLine/
                          #   OrderSummary, CartView  -> see .opencode/skill/bookstore
    checkout/             # store + CheckoutView (order placement) -> see .opencode/skill/bookstore
```

Each module exposes a public facade `index.ts` and a lazy `route.ts`
(`() => import('./pages/X.vue')`). Generic UI comes from
`@vue-application-architecture/design-system` (package specifier) and domain
types from `@vue-application-architecture/types/*`. Cross-feature helpers
(book components, stores) are imported **only through the sibling's facade**,
never its internals.

## Stores (Pinia setup-style)

- `catalog` (`useCatalogStore`): `books`, `filteredBooks` (search + category),
  `featuredBook`, `categories`, `setSearchQuery`, `setCategory`,
  `findBookById`, `relatedBooks(bookId, count)`, `ALL_CATEGORIES = 'All'`.
- `favorites` (`useFavoritesStore`): heart toggles, persisted to `shelf:favorites`.
- `preferences` (`usePreferencesStore`): theme, persisted to `shelf:theme`,
  defaults to OS colorScheme. `App.vue` binds the active theme class.
- `cart` (`useCartStore`): persisted to `shelf:cart`; amounts are integer
  cents. See the bookstore skill for money/shipping rules.
- `checkout` (`useCheckoutStore`): `lastOrder` + `placeOrder` (snapshot +
  clear the cart).

## Testing conventions

- Vitest + @vue/test-utils + happy-dom; globals on; setup at
  `apps/frontend/tests/setup.ts` (matchMedia mock, localStorage cleanup).
- vue-router 5: `router.isReady()` resolves after mount; in router tests,
  mount the app first, then `await router.push(...)` and await lazy load
  before asserting.
- Mock data is deterministic (faker seed 2026, 24 books, one featured; books
  have `priceCents`).
- Category/feature additions may require updating the `modular/boundaries`
  rule in `eslint.config.ts` (module detection is path-based; FEATURE_MODULES
  currently = catalog, favorites, cart, checkout).

## Commands

```bash
pnpm --filter frontend dev|test|test:watch|typecheck|lint|build
```

Always leave `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` green.
See the root AGENTS.md for StyleX import rules before writing styles, and
`.opencode/skill/bookstore` for cart/checkout work.

Base directory for this skill: /Users/yoosuf/Desktop/demo/library/.opencode/skill/shelf-app