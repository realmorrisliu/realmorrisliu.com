# Personal Site

This context covers the public personal site and the publication artifacts derived from
its professional profile content.

## Language

**So Far Page**:
The public professional profile page that presents Morris Liu's work history, projects,
education, skills, and contact paths.
_Avoid_: About page, Resume page

**Resume PDF**:
A downloadable, traditional resume artifact derived from the So Far Page content for a
single language.
_Avoid_: Printable page, browser PDF

**Resume Content Source**:
The language-specific structured professional profile content from which both the So Far
Page and Resume PDF select material.
_Avoid_: Typst source, web page copy

**Resume Typst Runtime Artifact**:
A versioned static asset required by the browser-side Typst compiler, such as the WASM
module, JavaScript bridge, or controlled font file.
_Avoid_: PDF asset, Worker code

**Artifact CDN Base URL**:
The public, versioned URL prefix from which the Resume PDF route loads Resume Typst Runtime
Artifacts in production.
_Avoid_: R2 bucket name, local static path

**Collected Edition**:
An optional, book-like reading surface for selected site content rendered with Typst. It
complements the default HTML site instead of replacing or mirroring every route.
_Avoid_: Typst mirror, replacement site, PDF-only site

**Collected Content**:
The content set eligible for the Collected Edition, initially Thoughts entries, Now pages, and
Moments entries.
_Avoid_: Whole site, all pages, resume-only content

**Collected Projection**:
The build-time JSON publication model generated from Collected Content for Typst templates
to consume. It normalizes prose, metadata, notes, code blocks, and photo entries without
becoming a second content source.
_Avoid_: Typst content source, copied Markdown, runtime conversion

**Photography Collection**:
The Collected Edition treatment of Moments entries as a curated photo-book section rather
than as ordinary article prose.
_Avoid_: Image appendix, gallery dump
