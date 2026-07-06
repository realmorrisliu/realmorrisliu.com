# Resume Typst R2 Artifact Hosting

The Resume PDF route can load its large Typst runtime artifacts from an R2-backed custom
domain while keeping Workers Static Assets as the fallback.

## Cloudflare Setup

Production uses Cloudflare account `b96556986b5109d88eb943aef8a7fa6d`
(`realmorrisliu`).

1. Create the R2 bucket `realmorrisliu-resume-typst-artifacts`.
2. Connect `assets.realmorrisliu.com` as the bucket custom domain.
3. Apply the CORS policy:

```sh
CLOUDFLARE_ACCOUNT_ID=b96556986b5109d88eb943aef8a7fa6d \
pnpm exec wrangler r2 bucket cors set "$RESUME_TYPST_R2_BUCKET" \
  --file scripts/resume-typst-r2-cors.json \
  --force
```

4. Keep the Cloudflare Workers Builds build command as:

```sh
pnpm run build
```

`scripts/build-site.mjs` detects `WORKERS_CI=1` and applies the production R2
defaults automatically. Local `pnpm build` still uses the local static fallback unless
the R2 environment variables are explicitly set.

The Workers Builds API token needs Workers R2 Storage edit permission. Cloudflare's
auto-created Workers Builds token includes that permission; if a custom token is used,
verify it has R2 write access.

Optional overrides:

```sh
CLOUDFLARE_ACCOUNT_ID=b96556986b5109d88eb943aef8a7fa6d
RESUME_TYPST_R2_BUCKET=realmorrisliu-resume-typst-artifacts
RESUME_TYPST_R2_PUBLIC_BASE_URL=https://assets.realmorrisliu.com
```

`RESUME_TYPST_R2_PREFIX` is optional. If omitted, the upload script uses
`resume-typst-artifacts/<workers-ci-commit-sha-or-git-sha>`.

## Build Commands

For Cloudflare Workers Builds where Cloudflare publishes the built Worker after the build
command finishes, keep the existing build command:

```sh
pnpm run build
```

This command uploads the committed WASM/font artifacts to remote R2 and then builds Astro
with the generated R2 artifact base URL. If the Rust WASM source changes, rebuild and
commit the browser artifacts before relying on Workers Builds:

```sh
pnpm run build:typst-wasm
```

For a manual or external CI Wrangler deployment after the artifacts are current:

```sh
pnpm run deploy:with-r2-artifacts
```

For upload-only testing:

```sh
pnpm run upload:typst-artifacts:r2
```

To verify the generated R2 object paths and build-time artifact base URL without uploading:

```sh
RESUME_TYPST_R2_BUCKET=example \
RESUME_TYPST_R2_PUBLIC_BASE_URL=https://assets.realmorrisliu.com \
pnpm upload:typst-artifacts:r2 -- --dry-run
```

The R2-enabled build injects:

```sh
PUBLIC_RESUME_TYPST_ARTIFACT_BASE_URL=$RESUME_TYPST_R2_PUBLIC_BASE_URL/$RESUME_TYPST_R2_PREFIX
```

The PDF route then derives:

- WASM runtime: `$PUBLIC_RESUME_TYPST_ARTIFACT_BASE_URL/wasm`
- controlled fonts: `$PUBLIC_RESUME_TYPST_ARTIFACT_BASE_URL/fonts`

## Rollback

Rebuild without `PUBLIC_RESUME_TYPST_ARTIFACT_BASE_URL` or the R2-enabled build command.
The site falls back to:

- `/resume-typst-wasm`
- `/resume-typst/fonts`

Because R2 artifact paths are versioned, rolling back to a known-good artifact set is also
just a matter of rebuilding with the previous artifact base URL.
