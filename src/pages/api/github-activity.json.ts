import {
  CACHE_TTL_SECONDS,
  getCachedGitHubActivity,
  STALE_WHILE_REVALIDATE_SECONDS,
} from "@utils/githubActivity";
import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ locals }: APIContext) {
  const data = await getCachedGitHubActivity({
    runtime: locals.runtime,
    timeoutMs: 10000,
  });

  if (!data) {
    return new Response(JSON.stringify({ available: false }), {
      status: 503,
      headers: {
        "cache-control": "no-store",
        "content-type": "application/json; charset=utf-8",
      },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "cache-control": `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`,
      "content-type": "application/json; charset=utf-8",
    },
  });
}
