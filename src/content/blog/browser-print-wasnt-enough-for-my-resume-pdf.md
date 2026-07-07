---
title: "Browser Print Wasn't Enough for My Resume PDF"
description: "I rebuilt my resume PDF flow with Typst after browser print styles kept making the preview and the final PDF drift apart."
pubDate: 2026-07-07
tags: ["typst", "pdf", "astro", "web-development"]
draft: false
featured: false
author: "Morris Liu"
readingTime: 6
---

I used to have a PDF resume page on my website that looked fine in the browser.

Then I tried to treat the exported PDF as something real: a file I could send to someone, attach to an application, and expect to look the same every time. That was when the cracks started to show.

The page itself was HTML. The export path was the browser print dialog. Somewhere between those two steps, layout could drift: a line would wrap differently, a section would gain a little height, a page that looked perfectly balanced in the preview would turn into something slightly off in the final PDF.

## The Old Flow

The first version was the obvious one for a personal website.

I reused the existing resume content, built a dedicated HTML page, added print styles, and triggered the browser print dialog when the page loaded. The core of the flow was almost embarrassingly simple:

```js
window.addEventListener("load", () => {
  setTimeout(() => {
    window.print();
  }, 500);
});
```

For a first pass, this was perfectly reasonable. HTML and CSS were already powering the site. Astro already owned the content. A print stylesheet can get surprisingly far when the document is simple enough.

The catch is that the browser print engine quietly becomes part of the product.

Clicking "download" did not produce a file. It opened a browser-controlled dialog. The user still had to choose "Save as PDF", confirm the paper size, check margins, and hope the browser interpreted the print CSS the same way I did.

For a casual export, that is fine. For a resume, it felt wrong. The most important step in the flow belonged to UI outside my application.

## Where It Broke

The dialog was annoying. The deeper issue was the feedback loop.

The HTML preview could look correct while the saved PDF still came out different. That mismatch is especially painful for a resume. A resume is a high-density, one-page document where tiny layout changes matter. A small difference in line height, font metrics, or paragraph wrapping can push a section into the wrong place.

I kept falling into the same loop:

- reduce a margin here
- compress a line-height there
- check the browser preview
- open print
- save a PDF
- inspect the result
- repeat

That loop is a bad sign. It means the preview has become a guess.

Three problems kept showing up.

**Preview drift.** The browser page and the saved PDF were related. The preview still never felt authoritative. I wanted the preview and the final PDF to come from the same rendering model.

**A weak export path.** The final step depended on the print dialog, browser defaults, and user choices. The application could suggest a PDF. The browser still decided how that PDF was created.

**A layout ceiling.** I wanted predictable page size, margins, typography, justification, and page-fitting behavior. HTML print styles can approximate those things. They also make you work against the grain.

At some point the diagnosis became obvious: I was asking a web page to behave like a typeset document.

## Why Typst Fit

Typst gave me a better mental model.

With browser print, I was trying to make a page print like a resume. With Typst, I could compile the resume as a document from the beginning.

In Typst, page size, margins, font choice, paragraph behavior, and justification are first-class parts of the document. A small part of my resume template looks like this:

```typst
#set page(
  paper: "a4",
  margin: (top: 8mm, bottom: 8mm, left: 12mm, right: 12mm),
)
#set text(font: font, lang: lang, size: body-size, fill: ink)
#set par(leading: body-leading, spacing: 0.18em, justify: true)
```

That is the kind of control I wanted. The syntax matters less than the model: the system is designed around documents.

The benefits were concrete:

- I could generate PDF bytes directly.
- The template could express A4 sizing, margins, typography, and justification directly.
- The layout work moved into a real document template.
- The preview and the downloaded PDF could come from the same Typst source and the same resume data.

That last point matters most. The goal was never a prettier preview. I wanted the preview and the downloaded PDF to be two outputs of the same document pipeline.

In the practical sense, that is the kind of WYSIWYG I care about.

## The Shape I Ended Up With

The site still owns the content. I did not want a hand-maintained resume file drifting away from the website.

My resume content already lives in the same translation data that powers the web version of the "So Far" page. The PDF flow takes that structured data, turns it into a small JSON payload, and passes it into a Typst template.

The boundary now looks like this:

```txt
Astro/i18n resume data
  -> JSON payload
  -> Typst template
  -> SVG preview and PDF export
```

Astro owns the website. Typst owns the PDF document.

I exposed the Typst renderer through a small WASM bridge so the browser can generate the final PDF without sending resume data to a server.

If you want to inspect the implementation, it is in my [site repository](https://github.com/realmorrisliu/realmorrisliu.com). The useful entry points are the [Typst template](https://github.com/realmorrisliu/realmorrisliu.com/blob/73a83cf74813fc020f52240a04adf30ec7fd5c14/public/resume-typst/resume.typ), the [WASM bridge](https://github.com/realmorrisliu/realmorrisliu.com/blob/73a83cf74813fc020f52240a04adf30ec7fd5c14/crates/resume-typst-wasm/src/lib.rs), the [build-time asset generator](https://github.com/realmorrisliu/realmorrisliu.com/blob/73a83cf74813fc020f52240a04adf30ec7fd5c14/scripts/generate-resume-typst-assets.mjs), and the [browser runtime](https://github.com/realmorrisliu/realmorrisliu.com/blob/73a83cf74813fc020f52240a04adf30ec7fd5c14/src/scripts/resume-pdf-runtime.ts).

The code is less interesting than the boundary it creates.

The website can keep being a website. The PDF can finally be a document.

## The Catch: WASM Isn't Free

The first Typst version had a much better rendering model. It also made the page feel too heavy.

On the first pass, the browser loaded the Typst compiler, the WASM binary, the Typst source, the resume JSON, and the font before the preview felt ready.

That forced another split:

```txt
build time:
  Typst source + resume data -> static SVG preview

browser runtime:
  warm Typst compiler in the background
  export PDF when the user clicks Download PDF
```

The current version pre-renders the SVG preview during the site build, subsets the CJK font used by the resume, preloads only the preview image, and warms the Typst compiler in the background when the network looks reasonable.

That gives the page the right first impression. The resume appears quickly, without waiting for the full compiler path. The heavier Typst machinery is still available for export, and it no longer blocks the preview.

This was the main lesson from the optimization pass:

Typst solved the rendering model. It did not automatically solve the loading model.

Those are different problems. The final design had to handle both.

## What I Learned

HTML is still the right medium for the web version of my resume. It is responsive, linkable, easy to style with the rest of the site, and natural for browsing.

The downloadable PDF is a different artifact.

It needs document-level guarantees: stable pagination, predictable typography, controlled margins, and a direct export path. Browser print gave me a clever shortcut. Typst gave me the right boundary.

Plenty of PDFs do not need this much machinery. A rough export of a web page can live happily in the print dialog. Strong-layout content is different. A resume is closer to a document than a page capture.

A web page should not have to pretend to be a document.

Now mine does not.

---

_You can see the current version in action on my [resume PDF page](/so-far/pdf)._
