import type { APIContext } from "astro";
import { getResumePdfData } from "@utils/resumePdfData";

export const prerender = true;

export function GET(_context: APIContext) {
  return new Response(JSON.stringify(getResumePdfData("en")), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
