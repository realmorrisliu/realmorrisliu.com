## Context

`/so-far` and `/so-far/zh` render the public professional profile through
`SoFarPage.astro`. Their PDF links currently point to `/so-far/pdf` and
`/so-far/pdf/zh`, which render `ResumeLayout.astro`: an A4-sized HTML resume
preview with a PDF-specific toolbar, print-specific CSS, and content filtered by
`showInPdf !== false`. The implementation must preserve this route-level layout,
toolbar structure, and A4 preview frame while replacing the old browser-print
preview/download behavior with Typst.

The site deploy flow is Astro on Cloudflare. Static `public/` assets are the natural place
for hosted Typst source, resume data, WASM modules, and fonts; the Cloudflare Worker
request path should not invoke a compiler.

Typst research notes:

- Typst's official Web App documentation describes an editor plus live preview panel and
  project export to PDF, PNG, SVG, or HTML:
  https://typst.app/docs/web-app/export-and-preview/
- The same Web App documentation says quick export downloads a PDF when preview mode is
  paged, confirming the desired UX is already a proven Typst product pattern:
  https://typst.app/docs/web-app/export-and-preview/
- The official `typst/typst` repository is a Cargo workspace whose members include the
  core `typst` compiler crate, `typst-pdf`, `typst-svg`, `typst-render`, `typst-html`,
  `typst-kit`, and `typst-cli`:
  https://github.com/typst/typst
- The core `typst` crate exposes the compilation pipeline and `compile(world)` API. It
  compiles a custom `World` into a `PagedDocument` or `HtmlDocument`:
  https://raw.githubusercontent.com/typst/typst/main/crates/typst/src/lib.rs
- `typst-pdf` exposes `pdf(document, options)` and returns raw PDF bytes:
  https://raw.githubusercontent.com/typst/typst/main/crates/typst-pdf/src/lib.rs
- `typst-svg` exposes SVG export functions that can be used for preview if a PDF-oriented
  preview is too heavy:
  https://raw.githubusercontent.com/typst/typst/main/crates/typst-svg/src/lib.rs
- `typst-library` defines the `World` trait, which is the integration boundary for
  source files, raw files, fonts, current date, and the standard library:
  https://raw.githubusercontent.com/typst/typst/main/crates/typst-library/src/lib.rs
- Typst can load structured JSON through `json("file.json")`, converting JSON objects to
  dictionaries and arrays to arrays:
  https://typst.app/docs/reference/data-loading/json/
- Typst page setup supports A4 as the default paper size:
  https://typst.app/docs/reference/layout/page/
- Official Typst PDF docs confirm Typst's native PDF export model; the implementation
  still needs a self-hosted browser runtime/API that can expose the same PDF export path:
  https://typst.app/docs/reference/pdf/#exporting-as-pdf

## Goals / Non-Goals

**Goals:**

- Host Typst source and compile the Resume PDF in the browser.
- Provide realtime preview for English and Chinese Resume PDFs.
- Provide a downloadable PDF produced from the browser-side Typst compilation.
- Preserve the existing `/so-far/pdf` page structure, toolbar, visual style, and A4
  preview region.
- Keep So Far Page content and Resume PDF content synchronized through a shared Resume
  Content Source.
- Preserve the existing PDF-specific filtering behavior for work history and projects.
- Keep PDF generation out of both the Cloudflare Worker request path and build-time static
  artifact generation.
- Make compiler/runtime/font loading failures visible to the visitor with actionable UI.

**Non-Goals:**

- Redesign the So Far Page.
- Build a general document publishing system for all site content.
- Generate or commit static PDF binaries at build time.
- Generate PDF dynamically in the Cloudflare Worker request path.
- Make Typst the authoring source for the So Far Page.

## Typst Repository Components

The implementation should use Typst's repository as a compiler toolkit rather than trying
to embed the official Web App or compile the CLI wholesale.

- `typst`: direct dependency. This is the compiler entrypoint. The adapter should call
  `typst::compile::<PagedDocument>(&world)` after providing a browser-owned `World`.
- `typst-library`: direct dependency. This provides the `World` trait and shared types for
  source files, raw files, fonts, standard library access, and current-date behavior. The
  site should implement its own `BrowserWorld` rather than use the CLI's system world.
- `typst-pdf`: direct dependency. This turns a `PagedDocument` into raw PDF bytes for the
  download action.
- `typst-svg`: optional direct dependency. This is the first-choice preview exporter if we
  want page previews as SVG instead of embedding a PDF object URL.
- `typst-render`: optional later dependency. This is only needed if the preview should be
  rasterized to canvas/PNG instead of SVG/PDF.
- `typst-syntax`: optional support dependency. It can help if the browser UI needs richer
  syntax or diagnostic mapping, but the first spike can rely on compiler diagnostics.
- `typst-kit`: selective reference/helper dependency. Use only browser-compatible utilities
  if they materially reduce work; avoid system file, package, downloader, watcher, or server
  features.
- `typst-cli`: reference only. Its compile/export orchestration and `SystemWorld` are useful
  examples, but its filesystem, terminal, CLI-flag, package-download, and native process
  assumptions are the wrong runtime boundary for this site.

## Decisions

### Compile Typst in the browser

Serve the Typst template, projected resume data, compiler WASM, renderer/runtime code, and
fonts as static assets. The `/so-far/pdf` and `/so-far/pdf/zh` pages load those assets,
compile the Typst document in the browser, render a live SVG preview inside the existing
A4 preview frame, and expose a download action that emits PDF bytes on demand.

