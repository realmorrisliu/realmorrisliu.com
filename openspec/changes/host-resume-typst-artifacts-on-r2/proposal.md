## Why

The browser-side Typst Resume PDF route now depends on large runtime artifacts: a Typst WASM
module, JavaScript bridge files, and controlled font files. Serving them only as site static
assets works, but it couples cache-heavy compiler artifacts to every site deployment and
does not give us a clean versioned CDN artifact boundary.

## What Changes

- Add a versioned Artifact CDN Base URL for the Resume Typst Runtime Artifacts.
- Keep the current Workers Static Assets paths as the default fallback for local development
  and failed CDN configuration.
- Add R2 upload tooling that publishes the WASM bridge, WASM binary, and controlled font to
  a versioned prefix with explicit MIME types and long-lived cache metadata.
- Document the Cloudflare account setup needed for a production R2 custom domain, CORS, and
  Workers Builds integration.
- Keep Typst source and resume JSON on the site route unless a later change deliberately
  moves those frequently edited text assets.

## Capabilities

### New Capabilities

- `resume-typst-artifact-hosting`: Defines versioned R2/CDN publication and browser loading
  behavior for Resume Typst Runtime Artifacts.

### Modified Capabilities

- None.

## Impact

- Affects `src/components/ResumePdfCompiler.astro` and the runtime asset URLs used by
  `src/scripts/resume-pdf-runtime.ts`.
- Adds repository scripts for R2 artifact publication through Wrangler.
- Adds deployment documentation for Cloudflare Workers Builds and manual `wrangler deploy`
  workflows.
- Requires Cloudflare account-side R2 bucket, custom domain, and CORS configuration before
  production can use the CDN path.
