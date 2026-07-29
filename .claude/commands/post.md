---
description: Scaffold a new Spanish post (the authoring language) as a draft
argument-hint: <slug>
---

Scaffold a new Spanish post with the slug `$1`.

Spanish is the authoring language for this blog; the other five locales are
produced by `/translate` afterwards. So create **only** the `es` file:

```bash
npm run new-post -- $1 --locales es
```

Then open `src/content/blog/es/$1.md` and:

1. **Set `draft: true`.** This is what lets the post be committed before its
   translations exist — `npm run check:translations` exempts drafts, and drafts
   are excluded from every listing, feed, route and the sitemap. `/translate`
   removes the flag once all six locales are in place.
2. Fill in `title` and `description` in Spanish. Leave the rest alone:
   - `pubDate` is already today's date.
   - `readMinutes` and `wordCount` are derived from the body at build time —
     only set them if the automatic count would mislead (a post that is mostly
     code blocks, say).
   - `heroImage` has been auto-assigned from `src/assets/blog/default-covers/`
     by slug hash. Replace it if you have a better image, and add
     `heroImageAlt` **only** if the image carries meaning; leave it off for
     decorative covers so it renders `alt=""`.
3. Validate the slug: lowercase letters, numbers and hyphens only. It becomes
   the join key across all six locales and must never change afterwards.

Report the created path and remind the user to run `/translate` when the Spanish
draft is finished.

Do not write the post's body content unless asked — the user writes the posts.
