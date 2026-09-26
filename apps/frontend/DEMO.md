# Demo — the Shelf frontend app

This branch is a rollout showcasing **`frontend`** — the deployable Vue 3
application. It already consumes both workspace packages (`@vue-application-architecture/design-system`
for the UI kit and `@vue-application-architecture/types` for the domain model), so this is the complete
product experience.

## Run it

```bash
pnpm install
pnpm dev               # or: pnpm demo:app from the repo root
```

Open the printed URL (default `http://localhost:5173`).

## What to try

| Area | What it demonstrates |
| --- | --- |
| **Home / Explore** | Catalog grid rendered from deterministic mock data (faker seed `2026`, 24 books, one featured banner). |
| **Search** | `SearchField`/`SearchBar` (design-system molecules) filtering `filteredBooks` in the `catalog` store. |
| **Category filters** | Chip row filtering by `BookCategory` from `@vue-application-architecture/types`. |
| **Book details** | `/books/:id` — lazy-loaded detail page with metadata and an auto-computed **related books** row. |
| **Favorites** | Heart toggles persisted to `localStorage` (`shelf:favorites`), collected on `/favorites`. |
| **Theme switching** | `ThemeToggle` atom + preferences store; light/dark StyleX themes applied at the app root and prefs persisted (`shelf:theme`). |
| **Route transitions** | Loading spinner (`Loader` atom) shown while lazy chunks navigate. |
| **404 handling** | Unknown URLs render a `NotFoundView`. |

## Architecture highlights

- **Modular monolith** — `catalog`, `favorites`, `theme` feature modules talk to
  each other and to `@vue-application-architecture/design-system` only through public facades
  (enforced by the `modular/boundaries` ESLint rule).
- **Source-first design system** — the app imports `.vue`/`.ts` sources through
  the package `exports` map, so UI-kit edits hot-reload with no build step.
- **Single stylesheet** — StyleX in `.ts` and `.vue` (app + design system) is
  compiled by `@stylexjs/unplugin` + `config/stylexVuePlugin.ts` into one CSS
  output.
- **Accessibility** — skip link, live regions for navigation and theme status,
  visible focus rings, `prefers-reduced-motion` support.

## Tests

```bash
pnpm test              # 43 app specs: stores, components, routing
```