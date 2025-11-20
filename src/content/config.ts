import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("Morris Liu"),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    readingTime: z.number().optional(),
  }),
});

const now = defineCollection({
  type: "content",
  schema: z.object({
    summary: z.string(),
    lastUpdated: z.coerce.date(),
    title: z.string().default("Now"),
    description: z.string().optional(),
  }),
});

const moments = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      date: z.coerce.date(),
      location: z.string().optional(),
      camera: z.string().optional(),
      lens: z.string().optional(),
      iso: z.string().optional(),
      aperture: z.string().optional(),
      shutterSpeed: z.string().optional(),
    }),
});

export const collections = { blog, now, moments };
