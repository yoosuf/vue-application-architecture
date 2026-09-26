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
    atoms/                # AppButton, IconButton, Loader, Rating,
                          # SearchField, ThemeToggle
    molecules/            # EmptyState, SearchBar
tests/                    # per-component Vitest specs (31 tests)
vitest.config.ts
```

## Tokens

Tokens are single-sourced in `tokens.stylex.ts` and mirrored to CSS variables.
Use whichever face fits the consumer.

### StyleX (components in this kit and the app)

```ts
import * as stylex from '@stylexjs/stylex'
import { colors, spacing } from '@vue-application-architecture/design-system/styles/tokens.stylex'

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

| Export                    | Description                                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `ui/atoms/AppButton`      | Button or `RouterLink`-based (`to`), variants `primary`/`secondary`, sizes `sm`/`md`/`lg`, `type`, `disabled`. Emits `click`. |
| `ui/atoms/IconButton`     | Round icon button: required `label` (aria), `pressed`, `disabled`. Emits `click`.                                             |
| `ui/atoms/Loader`         | Spinner with a `role="status"` group; `size` (px) and hidden `label`. Reduced-motion aware.                                   |
| `ui/atoms/Rating`         | Star + numeric rating; accepts `value`, announces `Rated X out of 5`.                                                         |
| `ui/atoms/SearchField`    | `v-model:modelValue` search input, icon, conditional clear button, `placeholder`, `ariaLabel`.                                |
| `ui/atoms/ThemeToggle`    | `theme: Theme` in, `toggle` out; announces the active theme in a live region.                                                 |
| `ui/molecules/EmptyState` | Centered empty/error panel: `title`, `message`, `headingLevel`, action slot.                                                  |
| `ui/molecules/SearchBar`  | Convenience wrapper: forwards `modelValue` to `SearchField` with default placeholder `Search…`.                               |

`index.ts` re-exports everything; deep imports by path are also supported:

```ts
import { AppButton, EmptyState } from '@vue-application-architecture/design-system'
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
pnpm --filter @vue-application-architecture/design-system test        # vitest (31 specs)
pnpm --filter @vue-application-architecture/design-system test:watch
pnpm --filter @vue-application-architecture/design-system typecheck
pnpm --filter @vue-application-architecture/design-system lint
pnpm --filter @vue-application-architecture/design-system format
```

`pnpm test`, `pnpm typecheck`, and `pnpm lint` at the repo root run every
package, including this one.
