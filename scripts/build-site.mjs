#!/usr/bin/env node
// Two steps, in order:
//   1. generate-resume-typst-assets.mjs downloads the prebuilt Typst wasm and
//      the full CJK font (neither is in git), then regenerates the subset font
//      and the SVG previews from the current resume data.
//   2. astro build. Everything the browser needs is under public/, so the site
//      serves it same-origin and no R2 credentials are needed at build time.
import { spawnSync } from "node:child_process";

const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: "inherit" });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

run(process.execPath, ["scripts/generate-resume-typst-assets.mjs"]);

// ponytail: the 20+ MB wasm rides along in dist/, close to the 25 MiB
// per-file limit for Worker assets. Move it out of public/ and back onto R2
// only if a deploy actually trips that limit.
run("pnpm", ["exec", "astro", "build"]);
