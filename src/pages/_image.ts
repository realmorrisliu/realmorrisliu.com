import type { APIRoute } from "astro";
import { imageConfig } from "astro:assets";
import { isRemoteAllowed } from "@astrojs/internal-helpers/remote";
import { isRemotePath } from "@astrojs/internal-helpers/path";

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
  const href = url.searchParams.get("href");
  if (!href) {
    return new Response("Missing 'href' query parameter", {
      status: 400,
      statusText: "Missing 'href' query parameter",
    });
  }

  if (isRemotePath(href)) {
    if (isRemoteAllowed(href, imageConfig) === false) {
      return new Response("Forbidden", { status: 403 });
    }
    return Response.redirect(href, 302);
  }

  const assetUrl = new URL(href, url);
  if (assetUrl.origin !== url.origin) {
    return new Response("Forbidden", { status: 403 });
  }

  const assetRequest = new Request(assetUrl.toString());

  const assetsBinding = locals.runtime?.env?.ASSETS;
  if (assetsBinding?.fetch) {
    // On Cloudflare, use the ASSETS binding to load the compiled file directly.
    const response = await assetsBinding.fetch(assetRequest);
    if (response.status !== 404) {
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers),
      });
    }
  }

  // Fallback used in development or other adapters that can fetch from origin.
  const fallbackResponse = await fetch(assetRequest);
  return new Response(fallbackResponse.body, {
    status: fallbackResponse.status,
    statusText: fallbackResponse.statusText,
    headers: new Headers(fallbackResponse.headers),
  });
};
