---
name: stylex
description: StyleX + Vue styling in this monorepo. Use when writing or debugging stylex.create, stylex.attrs, stylex.defineVars, token/theme imports, CSS output, or the stylexVuePlugin + @stylexjs/unplugin Vite setup in apps/frontend.
---

# StyleX in Shelf

`@stylexjs/unplugin` compiles StyleX in **`.ts(x)` files only**. A companion
plugin (`apps/frontend/config/stylexVuePlugin.ts`, `enforce: 'post'`) compiles
StyleX inside compiled `.vue` script modules and merges the generated rules
into the unplugin's shared aggregation store, so the app emits **one**
stylesheet (`virtual:stylex.css` in dev, a single CSS file in build).

Vite plugin order in `apps/frontend/vite.config.ts` **must stay**:
`[vue(), stylex.vite(), stylexVue()]`.

## Static resolver — the golden rule

StyleX's Babel resolver visits imports statically and **cannot resolve
aliases (`@/`) or package specifiers** for modules referenced inside
`stylex.create`/`defineVars`. Such imports must use **relative paths**:

- Within `packages/design-system/src`: `../../styles/tokens.stylex`.
- From app feature files into the design system:
  `../../../../../packages/design-system/src/styles/tokens.stylex`.

Imports that are NOT used inside stylex calls — components, domain types,
`global.css` — may use package specifiers
(`@vue-application-architecture/design-system/ui/molecules/BookCard.vue`).

## Where things live

- Tokens: `packages/design-system/src/styles/tokens.stylex.ts` (colors,
  spacing, typography, radii, shadows, motion, layout).
- Themes: `themes.stylex.ts` (`lightTheme`, `darkTheme`) bound to a theme class
  in `App.vue` from the preferences store.
- Shared utility styles: `shared.stylex.ts` (`focusRing`, `reducedMotion`,
  resets). Apply via `stylex.props`/spread rather than duplicating.

## Debugging

- Missing/duplicated styles: check whether the token import is relative, and
  that plugin order survived any edit to `vite.config.ts`.
- `vite.config.ts` can be imported with `./config/stylexVuePlugin.ts` (Vite 8
  native loader); keep the `.ts` extension.
- `stylex.attrs`/`stylex.props` returns bindable objects; do not pass styles
  arrays of raw objects to `:style`.
- Verify with `pnpm --filter frontend build` — the CSS bundle should stay one
  file; `pnpm --filter frontend dev` serves `/virtual:stylex.css`.
- Keep both boundary lint rules green after touches to stylex imports
  (`modular/boundaries`, `ds/self-contained`).