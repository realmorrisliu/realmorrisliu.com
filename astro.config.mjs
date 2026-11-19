// @ts-check
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Strip surrounding single or double quotes from a YAML scalar string.
 * @param {string} value
 * @returns {string}
 */
function stripQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

/**
 * Parse a frontmatter date string into an ISO-8601 timestamp if valid.
 * @param {string | undefined} raw
 * @returns {string | undefined}
 */
function toIsoDate(raw) {
  if (!raw) return undefined;
  const parsed = new Date(stripQuotes(raw));
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

/**
 * Parse the minimal YAML frontmatter fields needed for sitemap metadata.
 * @param {string} content
 * @returns {{ draft: boolean; pubDate?: string; updatedDate?: string; lastUpdated?: string; tags: string[] }}
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return { draft: false, tags: [] };
  }

  const lines = match[1].split(/\r?\n/);
  let draft = false;
  /** @type {string | undefined} */
  let pubDate;
  /** @type {string | undefined} */
  let updatedDate;
  /** @type {string | undefined} */
  let lastUpdated;
  /** @type {string[]} */
  const tags = [];
  let inTagsBlock = false;

  for (const line of lines) {
    if (inTagsBlock) {
      const listItem = line.match(/^\s+-\s+(.+)$/);
      if (listItem) {
        const tag = stripQuotes(listItem[1]).toLowerCase();
        if (tag) tags.push(tag);
        continue;
      }
      if (/^\s*$/.test(line)) {
        continue;
      }
      inTagsBlock = false;
    }

    const fieldMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!fieldMatch) continue;

    const [, key, rawValue] = fieldMatch;
    if (key === "draft") {
      draft = stripQuotes(rawValue).toLowerCase() === "true";
    } else if (key === "pubDate") {
      pubDate = toIsoDate(rawValue);
    } else if (key === "updatedDate") {
      updatedDate = toIsoDate(rawValue);
    } else if (key === "lastUpdated") {
      lastUpdated = toIsoDate(rawValue);
    } else if (key === "tags") {
      const trimmed = rawValue.trim();
      if (trimmed === "") {
        inTagsBlock = true;
      } else if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        const inner = trimmed.slice(1, -1);
        for (const item of inner.split(",")) {
          const tag = stripQuotes(item).toLowerCase();
          if (tag) tags.push(tag);
        }
      }
    }
  }

  return { draft, pubDate, updatedDate, lastUpdated, tags };
}

/**
 * Load real frontmatter lastmod dates and non-draft blog tag counts at config load time.
 */
function loadContentSitemapMetadata() {
  /** @type {Map<string, string>} */
  const lastmodByPath = new Map();
  /** @type {Map<string, number>} */
  const tagPostCounts = new Map();

  const blogDir = path.join(rootDir, "src/content/blog");
  /** @type {string | undefined} */
  let latestBlogDate;

  if (fs.existsSync(blogDir)) {
    for (const file of fs.readdirSync(blogDir)) {
      if (!/\.(md|mdx)$/.test(file)) continue;
      const content = fs.readFileSync(path.join(blogDir, file), "utf8");
      const fm = parseFrontmatter(content);
      if (fm.draft) continue;

      const slug = file.replace(/\.(md|mdx)$/, "");
      const postDate = fm.updatedDate ?? fm.pubDate;
      if (postDate) {
        lastmodByPath.set(`/thoughts/${slug}`, postDate);
        if (!latestBlogDate || postDate > latestBlogDate) {
          latestBlogDate = postDate;
        }
      }

      for (const tag of new Set(fm.tags)) {
        tagPostCounts.set(tag, (tagPostCounts.get(tag) ?? 0) + 1);
      }
    }
  }

  if (latestBlogDate) {
    lastmodByPath.set("/thoughts", latestBlogDate);
  }

  const nowDir = path.join(rootDir, "src/content/now");
  /** @type {string | undefined} */
  let latestNowDate;

  if (fs.existsSync(nowDir)) {
    for (const file of fs.readdirSync(nowDir)) {
      if (!/\.md$/.test(file)) continue;
      const content = fs.readFileSync(path.join(nowDir, file), "utf8");
      const fm = parseFrontmatter(content);
      if (!fm.lastUpdated) continue;

      const dateSlug = file.replace(/\.md$/, "");
      lastmodByPath.set(`/now/${dateSlug}`, fm.lastUpdated);
      if (!latestNowDate || fm.lastUpdated > latestNowDate) {
        latestNowDate = fm.lastUpdated;
      }
    }
  }

  if (latestNowDate) {
    lastmodByPath.set("/now", latestNowDate);
    lastmodByPath.set("/now/archive", latestNowDate);
  }

  return { lastmodByPath, tagPostCounts };
}

