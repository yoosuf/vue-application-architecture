# Bookstore spec — cart & checkout

Status: implemented on `feature/bookstore` (not yet merged to `main`)
Owner: apps/frontend
Audience: engineers and AI agents working on the Shelf bookstore surface

## 1. Overview

Shelf becomes a small e-commerce book store in the spirit of A Book Apart:
browse the catalog, add books to a cart, and check out against a mock
payment flow. Prices, cart provisioning, and order placement are
client-side only — there is no backend. The existing catalog module's fake
data (faker seed 2026, 24 books) is extended with a price; cart and checkout
are new sibling feature modules in the modular monolith.

## 2. Goals

- Give every book a price and surface it on cards, details, cart and receipt.
- Let users add, adjust and remove quantities, with the cart surviving page
  reloads (persisted to `localStorage`).
- Provide a full checkout path: contact + shipping + mock payment, client-side
  validation, and an order-confirmation receipt.
- Follow the modular-monolith rules: `cart` and `checkout` are feature
  modules exposing facades; nothing reaches into `app/` or sibling internals;
  generic form/quantity UI lives in the design system.

## 3. Out of scope (deliberately)

- Real payment processing, shipping carriers, taxes, discount codes.
- Account creation / login, order history.
- Server persistence or a checkout API (multi-tab sync is not guaranteed).
- Stock management / backorders.

## 4. Information architecture

| Route       | Module   | Name        | Title         | Notes                              |
| ----------- | -------- | ----------- | ------------- | ---------------------------------- |
| `/`         | catalog  | `explore`   | Explore         | cards now show price + add-to-cart |
| `/collections/:category` | catalog | `collection` | e.g. History | category-selected catalog, slug URL |
| `/products/:id`| catalog| `book-details` | Book Details | price + quantity stepper           |
| `/cart`     | cart     | `cart`      | Your Cart     | line items, summary, checkout CTA  |
| `/checkout` | checkout | `checkout`  | Checkout      | form + summary, or confirmation    |
| `/account/favorites` | customer | `account-favorites` | Your Favorites | account section reusing the favorites grid |

`/checkout` renders three states:
1. cart has items → checkout form;
2. cart is empty and an order was just placed → confirmation receipt;
3. cart is empty otherwise → empty state with a link back to the cart.

## 5. Data model

### `Book` (`packages/types/src/book.ts`)

- `priceCents: number` — the sale price, integer US cents for clean arithmetic.
- `listPriceCents: number` — the compare-at list price used for the struck-through
  savings display on the book details buy box; always above `priceCents`.

- `coverUrl: string` — the primary cover image (also the first gallery photo).
- `galleryUrls: string[]` — all product photos shown on the book details gallery
  (front cover, back cover, detail, reading shot); `galleryUrls[0] === coverUrl`.

Mock factory generates deterministic sale prices in `$12.00–$42.00`
(`faker` seeded), with `listPriceCents` rounded up to a `$X.99` compare-at
price `$3.00–$22.00` above the sale price. The types demo
(`packages/types/demo/samples.ts`) carries matching literal prices.

### Cart line

```ts
export interface CartItem { bookId: string; quantity: number }
export interface CartLine  { book: Book; quantity: number; lineTotalCents: number }
```

Cart entries are id+quantity pairs; line/price data is joined against the
catalog store at read time, so stale ids (removed books) render no line.

### Order snapshot (`modules/checkout`)

```ts
export interface Order extends CheckoutDetails {
  id: string          // SHELF-YYYYMMDD-######
  placedAt: string    // ISO timestamp
  lines: OrderLine[]
  subtotalCents: number
  shippingCents: number
  totalCents: number
}
```

`placeOrder` snapshots current cart lines and totals **before** clearing the
cart, so the receipt is stable.

## 6. State layer

### `cart` store (`modules/cart/stores/cart.store.ts`)

