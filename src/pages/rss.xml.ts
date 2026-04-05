import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getSortedPosts, getPostSlug } from "../lib/posts";

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();

  return rss({
    title: "Amir Hadžić",
    description: "Amir Hadžić's personal blog",
    site: context.site!.toString(),
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/${getPostSlug(post.id)}`,
    })),
  });
}
