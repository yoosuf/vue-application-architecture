# vue-application-architecture

An opinionated Vue.js reference architecture demonstrating scalable application structure, clean engineering patterns, and production-ready best practices.

```
.
├── apps/frontend           # the deployable Vue 3 app
├── packages/design-system  # @vue-application-architecture/design-system — presentational UI + tokens
├── packages/types          # @vue-application-architecture/types — shared domain types
├── pnpm-workspace.yaml
└── .npmrc                  # registry pinned to npmjs (environment has a private registry)
```

## Workspace packages

| Package | Purpose |
| --- | --- |
| `frontend` | Vue 3 + TypeScript + Vite + Pinia + vue-router + StyleX app |
| `@vue-application-architecture/design-system` | Presentational atoms/molecules, StyleX + CSS design tokens, light/dark themes |
| `@vue-application-architecture/types` | Shared domain types (`Book`, `BookCategory`) |

The design system is **linked** to the app with the `workspace:*` protocol in
`apps/frontend/package.json`. It ships its sources (`.vue`/`.ts`) through an
`exports` map and is consumed directly — no build step required — so edits in
`packages/design-system` hot-reload in the app's dev server.

## Commands (from the root)

```bash
pnpm install
pnpm dev           # vite dev server (apps/frontend)
pnpm build         # production build -> apps/frontend/dist/
pnpm test          # vitest for every workspace package (app + design system)
pnpm lint          # eslint --fix for every workspace package
pnpm typecheck     # vue-tsc for every workspace package
pnpm format        # prettier across sources
```

## Boundaries

- The app is a **modular monolith**: feature modules import the design system
  and sibling modules only through their public `index.ts` facades.
- `@vue-application-architecture/design-system` must be **self-contained**: it depends only on
  third-party packages (Stylex, lucide-vue-next, vue-router) and never on app
  code. Enforced by its `ds/self-contained` ESLint rule.
- App-side module boundaries are enforced by `modular/boundaries` in
  `apps/frontend/eslint.config.ts`.

## StyleX in a monorepo

`@stylexjs/unplugin` compiles StyleX in `.ts(x)` files and a companion plugin
(see `apps/frontend/config/stylexVuePlugin.ts`) compiles it in `.vue` files.
StyleX's resolver visits StyleX-using imports statically, so:

- components and types cross the package boundary by **package specifier**
  (`@vue-application-architecture/design-system/ui/atoms/AppButton.vue`), and
- token/theme files referenced inside `stylex.create` cross it by **relative
  path** into `packages/design-system/src` (e.g.
  `../../../../../packages/design-system/src/styles/tokens.stylex`).

Both mechanisms compile into the app's single stylesheet; CSS output is
identical whether the stylized code lives in the app or the design system.

See `apps/frontend/README.md` for the full app walkthrough.