- `items` (id+quantity), persisted under `shelf:cart`.
- Derived: `entries` (book-joined lines), `lineCount`, `count` (units),
  `subtotalCents`, `shippingCents`, `totalCents`.
- Actions: `addBook(id, qty=1)` (increments), `setQuantity(id, qty)`
  (`<= 0` removes), `removeBook`, `clear`, plus queries `quantityFor`,
  `isInCart`.
- Shipping rule (module constants in `utils/money.ts`): flat `$4.99`,
  free when subtotal ≥ `$35.00` (`SHIPPING_FREE_THRESHOLD_CENTS = 3500`).

### `checkout` store (`modules/checkout/stores/checkout.store.ts`)

- `lastOrder: Order | null` (in-memory, intentionally not persisted).
- `placeOrder(details)` → snapshots + clears cart, sets `lastOrder`,
  returns the order (or `null` when the cart is empty).
- `clearOrder()`.

### `preferences` / `favorites`

Unchanged. Storage keys stay prefixed `shelf:` (`shelf:theme`,
`shelf:favorites`, new `shelf:cart`).

## 7. Component plan

### Design system (domain-free atoms)

- `TextField` — labelled input; `label`, `type`, `placeholder`, `hint`,
  `error`, `autocomplete`, `inputmode`, `required`, `disabled`. Error state
  ties `aria-invalid` + `aria-describedby` + a `role="alert"` message.
- `QuantityStepper` — controlled stepper (`modelValue`, `min`, `max`,
  `disabled`, `label`); minus disables at minimum, plus at maximum.

New token pair `colors.danger` / `dangerSoft` for validation styling, synced
across `tokens.stylex.ts`, `themes.stylex.ts` and `tokens.css`.

### `cart` module

- `AddToCartButton` — "Add to Cart" button, or a quantity stepper once the
  book is in the cart.
- `CartLink` — header link with live count badge.
- `CartLine` — cover thumb, title/details link, unit price, stepper, line
  total, remove.
- `OrderSummary` — subtotal / shipping / total panel (free-shipping note).
- `utils/money.ts` — `formatPrice(cents)` (Intl `en-US` USD) + the two
  shipping constants.
- `CartView` — empty state vs. line list + summary + CTAs.

### `checkout` module

- `CheckoutView` — sections for Contact / Shipping / Payment (mock), client
  validation, summary sidebar with `Place Order`, and the confirmation
  receipt.

## 8. Currency & formatting

All money is integer **cents**. Display is centralized in
`formatPrice(cents)` (`Intl.NumberFormat('en-US', { style: 'currency',
currency: 'USD' })`). Never string-concatenate or float-round money in
components.

## 9. Accessibility

- Quantity steps are real buttons with `aria-label`s and a live quantity span.
- Form errors are announced via `role="alert"` and marked with
  `aria-invalid` + `aria-describedby`.
- Cart badge announces the item count (`aria-live="polite"`).
- The checkout confirmation is the first `h1` on the page (no route change),
  so it is not re-announced by the app-level loader announcer.

## 10. Acceptance criteria

- [x] Every catalog book displays a formatted price.
- [x] Add-to-cart updates the header badge immediately and survives reload.
- [x] Quantities can be raised/lowered/clamped/removed in the cart.
- [x] Free shipping threshold is applied and displayed.
- [x] Checkout validates required fields (including email/card format) and
      blocks submission on errors.
- [x] Placing an order empties the cart and shows a receipt with the order
      number, lines, totals and shipping address.
- [x] `/cart` and `/checkout` are reachable and guarded against empty state.
- [x] Boundary lint passes: `cart`/`checkout` never import app internals or
      sibling module internals.

## 11. Verification

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Coverage added: DS atoms (TextField, QuantityStepper), app stores (cart,
checkout), `AddToCartButton`, and end-to-end router flows
(empty/line cart + checkout-to-confirmation).

## 12. Future work

- Shipping/tax providers, promo codes, order history.
- `lastOrder` receipt persistence and a printable receipt.
- Multi-device cart sync via a backend.