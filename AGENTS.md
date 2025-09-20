# Repository Guidelines

## Project Structure & Module Organization
Source lives in `src/`. Pages and routes sit in `src/pages`, layouts in `src/layouts`, and shared UI in `src/components` (including the Resume/ subtree). Content collections are stored under `src/content/` with `blog/` for long-form writing and `now/` for monthly updates. Localization resources reside in `src/i18n/`. Global styling is defined in `src/styles/` and applied through Tailwind v4 utilities. Static assets belong in `public/`. Builds emit to `dist/`; do not edit files there manually.

## Build, Test, and Development Commands
Run `pnpm install` once per environment. Use `pnpm dev` to launch Astro at `localhost:4321` with hot reload. Execute `pnpm build` before any deployment to verify production output. `pnpm preview` serves the built site locally for final QA. `pnpm typecheck` invokes `astro check` and must pass prior to commits. Format everything with `pnpm prettier`, which also sorts Tailwind classes.

## Coding Style & Naming Conventions
Follow Prettier defaults (2-space indent, trailing commas where valid) plus `prettier-plugin-astro` and Tailwind class sorting. Prefer existing components (Link, Button, IconLink, etc.) and rely on Tailwind utilities instead of inline CSS. All imports must use configured aliases such as `@components/`, `@layouts/`, `@utils/`, and `@styles/`; avoid relative paths. Keep filenames kebab-case for markdown content and PascalCase for Astro/TS components. When adding tags, store them in kebab-case and call `formatTag()` for display.

## Testing Guidelines
There is no automated unit test suite; type safety and accessibility checks are enforced through Astro. Always run `pnpm typecheck` and `pnpm build` before opening a PR. For UI work, use `pnpm preview` to validate responsive states and internationalized routes (`/so-far` and `/so-far/zh`). Blog posts should be linted via Prettier and verified inside the Content Collections pipeline.

## Commit & Pull Request Guidelines
Commits follow concise, present-tense statements (e.g., "Add PostHog analytics tracking", "Fix quotation marks in Chinese translation"). Group related changes together and ensure formatting/typecheck scripts have been run. Pull requests should outline intent, list key changes, and reference issues when applicable. Include screenshots or clip previews for any visual updates, plus notes confirming `pnpm build` and `pnpm typecheck` were executed.

## Content & Localization Notes
Maintain the letter-inspired tone used across pages and reuse existing typography patterns. Add new translations to `src/i18n/translations/*.json` and confirm language toggles via the provided utilities. For metadata updates, keep structured data in sync and use Iconify for any new icons.
