# Host Resume Typst Runtime Artifacts On R2

The browser-side Typst compiler works from Workers Static Assets today, but the WASM module
and controlled font are large, cacheable runtime artifacts rather than page code. We will
publish those artifacts to a versioned R2-backed CDN prefix while preserving the current
Workers Static Assets path as the local and production fallback; this separates long-lived
compiler assets from site deploys without putting PDF compilation into the Worker request
path.
