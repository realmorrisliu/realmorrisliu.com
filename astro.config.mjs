// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      // 使用 github-light 作为默认主题
      theme: 'github-light',
      // 或者为浅色和深色模式设置双主题
      themes: {
        light: 'github-light',
        dark: 'github-light' // 我们只使用 light 主题
      },
      // 启用 word wrap 防止代码溢出
      wrap: true,
    },
  },
});
