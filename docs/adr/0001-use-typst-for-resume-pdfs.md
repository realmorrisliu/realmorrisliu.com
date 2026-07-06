# Use Browser-Side Typst for Resume PDFs

The current Resume PDF flow depends on a print-specific HTML page and the user's browser
print dialog, which makes the "download PDF" path indirect and browser-dependent. We will
host the Typst source and compile it in the browser while keeping the So Far Page in Astro
and keeping the Resume Content Source as the shared source of truth; this gives up a small,
prebuilt static PDF artifact in exchange for live Typst source hosting, realtime preview,
and a browser-owned PDF download path.
