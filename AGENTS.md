# AGENTS.md

Guidance for **any** AI agent (or new human) working in this repository. It is
the single entry point: read this file, then open the doc it points to for the
area you are touching. Everything here is plain Markdown with no tool-specific
config, so the same file works for every agent.

| Doc                                                  | Read it when                                                                |
| ---------------------------------------------------- | --------------------------------------------------------------------------- |
| [`docs/architecture.md`](docs/architecture.md)       | adding/changing modules, facades, stores, routes, or reviewing dependencies |
| [`docs/styling.md`](docs/styling.md)                 | writing or debugging any StyleX styles                                      |
| [`docs/formatting.md`](docs/formatting.md)           | rendering money or dates                                                    |
| [`docs/testing.md`](docs/testing.md)                 | writing or running tests                                                    |
| [`docs/design-system.md`](docs/design-system.md)     | touching `packages/design-system` or deciding kit vs. app                   |
| [`docs/specs/bookstore.md`](docs/specs/bookstore.md) | changing cart, checkout, pricing, or order flow                             |

## What this repo is

A pnpm workspace holding a Vue 3 **modular-monolith** app and the packages it
is built from. It is a reference architecture: the value is in the structure
(module boundaries, facades, a self-contained design system), not in the
product — Shelf is a small bookshop demo with no backend.

```
apps/frontend          the deployable app (Vue 3, TS, Vite, Pinia, vue-router, StyleX)
packages/design-system @vue-application-architecture/design-system — generic, domain-free UI kit + tokens
packages/types         @vue-application-architecture/types — shared domain types (Book, BookCategory)
docs/                  this guidance and the product specs
```

Both packages are **source-first**: `exports` point at `.vue`/`.ts` sources, so
there is no build step and edits hot-reload inside the app. The root
`package.json` holds shared tooling (vite, typescript, eslint, prettier,
vue-tsc, `@stylexjs/*`); runtime dependencies live in each package.

## Commands

```bash
nvm use                # Node is pinned in .nvmrc (20.19.5)
pnpm install
pnpm dev               # vite dev server (apps/frontend)
pnpm build             # production build -> apps/frontend/dist/
pnpm build:deploy      # ordered typecheck (types -> kit -> app) + one bundle -> dist/
pnpm test              # vitest once, every package
pnpm test:watch        # vitest watch
pnpm lint              # eslint --fix, every package
pnpm typecheck         # vue-tsc, every package
pnpm format            # prettier across the repo
pnpm format:check      # prettier --check, what CI runs
```

Package-scoped: `pnpm --filter frontend ...`,
`pnpm --filter @vue-application-architecture/design-system ...`.

**Definition of done:** run `pnpm lint`, `pnpm typecheck`, `pnpm test` (plus
`pnpm build` when styles or bundling changed) and leave them green. Lint runs
with `--fix`, so re-read files it rewrote. CI (`.github/workflows/ci.yml`) runs
`format:check` on top of that list, so run `pnpm format` before pushing.

## The rules that matter

1. **Feature modules are self-contained behind facades.** Each module under
   `apps/frontend/src/modules/*` exposes a public `index.ts`. Sibling modules
   import **only** that facade — never a module's internals — and never
   `src/app/`. `app/` is the composition root and may import anything.
2. **`core` is the shared module.** It owns `NotFoundView`, the preferences
   store, and the shared formatters. Features reach it through its facade; it
   may not import features or `app/`.
3. **The design system is domain-free.** Files in
   `packages/design-system/src` may depend only on `@stylexjs/stylex`, `vue`,
   `lucide-vue-next`, and `vue-router` — never app code, never
   `@vue-application-architecture/types`. Product-domain presentation (books,
   cart, checkout) belongs in app modules.
4. **StyleX imports inside `stylex.create`/`defineVars` must be relative.**
   The StyleX resolver is static and cannot resolve aliases or package
   specifiers. Components, types, and CSS may use package specifiers.
5. **Money is integer cents; dates go through the formatters.** Never
   string-concatenate money, call `Intl.*` inline in a component, or use
   `toLocaleDateString` directly.
6. **No comments in code** unless asked. Formatting is Prettier
   (`semi: false`, `singleQuote: true`, `trailingComma: 'all'`).
7. **Config files are TypeScript.** `vite.config.ts`, `eslint.config.ts`,
   `vitest.config.ts` — never add `.js`/`.cjs`/`.mjs` (ESLint loads its config
   through `jiti`).

Rules 1–3 are enforced by two custom ESLint rules, so a boundary mistake fails
`pnpm lint`:

- `modular/boundaries` in `apps/frontend/eslint.config.ts` (app modules)
- `ds/self-contained` in `packages/design-system/eslint.config.ts`

## Gotchas

- `.npmrc` pins the npm registry; the environment default is a private
  endpoint that returns 401. Never change it — reinstalls go through npmjs.
- New feature module? Add it to `FEATURE_MODULES` in
  `apps/frontend/eslint.config.ts`, or the boundary rule will not check it.
- New design-system component? Add it to `src/ui/atoms/index.ts` or
  `src/ui/molecules/index.ts` plus `tests/exports.spec.ts` coverage — the root
  `src/index.ts` re-exports the two barrels, so a missing barrel entry is the
  only way a component goes missing from the kit.
- vue-router 5: `router.isReady()` only resolves after the app is mounted, and
  lazy route components load asynchronously. In tests, mount first, then
  `await router.push(...)`, then assert.
- Tests: Vitest + @vue/test-utils + happy-dom, globals on, setup in
  `apps/frontend/tests/setup.ts` (matchMedia mock, localStorage cleared before
  each test). App specs must live in `apps/frontend/tests/**/*.spec.ts` or the
  suite will not pick them up.
- Mock catalog data is deterministic: `faker.seed(2026)`, `BOOK_COUNT = 100`,
  index 0 is the featured book, and every book carries `priceCents`
  (`1200`–`4200`) and a `listPriceCents` compare-at price.
- `lucide-vue-next` is pinned to `^0.577.0`; icons are named imports.
- The design system keeps its defaults domain-neutral (the search placeholder
  is `Search…`); the app passes its own copy.
- `App.vue` binds the active theme class from the preferences store **and** sets
  `data-ds-theme` on `<html>`, which is what activates the dark `--ds-*` custom
  properties in `styles/tokens.css`; themes live in
  `packages/design-system/src/styles/themes.stylex.ts`.

## Keeping this guidance tool-neutral

All knowledge lives in this file and `docs/`. Every editor/agent tool gets the
same content through a one-line pointer, so nothing needs duplicating:

| Tool                                                                | Pointer                                               |
| ------------------------------------------------------------------- | ----------------------------------------------------- |
| any tool that reads `AGENTS.md` (opencode, Codex, Cursor, Cline, …) | `AGENTS.md` (this file)                               |
| Claude Code                                                         | `CLAUDE.md` → `@AGENTS.md`                            |
| Gemini CLI                                                          | `GEMINI.md` → `@AGENTS.md`                            |
| Cursor                                                              | `.cursor/rules/shelf-project.mdc`                     |
| GitHub Copilot                                                      | `.github/instructions/agent-guidance.instructions.md` |
| opencode                                                            | `opencode.json` → `instructions: ["AGENTS.md"]`       |

When you learn something non-obvious, put it here or in the matching
`docs/*.md` file — never in a tool-specific pointer. A new tool only needs a
pointer, not a new copy of the rules.
