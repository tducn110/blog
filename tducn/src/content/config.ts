// ponytail: Type-safe Content Collection with zero boilerplate Zod schema
import { defineCollection, z } from 'astro:content';
import { CATEGORY_KEYS } from '../utils/categories';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    category: z.enum(CATEGORY_KEYS),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    recommendedFont: z.enum(['sans', 'academic', 'serif']).default('sans'),
    draft: z.boolean().default(false),
    lang: z.enum(['vi', 'en']).default('vi'),
    translationSlug: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
