#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const args = new Set(process.argv.slice(2));
const buildSite = args.has("--build-site") || args.has("--deploy-site");
const deploySite = args.has("--deploy-site");
const dryRun = args.has("--dry-run");

const requiredEnv = name => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
};

const optionalEnv = name => process.env[name]?.trim() || undefined;

const gitSha = () => {
  try {
    return execFileSync("git", ["rev-parse", "--short=12", "HEAD"], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return undefined;
  }
};

const normalizePath = value => value.replace(/^\/+|\/+$/g, "");
const normalizeBaseUrl = value => value.replace(/\/+$/g, "");

const bucket = requiredEnv("RESUME_TYPST_R2_BUCKET");
const publicBaseUrl = normalizeBaseUrl(requiredEnv("RESUME_TYPST_R2_PUBLIC_BASE_URL"));
const version =
  optionalEnv("RESUME_TYPST_ARTIFACT_VERSION") ??
  optionalEnv("WORKERS_CI_COMMIT_SHA") ??
  optionalEnv("CF_PAGES_COMMIT_SHA") ??
  optionalEnv("GITHUB_SHA") ??
  gitSha();

if (!version) {
  throw new Error("Unable to determine artifact version; set RESUME_TYPST_ARTIFACT_VERSION");
}

const prefix = normalizePath(
  optionalEnv("RESUME_TYPST_R2_PREFIX") ?? `resume-typst-artifacts/${version}`
);
const artifactBaseUrl = `${publicBaseUrl}/${prefix}`;
const cacheControl =
  optionalEnv("RESUME_TYPST_CACHE_CONTROL") ?? "public, max-age=31536000, immutable";

const run = (command, commandArgs, options = {}) => {
  const { respectDryRun = true, ...spawnOptions } = options;

  if (dryRun && respectDryRun) {
    console.log(`[dry-run] ${command} ${commandArgs.join(" ")}`);
    return;
  }

  const result = spawnSync(command, commandArgs, {
    cwd: repoRoot,
    env: process.env,
    stdio: "inherit",
    ...spawnOptions,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${commandArgs.join(" ")} failed with exit code ${result.status}`);
  }
};

run(process.execPath, ["scripts/generate-resume-typst-assets.mjs"], { respectDryRun: false });

const artifacts = [
  {
    file: "public/resume-typst-wasm/browser.js",
    key: `${prefix}/wasm/browser.js`,
    contentType: "application/javascript; charset=utf-8",
  },
  {
    file: "public/resume-typst-wasm/resume_typst_wasm.js",
    key: `${prefix}/wasm/resume_typst_wasm.js`,
    contentType: "application/javascript; charset=utf-8",
  },
  {
    file: "public/resume-typst-wasm/resume_typst_wasm_bg.wasm",
    key: `${prefix}/wasm/resume_typst_wasm_bg.wasm`,
    contentType: "application/wasm",
  },
  {
    file: "public/resume-typst/fonts/NotoSansCJKsc-Regular.otf",
    key: `${prefix}/fonts/NotoSansCJKsc-Regular.otf`,
    contentType: "font/otf",
  },
  {
    file: "public/resume-typst/fonts/NotoSansCJKsc-ResumeSubset.ttf",
    key: `${prefix}/fonts/NotoSansCJKsc-ResumeSubset.ttf`,
    contentType: "font/ttf",
  },
];

for (const artifact of artifacts) {
  const filePath = path.join(repoRoot, artifact.file);
  if (!existsSync(filePath)) {
    throw new Error(`Missing artifact file: ${artifact.file}`);
  }

  run("pnpm", [
    "exec",
    "wrangler",
    "r2",
    "object",
    "put",
    `${bucket}/${artifact.key}`,
    "--remote",
    "--file",
    artifact.file,
    "--content-type",
    artifact.contentType,
    "--cache-control",
    cacheControl,
  ]);
}

console.log(`PUBLIC_RESUME_TYPST_ARTIFACT_BASE_URL=${artifactBaseUrl}`);

if (buildSite) {
  run("pnpm", ["exec", "astro", "build"], {
    env: {
      ...process.env,
      PUBLIC_RESUME_TYPST_ARTIFACT_BASE_URL: artifactBaseUrl,
    },
  });
}

if (deploySite) {
  run("pnpm", ["exec", "wrangler", "deploy"]);
}
