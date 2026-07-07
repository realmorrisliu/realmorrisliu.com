## Why

The site needs an optional book-like reading surface for long-form content without
replacing the current HTML routes. The recent Typst resume work proved the value of
document-grade layout, but applying browser-side typesetting directly to normal prose made
the default reading experience too sensitive to loading and reflow.

## What Changes

- Add a Collected Edition entrypoint that presents selected site content as a book-like
  publication surface.
- Collect eligible Thoughts entries, Now pages, and Moments entries through an explicit
  opt-in model.
- Add a build-time Collected Projection that converts existing Astro content collections
  into strict JSON publication inputs.
- Render Collected Edition reading pages from Typst to static SVG pages during the build.
- Display generated SVG pages through Astro routes with collection navigation, table of
  contents, and previous/next movement.
- Treat Moments entries as a Photography Collection rather than ordinary prose articles.
- Keep the existing `/thoughts`, `/now`, `/moments`, and `/so-far` routes unchanged.
- Exclude browser-side Typst rendering and whole-book PDF export from the first release.

## Capabilities

### New Capabilities

- `collected-edition`: Defines the optional Collected Edition surface, its content
  projection, build-time Typst-to-SVG rendering, route behavior, and MVP scope.

### Modified Capabilities

- None.

## Impact

- Affects `src/content` schemas by adding optional Collected Edition metadata.
- Adds build scripts for Collected Projection generation and Typst SVG rendering.
- Adds Typst templates and generated static SVG artifacts for Collected Edition pages.
- Adds Astro routes and components under a new `/collected` surface.
- Adds validation for unsupported Markdown/MDX nodes and missing generated artifacts.
- Does not change the default HTML reading routes or the existing Resume PDF Typst runtime.
