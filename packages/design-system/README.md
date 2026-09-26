# @vue-application-architecture/design-system

A **standard, self-contained design system** for the Shelf monorepo. It provides
the brand tokens, light/dark theming, and a catalog of domain-free Vue atoms and
molecules — everything a Shelf UI is built from.

- **Domain-free** — zero knowledge of books, shelves, or any Shelf entity. The
  product layer (`@vue-application-architecture/types` + the app's `shared` book components) depends on
  this kit, never the other way around.
- **Source-first** — `exports` points at `.vue`/`.ts` sources, so there is no
  build step and edits hot-reload in the app. The package ships **ready to
  publish** at the same time.
- **Two token faces** — StyleX vars for components (`tokens.stylex.ts`) and CSS
  custom properties for plain CSS/HTML (`tokens.css`), kept in sync.
- **Accessible by default** — every component ships focus states, aria wiring,
  visible/hidden labels, and `prefers-reduced-motion` support.

## Package layout

```
src/
  index.ts                # public facade: all components + the Theme type
  theme.ts                # Theme ('light' | 'dark')
  styles/
    tokens.stylex.ts      # StyleX design tokens (colors, spacing, typography, …)
    themes.stylex.ts      # lightTheme / darkTheme (StyleX theme classes)
    tokens.css            # the same tokens as CSS custom properties (--ds-*)
    global.css            # reset + token variables (imports tokens.css)
    shared.stylex.ts      # shared styles: focusRing, reducedMotion, visuallyHidden
  ui/
    atoms/                # AppButton, Chip, IconButton, Loader, NativeSelect, NavLink,
                          # QuantityStepper, Rating, SearchField, SectionHeading,
                          # SkipLink, StatusAnnouncer, TextButton, TextField, ThemeToggle
    molecules/            # Breadcrumbs, Drawer, EmptyState, FilterGroup, FormSection, MainContent, PageSection, ResponsiveGrid, SearchBar, Tabs
tests/                    # per-component Vitest specs
vitest.config.ts
```

## Tokens

Tokens are single-sourced in `tokens.stylex.ts` and mirrored to CSS variables.
Use whichever face fits the consumer.

### StyleX (components in this kit and the app)

```ts
import * as stylex from '@stylexjs/stylex'
import {
  colors,
  spacing,
} from '@vue-application-architecture/design-system/styles/tokens.stylex'

const styles = stylex.create({
  root: { color: colors.accent, padding: spacing.md },
})
```

| Group        | Exports                                                                                                                                                                     |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `colors`     | background, surface, surfaceHover, textPrimary, textSecondary, textOnAccent, accent, accentHover, accentSoft, border, borderStrong, favorite, favoriteSoft, shadow, overlay |
| `spacing`    | xxs, xs, sm, md, lg, xl, xxl, xxxl                                                                                                                                          |
| `typography` | fontSans, fontDisplay, sizeXs…size4xl, leadingTight/Snug/Normal, weightRegular/Medium/Bold                                                                                  |
| `radii`      | sm, md, lg, circle                                                                                                                                                          |
| `shadows`    | card, cardHover                                                                                                                                                             |
| `motion`     | fast, base, slow, easeOut                                                                                                                                                   |
| `layout`     | headerHeight, pageMaxWidth, pageGutter                                                                                                                                      |

### CSS custom properties (plain CSS, HTML, third-party UIs)

Import once in your app:

```ts
import '@vue-application-architecture/design-system/styles/global.css' // reset + tokens
```

Tokens are available as `--ds-*` variables on `:root`:

```css
.panel {
  background: var(--ds-color-surface);
  color: var(--ds-color-text-primary);
  border-radius: var(--ds-radius-md);
  padding: var(--ds-spacing-md);
}
```

Variable names map 1:1 to the StyleX groups: `--ds-color-*`, `--ds-spacing-*`,
`--ds-text-*`/`--ds-font-*`/`--ds-leading-*`/`--ds-weight-*`, `--ds-radius-*`,
`--ds-shadow-*`, `--ds-motion-*`, `--ds-header-height`, `--ds-page-max-width`,
`--ds-page-gutter`.

## Theming

There are two theming mechanisms, both keyed to the `Theme` type:

1. **StyleX** — `darkTheme`/`lightTheme` from `themes.stylex.ts` are theme
   classes. Bind one to your app root (e.g. via the preferences store) and
   components re-skin automatically:

   ```ts
   import {
     darkTheme,
     lightTheme,
   } from '@vue-application-architecture/design-system/styles/themes.stylex'
   ```

2. **CSS** — for plain-CSS surfaces, set `data-ds-theme="dark"` (or leave it
   unset for light) on any ancestor; `tokens.css` re-defines the `--ds-color-*`
   variables under that selector and flips `color-scheme`.

Keep both mechanisms pointing at the same hex values so the two faces never
drift.

## Components

All components are **presentational**: data in as props, actions out as events.
No component imports a store or a router instance.

| Export                        | Description                                                                                                                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ui/atoms/AppButton`          | Button or `RouterLink`-based (`to`), variants `primary`/`secondary`, sizes `sm`/`md`/`lg`, `type`, `disabled`. Emits `click`.                                                                                                              |
| `ui/atoms/Chip`               | Toggleable filter chip: `label`/default slot, `selected` → `aria-pressed`. Emits `select`.                                                                                                                                                 |
| `ui/atoms/IconButton`         | Round icon button: required `label` (aria), `pressed`, `disabled`. Emits `click`.                                                                                                                                                          |
| `ui/atoms/Loader`             | Spinner with a `role="status"` group; `size` (px) and hidden `label`. Reduced-motion aware.                                                                                                                                                |
| `ui/atoms/NativeSelect`       | Styled native `<select>`: `modelValue`, `options: { value, label }[]`, `ariaLabel`, `disabled`, `flex`. Emits `update:modelValue`.                                                                                                         |
| `ui/atoms/NavLink`            | Router-aware nav anchor (`to`, `label`); `aria-current="page"` on the active route. Redirect-focused.                                                                                                                                      |
| `ui/atoms/Rating`             | Star + numeric rating; accepts `value`, announces `Rated X out of 5`.                                                                                                                                                                      |
| `ui/atoms/SearchField`        | `v-model:modelValue` search input, icon, conditional clear button, `placeholder`, `ariaLabel`.                                                                                                                                             |
| `ui/atoms/SectionHeading`     | Section heading rendered as `h1`/`h2`/`h3` (`level`, default `h2`), `size` `2xl`/`3xl`, `id`, `marginBlockEnd`.                                                                                                                            |
| `ui/atoms/SkipLink`           | Keyboard skip link (`targetId`, default `main-content`; `label`); moves focus to the target on activation.                                                                                                                                 |
| `ui/atoms/StatusAnnouncer`    | Visually hidden live region (`role="status"`) that announces `message` to screen readers.                                                                                                                                                  |
| `ui/atoms/TextButton`         | Quiet text-action button: underline + accent (or `tone="danger"`), `type`, `disabled`. Emits `click`.                                                                                                                                      |
| `ui/atoms/ThemeToggle`        | `theme: Theme` in, `toggle` out; announces the active theme in a live region.                                                                                                                                                              |
| `ui/molecules/Drawer`         | Right-side slide-over with scrim: `open`, `title`; emits `close` (X, Escape, scrim click); traps focus, restores focus, locks page scroll. `footer` optional.                                                                              |
| `ui/molecules/Breadcrumbs`    | Accessible breadcrumb trail (`nav` + `ol`): `items: readonly { label, to? }[]`; items with `to` render as `RouterLink`, trailing item without `to` is current (`aria-current="page"`), chevron separators, `label` for the nav aria-label. |
| `ui/molecules/EmptyState`     | Centered empty/error panel: `title`, `message`, `headingLevel`, action slot.                                                                                                                                                               |
| `ui/molecules/FilterGroup`    | `role="group"` wrapper for filter controls: required `label` (aria) + default slot; wraps/aligns children.                                                                                                                                 |
| `ui/molecules/FormSection`    | Fieldset group with a `legend` title and a card-style body: surface background, border, rounded corners.                                                                                                                                   |
| `ui/molecules/MainContent`    | App-scaffold `<main id="main-content">` with route loading state (`loading` → `Loader` + `RouterView`).                                                                                                                                    |
| `ui/molecules/PageSection`    | Page section shell: centered, max-width, `spacing` `xl`/`xxl`/`xxxl`, `layout` `block`/`column`, `label`/`labelledby`.                                                                                                                     |
| `ui/molecules/ResponsiveGrid` | Responsive CSS grid container (5→4→3→2 columns by breakpoint, optional 1-column collapse below 480px unless `minColumns="2"`); children become cells. `gap` `md`/`lg`, `minColumns` `1`/`2` (default `1`).                                 |
| `ui/molecules/SearchBar`      | Convenience wrapper: forwards `modelValue` to `SearchField` with default placeholder `Search…`.                                                                                                                                            |
| `ui/molecules/Tabs`           | Accessible tablist: `labels`, optional `v-model` active index; renders one `role="tabpanel"` via the default scoped slot (`{ index, label, active }`). Arrow/Home/End keys.                                                                |

`index.ts` re-exports everything; deep imports by path are also supported:

```ts
import {
  AppButton,
  EmptyState,
} from '@vue-application-architecture/design-system'
import { SearchBar } from '@vue-application-architecture/design-system/ui/molecules'
import type { Theme } from '@vue-application-architecture/design-system/theme'
```

Keep component defaults domain-neutral (e.g. placeholder `Search…`); product
copy is passed in by the consumer.

## Global styles

`@vue-application-architecture/design-system/styles/global.css` provides a minimal reset, the token
variables, and sensible defaults (font, text color, background) driven by
`--ds-*`.

Shared StyleX utilities live in `shared.stylex.ts`:
`focusRing.visible`/`focusRing.halo`, `reducedMotion.root`,
`visuallyHidden.root`, `buttonReset.root`, `linkReset.root`.

## Rules

- **Self-contained** — enforced by the `ds/self-contained` ESLint rule: the
  package may depend only on third-party packages. Never app code, never
  `@vue-application-architecture/types`.
- **Atomic design** — atoms are primitives (no store/router coupling); molecules
  compose atoms. Presentational only.
- **StyleX imports** in `stylex.create`/`defineVars` must be **relative paths**
  (within the package, or from the app via a relative hop), because StyleX's
  resolver is static.
- **New exports** must be added to the `exports` map (explicit keys first,
  wildcards last), to `index.ts`, and to the README table above.

## Commands

```bash
pnpm --filter @vue-application-architecture/design-system demo         # standalone Vite playground
pnpm --filter @vue-application-architecture/design-system demo:build   # production build of the demo
pnpm --filter @vue-application-architecture/design-system test        # vitest (21 spec files)
pnpm --filter @vue-application-architecture/design-system test:watch
pnpm --filter @vue-application-architecture/design-system typecheck
pnpm --filter @vue-application-architecture/design-system lint
pnpm --filter @vue-application-architecture/design-system format
```

`pnpm test`, `pnpm typecheck`, and `pnpm lint` at the repo root run every
package, including this one.

## Demo

`pnpm demo` (or `pnpm demo:ds` from the repo root) boots a self-contained
playground that renders the whole component catalog — atoms, molecules, both
theme faces (the StyleX `ThemeToggle` and the `data-ds-theme` CSS token layer),
and live `--ds-*` swatches. It depends only on this package: no `@vue-application-architecture/types`,
no app code.
