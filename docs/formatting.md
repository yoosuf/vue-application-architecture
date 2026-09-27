# Formatting (money & dates)

All display formatting for the app lives in one module. Read `../AGENTS.md`
first.

## The contract

`apps/frontend/src/modules/core/utils/format.ts`, exported through the `core`
facade — every feature module imports it from there:

```ts
import { formatCurrency, formatDate } from '../../core'
```

| Export | Signature | Notes |
| --- | --- | --- |
| `formatCurrency` | `(cents: number, options?: { locale?, currency?, compact? }) => string` | money in, money out. Defaults to `en-US` / `USD`; `compact` switches to compact notation. |
| `formatDate` | `(value: Date \| number \| string, options?: Intl.DateTimeFormatOptions & { locale? }) => string` | accepts a `Date`, epoch milliseconds, or an ISO string. |
| `EMPTY_VALUE` | `'—'` | returned by both formatters for unusable input |
| `DEFAULT_LOCALE` / `DEFAULT_CURRENCY` | `'en-US'` / `'USD'` | the defaults the formatters use |

`Intl` instances are cached per option shape, so hot paths (cart totals inside
a `v-for`) do not rebuild formatters. The default locale is fixed rather than
the runtime's, which keeps snapshots and tests deterministic.

## Money rules

- **Money is integer cents, always.** Never floats: `priceCents = 1234` is
  `$12.34`. Do the arithmetic in cents and divide only inside the formatter.
- Never string-concatenate money (`'$' + amount`), never `toFixed` money, never
  call `Intl.NumberFormat` directly in a component. This includes test
  expectations in app specs — assert against `formatCurrency`.
- The cart is the only place that derives totals, and it does it in integer
  cents: `subtotalCents` (Σ `priceCents * quantity`), `shippingCents`,
  `totalCents`.
- Shipping constants live in `apps/frontend/src/modules/cart/utils/money.ts`:
  `FLAT_SHIPPING_CENTS = 499`, free at ≥
  `SHIPPING_FREE_THRESHOLD_CENTS = 3500`. Keep them there and derive the
  "X away from free shipping" copy from them.
- Savings on the product page are cents too: `listPriceCents - priceCents`,
  with the percentage as an integer `Math.round`.
- Non-finite input (e.g. `NaN`) yields `EMPTY_VALUE` rather than `$NaN`.

## Date rules

- Persisted timestamps are ISO strings (`new Date().toISOString()`); pass them
  straight to `formatDate` — the formatter parses them.
- `formatDate` takes any `Intl.DateTimeFormatOptions`, so
  `{ dateStyle: 'medium', timeStyle: 'short' }` covers date-times and
  `{ weekday: 'short', month: 'short', day: 'numeric' }` covers delivery
  estimates. Do **not** mix `dateStyle`/`timeStyle` with individual
  components (`year`, `month`, …) — `Intl` throws for that combination.
- Never call `toLocaleDateString`/`toLocaleString`/`Intl.DateTimeFormat` in a
  component, and never leave a date unformatted.
- Unparseable input returns `EMPTY_VALUE`, so a missing `placedAt` renders `—`
  instead of "Invalid Date".
- Identifier-shaped dates (order ids like `SHELF-20260926-481920`) are built
  from local date parts in `checkout.stores.createOrderId`; that is an id
  format, not display formatting, and is intentionally not routed through
  `formatDate`.

## Tests

`apps/frontend/tests/utils/format.spec.ts` covers both formatters: cents →
`$12.34`, negatives, rounding, locale/currency/compact overrides, `Date`/epoch/
ISO inputs, and the `—` fallback.
