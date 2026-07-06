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
