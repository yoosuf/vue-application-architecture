# Testing

Vitest + @vue/test-utils + happy-dom, in both the app and the design system.
Read `../AGENTS.md` first.

## Running

```bash
pnpm test                                # once, every package
pnpm test:watch
pnpm --filter frontend test              # app only
pnpm --filter frontend test tests/stores/cart.store.spec.ts
pnpm --filter @vue-application-architecture/design-system test
```

The `types` package has no runner (it is type-only).

## Setup

|                 | app                                             | design system                             |
| --------------- | ----------------------------------------------- | ----------------------------------------- |
| config          | `apps/frontend/vite.config.ts` (`test` block)   | `packages/design-system/vitest.config.ts` |
| include         | `tests/**/*.spec.ts`                            | `tests/**/*.spec.ts`                      |
| environment     | `happy-dom`                                     | `happy-dom`                               |
| globals         | on (no imports of `describe`/`it`/`expect`)     | on                                        |
| setup           | `apps/frontend/tests/setup.ts`                  | none                                      |
| StyleX in tests | compiled by the same plugin pipeline as the app | same                                      |

`apps/frontend/tests/setup.ts` mocks `window.matchMedia` (the preferences
store reads `prefers-color-scheme`) and clears `localStorage` before each test.

Two hard rules:

- **App specs must live in `apps/frontend/tests/**/*.spec.ts`.** The `include`
  glob does not cover `src/`, so a spec next to the component never runs.
- Specs may import internals through the `@` alias
  (`@/modules/cart/stores/cart.store`) — the boundary lint rule does not apply
  outside `src/`. Production code must still use facades.

## Conventions

- Store specs: `createPinia()` + `setActivePinia(pinia)` per test.
- Component specs: `mount(Component, { global: { plugins: [pinia] } })`, stub
  `RouterLink` with `RouterLinkStub` from `@vue/test-utils`.
- Money assertions go through `formatCurrency` (see `formatting.md`), never
  `'$' + (cents / 100).toFixed(2)`.
- Date assertions: pass `timeZone: 'UTC'` (or use a locally constructed
  `new Date(y, m, d, 12)`) so they do not depend on the machine's timezone.
- The mock catalog is deterministic (`faker.seed(2026)`, 100 books, index 0
  featured), so component specs can assert on real book data.

## Router tests (vue-router 5)

`router.isReady()` only resolves **after** the app is mounted, and lazy route
components load asynchronously. The working order in `tests/router.spec.ts`:

1. `createRouter` / create the app, `mount(...)` it,
2. `await router.push({ name: 'cart' })`,
3. `await router.isReady()` (or `await flushPromises()`),
4. then assert on the rendered output.

## Where the tests are

| Area                                                                                                                                                                 | File                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Cart / checkout / catalog / customer / favorites / preferences stores                                                                                                | `apps/frontend/tests/stores/*.spec.ts`                                                             |
| Components (`BookCard`, `OrderSummary`, `CartDrawer`, `AddToCartButton`, `BookGallery`, `CategoryFilter`, `FavoriteButton`)                                          | `apps/frontend/tests/components/*.spec.ts`                                                         |
| Formatters                                                                                                                                                           | `apps/frontend/tests/utils/format.spec.ts`                                                         |
| End-to-end-ish flows (cart → checkout → confirmation, header cart drawer, magic-link sign-in, account sections, addresses, favorites, deep links and auth redirects) | `apps/frontend/tests/router.spec.ts`                                                               |
| Every design-system component, plus barrel/root export parity                                                                                                        | `packages/design-system/tests/<Component>.spec.ts`, `packages/design-system/tests/exports.spec.ts` |

When you add a design-system component, add a matching spec there and re-export
it from `src/ui/atoms/index.ts` or `src/ui/molecules/index.ts` — `tests/exports.spec.ts`
fails if a component file has no barrel entry. The app gates will not exercise a
component on their own. When you add a store or a user-visible flow, add a spec
in the app.

## Definition of done

A change is done when `pnpm lint`, `pnpm typecheck`, and `pnpm test` are green
(add `pnpm build` when styles or bundling changed). Lint runs with `--fix`, so
re-read any file it rewrote before committing. CI additionally runs
`pnpm format:check`, so run `pnpm format` before pushing.

## CI and publishing

| Workflow                       | Trigger                                             | What it does                                                                                                                                         |
| ------------------------------ | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`     | every push and PR to `main`                         | `pnpm install --frozen-lockfile`, then `format:check`, `lint`, `typecheck`, `test`, `build`; uploads `apps/frontend/dist` as the `web-dist` artifact |
| `.github/workflows/deploy.yml` | green `CI` on `main`, or manual `workflow_dispatch` | rebuilds and publishes the app to Vercel                                                                                                             |

Both use `pnpm/action-setup` (version from the root `packageManager` field),
Node from `.nvmrc`, and a pnpm-store cache, so a run needs no configuration.

The deploy step needs three repository secrets — `VERCEL_TOKEN`,
`VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (Settings → Secrets and variables →
Actions). Without them the publish step is skipped with a note instead of
failing the run. Get them from a machine with the Vercel CLI:

```bash
npm i -g vercel
vercel link                       # or: vercel link --yes
vercel pull
cat .vercel/project.json          # {"orgId": "...", "projectId": "..."}
```

The token is `Account Settings → Tokens`; store it, the two ids, and nothing
else:

```bash
gh secret set VERCEL_TOKEN --repo yoosuf/vue-application-architecture
gh secret set VERCEL_ORG_ID --repo yoosuf/vue-application-architecture
gh secret set VERCEL_PROJECT_ID --repo yoosuf/vue-application-architecture
```

Deployment itself is configured by the root `vercel.json`, not by the workflow:
`buildCommand` `pnpm build:deploy` and `outputDirectory` `dist`, plus a
catch-all rewrite to `index.html` because the router uses `createWebHistory()`
and every route is lazy. `pnpm build:deploy` is `pnpm build` followed by a
copy of `apps/frontend/dist` to a root `dist/`, so the deployment works both
with this file and with a project left on Vercel's default output directory.
Vercel's own Git integration reads the same file — use either that or the
deploy workflow, not both. The required dashboard settings are listed in
[`architecture.md`](architecture.md#build-ci-and-deployment).
