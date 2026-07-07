## Context

The site is an Astro + TypeScript personal site with public content surfaces named
Thoughts, Now, Moments, and So Far. The underlying Astro content collection for Thoughts
is currently named `blog`, but user-facing language should keep using `Thoughts`.

The site already has a Typst-powered Resume PDF experience under `/so-far/pdf`. That
experience uses browser-side Typst compilation for PDF export and a pre-rendered preview
path for faster initial display. The Collected Edition is a separate publication surface:
it uses Typst because the desired output is book-like, but it must not make normal long-form
reading depend on browser-side Typst runtime loading.

Current content shapes:

- Thoughts and Now entries are Markdown/MDX content with frontmatter.
- Some Thoughts entries use controlled MDX components such as `LanguageSwitcher`,
  `FootnoteRef`, `Footnote`, and `InlineNoteRef`.
- Moments entries are image-backed content records with title, date, location, camera, lens,
  and exposure metadata.

The deployment target remains Astro on Cloudflare. Static generated assets are the natural
publication output. Request-time or first-paint Typst compilation is outside the intended
runtime boundary.

## Goals / Non-Goals

**Goals:**

- Add an optional Collected Edition that feels like a book-like reading surface.
- Keep the default HTML site as the canonical browsing, SEO, sharing, and fast-reading
  experience.
- Collect selected Thoughts, Now, and Moments entries without duplicating content into a
  second authoring source.
- Use a build-time Collected Projection to convert content collections into strict JSON
  publication inputs.
- Render reading pages from Typst to static paginated SVG assets at build time.
- Present generated SVG pages through Astro routes with cover/table-of-contents,
  per-entry pages, and collection navigation.
- Treat Moments as a Photography Collection, not as prose with images appended.
- Fail the build clearly when included content contains unsupported projection nodes.

**Non-Goals:**

- Replace `/thoughts`, `/now`, `/moments`, or `/so-far`.
- Create a 1:1 Typst mirror of every site route.
- Run Typst in the browser for the first-read Collected Edition experience.
- Use Typst HTML output for the first version.
- Ship whole-book PDF export in the first version.
- Migrate all existing published content into the Collected Edition at once.

## Decisions

### Name the surface Collected Edition

The user-facing name is Collected Edition. It is intentionally not called Typeset Edition,
Typst Edition, Book Mode, or Blog. The name describes a curated publication surface rather
than the rendering technology or an implementation detail.

Alternatives considered:

- `Typeset Edition`: too implementation-oriented and too close to the discarded Pretext
  experiment.
- `Book Edition`: clear, but more rigid than the actual scope because the surface includes
  a photography collection and may remain web-native.
- `Typst mirror`: incorrect boundary because the feature is not a whole-site replacement.

### Keep routes independent while making the experience feel continuous

The route shape should use `/collected` as the cover/table-of-contents entrypoint and
dedicated child routes for content:

- `/collected/thoughts/...`
- `/collected/now/...`
- `/collected/moments` or later `/collected/moments/...`

Each route is independently shareable and cacheable, while the UI provides book-like
movement through table-of-contents, previous/next links, and current section context.

The first version should use vertical paginated scrolling rather than simulated page-flip
interaction. This preserves the feel of pages without introducing a custom reader engine.

### Use explicit opt-in for the first release

Collected Edition inclusion should be controlled by content metadata rather than inferred
from all published content. The initial metadata can live in frontmatter under a
`collected` object.

Example for Thoughts or Now:

```yaml
collected:
  include: true
  section: thoughts
  order: 20260707
```

Example for Moments:

```yaml
collected:
  include: true
  section: photography
  spread: full
```

This prevents unsuitable entries, unsupported MDX components, draft experiments, or image
records from silently becoming part of the publication. A later change can revisit default
inclusion once projection coverage is mature.

### Build a strict Collected Projection

The projection layer is the boundary between Astro content and Typst templates. It should
read Astro content collections, normalize included entries into JSON, and emit a manifest
plus entry documents. Typst templates should read only these generated JSON inputs.

This keeps content facts in the existing collections while avoiding a second hand-authored
Typst content source.

The projection should support a controlled publication block model:

- headings
- paragraphs
- strong/emphasis/inline code
- links
- ordered and unordered lists
- blockquotes
- code blocks
- thematic breaks
- images
- footnotes
- inline notes
- photo entries/spreads

Known MDX components should become structured projection data:

- `LanguageSwitcher` becomes related-language metadata, not visible body prose.
- `FootnoteRef` and `Footnote` become a footnote model.
- `InlineNoteRef` becomes an annotation or sidenote model.

Unsupported Markdown/MDX nodes or unknown components must fail the build with the source
entry and unsupported node named.

### Render Typst to static SVG at build time

The Collected Edition web reading surface should be generated from Typst to paginated SVG
assets during build. Astro pages should display generated SVG pages; they should not invoke
Typst in the browser for first read.

Alternatives considered:

- Browser-side Typst: gives runtime flexibility, but creates WASM/font loading pressure and
  risks visible reflow for reading pages.
- Typst HTML: could be attractive for accessibility and text selection, but it is not the
  desired first target and adds uncertainty to a layout-first feature.
- Embedded PDF: preserves pagination, but web reading, mobile behavior, links, and styling
  are less natural than site-owned SVG pages.

Static SVG gives deterministic page layout, fast cacheable reads, and a clear first release.
PDF export remains a later artifact, not the primary reading surface.

### Keep the Collected Edition separate from Resume PDF

Both features use Typst, but their capabilities are separate. Resume PDF is a traditional
single-document artifact derived from So Far content. Collected Edition is a curated,
book-like reading surface derived from Thoughts, Now, and Moments.

The implementation can reuse low-level learning about fonts, generated assets, and build
scripts, but specs, routes, and validation should remain separate.

## Risks / Trade-offs

- SVG output can become large for long entries -> Start with opt-in MVP content, lazy-load
  page images where appropriate, and keep whole-book export out of the first release.
- SVG text may be less accessible/selectable than HTML -> Keep canonical HTML routes
  unchanged and link back to them; revisit Typst HTML or accessible sidecar text later.
- Markdown/MDX projection coverage can be incomplete -> Fail builds for unsupported nodes
  rather than silently dropping content.
- Build time can increase -> Keep the first release scoped to a small opt-in set and add
  clear generated-artifact checks before broadening content coverage.
- Photography pages can ship oversized images -> Use the existing Astro image asset
  pipeline or a controlled static export step to provide appropriately sized images for
  Typst/SVG generation.
- Generated publication assets can drift from source content -> Regenerate during build
  and add validation that included content has corresponding projection and SVG outputs.

## Migration Plan

1. Extend content schemas with optional `collected` metadata for Thoughts, Now, and Moments.
2. Opt in one representative Thoughts entry, one Now entry, and at least one Moments entry.
3. Add the Collected Projection script that emits a manifest and per-entry JSON documents.
4. Add Typst templates for article, now, and photography layouts.
5. Add the build-time Typst-to-SVG generation step for included entries.
6. Add `/collected` and child Astro routes that display the generated manifest and SVG pages.
7. Add validation for unsupported projection nodes and missing generated assets.
8. Verify with `pnpm check`, `pnpm build`, and browser smoke tests for the cover page,
   representative Thoughts page, representative Now page, and Photography Collection page.

## Open Questions

- Exact visual design of the Collected Edition cover, page chrome, and navigation remains
  open for the implementation pass.
- Exact SVG generation toolchain can be selected during implementation, but it must preserve
  the build-time Typst-to-SVG boundary.
- Whole-book PDF export is intentionally deferred and should be specified separately when
  the reading surface is stable.
