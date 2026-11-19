import rss from "@astrojs/rss";
import assert from "node:assert/strict";
import test from "node:test";
import { thoughtFeedPath } from "./thoughtPath";

const publishedIds = [
  "why-alan-became-alan9.mdx",
  "why-alan-became-alan9-zh.mdx",
  "human-in-the-end-next-gen-agent-interaction.mdx",
  "human-in-the-end-next-gen-agent-interaction-zh.mdx",
  "do-things-that-dont-scale-zh.mdx",
  "zero-trust-secret-management-design-decisions.mdx",
  "zero-trust-secret-management-design-decisions-zh.mdx",
  "why-i-built-sealbox.md",
  "streaming-openrouter-rust-axum.md",
];

test("thought feed paths drop markdown extensions", () => {
  for (const id of publishedIds) {
    const slug = id.replace(/\.(md|mdx)$/, "");
    assert.equal(thoughtFeedPath(id), `/thoughts/${slug}`);
  }
  assert.equal(thoughtFeedPath("already-clean"), "/thoughts/already-clean");
});

test("rss item links stay on extensionless thought routes", async () => {
  const response = await rss({
    title: "Thoughts",
    description: "Fixture",
    site: "https://realmorrisliu.com",
    items: publishedIds.map(id => ({
      title: id,
      link: thoughtFeedPath(id),
      pubDate: new Date("2026-11-19T00:00:00.000Z"),
    })),
  });
  const xml = await response.text();
  const links = [...xml.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>/g)].map(match => match[1]);

  assert.equal(links.length, publishedIds.length);
  for (const link of links) {
    const pathname = new URL(link).pathname.replace(/\/$/, "");
    assert.equal(pathname.includes("."), false, link);
    assert.equal(
      publishedIds.some(id => pathname === `/thoughts/${id.replace(/\.(md|mdx)$/, "")}`),
      true,
      link
    );
  }
});
