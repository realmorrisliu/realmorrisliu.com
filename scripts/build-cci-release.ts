import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sourceManifest from "../src/cci/data/source-manifest-v1.json";
import {
  buildRelease,
  type CandidateReleaseInput,
  type PublishedCciRelease,
} from "../src/cci/model";

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

function canonicalJson(value: JsonValue): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  return `{${Object.keys(value)
    .sort()
    .map(key => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
    .join(",")}}`;
}

function sha256(value: JsonValue): string {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

const dataDirectory = fileURLToPath(new URL("../src/cci/data", import.meta.url));
const candidateFilename = readdirSync(dataDirectory)
  .filter(filename => /^candidate-\d{4}-\d{2}(?:-\d+)?\.ts$/.test(filename))
  .sort((left, right) =>
    left.slice(0, -3).localeCompare(right.slice(0, -3), "en", { numeric: true })
  )
  .at(-1);
if (!candidateFilename) throw new Error("No CCI candidate input found");

const candidateModule = (await import(
  pathToFileURL(join(dataDirectory, candidateFilename)).href
)) as { default?: CandidateReleaseInput };
const candidate = candidateModule.default;
if (!candidate) throw new Error(`${candidateFilename} must default-export a CCI candidate`);
if (!/^CCI-\d{4}\.\d{2}(?:\.\d+)?$/.test(candidate.releaseId)) {
  throw new Error(`Invalid immutable release ID: ${candidate.releaseId}`);
}
if (candidate.sourceManifestVersion !== sourceManifest.manifestVersion) {
  throw new Error("Candidate and source manifest versions do not match");
}

const core = buildRelease(candidate);
const sourceManifestSha256 = sha256(sourceManifest as JsonValue);
const inputSha256 = sha256({
  candidate,
  sourceManifest,
} as unknown as JsonValue);
const outputPayload = {
  ...core,
  sourceManifestSha256,
  checksums: { inputSha256 },
};
const release: PublishedCciRelease = {
  ...outputPayload,
  checksums: {
    inputSha256,
    outputPayloadSha256: sha256(outputPayload as unknown as JsonValue),
  },
};
const output = `${JSON.stringify(release, null, 2)}\n`;
const outputPath = join(dataDirectory, "releases", `${candidate.releaseId.toLowerCase()}.json`);

if (process.argv.includes("--check")) {
  if (!existsSync(outputPath) || readFileSync(outputPath, "utf8") !== output) {
    console.error("CCI release is stale. Run pnpm cci:build.");
    process.exit(1);
  }
  console.log("CCI release is current.");
} else {
  if (existsSync(outputPath) && readFileSync(outputPath, "utf8") !== output) {
    console.error(
      `Refusing to overwrite immutable ${candidate.releaseId}; create a newer candidate release.`
    );
    process.exit(1);
  }
  mkdirSync(dirname(outputPath), { recursive: true });
  if (!existsSync(outputPath)) writeFileSync(outputPath, output);
  console.log(`${candidate.releaseId} is current at ${outputPath}`);
}