/**
 * Normalize a full sitemap URL into a canonical pathname for matching and filtering.
 * @param {string} url
 * @returns {string}
 */
function normalizeSitemapPathname(url) {
  return (
    new URL(url).pathname
      .replace(/\/index\.html$/, "")
      .replace(/\.html$/, "")
      .replace(/\/$/, "") || "/"
  );
}

const { lastmodByPath, tagPostCounts } = loadContentSitemapMetadata();

// https://astro.build/config
export default defineConfig({
  site: "https://realmorrisliu.com",
  trailingSlash: "never",

  output: "server",

  build: {
    format: "file",
  },

  integrations: [
    mdx(),
    icon({
      include: {
        logos: ["github-icon", "x", "ycombinator"],
        lucide: ["rss"],
      },
    }),
    react(),
    sitemap({
      customPages: [
        "https://realmorrisliu.com/",
        "https://realmorrisliu.com/so-far",
        "https://realmorrisliu.com/so-far/zh",
        "https://realmorrisliu.com/thoughts",
        "https://realmorrisliu.com/cci",
        "https://realmorrisliu.com/cci/zh",
      ],
      changefreq: "weekly",
      priority: 0.7,
      filter(page) {
        const pathname = normalizeSitemapPathname(page);
        if (pathname === "/og-generator" || pathname === "/og-preview") {
          return false;
        }
        if (pathname.startsWith("/thoughts/tags/")) {
          const tag = decodeURIComponent(pathname.slice("/thoughts/tags/".length)).toLowerCase();
          return (tagPostCounts.get(tag) ?? 0) >= 2;
        }
        return true;
      },
      serialize(item) {
        const pathname = normalizeSitemapPathname(item.url);
        const lastmod = lastmodByPath.get(pathname);
        if (lastmod) {
          item.lastmod = lastmod;
        }

        // Set different priorities based on page type
        if (pathname === "/") {
          item.priority = 1.0;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        } else if (pathname === "/thoughts") {
          // Thoughts index page
          item.priority = 0.9;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (pathname.startsWith("/thoughts/tags/")) {
          // Multi-post tag hub pages
          item.priority = 0.6;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (pathname.startsWith("/thoughts/")) {
          // Individual blog posts
          item.priority = 0.8;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        } else if (pathname === "/cci" || pathname.startsWith("/cci/")) {
          item.priority = 0.8;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        } else if (pathname.startsWith("/so-far/")) {
          item.priority = 0.8;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        } else if (pathname.includes("/pdf/")) {
          item.priority = 0.6;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        }
        return item;
      },
    }),
  ],

  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: false,
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ["async_hooks"],
    },
  },

  markdown: {
    shikiConfig: {
      // 使用 github-light 作为默认主题
      theme: "github-light",
      // 或者为浅色和深色模式设置双主题
      themes: {
        light: "github-light",
        dark: "github-light", // 我们只使用 light 主题
      },
      // 启用 word wrap 防止代码溢出
      wrap: true,
    },
  },

  adapter: cloudflare({
    imageService: "compile",
  }),
});
