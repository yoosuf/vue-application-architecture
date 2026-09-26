# Changelog

All notable changes to `@vue-application-architecture/design-system` are documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/), and the package
adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Design tokens exposed as CSS custom properties
  (`styles/tokens.css`, `--ds-*`) with a `data-ds-theme="dark"` theme switch,
  in sync with the StyleX token/theme layer.
- `global.css` now imports the token variables and applies token-driven defaults
  (font, text color, background) on `:root`/`body`.
- The package now owns its component tests: per-component Vitest suites under
  `tests/` (mounting components through the compiled StyleX pipeline) with a
  package-local `vitest.config.ts`.
- Standard package metadata: `description`, `license`, `keywords`, `engines`,
  `files`, `sideEffects`, plus `test`/`test:watch` scripts.
- A full standards document in `README.md` (tokens, theming, component
  reference, rules, commands).

### Changed

- Public surface now includes `./styles/tokens.css` in addition to the StyleX
  token files.

## [0.1.0] - 2026-09-25

### Added

- Initial design-system surface: `Theme` type, StyleX tokens (`colors`,
  `spacing`, `typography`, `radii`, `shadows`, `motion`, `layout`), light/dark
  themes, shared styles, and the atoms/molecules below.
- Atoms: `AppButton`, `IconButton`, `Loader`, `Rating`, `SearchField`,
  `ThemeToggle`.
- Molecules: `EmptyState`, `SearchBar`.
- Source-first `exports` map consumed directly by the app.
