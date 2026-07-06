## Why

The current `/so-far` PDF path renders a print-only HTML page and asks the user to save
through the browser print dialog. Replacing that flow with hosted Typst source and
browser-side compilation makes the PDF path source-driven, inspectable, and able to provide
realtime preview/download behavior without storing prebuilt PDF binaries.

## What Changes

- Add hosted Typst source, resume data, compiler WASM, and font assets needed for
  browser-side Resume PDF compilation.
- Add a browser PDF surface that loads the hosted Typst source and compiles it in the
  visitor's browser for English and Chinese.
- Keep the existing Resume Content Source as the shared source for both the So Far Page
  and the Resume PDF, including the existing `showInPdf` filtering semantics.
- Replace `/so-far` PDF links with the browser-side Typst PDF surface.
- Preserve `/so-far/pdf` and `/so-far/pdf/zh` as the public PDF routes, but make them load
  the Typst compiler experience instead of the print-dialog page.
- Remove the browser-print Resume PDF experience once the Typst artifacts are served.

## Capabilities

### New Capabilities

- `so-far-resume-pdf`: Defines hosted Typst source, browser-side compilation, publication,
  and content parity behavior for Resume PDFs derived from the So Far Page content.

### Modified Capabilities

- None.

## Impact

- Affects `src/pages/so-far*`, `src/components/SoFarPage.astro`, and the current
  `ResumeLayout.astro` print-only flow.
- Adds hosted Typst source/data assets, browser compiler/runtime code, WASM assets, and
  font assets.
- Adds a client-side dependency such as `typst.ts` or an equivalent browser-capable Typst
  compiler that can produce a downloadable PDF.
- Keeps Cloudflare Worker runtime behavior simple by serving source/runtime assets; PDF
  compilation happens in the visitor's browser, not during build or request handling.
