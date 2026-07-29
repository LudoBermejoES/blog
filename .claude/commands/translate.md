---
description: Translate Spanish posts into the other five locales, in parallel
argument-hint: [slug]  # omit to translate every incomplete post
---

Translate Spanish posts into the other five locales: `en`, `ja`, `ko`, `zh`, `eo`.

## 1. Work out what needs translating

If `$1` is given, that slug. Otherwise find every incomplete post:

```bash
npm run check:translations
```

Its failure output lists each published-but-incomplete slug and exactly which
locales are missing. If the target post is still `draft: true` it will not
appear there, so also check `src/content/blog/es/` directly for drafts.

Read the Spanish source before dispatching anything, so you can sanity-check the
translations that come back.

## 2. Dispatch all five agents in one message

They are independent. Send them **concurrently — multiple tool calls in a single
message**, not one after another:

| Target | Agent |
| --- | --- |
| `en` | `es-en-translator` |
| `ja` | `translator-ja` |
| `ko` | `translator-ko` |
| `zh` | `translator-zh` |
| `eo` | `translator-eo` |

Give each agent the source path and tell it the target locale. Each agent
already knows this repo's conventions, but the one that must not be got wrong:

> **The filename is the join key. Copy `src/content/blog/es/<slug>.md` to
> `src/content/blog/<locale>/<slug>.md` with the slug byte-for-byte identical.**
> `[...slug].astro` resolves the language switcher and hreflang alternates via
> `<locale>/<same-slug>`; a renamed slug silently drops readers on the archive
> with a green build.

Frontmatter: translate `title`, `description`, `subtitle`, `heroImageAlt` and
free-text `tags`. Copy `pubDate`, `updatedDate`, `heroImage`, `author` and
`draft` unchanged. `Hadinapló` is a proper noun — identical in every language.

## 3. Publish

Once all six exist, drop `draft: true` from **all six** files — leaving it on one
copy makes the post incomplete again, and `check:translations` will say so.

## 4. Verify before reporting done

```bash
npm run check && npm run build
```

`npm run check` includes `check:translations`, so it fails if any locale is
missing. Then confirm the post actually renders in a couple of locales:

```bash
ls dist/*/blog/<slug>/index.html
```

## 5. Report

- The files created, and anything each agent flagged about the Spanish source.
  Translators are told to flag rather than silently fix source errors, so relay
  those — they are for the author to decide on.
- Do not claim success if `check` or `build` failed.
