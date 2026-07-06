## 1. Browser Compiler Spike

- [x] 1.1 Create a minimal Rust/WASM adapter that depends on official Typst crates
      (`typst`, `typst-pdf`, and optionally `typst-svg`).
- [x] 1.2 Implement a browser `World` for in-memory Typst source, shared and
      language-specific entrypoints, resume JSON, imported files, controlled fonts, and stable
      current-date behavior.
- [x] 1.3 Prove the adapter can compile a minimal hosted resume Typst document to a
      `PagedDocument`.
- [x] 1.4 Prove the adapter can export downloadable PDF bytes through `typst-pdf`.
- [x] 1.5 Prove the adapter can render a realtime preview through SVG.
- [x] 1.6 Prove compiler, data, WASM, and font assets can be served from this site without
      CDN dependencies.
- [x] 1.7 Record any required Typst dependency feature flags, patches, or browser-target
      limitations in the implementation notes or README.

## 2. Source, Data, And Template

- [x] 2.1 Add a Resume PDF data projection path that imports the English and Chinese
      translation sources and emits Typst-friendly JSON for each language.
- [x] 2.2 Preserve the existing `showInPdf !== false` filtering for work positions, work
      projects, and personal projects in the projected data.
- [x] 2.3 Add a hosted shared Typst template plus thin English and Chinese Typst entrypoints
      using A4 page geometry and language-aware text settings.
- [x] 2.4 Add self-hosted font assets needed for reliable English and Chinese rendering.

## 3. Browser PDF Runtime

- [x] 3.1 Implement a PDF route runtime that lazy-loads the browser Typst compiler and
      required WASM assets.
- [x] 3.2 Render a realtime SVG preview after successful browser-side compilation.
- [x] 3.3 Add a download action that saves the browser-compiled PDF.
- [x] 3.4 Add loading and failure states for compiler, source, data, and font failures.

## 4. Route Migration

- [x] 4.1 Keep `/so-far` and `/so-far/zh` PDF links pointed at `/so-far/pdf` and
      `/so-far/pdf/zh`.
- [x] 4.2 Preserve the existing `/so-far/pdf` and `/so-far/pdf/zh` layout while replacing
      the preview region and download button with browser-side Typst behavior.
- [x] 4.3 Remove the browser-print behavior without removing the existing PDF route layout.
- [x] 4.4 Update PDF-related i18n copy so it describes compiling/downloading rather than
      using the browser print dialog.

## 5. Validation

- [x] 5.1 Smoke-test `/so-far`, `/so-far/zh`, `/so-far/pdf`, and `/so-far/pdf/zh` after
      build.
- [x] 5.2 Use browser automation to verify both PDF routes initialize the compiler,
      render SVG previews, and download PDFs.
- [x] 5.3 Verify Chinese glyph rendering in browser preview and downloaded PDF.
- [x] 5.4 Run `pnpm check`.
- [x] 5.5 Run `pnpm build`.
