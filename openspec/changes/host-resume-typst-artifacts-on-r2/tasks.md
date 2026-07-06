## 1. Specification And Domain Model

- [x] 1.1 Add an OpenSpec proposal for R2-hosted Resume Typst Runtime Artifacts.
- [x] 1.2 Add requirements for configurable artifact CDN loading, R2 upload metadata, and
      Cloudflare deployment compatibility.
- [x] 1.3 Record the R2 artifact hosting decision in an ADR and glossary terms.

## 2. Runtime Configuration

- [x] 2.1 Add `PUBLIC_RESUME_TYPST_ARTIFACT_BASE_URL` support for both WASM and font
      runtime assets.
- [x] 2.2 Preserve `PUBLIC_RESUME_TYPST_WASM_BASE_URL` and local static paths as fallback
      configuration.

## 3. R2 Publication Tooling

- [x] 3.1 Add a Wrangler-based upload script for the WASM bridge, generated WASM JavaScript,
      WASM binary, and controlled font.
- [x] 3.2 Upload files with explicit content types and immutable cache metadata.
- [x] 3.3 Add package scripts for upload-only, R2-enabled build, and R2-enabled deploy
      workflows.
- [x] 3.4 Keep the default `pnpm run build` command compatible with Workers Builds by
      detecting `WORKERS_CI=1` and applying production R2 defaults.
- [x] 3.5 Add a checked-in CORS policy template for the production site origins.

## 4. Deployment Documentation

- [x] 4.1 Document required Cloudflare R2 bucket, custom domain, CORS, and build environment
      setup.
- [x] 4.2 Document both Cloudflare Workers Builds and manual Wrangler deployment commands.
- [x] 4.3 Document rollback to the Workers Static Assets fallback.

## 5. Validation

- [x] 5.1 Run OpenSpec validation.
- [x] 5.2 Run `pnpm check`.
- [x] 5.3 Run `pnpm build`.
