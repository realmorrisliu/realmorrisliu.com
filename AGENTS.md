# Repository Guidelines

## Project Structure & Module Organization
This is an Astro + TypeScript site. Keep feature code under `src/`:
- `src/pages/`: route entrypoints (`.astro` and API handlers).
- `src/components/`: reusable UI components (mostly `PascalCase.astro`).
- `src/layouts/`, `src/utils/`, `src/i18n/`: layout, shared logic, and translations.
- `src/content/`: content collections (`blog`, `now`, `moments`) validated by `src/content/config.ts`.
- `src/styles/`: global and prose styles.
- `public/`: static files served as-is.
- `scripts/`: repository scripts such as photo ingestion.

## Build, Test, and Development Commands
Use `pnpm` for all tasks:
- `pnpm dev`: start local dev server (`http://localhost:4321`).
- `pnpm build`: production build to `dist/`.
- `pnpm preview`: serve the built output locally.
- `pnpm lint` / `pnpm lint:fix`: run ESLint (or auto-fix).
- `pnpm format:check` / `pnpm format`: check or apply Prettier formatting.
- `pnpm typecheck`: run `astro check`.
- `pnpm check`: full quality gate (`lint + format:check + typecheck`).
- `pnpm check:fix`: fix formatting/lint issues, then re-run checks.
- `pnpm new:photo`: add a new photo content entry via script.

## Coding Style & Naming Conventions
Follow existing Prettier settings: 2 spaces, semicolons, double quotes, trailing commas (`es5`), 100-char line width, LF endings.  
Use TypeScript and Astro idioms consistently. Prefer:
- `PascalCase` for component files (`Button.astro`).
- `camelCase` for utility modules (`dateUtils.ts`).
- Kebab-case for content filenames (for example blog post slugs).  
Use configured path aliases (`@/`, `@components/`, `@utils/`) instead of deep relative imports.

## Testing Guidelines
There is no dedicated unit-test framework configured yet. Treat `pnpm check` as the required pre-PR validation. For route/content changes, also run `pnpm build && pnpm preview` and smoke-test core pages (`/`, `/thoughts`, `/so-far`, `/now`). Ensure new content frontmatter matches collection schemas.

## Commit & Pull Request Guidelines
Recent history favors Conventional Commit prefixes: `feat:`, `fix:`, `docs(scope):`, `style:`, `chore:`. Keep commit subjects imperative and focused on one logical change.  
PRs should include:
- what changed and why,
- linked issue (if applicable),
- screenshots for UI/visual changes,
- notes on affected routes/content and deploy impact,
- confirmation that `pnpm check` passes.

## Security & Configuration Tips
Keep secrets in local `.env` only; never commit credentials. `pnpm deploy` and `pnpm preview:worker` require valid Cloudflare/Wrangler auth in your environment.
