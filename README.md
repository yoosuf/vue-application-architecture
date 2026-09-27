# vue-application-architecture

An opinionated Vue.js reference architecture demonstrating scalable application structure, clean engineering patterns, and production-ready best practices.

```
.
├── apps/frontend           # the deployable Vue 3 app
├── packages/design-system  # @vue-application-architecture/design-system — presentational UI + tokens
├── packages/types          # @vue-application-architecture/types — shared domain types
├── AGENTS.md               # agent guidance (any AI tool) + index of docs/
├── docs/                   # architecture, styling, formatting, testing, product specs
├── pnpm-workspace.yaml
├── vercel.json             # build command, output dir (apps/frontend/dist), SPA rewrites
├── .github/workflows/      # CI (lint, typecheck, test, build) + Vercel deploy
└── .npmrc                  # registry pinned to npmjs (environment has a private registry)
```

## Workspace packages

| Package                                       | Purpose                                                                       |
| --------------------------------------------- | ----------------------------------------------------------------------------- |
| `frontend`                                    | Vue 3 + TypeScript + Vite + Pinia + vue-router + StyleX app                   |
| `@vue-application-architecture/design-system` | Presentational atoms/molecules, StyleX + CSS design tokens, light/dark themes |
| `@vue-application-architecture/types`         | Shared domain types (`Book`, `BookCategory`)                                  |

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
pnpm format        # prettier across the repo
pnpm format:check  # prettier --check, what CI runs
```

Every push and pull request to `main` runs the full gate list in
[`.github/workflows/ci.yml`](.github/workflows/ci.yml); a green run on `main`
publishes the app with [`vercel.json`](vercel.json)
(see [`docs/testing.md`](docs/testing.md#ci-and-publishing)).

## Guidance for AI agents

[`AGENTS.md`](AGENTS.md) is the single entry point for **any** AI tool (or new
human) and is plain Markdown with no tool-specific config. It states the rules,
the commands, and links to the deep docs:

| Doc                                                  | Covers                                                             |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| [`docs/architecture.md`](docs/architecture.md)       | modules, facades, stores, routes, how the boundary lint rule works |
| [`docs/styling.md`](docs/styling.md)                 | StyleX + Vite + Vue, relative-import rule, debugging               |
| [`docs/formatting.md`](docs/formatting.md)           | currency and date formatters                                       |
| [`docs/testing.md`](docs/testing.md)                 | Vitest setup, conventions, where tests live                        |
| [`docs/design-system.md`](docs/design-system.md)     | exports map, kit vs. app, rules for new components                 |
| [`docs/specs/bookstore.md`](docs/specs/bookstore.md) | cart/checkout product spec and conventions                         |

Tools that look for their own file read a one-line pointer: `CLAUDE.md`,
`GEMINI.md`, `.cursor/rules/shelf-project.mdc`,
`.github/instructions/agent-guidance.instructions.md`, and `opencode.json`.

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

The two packages document themselves in place:
`packages/design-system/README.md` (tokens, theming, component reference) and
`packages/types/README.md` (the domain types). For the app itself, read
[`docs/architecture.md`](docs/architecture.md).
