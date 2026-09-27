# Design system

`@vue-application-architecture/design-system` is a **self-contained,
domain-free** workspace package: atoms, molecules, StyleX tokens and themes,
plus a plain-CSS token layer. Read `../AGENTS.md` and `styling.md` first.

## Hard constraint

Files in `packages/design-system/src` may depend only on `@stylexjs/stylex`,
`vue`, `lucide-vue-next`, and `vue-router` — never app code, never
`@vue-application-architecture/types`, never a Pinia store. The
`ds/self-contained` rule in `packages/design-system/eslint.config.ts` reports
any bare specifier outside that allowlist and any relative import that escapes
the package, so a boundary mistake fails `pnpm lint`. The rule is scoped to
`src/`: the demo and the Vite/Vitest configs may import their own tooling.

`vue-router` is allowed for `RouteLocationRaw`-typed links (`AppButton`,
`NavLink`); `lucide-vue-next` icons are named imports, pinned `^0.577.0`.

## Source-first

`exports` point at `.vue`/`.ts` sources, so there is no build step and app
edits hot-reload. Any new subpath must be added to `package.json` `exports`
(explicit keys first, wildcards last) or it is unreachable from the app.

| Specifier | Resolves to |
| --- | --- |
| `@vue-application-architecture/design-system` | `src/index.ts` (every atom + molecule, `Theme`) |
| `.../theme` | `src/theme.ts` — `Theme = 'light' \| 'dark'` |
| `.../styles/global.css` | resets/base, imported once by the app's `main.ts` |
| `.../styles/tokens.css` | tokens as CSS custom properties (`data-ds-theme="dark"` switch) |
| `.../styles/tokens.stylex`, `.../styles/themes.stylex`, `.../styles/shared.stylex` | the StyleX layer |
| `.../ui/atoms` / `.../ui/atoms/X.vue` | atoms |
| `.../ui/molecules` / `.../ui/molecules/X.vue` | molecules |

## The kit today

- **Atoms** (primitives, no store or router coupling beyond typed links):
  `AppButton`, `Chip`, `IconButton`, `Loader`, `NativeSelect`, `NavLink`,
  `QuantityStepper`, `Rating`, `SearchField`, `SectionHeading`, `SkipLink`,
  `StatusAnnouncer`, `TextButton`, `TextField`, `ThemeToggle`, `Toggle`
  (`role="switch"`, `v-model:checked`, disabled + reduced-motion safe).
- **Molecules** (compose atoms): `Breadcrumbs` (`items: { label, to? }[]`, the
  current item has no `to`), `Drawer` (scrim/Escape, focus trap + restore,
  scroll lock), `EmptyState`, `FilterGroup`, `FormSection`, `MainContent`,
  `PageSection`, `ResponsiveGrid` (5→1 columns, `gap: 'md' | 'lg'`,
  `minColumns`), `SearchBar`, `Tabs` (tablist with arrow-key nav and
  `v-model` active index).

## Kit vs. app

The line is **generality**, not size. Generic things were lifted into the kit
(`NavLink`, `SkipLink`, `StatusAnnouncer`, `MainContent`, `PageSection`,
`SectionHeading`, `Chip`, `FilterGroup`, `TextField`, `QuantityStepper`,
`Drawer`, `EmptyState`, `ResponsiveGrid`, `Tabs`, `Breadcrumbs`).

Product-domain things stay in the app, even when they look generic:

- `AppShell`, `AppHeader`, `AppLogo`, `AppFooter` — brand/shell chrome.
- Product-domain components: everything `Book*`, `Cart*`, `Order*`,
  `AddToCartButton`, `FeaturedBook`, `CategoryFilter`, `SortControl`,
  `AddressForm` — they know about books, carts, and addresses.
- Domain types (`Book`, `BookCategory`) live in
  `@vue-application-architecture/types`; a component that needs them is
  app-side by definition.

Any new generic form primitive or overlay belongs **here** (with exports and a
spec), not in an app module.

## Rules for new components

- Atomic design within the package: atoms are primitives, molecules compose
  atoms. Nothing composes a molecule from app code.
- **Presentational only**: data in as props, actions out as emits or slots.
  Never import a Pinia store, a feature module, or
  `@vue-application-architecture/types`.
- Inside the package, import everything relatively: sibling components as
  `./X.vue`, and StyleX token/theme/shared-style imports referenced inside
  `stylex.create`/`defineVars` as `../../styles/tokens.stylex` (see
  `styling.md`).
- Add the export to `package.json`, add the component to the matching barrel
  (`src/ui/atoms/index.ts` or `src/ui/molecules/index.ts` — `src/index.ts`
  re-exports those two, never a hand-copied list), and add
  `tests/<Component>.spec.ts`. `tests/exports.spec.ts` fails if a `.vue` file
  and its barrel disagree.
- Keep defaults domain-neutral: the search placeholder is `Search…`, not
  book copy. The app passes its own strings.
- Accessibility is part of the contract, not a follow-up: real `<button>`s and
  labels, `aria-*` state, keyboard paths, `prefers-reduced-motion` guards, and
  `visuallyHidden` for text that is announced but not shown.

## Tokens

Tokens have two faces that must stay in sync: `styles/tokens.stylex.ts`
(StyleX `defineVars`, used by components) and `styles/tokens.css` (CSS custom
properties, for plain CSS/HTML), with `styles/themes.stylex.ts` supplying the
light/dark theme classes. A token write touches all three.

## Verification

```bash
pnpm --filter @vue-application-architecture/design-system typecheck|lint|test
```

A design-system change is fully validated when the app gates pass too, because
the app bundles these sources into its own single stylesheet build
(`pnpm --filter frontend build`).
