import { getCollection } from "astro:content";

export async function getSortedPosts() {
  const posts = await getCollection("posts");
  return posts
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getPostSlug(id: string): string {
  // id is the filename without extension, e.g. "2013-05-04-Ember-and-Google-Analytics"
  // We want: /2013/05/04/Ember-and-Google-Analytics
  const match = id.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  if (!match) return id;
  const [, year, month, day, slug] = match;
  return `${year}/${month}/${day}/${slug}`;
}
