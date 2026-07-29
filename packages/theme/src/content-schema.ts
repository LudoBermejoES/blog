import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
  Every field here is rendered by the cyberdream theme. The upstream schema also
  carried aiModel, aiMode, aiState, aiLatencyMs, aiConfidence, tokenCount,
  context, canonicalTopic and sourceLinks — props for the old AI-terminal blog
  layout. Nothing renders them any more, so they were only dead frontmatter for
  an author to wonder about.
*/
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      description: z.string(),
      // Coerced so a bare `2026-07-29` in frontmatter parses without quotes.
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      /*
        Describe heroImage when it carries meaning (a diagram, a screenshot).
        Omit it for purely decorative covers — the renderer falls back to
        alt="", which is what a screen reader should skip.
      */
      heroImageAlt: z.string().optional(),
      author: z.string().optional(),
      tags: z.array(z.string()).optional(),
      /*
        Both are derived from the body at build time when absent, so an author
        never fills them in. They stay overridable for the rare post where the
        automatic count is misleading — a piece that is mostly code blocks, say.
      */
      readMinutes: z.number().int().positive().optional(),
      wordCount: z.number().int().nonnegative().optional(),
      /*
        Drafts are excluded from every locale's listing, feed and route, and are
        exempt from `npm run check:translations`. This is what lets a Spanish
        post be committed before its five translations exist.
      */
      draft: z.boolean().optional().default(false),
    }),
});

export const collections = { blog };
