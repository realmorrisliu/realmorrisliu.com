import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog"))
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: "Morris Liu - Thoughts",
    description:
      "Technical thoughts and insights from Morris Liu on software engineering, leadership, AI infrastructure, and open source development.",
    site: context.site || "https://realmorrisliu.com",
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/thoughts/${post.id.replace(/\.md$/, "")}`,
      author: post.data.author || "Morris Liu",
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
    stylesheet: "/rss/styles.xsl",
  });
}
