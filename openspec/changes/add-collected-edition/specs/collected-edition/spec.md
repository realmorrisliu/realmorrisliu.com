## ADDED Requirements

### Requirement: Collected Edition Entry Surface
The system SHALL provide a Collected Edition entry surface that is separate from the
existing default HTML routes.

#### Scenario: Visitor opens the Collected Edition entrypoint
- **WHEN** a visitor opens `/collected`
- **THEN** the system displays a cover or table-of-contents surface for the Collected
  Edition without replacing `/thoughts`, `/now`, `/moments`, or `/so-far`

#### Scenario: Existing routes remain canonical
- **WHEN** a visitor opens `/thoughts`, `/now`, `/moments`, or `/so-far`
- **THEN** the system serves the existing HTML route behavior without requiring Collected
  Edition assets or browser-side Typst rendering

### Requirement: Collected Content Opt-In
The system SHALL include content in the Collected Edition only when that source entry is
explicitly opted in through Collected Edition metadata.

#### Scenario: Included entry appears in the manifest
- **WHEN** a Thoughts, Now, or Moments source entry has Collected Edition metadata with
  inclusion enabled
- **THEN** the generated Collected Edition manifest lists that entry in the requested
  section with its route, title, ordering metadata, and generated input reference

#### Scenario: Non-included entry is omitted
- **WHEN** a source entry does not have Collected Edition inclusion enabled
- **THEN** the generated Collected Edition manifest omits that entry even if the entry is
  published on the default HTML site

### Requirement: Collected Projection
The system SHALL generate a build-time Collected Projection from existing Astro content
collections into strict JSON publication inputs for Typst templates.

#### Scenario: Thoughts entry projection
- **WHEN** an included Thoughts entry is projected
- **THEN** the generated JSON document contains the entry kind, route metadata, title,
  description, date, language metadata when available, and a normalized publication block
  tree

#### Scenario: Now entry projection
- **WHEN** an included Now entry is projected
- **THEN** the generated JSON document contains the entry kind, route metadata, title,
  summary, last-updated date, and a normalized publication block tree

#### Scenario: Moments entry projection
- **WHEN** an included Moments entry is projected
- **THEN** the generated JSON document contains photography metadata including title, date,
  image reference, location when available, camera when available, lens when available, and
  exposure metadata when available

#### Scenario: Unsupported source node fails the build
- **WHEN** an included source entry contains an unsupported Markdown node, MDX node, or
  unknown component
- **THEN** the projection step fails with an error that names the source entry and the
  unsupported node or component

### Requirement: Controlled Publication Block Model
The system SHALL support a controlled Collected Projection block model for long-form prose
and SHALL reject unsupported structures.

#### Scenario: Supported prose structures are preserved
- **WHEN** included prose contains headings, paragraphs, emphasis, strong text, inline code,
  links, lists, blockquotes, code blocks, thematic breaks, images, footnotes, or inline notes
- **THEN** the projection represents those structures in the generated JSON without relying
  on raw Markdown parsing inside Typst

#### Scenario: Known MDX components are normalized
- **WHEN** included MDX content uses `LanguageSwitcher`, `FootnoteRef`, `Footnote`, or
  `InlineNoteRef`
- **THEN** the projection converts those components into structured metadata, footnotes, or
  annotations instead of preserving raw component markup

### Requirement: Build-Time Typst SVG Rendering
The system SHALL render Collected Edition reading content from Typst into static SVG page
assets during the build.

#### Scenario: Included entry has generated SVG pages
- **WHEN** the build processes an included Collected Edition entry
- **THEN** the build emits one or more SVG page assets for that entry and records those
  assets in the generated manifest or entry metadata

#### Scenario: First-read route does not compile Typst in the browser
- **WHEN** a visitor opens a Collected Edition reading route
- **THEN** the route displays pre-generated SVG page assets without loading a browser-side
  Typst compiler as a prerequisite for reading

#### Scenario: Missing generated artifact fails validation
- **WHEN** an included entry is listed in the Collected Edition manifest but its SVG assets
  are missing
- **THEN** the build or validation step fails before deployment

### Requirement: Paginated Scrolling Reader
The system SHALL present generated Collected Edition SVG pages as a vertically scrollable
paginated reader rather than a simulated page-flip interface.

#### Scenario: Reader displays pages in order
- **WHEN** a visitor opens a Collected Edition reading route
- **THEN** the system displays the generated SVG pages for that entry in manifest order
  inside a stable reading layout

#### Scenario: Reader provides collection navigation
- **WHEN** a visitor is reading a Collected Edition entry
- **THEN** the page provides a way to return to the Collected Edition table of contents and
  move to the previous or next collected entry when such entries exist

### Requirement: Photography Collection
The system SHALL treat included Moments entries as a Photography Collection with
photo-book-style presentation.

#### Scenario: Photography collection appears in the entrypoint
- **WHEN** one or more Moments entries are included in the Collected Edition
- **THEN** `/collected` includes a Photography Collection section or entry for those
  Moments entries

#### Scenario: Photography page uses photo metadata
- **WHEN** a visitor opens the Photography Collection route
- **THEN** the generated page presents the selected images with their title, date, location
  when available, camera when available, lens when available, and exposure metadata when
  available

### Requirement: MVP Scope
The first implementation SHALL ship a minimal real Collected Edition before broader
publication-system features.

#### Scenario: MVP content coverage
- **WHEN** the first Collected Edition implementation is complete
- **THEN** it includes `/collected`, at least one generated Thoughts reading page, at least
  one generated Now reading page, and at least one Photography Collection page derived from
  Moments content

#### Scenario: Deferred features are absent from MVP
- **WHEN** the first Collected Edition implementation is complete
- **THEN** it does not require whole-book PDF export, browser-side Typst rendering, Typst
  HTML output, full-site mirroring, or page-flip animation