Alternatives considered:

- Keep browser print: lowest implementation cost, but it keeps the current indirect
  download flow and browser-dependent pagination.
- Generate at build time: deterministic and simple for visitors, but it stores static PDF
  binaries and does not expose the Typst source/runtime path the product wants.
- Generate in the Worker: keeps compilation off the visitor device, but requires a PDF
  compiler in the request path and does not fit the Cloudflare runtime.

### Keep i18n content as the data authority and Typst as the layout authority

The implementation should keep the existing language-specific translation files as the
authoritative source for resume facts and prose. A build-time projection emits
Typst-friendly JSON for each language, preserving `showInPdf !== false` filtering before
the browser compiler runs.

This preserves the current editing workflow and keeps the So Far Page as the rich web
presentation while allowing Typst to own the PDF document layout.

Typst source should still be explicitly language-aware:

- `resume.typ` owns the shared resume document components and A4 layout.
- `resume.en.typ` imports `resume.typ`, loads the English JSON projection, and sets
  English-specific document metadata, font choices, and spacing.
- `resume.zh.typ` imports `resume.typ`, loads the Chinese JSON projection, and sets
  Chinese-specific document metadata, font choices, and spacing.

The language entrypoints should stay thin. They may tune layout and typography, but they
must not duplicate the full resume body that already exists in the translation sources.

### Preserve the existing PDF route layout while replacing the preview/download engine

The So Far Page links should continue to point to `/so-far/pdf` and `/so-far/pdf/zh`.
Those routes keep the existing `ResumeLayout.astro` page shell, PDF toolbar, language
toggle, back link, and A4 preview region. Only the preview renderer and download action are
replaced: the A4 region is filled with Typst SVG output, and the old browser print button
now generates a Typst PDF.

### Treat fonts and WASM as explicit hosted assets

The implementation must host or bundle the selected English and Chinese fonts and all WASM
modules needed by the browser compiler. The page must not depend on CDN-hosted font assets
or a visitor's system fonts for correctness. A missing CJK glyph, missing WASM module, or
failed compiler initialization is a failed PDF experience.

### Reproduce the Typst Web App pattern with self-hosted assets

Typst's own Web App already demonstrates realtime preview and PDF export as a product
pattern. The implementation task is to reproduce that pattern from this site with
self-hosted source/data/runtime/font assets.

The preferred implementation path is a small Rust/WASM adapter around the official Typst
crates:

1. Implement a browser `World` that serves `resume.en.typ` or `resume.zh.typ`, the shared
   `resume.typ`, the matching resume JSON projection, imported Typst files, and font bytes
   from in-memory or fetched site assets.
2. Call `typst::compile::<PagedDocument>(&world)`.
3. For preview, export each page through `typst-svg` and inject the SVG into the existing
   A4 preview frame.
4. For download, call `typst_pdf::pdf(&document, &PdfOptions::default())` on demand and return the
   resulting bytes to JavaScript.

`typst-cli` is useful as reference code for compile/export orchestration, but it should
not be compiled wholesale into the browser because it is built around system files,
terminal diagnostics, CLI flags, and native process concerns. `typst-kit` is useful
selectively for utilities, but browser file/package/font loading should remain explicit
and site-owned.

`typst.ts` remains useful prior art and a fallback library, but the primary goal is to own
the minimal browser runtime around official Typst compiler/exporter crates.

## Risks / Trade-offs

- Official crates may not compile cleanly to the browser target with the desired feature
  set -> spike the minimal adapter before full UI migration and document dependency or
  feature patches.
- WASM binary size may be large -> include only `typst`, `typst-pdf`, `typst-svg`, and the
  explicit asset-loading code needed for this route. If the bundle exceeds Cloudflare's
  static asset limit, keep the same runtime interface but serve the WASM assets from a
  configured CDN/R2 base URL.
- Compiler/WASM/font bundles can be large -> lazy-load the PDF runtime only on the PDF
  routes and keep `/so-far` free of compiler assets.
- Browser compilation can be slow on mobile -> provide explicit loading/progress state and
  avoid blocking the So Far Page itself.
- Separate web and PDF layouts can drift -> use the same Resume Content Source projection
  and add focused checks for visible sections and filtered item counts.
- Chinese output can silently fall back poorly if fonts are unavailable -> host controlled
  fonts and verify CJK glyph rendering in the browser preview/download.

## Migration Plan

1. Spike a Rust/WASM adapter around the official Typst crates with hosted Typst source,
   hosted data, hosted fonts, realtime preview, and PDF byte download.
2. Add the Resume PDF data projection, shared Typst template, and language-specific Typst
   entrypoints as hosted source assets.
3. Replace the current print-only preview/download behavior inside the existing PDF route
   layout with Typst SVG preview and on-demand PDF download.
4. Keep `/so-far` and `/so-far/zh` linking to `/so-far/pdf` and `/so-far/pdf/zh`.
5. Keep the existing PDF page shell and A4 preview styling intact unless a separate design
   change explicitly revisits that route.
6. Validate with `pnpm check`, `pnpm build`, browser-route smoke tests, and a real
   browser compile/download check for both languages.

## Open Questions

- Which exact Rust/WASM build shape will work best is intentionally unresolved until the
  implementation spike proves it. The target is a minimal self-owned adapter over
  `typst`, `typst-pdf`, and optionally `typst-svg`; `typst.ts` is reference material or a
  fallback, not the default architecture.
