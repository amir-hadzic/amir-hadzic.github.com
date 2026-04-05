import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    hidden: z.boolean().optional(),
    outdated: z.boolean().optional(),
    bookreview: z.boolean().optional(),
  }),
});

export const collections = { posts };
