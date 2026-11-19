/// <reference types="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type CloudflareEnv = {
  GITHUB_TOKEN?: string;
  GITHUB_USERNAME?: string;
};

type CloudflareRuntime = import("@astrojs/cloudflare").Runtime<CloudflareEnv>;

declare namespace App {
  interface Locals extends CloudflareRuntime {
    [key: string]: unknown;
  }
}
