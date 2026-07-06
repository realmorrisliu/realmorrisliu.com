## Context

The current Resume PDF implementation compiles Typst in the browser. The page loads:

- Typst source and language entrypoints from `/resume-typst/*.typ`
- projected resume JSON from `/so-far/pdf-data/*.json`
- a browser bridge and WASM module from `/resume-typst-wasm`
- a controlled CJK font from `/resume-typst/fonts`

`wrangler.jsonc` serves built static files through Workers Static Assets, which Cloudflare
caches globally. This is already safe and functional. R2 is still useful for the large,
slow-changing runtime artifacts because it provides an explicit artifact store, custom
domain caching controls, and versioned publication independent from the page shell.

## Goals / Non-Goals

**Goals:**

- Publish WASM, JavaScript bridge files, and controlled fonts to a versioned R2-backed CDN
  prefix.
- Let production builds inject one Artifact CDN Base URL that covers both WASM and font
  runtime artifacts.
- Preserve local development and production fallback to the current Workers Static Assets
  paths.
- Use explicit content types and long-lived immutable cache metadata for versioned
  artifacts.
- Document the Cloudflare account-side setup needed for custom domain, CORS, and automated
  builds.

**Non-Goals:**

- Move Typst source or resume JSON to R2 in this change.
- Generate PDFs at build time or in the Worker request path.
- Remove the checked-in static artifact fallback.
- Create Cloudflare account resources from application runtime code.

## Decisions

### Treat R2 as an artifact CDN, not as the only source of truth

Production can set `PUBLIC_RESUME_TYPST_ARTIFACT_BASE_URL` to a versioned public URL such as
`https://assets.realmorrisliu.com/resume-typst-artifacts/<commit-sha>`. The page derives
`/wasm` and `/fonts` URLs from that base. If the variable is absent, the page continues to
load `/resume-typst-wasm` and `/resume-typst/fonts`.

Alternatives considered:

- Replace all local static assets with R2 URLs: simpler production payload, but it makes
  local development and rollback dependent on external storage.
- Keep only Workers Static Assets: simplest, but the compiler bundle remains coupled to
  every site deploy and lacks explicit versioned artifact metadata.

### Version by immutable prefix

Artifacts are uploaded under `RESUME_TYPST_R2_PREFIX`, defaulting to a commit-derived
`resume-typst-artifacts/<version>`. Uploaded objects use long-lived immutable cache
metadata because the prefix changes when the artifact set changes.

### Keep Cloudflare resource setup outside the app

The repository provides upload tooling and CORS configuration, but bucket creation and
custom domain connection remain Cloudflare account operations. The default build command
detects Cloudflare Workers Builds via `WORKERS_CI=1` and applies this site's production
R2 bucket and custom-domain defaults so the existing `pnpm run build` command can publish
R2 artifacts without a Dashboard build-command change.

## Risks / Trade-offs

- Custom-domain R2 assets are cross-origin from `realmorrisliu.com` -> configure R2 CORS for
  `GET` and `HEAD` from the site origins before enabling the CDN base URL.
- Long cache TTL can pin a bad artifact -> use immutable versioned prefixes and roll back by
  rebuilding the site with the previous `PUBLIC_RESUME_TYPST_ARTIFACT_BASE_URL`.
- Cloudflare Workers Builds command shape may differ from manual deploys -> keep the
  existing `pnpm run build` command working by detecting `WORKERS_CI=1`, and document the
  manual path separately.
- R2 upload may fail while the site build succeeds -> keep the static fallback and make the
  R2-enabled build command fail fast when required environment variables are missing.

## Migration Plan

1. Create an R2 bucket for resume Typst artifacts.
2. Connect a production custom domain, for example `assets.realmorrisliu.com`.
3. Apply the repository CORS policy to allow `realmorrisliu.com`, `www.realmorrisliu.com`,
   and local development origins to load module scripts, WASM, and fonts.
4. Keep the Cloudflare Workers Builds command as `pnpm run build`; the repository build
   wrapper applies the production R2 defaults when `WORKERS_CI=1`.
5. Use the manual R2-enabled deploy command when deploying outside Workers Builds.
6. Build WASM only when the Rust source changes, then commit the generated browser
   artifacts.
7. Smoke-test `/so-far/pdf` and `/so-far/pdf/zh` in a real browser and verify artifact
   network requests come from the custom domain.

Rollback: rebuild without `PUBLIC_RESUME_TYPST_ARTIFACT_BASE_URL` to return to the
Workers Static Assets fallback, or rebuild with a previous artifact prefix.
