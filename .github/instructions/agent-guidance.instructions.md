---
description: Shelf monorepo agent guidance — apply to every file
applyTo: '**'
---

# Shelf monorepo guidance

The authoritative, vendor-neutral guidance for this repository is
[`AGENTS.md`](../../AGENTS.md) at the repo root — read it before editing
anything. It lists the commands, the seven rules that matter (module
boundaries, domain-free design system, relative StyleX imports, integer-cent
money, no code comments, TypeScript config files), and an index of the
deep-dive docs in `docs/`:

- `docs/architecture.md` — modules, facades, stores, routes, boundary rules
- `docs/styling.md` — StyleX + Vite + Vue rules and debugging
- `docs/formatting.md` — currency and date formatters
- `docs/testing.md` — Vitest setup and conventions
- `docs/design-system.md` — exports map, kit vs. app
- `docs/specs/bookstore.md` — cart/checkout product spec and conventions

Definition of done: `pnpm lint`, `pnpm typecheck`, `pnpm test` (plus
`pnpm build` when styles or bundling changed) all green.
