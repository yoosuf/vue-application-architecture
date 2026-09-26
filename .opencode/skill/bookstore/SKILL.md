---
name: bookstore
description: Edit the Shelf bookstore surface — the cart and checkout feature modules (modules/cart, modules/checkout), pricing on Book, order flow, and the associated specs. Use when adding or fixing cart/checkout UI, the cart or checkout Pinia stores, money formatting, or order placement.
---

# Bookstore (cart & checkout)

The bookstore turns Shelf into a small e-commerce experience in the spirit of
A Book Apart: priced books, a persistent cart, and a mock checkout. There is
**no backend** — everything is client-side. Spec: `docs/specs/bookstore.md`.

## Feature modules

- `src/modules/cart/` — `useCartStore` (persisted to `shelf:cart`, plus a
  non-persisted `isCartOpen` UI flag with `openCart`/`closeCart`/`toggleCart`),
  money util, `AddToCartButton`, `CartLink` (header button that toggles the
  drawer), `CartLine` (`compact` variant for the drawer), `OrderSummary`,
  `CartDrawer` (Shopify-style right slide-over via the DS `Drawer` molecule),
  `CartView`, `cartRoutes`, facade `index.ts`.
- `src/modules/checkout/` — `useCheckoutStore` (`lastOrder`, `placeOrder`,
  `clearOrder`), `CheckoutView`, `checkoutRoutes`, facade `index.ts`.
- `checkout` depends on `cart` through its facade only; `cart.values` cross-
  read the catalog store (via the `catalog` facade) exactly like
  `favorites` does.

## Rules to keep intact

- Cart/checkout must import **only facades** of sibling modules
  (`../../catalog`, `../../cart`, `../../customer`) — never `app/` or
  internals. The `modular/boundaries` rule (FEATURE_MODULES in
  `eslint.config.ts`) knows `catalog, favorites, cart, checkout, customer`;
  add new modules there.
- Cart UX: any "Add to Cart" (e.g. `AddToCartButton`) opens the drawer via
  `openCart()`; the header `CartLink` button toggles it. The DS `Drawer`
  molecule handles scrim/Escape/close-button, focus trap + restore, and scroll
  lock — the cart module only supplies content and CTAs (Checkout → `/checkout`,
  View Cart → `/cart`), closing the drawer before navigating.
- Money is integer **cents**. Format with `formatPrice()` from
  `modules/cart/utils/money.ts` (Intl USD) — never float-round currency.
- Shipping: flat `FLAT_SHIPPING_CENTS = 499`, free at ≥
  `SHIPPING_FREE_THRESHOLD_CENTS = 3500`; keep the constants in `money.ts`.
- Storage key prefix is `shelf:` (`shelf:cart`, `shelf:favorites`,
  `shelf:theme`); parsing is defensive (try/catch, shape checks).
- UI comes from the design system (`AppButton`, `IconButton`, `EmptyState`,
  `TextField`, `QuantityStepper`) by package specifier; StyleX tokens by the
  relative path hop into `packages/design-system/src/styles/tokens.stylex`.
- `TextField`/`QuantityStepper` are design-system atoms; any new generic form
  primitive belongs there (with exports + DS unit tests), not in app modules.

## Checkout flow

1. Validate the form (presentational errors via `TextField error` prop).
2. `checkout.placeOrder(details)` snapshots `cart.entries` + totals, clears the
   cart, stores `lastOrder`.
3. `CheckoutView` renders the confirmation from `lastOrder` (order id
   `SHELF-YYYYMMDD-######`, lines, totals, ship-to address) and, when a
   customer is signed in, calls `customer.recordOrder(order)` so the order
   appears in the signed-in customer's history on `/account`. The shipping
   group is prefilled when a signed-in customer has a saved address (the
   shipping-designated address, falling back to primary; email prefilled from
   the account).

## Testing

- Stores: `tests/stores/cart.store.spec.ts`,
  `tests/stores/checkout.store.spec.ts`.
- Component: `tests/components/AddToCartButton.spec.ts`,
  `tests/components/CartDrawer.spec.ts` (empty state, lines/totals, Checkout
  closes + routes).
- Flows live in `tests/router.spec.ts` (empty cart, line cart, checkout
  submit → confirmation, header button opens the drawer).
- DS atoms/molecules: `packages/design-system/tests/{TextField,QuantityStepper,Drawer}.spec.ts`.

## Commands

```bash
pnpm --filter frontend dev|test|test:watch|typecheck|lint|build
pnpm --filter @vue-application-architecture/design-system typecheck|lint|test
```

Leave `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` green.

Base directory for this skill: /Users/yoosuf/Desktop/demo/library/.opencode/skill/bookstore