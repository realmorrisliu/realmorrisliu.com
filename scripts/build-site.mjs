#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const workersBuildDefaults = {
  accountId: "b96556986b5109d88eb943aef8a7fa6d",
  bucket: "realmorrisliu-resume-typst-artifacts",
  publicBaseUrl: "https://assets.realmorrisliu.com",
};

const isWorkersBuild = process.env.WORKERS_CI === "1";
const buildEnv = { ...process.env };

if (isWorkersBuild) {
  buildEnv.CLOUDFLARE_ACCOUNT_ID ??= workersBuildDefaults.accountId;
  buildEnv.RESUME_TYPST_R2_BUCKET ??= workersBuildDefaults.bucket;
  buildEnv.RESUME_TYPST_R2_PUBLIC_BASE_URL ??= workersBuildDefaults.publicBaseUrl;
}

const hasR2Config =
  Boolean(buildEnv.RESUME_TYPST_R2_BUCKET) && Boolean(buildEnv.RESUME_TYPST_R2_PUBLIC_BASE_URL);

const command = hasR2Config ? process.execPath : "pnpm";
const args = hasR2Config
  ? ["scripts/upload-resume-typst-artifacts-to-r2.mjs", "--build-site"]
  : ["exec", "astro", "build"];

const run = (runCommand, runArgs, env = buildEnv) => {
  const runResult = spawnSync(runCommand, runArgs, {
    env,
    stdio: "inherit",
  });

  if (runResult.error) {
    throw runResult.error;
  }

  if (runResult.status !== 0) {
    process.exit(runResult.status ?? 1);
  }
};

if (hasR2Config) {
  console.log("Building with R2-hosted Resume Typst artifacts.");
} else {
  console.log("Building with local Resume Typst artifact fallback.");
  run(process.execPath, ["scripts/generate-resume-typst-assets.mjs"]);
}

run(command, args);
