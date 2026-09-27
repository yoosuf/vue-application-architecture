# Styling (StyleX)

StyleX is compile-time CSS-in-JS: styles are authored in TypeScript objects and
emitted as a single stylesheet. Read `../AGENTS.md` first.

## How it is wired

- `@stylexjs/unplugin` compiles StyleX in **`.ts(x)` files only**.
- A companion plugin, `apps/frontend/config/stylexVuePlugin.ts`
  (`enforce: 'post'`), compiles StyleX inside compiled `.vue` script modules
  and merges the generated rules into the unplugin's shared aggregation store.
  That is why the app emits **one** stylesheet: `virtual:stylex.css` in dev, a
  single CSS file in the build.
- The Vite plugin order in `apps/frontend/vite.config.ts` **must stay**
  `[vue(), stylex.vite(), stylexVue()]`.

## The golden rule: the resolver is static

StyleX's Babel resolver walks imports statically. It cannot resolve the `@/`
alias and cannot resolve package specifiers, so **any module referenced inside
`stylex.create` / `defineVars` must be imported by relative path**:

```ts
// inside packages/design-system/src
import { spacing } from '../../styles/tokens.stylex'

// inside an app feature file — note the long relative hop
import {
  colors,
  spacing,
} from '../../../../../../packages/design-system/src/styles/tokens.stylex'
```

The hop depth depends on where the file sits (`src/app/App.vue` uses 4 levels,
`src/app/components/` uses 5, `src/modules/x/components/` uses 6). This is ugly
and deliberate; do not "fix" it with an alias.

Imports that are _not_ used inside stylex calls — components, domain types,
`global.css` — may use package specifiers:

```ts
import AppButton from '@vue-application-architecture/design-system/ui/atoms/AppButton.vue'
import type { Book } from '@vue-application-architecture/types/book'
```

Those are resolved by Vite/TypeScript, not by the StyleX compiler, so they are
safe.

## Where things live

| File                                                 | Contents                                                                                              |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `packages/design-system/src/styles/tokens.stylex.ts` | `defineVars` token objects: `colors`, `spacing`, `typography`, `radii`, `shadows`, `motion`, `layout` |
| `packages/design-system/src/styles/themes.stylex.ts` | `lightTheme`, `darkTheme` — `createTheme` classes over `colors`                                       |
| `packages/design-system/src/styles/shared.stylex.ts` | reusable style objects: `visuallyHidden`, `buttonReset`, `linkReset`, `focusRing`, `reducedMotion`    |
| `packages/design-system/src/styles/tokens.css`       | the same tokens as CSS custom properties, for plain CSS/HTML                                          |
| `packages/design-system/src/styles/global.css`       | resets/base, imported once in `main.ts`                                                               |

Tokens have **two faces** — the StyleX vars used by components and the CSS
custom properties used by plain CSS. When you write a token, update
`tokens.stylex.ts`, `themes.stylex.ts`, and `tokens.css` together.

Themes are applied by class: `App.vue` binds the active theme class from the
preferences store, so `var(--…)` tokens switch at runtime between light and
dark.

## Using styles in a component

```vue
<script setup lang="ts">
import * as stylex from '@stylexjs/stylex'
import { spacing } from '../../../../../../packages/design-system/src/styles/tokens.stylex'

const styles = stylex.create({
  root: { paddingInline: spacing.lg },
})
</script>

<template>
  <div v-bind="stylex.attrs(styles.root)">…</div>
</template>
```

- `stylex.attrs(...)` returns bindable objects — spread them with
  `v-bind`, never pass raw style objects to `:style`.
- Multiple styles compose: `stylex.attrs(styles.a, styles.b)`.
- Conditional classes: `stylex.attrs(styles.root, active && styles.active)`.
- Reuse `focusRing` and `reducedMotion` from `shared.stylex.ts` instead of
  re-implementing focus outlines or reduced-motion guards.

## Diagnosing StyleX problems

| Symptom                                      | Cause                                                                                          | Fix                                                               |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| "Cannot find module" only at build, dev fine | an import _inside_ `stylex.create`/`defineVars` uses `@/` or a package specifier               | rewrite it as a relative path                                     |
| duplicated or missing rules                  | plugin order changed, or `stylexVuePlugin` lost `enforce: 'post'`                              | restore `[vue(), stylex.vite(), stylexVue()]` and the post plugin |
| theme does not switch, or a `var(--…)` leaks | a token was imported through a non-relative path, or the theme class is not bound in `App.vue` | fix the import; check the class binding                           |
| build emits more than one CSS file           | the aggregation store stopped merging (`.vue` files not compiled)                              | confirm `stylexVuePlugin` is registered after `stylex.vite()`     |

Verification: `pnpm --filter frontend build` should still produce a single CSS
bundle; `pnpm --filter frontend dev` serves `/virtual:stylex.css` for live
inspection. After changing StyleX imports, keep both lint rules green
(`modular/boundaries`, `ds/self-contained`) — cross-package StyleX imports are
the usual culprit.

`vite.config.ts` imports the plugin as `./config/stylexVuePlugin.ts`; keep the
`.ts` extension so Vite 8's native config loader can resolve it.
