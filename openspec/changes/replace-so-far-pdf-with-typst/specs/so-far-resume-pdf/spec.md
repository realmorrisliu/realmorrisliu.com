## ADDED Requirements

### Requirement: Hosted browser-side Typst compilation

The system SHALL host Typst source and compile the Resume PDF in the visitor's browser for
each supported So Far language.

#### Scenario: English browser compilation

- **WHEN** a visitor opens `/so-far/pdf`
- **THEN** the page loads hosted Typst source, hosted English resume data, hosted compiler
  assets, and compiles the English Resume PDF in the browser

#### Scenario: Chinese browser compilation

- **WHEN** a visitor opens `/so-far/pdf/zh`
- **THEN** the page loads hosted Typst source, hosted Chinese resume data, hosted compiler
  assets, and compiles the Chinese Resume PDF in the browser

### Requirement: Realtime preview and PDF download

The system SHALL provide realtime preview and a downloadable PDF from the browser-compiled
Typst document.

#### Scenario: Preview after compile

- **WHEN** browser-side Typst compilation succeeds
- **THEN** the visitor sees an SVG-rendered preview of the compiled Resume PDF inside the
  existing A4 preview region without opening the browser print dialog

#### Scenario: Download from compiled document

- **WHEN** the visitor activates the download control after a successful compile
- **THEN** the browser downloads a PDF generated from the compiled Typst document

#### Scenario: PDF generation is on demand

- **WHEN** the PDF route first renders its preview
- **THEN** it does not use an embedded PDF viewer for the preview
- **AND** it generates PDF bytes only when the visitor activates the download control

#### Scenario: No static PDF fallback

- **WHEN** the PDF route is served
- **THEN** it does not depend on a prebuilt PDF binary generated during `pnpm build`

### Requirement: Shared Resume Content Source

The browser-side Resume PDF compilation pipeline SHALL derive its content from the same
language-specific Resume Content Source used by the So Far Page.

#### Scenario: Content source projection

- **WHEN** the English or Chinese Resume PDF data projection is hosted or embedded
- **THEN** the generated data is projected from the corresponding translation source
  rather than copied from rendered HTML or hand-maintained PDF-only prose

#### Scenario: PDF item filtering

- **WHEN** work positions, work projects, or personal projects set `showInPdf` to `false`
- **THEN** those items are excluded from the generated Resume PDF for that language

### Requirement: Hosted source and runtime assets

The system SHALL host all source and runtime assets required for browser-side Typst
compilation.

#### Scenario: Typst source is publicly served

- **WHEN** the browser PDF route loads
- **THEN** it can fetch the Typst source used to compile the Resume PDF

#### Scenario: Language entrypoints are hosted

- **WHEN** the English or Chinese browser PDF route loads
- **THEN** it can fetch a language-specific Typst entrypoint that imports the shared resume
  template and loads the matching projected resume data

#### Scenario: Runtime assets are self-hosted

- **WHEN** the browser PDF route loads compiler, renderer, data, or font assets
- **THEN** those required assets are served from the site or bundled output rather than
  required from an external CDN

#### Scenario: Official compiler core is used

- **WHEN** the browser runtime compiles the Resume PDF
- **THEN** it uses a WASM adapter built from official Typst compiler/exporter crates or a
  documented equivalent that preserves the same Typst compile and PDF export semantics

#### Scenario: Compiler failure is visible

- **WHEN** browser-side compiler initialization or compilation fails
- **THEN** the PDF route displays a clear failure state instead of silently falling back to
  the browser print dialog

### Requirement: Document layout is deterministic

The generated Resume PDF artifacts SHALL use a deterministic document layout suitable for
traditional resume sharing.

#### Scenario: A4 PDF output

- **WHEN** a Resume PDF is compiled in the browser
- **THEN** it uses A4 page geometry and does not depend on browser print settings

#### Scenario: Chinese glyph coverage

- **WHEN** the Chinese Resume PDF is compiled and downloaded
- **THEN** Chinese text renders with valid glyphs in the generated PDF

### Requirement: Existing PDF route layout is preserved

The implementation SHALL preserve the previous PDF route shell while replacing only the
preview renderer and download action.

#### Scenario: Existing page shell remains

- **WHEN** a visitor opens `/so-far/pdf` or `/so-far/pdf/zh`
- **THEN** the page keeps the existing PDF toolbar, language toggle, back link, and
  A4-sized preview frame styling

#### Scenario: No compiler dashboard redesign

- **WHEN** the browser-side Typst runtime is active
- **THEN** the page does not introduce a new compiler dashboard, sidebar, or PDF object
  viewer around the preview

### Requirement: PDF route smoke coverage

The implementation SHALL include validation that the PDF generation and public routes work
for both languages.

#### Scenario: Quality gate

- **WHEN** pre-PR validation runs for this change
- **THEN** it includes `pnpm check`, `pnpm build`, smoke checks for `/so-far`,
  `/so-far/zh`, `/so-far/pdf`, and `/so-far/pdf/zh`, and browser verification that both
  PDF routes compile and download PDFs
