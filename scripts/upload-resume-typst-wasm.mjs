#!/usr/bin/env node
// Publish the locally built Typst wasm to R2 so every build — local or CI —
// can download it instead of needing a Rust toolchain.
//
// Run after `pnpm build:typst-wasm`. If crates/resume-typst-wasm changed,
// bump WASM_VERSION in resume-typst-wasm-source.mjs first.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { WASM_DIR, WASM_FILES, WASM_VERSION } from "./resume-typst-wasm-source.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");

const bucket = process.env.RESUME_TYPST_R2_BUCKET?.trim() || "realmorrisliu-resume-typst-artifacts";

const contentTypes = {
  ".js": "application/javascript; charset=utf-8",
  ".wasm": "application/wasm",
};

for (const file of WASM_FILES) {
  const filePath = path.join(WASM_DIR, file);
  if (!existsSync(path.join(repoRoot, filePath))) {
    throw new Error(`Missing ${filePath} — run "pnpm build:typst-wasm" first`);
  }
}

for (const file of WASM_FILES) {
  const args = [
    "exec",
    "wrangler",
    "r2",
    "object",
    "put",
    `${bucket}/resume-typst-wasm/${WASM_VERSION}/${file}`,
    "--remote",
    "--file",
    path.join(WASM_DIR, file),
    "--content-type",
    contentTypes[path.extname(file)],
    "--cache-control",
    "public, max-age=31536000, immutable",
  ];

  if (dryRun) {
    console.log(`[dry-run] pnpm ${args.join(" ")}`);
    continue;
  }

  const result = spawnSync("pnpm", args, { cwd: repoRoot, stdio: "inherit" });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`Uploading ${file} failed with exit code ${result.status}`);
  }
}

console.log(`Published Typst wasm ${WASM_VERSION} to ${bucket}.`);
