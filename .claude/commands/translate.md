---
description: Translate Spanish posts into the other five locales, in parallel
argument-hint: [slug]  # omit to translate every incomplete post
---

Translate Spanish posts into the other five locales: `en`, `ja`, `ko`, `zh`, `eo`.

There are two translatable collections. Check both.

**Blog posts** — `src/content/blog/<locale>/<slug>.md`. The filename is the slug
and must be **identical across locales**.

**The About page** — `src/content/about/<locale>.md`. One entry per locale, named
by locale code, so the target filename is `en.md`, `ja.md` and so on — *not* the
source filename. Its frontmatter is `title`, `description`, `metaLine` and
`signature`, all translatable prose; there is no `pubDate`, `heroImage` or
`draft`. **Never write the `01 /` section numbers** — they are a CSS counter, and
literal numbers would double them.

## 1. Work out what needs translating

If `$1` is given, that slug. Otherwise find every incomplete post:

```bash
npm run check:translations
```

Its failure output lists each published-but-incomplete slug and exactly which
locales are missing. If the target post is still `draft: true` it will not
appear there, so also check `src/content/blog/es/` directly for drafts.

`check:translations` covers **posts only**, deliberately: a missing post
translation fails silently, whereas a missing About translation falls back to the
default locale with a visible notice. So check the About collection by hand:

```bash
ls src/content/about/
```

Six files expected — `en ja ko zh eo es`. Anything missing needs translating too.

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

## 3. Do NOT publish

Applies to posts only; the About page has no draft flag and goes live on deploy.

Leave `draft: true` in place on all six post files. Publishing is `/publish`'s job —
it is the step that checks `pubDate`, drops the flag, verifies the rendered
routes and deploys. Doing it here too would mean two commands racing over the
same decision.

## 4. Verify before reporting done

```bash
npm run check && npm run build
```

`npm run check` includes `check:translations`, so it fails if any locale is
missing. Then confirm the post actually renders in a couple of locales:

```bash
ls src/content/blog/*/<slug>.md   # six files, identical slug
```

Note that a `draft: true` post emits **no route**, so `dist/*/blog/<slug>/` will
be empty and that is correct. Verify the six source files instead, and confirm
the frontmatter invariants match the Spanish original: `pubDate`, `heroImage` and
`draft` copied unchanged in every locale.

## 5. Report

- The files created, and anything each agent flagged about the Spanish source.
  Translators are told to flag rather than silently fix source errors, so relay
  those — they are for the author to decide on.
- Do not claim success if `check` or `build` failed.
- End by telling the user to run `/publish <slug>` when they are happy with the
  translations. That is the step that makes the post live.
