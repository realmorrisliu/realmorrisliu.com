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
- `pnpm build:typst-wasm`: rebuild the Typst wasm (needs Rust + wasm-pack + binaryen).
- `pnpm upload:typst-wasm`: publish that wasm to R2 so other builds can fetch it.

`pnpm build` needs nothing but Node. It downloads the prebuilt Typst wasm and
the full CJK font, then regenerates the subset font and the resume preview
SVGs. Only touching `crates/resume-typst-wasm/` needs a Rust toolchain: rebuild,
bump `WASM_VERSION` in `scripts/resume-typst-wasm-source.mjs`, then upload.

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

Keep secrets in local `.env` only; never commit credentials.

Pushing to `main` deploys automatically via Cloudflare Workers Builds, which
runs `pnpm build` then `npx wrangler deploy`. Prefer that over deploying by
hand: a manual deploy is exactly how the site silently went a month without
updates. `pnpm deploy:manual` and `pnpm preview:worker` still exist as an
escape hatch and need valid Cloudflare/Wrangler auth in your environment. The
manual one is named `deploy:manual` because `pnpm deploy` is a pnpm builtin in
any repo with a `pnpm-workspace.yaml`, and silently refuses to run a script of
that name.
