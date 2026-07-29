# Hadinapló

Personal blog. Astro 7 static site, deployed to <https://blog.ludobermejo.es> via GitHub Pages.

- **Site identity** lives in exactly one place: `src/site.config.ts`. Title, author, URL, and the global description/tagline fallbacks. Everything under `src/config/**` and `src/i18n/**` is a generated adapter — edit the templates in `scripts/adapter-templates/` and run `npm run sync-adapters`, never the generated files.
- **The theme is vendored** at `packages/theme/` as an npm workspace, not consumed from `node_modules`. Edit it there. `npm update @cyberdream/astro-theme` will not touch it.
- **The theme is `cyberdream`, built on [CYBERCORE CSS](https://github.com/sebyx07/cybercore-css)** (MIT), installed as a normal npm dependency. CyberCore supplies tokens, components (`.cyber-nav`, `.cyber-card`, `.cyber-btn`, `.cyber-terminal`, `.cyber-badge`, `.cyber-select`) and CSS-only effects (`.cyber-glitch`, `.cyber-scanlines`, `.cyber-heading`). Reach for a CyberCore class before writing CSS.
- **One shell, one stylesheet.** `layouts/CyberdreamShell.astro` and `styles/cyberdream.css`. The five atmosphere shells, 21 stylesheets and 16 effect scripts are gone; a page ships one inline script (the locale switcher). Don't reintroduce per-page JS without a reason.
- **CyberCore wraps its rules in `@layer`**, so the theme layer is unlayered and overrides it with no `!important`. Keep it that way.
- Background on the deploy, the TypeScript 6 pin, and asset provenance is in `README.md`.

## Every post must exist in all six languages

The site ships six locales. A post is not finished until it exists in **all** of them:

| Locale | Language | Content directory |
| --- | --- | --- |
| `en` | English | `src/content/blog/en/` |
| `es` | Español | `src/content/blog/es/` |
| `ja` | 日本語 | `src/content/blog/ja/` |
| `ko` | 한국어 | `src/content/blog/ko/` |
| `zh` | 中文 (Simplified, `hreflang` `zh-CN`) | `src/content/blog/zh/` |
| `eo` | Esperanto | `src/content/blog/eo/` |

**Spanish is the authoring language.** The author writes `es`; the other five are
produced by translation. The workflow:

```
/post <slug>      # scaffold src/content/blog/es/<slug>.md as a draft
                  # ...author writes it in Spanish...
/translate <slug> # fan out all five translator agents in parallel
/publish <slug>   # drop the draft flag in all six, verify, commit, deploy
```

`/publish` refuses to act on a post that is not present in all six locales, so
the incomplete-post failure cannot reach production through it.

`npm run check:translations` enforces the rule — it fails when a post is
published in at least one locale but missing from others. It is in the `check`
chain and therefore in CI, so an incomplete post cannot ship. Without it the
failure is silent: a green build, but the language switcher drops readers on the
archive and hreflang points at the wrong URL.

`draft: true` is the escape hatch, and the reason the workflow works at all: it
exempts a post from the check and excludes it from every listing, feed, route and
the sitemap. That is what lets a finished Spanish post be committed before its
translations exist. Drop the flag from **all six** files when publishing —
leaving it on one copy makes the post incomplete again.

### The slug is the join key — never localise it

`src/pages/[lang]/blog/[...slug].astro` builds the language switcher and the `hreflang` alternates by looking for `` `${targetLocale}/${currentSlug}` ``. If a translation uses a different filename:

- switching language on that post silently sends the reader to `/<locale>/blog/` (the archive) instead of the translation, and
- the `hreflang` alternates point at the wrong URLs.

Nothing fails the build. Use the identical filename in all six directories. If you ever want per-language slugs for SEO, `localeHrefs` has to be reworked first.

### Use the translator agents

One agent per target language, each carrying that language's conventions and pitfalls:

| Target | Agent |
| --- | --- |
| English / Spanish | `es-en-translator` |
| Japanese | `translator-ja` |
| Korean | `translator-ko` |
| Chinese | `translator-zh` |
| Esperanto | `translator-eo` |

They are independent, so dispatch them in parallel — one message, several agent calls — rather than serially.

Shared rules they all follow, and that any translation must respect:

1. **Translate, don't rewrite.** No added claims, dropped content, or summarising.
2. **Flag, don't fix.** Translate a source error as written and report it; a silent correction hides the problem from the author.
3. **Never translate code.** Identifiers, keywords, commands, paths, package names, and output stay untouched inside fences, inline code, and MDX expressions.
4. **Translate frontmatter prose only:** `title`, `description`, `subtitle`, `heroImageAlt`, free-text `tags`. Copy `pubDate`, `updatedDate`, `heroImage`, asset paths, and `author` unchanged.
5. **`Hadinapló` is a proper noun** and is identical in every language.

### The About page is content, not config

`src/content/about/<locale>.md` — one entry per locale, authored in Markdown like
a post, so `/translate` handles it. It used to be a deeply nested `about` object
per locale inside `src/site.config.ts`; that whole surface is gone, along with
the `sidebar`, `scriptsPath`, `modals` and `effects` blocks that drove the old
interactive terminal About page.

Frontmatter is page chrome only (`title`, `description`, `metaLine`,
`signature`). Everything a reader sees is the Markdown body, including the
contact links — so the sections are not fixed at five and their headings are your
words, not theme strings.

**Do not type the section numbers.** The `01 /`, `02 /` prefixes are a CSS
counter (`.cd-about-body h2::before` in `cyberdream.css`). Write `## Quién soy`
and the numbering follows. Hand-numbering is what produced the 01, 02, 04, 03
bug in the previous version.

Unlike posts, a missing About translation falls back to the default locale rather
than disappearing — a single page is better served in another language than
404ing. The reader is told so in their own language, and the body carries a
`lang` attribute for its real language.

### The content schema is deliberately small

`packages/theme/src/content-schema.ts` carries only fields the theme renders.
The upstream schema also had `aiModel`, `aiMode`, `aiState`, `aiLatencyMs`,
`aiConfidence`, `tokenCount`, `context`, `canonicalTopic` and `sourceLinks` —
props for the old AI-terminal layout. They were removed rather than left inert,
because dead frontmatter is a question every author has to ask once. Don't
reintroduce a field without something rendering it.

`readMinutes` and `wordCount` are derived from the body at build time when
absent, so an author never fills them in.

### UI strings and site metadata

Post content is not the only thing that needs all six languages.

- **Theme UI strings** live in `packages/theme/src/i18n/messages.ts`, one full set per locale. Adding a key to the `Messages` type means adding it to all six sets, or `astro check` fails.
- **Per-locale description and tagline** are overridden in `src/site.config.ts` under `i18n.locales.<code>.messages`. Both are translated; the values in `site:` are global fallbacks only.
- Esperanto has no territory, so the `eo` locale deliberately has **no `ogLocale`**. Open Graph expects `language_TERRITORY`; `BaseHead` emits `og:locale` only when the value is present, so omitting it is correct. Don't invent `eo_EO`.

## Gotchas that already bit us

- **`compressHTML` defaults to `'jsx'` in Astro 7.** Whitespace-only line breaks between adjacent expressions are dropped, exactly as JSX does. `{a}\n{b}` renders as `ab`, not `a b`. Keep visible text runs on one line, or use an explicit `{' '}`. This silently mangled the footer, post meta lines, and the about page's contact paragraph during the Astro 6 → 7 upgrade.
- **Verify with the built output, not the source.** `npx astro check && npm run build`, then grep `dist/` for the string you changed. Several of the bugs above type-checked cleanly and looked right in the source.
- **Check licences before adding any asset or font.** A font's terms are embedded in its `name` table and are readable — the starter shipped a proprietary font whose licence forbade redistribution, plus commercial film footage. See `README.md`.
- **CyberCore uppercases every heading.** The theme layer resets `text-transform` on content headings (post titles, card titles, prose headings) because all-caps slows reading and mangles accented Latin across six languages. Chrome labels keep their caps. If you add a heading class, decide which side it is on.
- **`check:scaffold` had rotted** — it asserted on a `SUPPORTED_LOCALES` export that does not exist and was never wired into `npm run check`. It is now in the chain. Keep it there.
- **A dark hero image is not a broken hero image.** Screenshot JPEG compression makes the dark covers read as empty boxes; check `img.complete` / `naturalWidth` or sample pixels before "fixing" it.

## Commands

```bash
npm run dev              # dev server
npm run build            # production build
npm run check            # workspace link + adapters + fonts + scaffold + translations + astro check
npm run check:translations # every published post exists in all six locales
npm run new-post -- slug --locales es  # Spanish only; /post wraps this
npm run assets:monitor   # regenerate the generated CC0 monitor loops and OG still
npm run assets:favicon   # rebuild favicon.ico from favicon.svg
```
