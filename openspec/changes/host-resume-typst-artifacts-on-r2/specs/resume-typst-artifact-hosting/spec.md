## ADDED Requirements

### Requirement: Configurable artifact CDN base

The Resume PDF route SHALL load Resume Typst Runtime Artifacts from a configured Artifact
CDN Base URL when one is provided.

#### Scenario: Production artifact base is configured

- **WHEN** the site is built with `PUBLIC_RESUME_TYPST_ARTIFACT_BASE_URL`
- **THEN** the Resume PDF route loads WASM bridge files from that base URL plus `/wasm`
- **AND** it loads controlled font files from that base URL plus `/fonts`

#### Scenario: Artifact base is not configured

- **WHEN** the site is built without `PUBLIC_RESUME_TYPST_ARTIFACT_BASE_URL`
- **THEN** the Resume PDF route loads WASM bridge files from `/resume-typst-wasm`
- **AND** it loads controlled font files from `/resume-typst/fonts`

### Requirement: Versioned R2 artifact publication

The repository SHALL provide tooling to publish Resume Typst Runtime Artifacts to a
versioned R2 object prefix.

#### Scenario: Upload runtime artifacts

- **WHEN** the R2 upload command runs with a bucket and public base URL
- **THEN** it uploads the browser bridge, generated WASM JavaScript, WASM binary, and
  controlled font file to a single versioned prefix

#### Scenario: Explicit object metadata

- **WHEN** runtime artifacts are uploaded to R2
- **THEN** JavaScript files are uploaded with a JavaScript MIME type
- **AND** WASM files are uploaded with `application/wasm`
- **AND** font files are uploaded with a font MIME type
- **AND** versioned files are uploaded with long-lived immutable cache metadata

### Requirement: Cloudflare deployment compatibility

The R2 artifact hosting flow SHALL work with both Cloudflare Workers Builds and manual
Wrangler deployments without requiring secrets to be committed.

#### Scenario: Cloudflare build output flow

- **WHEN** Cloudflare Workers Builds runs an R2-enabled build command
- **THEN** the command can upload artifacts and build the site with the generated Artifact
  CDN Base URL before Cloudflare publishes the Worker deployment

#### Scenario: Existing Workers Builds command remains valid

- **WHEN** Cloudflare Workers Builds runs the repository's default `pnpm run build`
- **THEN** the build detects the `WORKERS_CI=1` environment variable
- **AND** it applies this site's production R2 bucket and custom-domain defaults
- **AND** it performs the R2-enabled build without requiring a Dashboard build-command
  change

#### Scenario: Manual Wrangler deploy flow

- **WHEN** a maintainer runs the R2-enabled deploy command locally or in external CI
- **THEN** the command uploads artifacts, builds the site with the generated Artifact CDN
  Base URL, and deploys with Wrangler

#### Scenario: Missing R2 configuration

- **WHEN** an R2-enabled artifact upload or deploy command runs without required bucket or
  public base URL configuration
- **THEN** the command fails before deploying a partially configured site

### Requirement: Cross-origin artifact loading

R2-hosted Resume Typst Runtime Artifacts SHALL be loadable by the browser PDF route from
the public site origins.

#### Scenario: CORS policy is applied

- **WHEN** artifacts are served from a custom R2 domain
- **THEN** browser module script, WASM, and font requests from `realmorrisliu.com` and
  `www.realmorrisliu.com` are allowed by the bucket CORS configuration
