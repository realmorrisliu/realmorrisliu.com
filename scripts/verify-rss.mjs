import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function option(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} needs a value`);
  }
  return value;
}

const base = option("--base", "");
const distDir = option("--dist", "dist");
const contentDir = option("--content", path.join("src", "content", "blog"));

if (!base) {
  console.error(
    "Usage: node scripts/verify-rss.mjs --base http://127.0.0.1:4321 [--dist dist] [--content src/content/blog]"
  );
  process.exit(2);
}

const baseUrl = new URL(base);
const failures = [];

function fail(message) {
  failures.push(message);
}

function frontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? "";
}

function isDraft(markdown) {
  return /^draft:\s*true\s*$/m.test(frontmatter(markdown));
}

function canonicalPath(slug) {
  return `/thoughts/${slug}`;
}

function slugFromFilename(filename) {
  return filename.replace(/\.(md|mdx)$/, "");
}

function itemBlocks(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(match => match[1]);
}

function itemTag(block, name) {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([^<]*)</${name}>`));
  return match?.[1]?.replaceAll("&amp;", "&") ?? "";
}

const posts = readdirSync(contentDir)
  .filter(filename => /\.(md|mdx)$/.test(filename))
  .sort()
  .map(filename => {
    const markdown = readFileSync(path.join(contentDir, filename), "utf8");
    const slug = slugFromFilename(filename);
    return {
      filename,
      slug,
      draft: isDraft(markdown),
      canonical: canonicalPath(slug),
    };
  });

const builtArticles = new Set(
  readdirSync(path.join(distDir, "thoughts"))
    .filter(filename => filename.endsWith(".html"))
    .map(filename => canonicalPath(filename.slice(0, -".html".length)))
);

const feedResponse = await fetch(new URL("/rss.xml", baseUrl));
if (!feedResponse.ok) {
  fail(`GET /rss.xml returned ${feedResponse.status}`);
}
const feedXml = await feedResponse.text();
const feedItems = itemBlocks(feedXml).map(block => {
  const link = itemTag(block, "link");
  const guid = itemTag(block, "guid");
  const pathname = link ? new URL(link).pathname.replace(/\/$/, "") || "/" : "";
  return { link, guid, pathname };
});
const feedByPath = new Map(feedItems.map(item => [item.pathname, item]));

console.log("feature map");
for (const post of posts) {
  const item = feedByPath.get(post.canonical);
  console.log(
    [
      post.draft ? "draft" : "published",
      post.filename,
      post.canonical,
      builtArticles.has(post.canonical) ? "built" : "missing-build",
      item ? item.link : "missing-feed",
    ].join("\t")
  );
}

for (const item of feedItems) {
  if (item.pathname.includes(".mdx") || item.pathname.endsWith(".md")) {
    fail(`feed link keeps a markdown extension: ${item.link}`);
  }
  if (item.guid !== item.link) {
    fail(`feed guid ${item.guid} does not match link ${item.link}`);
  }
  if (!builtArticles.has(item.pathname)) {
    fail(`feed link ${item.link} has no built route ${item.pathname}`);
  }
}

for (const post of posts) {
  const inFeed = feedByPath.has(post.canonical);
  const built = builtArticles.has(post.canonical);
  if (post.draft) {
    if (inFeed) fail(`draft ${post.filename} is in the feed`);
    if (built) fail(`draft ${post.filename} was built at ${post.canonical}`);
    continue;
  }
  if (!built) fail(`published ${post.filename} has no built route ${post.canonical}`);
  if (!inFeed) fail(`published ${post.filename} is missing from the feed`);
  if (post.filename.endsWith(".mdx")) {
    const legacy = new URL(`${post.canonical}.mdx`, baseUrl);
    const legacyResponse = await fetch(legacy);
    if (legacyResponse.status !== 404) {
      fail(`${legacy.pathname} returned ${legacyResponse.status}, expected 404`);
    }
  }
}

const extraBuilt = [...builtArticles].filter(
  route => !posts.some(post => post.canonical === route)
);
for (const route of extraBuilt) {
  fail(`built route ${route} has no blog content file`);
}

for (const post of posts.filter(post => !post.draft)) {
  const item = feedByPath.get(post.canonical);
  if (!item) continue;
  const pageUrl = new URL(item.link);
  pageUrl.protocol = baseUrl.protocol;
  pageUrl.host = baseUrl.host;
  const pageResponse = await fetch(pageUrl);
  const finalPath = new URL(pageResponse.url).pathname.replace(/\/$/, "") || "/";
  console.log(`fetch\t${pageResponse.status}\t${pageUrl.pathname}\t${finalPath}`);
  if (pageResponse.status !== 200) {
    fail(`${item.link} returned ${pageResponse.status}`);
  }
  if (finalPath !== post.canonical) {
    fail(`${item.link} resolved to ${finalPath}, expected ${post.canonical}`);
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length} RSS check failure(s)`);
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`\nRSS check passed for ${posts.filter(post => !post.draft).length} published posts`);
