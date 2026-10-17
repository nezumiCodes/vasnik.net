import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1).max(90),
        description: z.string().min(1).max(160),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        tags: z
          .array(z.string().regex(kebabCase, 'Tags must be lowercase kebab-case, e.g. "power-bi"'))
          .default([]),
        draft: z.boolean().default(false),
        heroImage: image().optional(),
        heroAlt: z.string().min(1).optional(),
        /** Photo credit shown under the hero image, e.g. "Photo by X on Unsplash". */
        heroCredit: z
          .object({
            author: z.string().min(1),
            authorUrl: z.url({ protocol: /^https$/ }),
            source: z.string().min(1),
            sourceUrl: z.url({ protocol: /^https$/ }),
          })
          .optional(),
        /**
         * The same article on Medium. `original: true` means Medium had it
         * first, so this page's canonical link points there; otherwise this
         * site is the original and Medium is the copy (use Medium's "Import
         * a story" so Medium's canonical points here).
         */
        medium: z
          .object({
            url: z.url({ protocol: /^https$/ }),
            publication: z.string().min(1).optional(),
            original: z.boolean().default(false),
          })
          .optional(),
      })
      .refine((post) => !post.heroImage || post.heroAlt, {
        message: 'heroAlt is required when heroImage is set',
        path: ['heroAlt'],
      })
      .refine((post) => !post.updatedDate || post.updatedDate >= post.pubDate, {
        message: 'updatedDate cannot be earlier than pubDate',
        path: ['updatedDate'],
      }),
});

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1).max(60),
    summary: z.string().min(1).max(160),
    outcomes: z.array(z.string().min(1)).min(2).max(4),
    tools: z.array(z.string().min(1)).min(1),
    engagement: z.enum(['fixed-scope', 'retainer', 'day-rate']),
    startingFrom: z.string().min(1).optional(),
    order: z.number().int().nonnegative(),
  }),
});

export const collections = { blog, services };
