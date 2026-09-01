import type { PublishedCciRelease } from "./model";

const modules = import.meta.glob("./data/releases/*.json", {
  eager: true,
  import: "default",
}) as Record<string, PublishedCciRelease>;

export const cciReleases = Object.values(modules).sort(
  (left, right) =>
    right.asOf.localeCompare(left.asOf) || right.releaseId.localeCompare(left.releaseId)
);

const latest = cciReleases[0];
if (!latest) throw new Error("No CCI release found");

export const latestCciRelease = latest;
