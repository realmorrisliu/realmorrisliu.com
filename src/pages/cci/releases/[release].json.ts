import { cciReleases } from "@/cci/releases";
import type { APIContext } from "astro";

export const prerender = true;

export function getStaticPaths() {
  return cciReleases.map(release => ({
    params: { release: release.releaseId },
    props: { release },
  }));
}

export function GET({ props }: APIContext) {
  const release = props.release;
  return new Response(JSON.stringify(release), {
    headers: {
      "cache-control": "public, max-age=31536000, immutable",
      "content-type": "application/json; charset=utf-8",
      etag: `"${release.checksums.outputPayloadSha256}"`,
    },
  });
}
