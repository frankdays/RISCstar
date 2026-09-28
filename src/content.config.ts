import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per blog post in src/content/blog/. The file name is the URL slug.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    modified: z.coerce.date().optional(),
    author: z.string(),
    authorSlug: z.string(),
    authorBio: z.string().optional(),
    authorAvatar: z.string().optional(),
    categories: z.array(z.string()),
    image: z.string(),
    imageAlt: z.string().default(''),
    imageWidth: z.number().optional(),
    imageHeight: z.number().optional(),
    seoTitle: z.string().optional(),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    // Listed on the blog, but the post URL forwards here (e.g. the whitepaper).
    redirect: z.string().optional(),
    draft: z.boolean().default(false),
    // --- carried over from WordPress (not needed for new posts) ---
    /** Extra stylesheets the original post used (its Elementor post CSS, widget CSS). */
    legacyStyles: z.array(z.string()).optional(),
    /** Extra scripts the original post used (e.g. Prism for code blocks). */
    legacyScripts: z.array(z.string()).optional(),
    /** Written in the classic WordPress editor: body renders without an Elementor container. */
    classic: z.boolean().optional(),
  }),
});

export const collections = { blog };
