## 1. Content Metadata

- [ ] 1.1 Extend `src/content/config.ts` with optional Collected Edition metadata for
  Thoughts, Now, and Moments entries.
- [ ] 1.2 Opt in one representative Thoughts entry, one Now entry, and at least one Moments
  entry for the MVP.
- [ ] 1.3 Add or update type helpers for Collected Edition metadata, section names, ordering,
  and photography spread options.

## 2. Collected Projection

- [ ] 2.1 Add a build-time Collected Projection script that reads Astro content collections
  and emits a manifest plus per-entry JSON documents.
- [ ] 2.2 Implement projection for included Thoughts entries with normalized metadata and a
  publication block tree.
- [ ] 2.3 Implement projection for included Now entries with normalized metadata and a
  publication block tree.
- [ ] 2.4 Implement projection for included Moments entries as photography entries with image
  and camera metadata.
- [ ] 2.5 Normalize supported Markdown structures into the controlled publication block model.
- [ ] 2.6 Normalize known MDX components: `LanguageSwitcher`, `FootnoteRef`, `Footnote`, and
  `InlineNoteRef`.
- [ ] 2.7 Fail projection with a clear source-entry error for unsupported Markdown nodes, MDX
  nodes, or unknown components.

## 3. Typst SVG Generation

- [ ] 3.1 Add Collected Edition Typst templates for prose articles, Now entries, and
  photography pages.
- [ ] 3.2 Add a build-time Typst-to-SVG generation step for projected entries.
- [ ] 3.3 Record generated SVG page asset paths in the Collected Edition manifest or entry
  metadata.
- [ ] 3.4 Add validation that every included entry has its projection JSON and generated SVG
  assets before deployment.

## 4. Collected Edition Routes

- [ ] 4.1 Add `/collected` as the Collected Edition cover and table-of-contents route.
- [ ] 4.2 Add Collected Edition reading routes for included Thoughts and Now entries.
- [ ] 4.3 Add a Photography Collection route for included Moments entries.
- [ ] 4.4 Display generated SVG pages in a vertically scrollable paginated reader.
- [ ] 4.5 Add table-of-contents, previous/next, and canonical HTML route navigation where
  applicable.
- [ ] 4.6 Ensure Collected Edition routes do not require browser-side Typst runtime loading
  for first-read display.

## 5. Quality Gates

- [ ] 5.1 Run `pnpm check`.
- [ ] 5.2 Run `pnpm build`.
- [ ] 5.3 Smoke-test `/collected` in a browser.
- [ ] 5.4 Smoke-test one Collected Thoughts reading page in a browser.
- [ ] 5.5 Smoke-test one Collected Now reading page in a browser.
- [ ] 5.6 Smoke-test the Photography Collection page in a browser.
- [ ] 5.7 Verify unsupported included content fails projection with a clear error message.
