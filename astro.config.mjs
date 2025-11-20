// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://realmorrisliu.com",
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  trailingSlash: "never",
  build: {
    format: "file",
  },
  integrations: [
    mdx(),
    icon(),
    react(),
    keystatic(),
    sitemap({
      customPages: [
        "https://realmorrisliu.com/",
        "https://realmorrisliu.com/so-far",
        "https://realmorrisliu.com/so-far/zh",
        "https://realmorrisliu.com/thoughts",
      ],
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // Set different priorities based on page type
        if (item.url === "https://realmorrisliu.com/") {
          item.priority = 1.0;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        } else if (item.url === "https://realmorrisliu.com/thoughts") {
          // Thoughts index page
          item.priority = 0.9;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (item.url.includes("/thoughts/")) {
          // Individual blog posts
          item.priority = 0.8;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        } else if (item.url.includes("/so-far/")) {
          item.priority = 0.8;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        } else if (item.url.includes("/pdf/")) {
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
});
