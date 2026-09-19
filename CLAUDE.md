# Hadinapló

Personal blog. Astro 7 static site, deployed to <https://blog.ludobermejo.es> via GitHub Pages.

- **Site identity** lives in exactly one place: `src/site.config.ts`. Title, author, URL, and the global description/tagline fallbacks. Everything under `src/config/**` and `src/i18n/**` is a generated adapter — edit the templates in `scripts/adapter-templates/` and run `npm run sync-adapters`, never the generated files.
- **The theme is vendored** at `packages/theme/` as an npm workspace, not consumed from `node_modules`. Edit it there. `npm update @cyberdream/astro-theme` will not touch it.
- **The theme is `cyberdream`, built on [CYBERCORE CSS](https://github.com/sebyx07/cybercore-css)** (MIT), installed as a normal npm dependency. CyberCore supplies tokens, components (`.cyber-nav`, `.cyber-card`, `.cyber-btn`, `.cyber-terminal`, `.cyber-badge`, `.cyber-select`) and CSS-only effects (`.cyber-glitch`, `.cyber-scanlines`, `.cyber-heading`). Reach for a CyberCore class before writing CSS.
- **One shell, one stylesheet.** `layouts/CyberdreamShell.astro` and `styles/cyberdream.css`. The five atmosphere shells, 21 stylesheets and 16 effect scripts are gone; a page ships one inline script (the locale switcher). Don't reintroduce per-page JS without a reason.
- **CyberCore wraps its rules in `@layer`**, so the theme layer is unlayered and overrides it with no `!important`. Keep it that way.
- **Asset provenance** is in `README.md` — worth reading once, since the upstream
  theme shipped commercial film footage and a font whose licence forbade
  redistribution.
- **`HANDOFF.md`** holds what this file deliberately does not: machine setup, the
  decisions still waiting on the author, and known-unverified repo state.

## Deploy

Pushes to `main` build and deploy via `.github/workflows/deploy.yml`. The GitHub
Pages source is **`workflow`** (the Actions build), not a `gh-pages` branch.

- **The custom domain is held in two places and both must stay:** `public/CNAME`
  in the repo *and* the `cname` field on the Pages API config. With the Actions
  source the `CNAME` file alone does **not** set the domain.
- **Setting the `cname` resets `https_enforced` to false.** Re-enable it once the
  certificate is issued, or the site serves plain HTTP.

### Why the site has no `base` path

Serving from a custom domain at the root is load-bearing, not cosmetic. The
i18n helpers emit root-absolute links and `stripLocaleFromPath` assumes the
locale is the first path segment, so a `user.github.io/blog/` style subpath would
break every nav link and locale switch until `localeHrefs` is made base-aware.
If the custom domain is ever dropped, that work comes first.

## The root URL is a language dispatcher, not a page

`defaultLocalePrefix` is `'always'`, so `/en/` is the canonical English home and
`/` would otherwise duplicate it. `src/pages/index.astro` instead matches
`navigator.languages` against the enabled locales and redirects, falling back to
English. Each of these is load-bearing:

- An explicit choice in the language switcher is stored in `localStorage` under
  `cd:locale` and **takes precedence over detection**. Without it, someone
  reading in their second language gets bounced back on every visit to the root.
- The full BCP-47 tag is tried before the primary subtag, so `zh-CN` beats a bare
  `zh` while `es-419` and `es-MX` still resolve to `es`.
- It uses `location.replace()`, so the dispatcher never traps the Back button.
- It is `noindex` with `x-default` pointing at itself — what Google documents for
  a language selector. Don't "fix" it to indexable.
- With JS off it is a real page listing each language in its own language, which
  is why it needs no translation of its own.

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

#### Precedents already set — match them, don't re-decide

The agents chose these on the first translation and will not remember them next
session. Later posts must match or each language drifts into two voices.

| Language | Register | Notes |
| --- | --- | --- |
| `ja` | **です・ます** | Plain/imperative form for maxim bullets only — a conventional list exception, not a register slip. |
| `ko` | **합니다체** | Reader-facing, not the flatter diary `~다`. |
| `zh` | mainland, direct | Simplified only. Half-width space between Chinese and Latin runs. |
| `eo` | standard orthography | Real diacritics `ĉ ĝ ĥ ĵ ŝ ŭ` — **never** the x- or h-system. |
| `en` | Title Case titles, American spelling | Matches the theme's own UI strings. Spanish sentence-case titles get converted. |

Terminology already fixed: `mestizar` → crossbreed / 交雑 / 이종교배 / 杂交 /
`krucbredi` (the biological metaphor is the point, don't flatten it to
"combine"); `Ethos` → cognate in `ja`/`eo` but native word in `ko`/`zh`; LARP
carries a `(LARP)` gloss in `ja`/`ko` and deliberately none in `zh`.

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
absent, so an author never fills them in. **The counting is script-aware** — see
`src/utils/metrics.ts`. Whitespace splitting alone reported a whole Japanese post
as 14 "words", because Han and kana do not space between words; they are counted
as characters instead, at separate reading rates (Han is slower than kana, which
is why the rate is per script rather than per language and needs no locale
argument). Korean is deliberately *not* in that set: it spaces between eojeol and
already counted correctly. The `ja` and `zh` unit labels are 文字 and 字 rather
than "words", because the figure is now a character count. One known soft spot:
Korean eojeol are counted as "words" at the Latin rate, and an eojeol carries
more than an English word, so Korean read times run a little short.

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
- **Don't "simplify" word counting back to `split(/\s+/)`.** It looks redundant
  next to the character counting and it is not: that is the bug, not the
  cleanup. A Japanese post counted 14 words and read "~1 min".
- **TypeScript is pinned to 6.x on purpose.** `npm outdated` will keep offering
  7.x; taking it breaks `astro check`, because TypeScript 7's native compiler
  does not expose the programmatic API the Astro language server needs. Tested,
  not assumed.
- **Astro caches the content store.** Deleting or renaming content files and then
  building can still emit the *old* routes — after removing the starter posts the
  build kept producing them. `rm -rf .astro dist` before rebuilding whenever
  content files have been deleted.
- **A `draft: true` post emits no route at all.** `ls dist/*/blog/<slug>/` being
  empty is correct, not a failure. Verify drafts against the six *source* files.
- **zsh globs filenames in `for f in $FILES`.** Paths like
  `src/pages/[lang]/blog/[...slug].astro` contain glob characters and silently
  break unquoted loops — a rename pass once appeared to succeed while changing
  nothing. Use python/node for bulk file edits, not a shell loop.
- **`grep -c` exits non-zero on zero matches**, so `n=$(grep -c x f || echo 0)`
  yields `"0\n0"` and every comparison against it fails. That produced a wrong
  conclusion about dead code.
- **Prefer computed styles over screenshots** for layout questions. Screenshots
  of the site can time out, and `getComputedStyle` / `img.naturalWidth` is both
  faster and better evidence.
- **The `rq-tv-*` class names and `red-queen-tv.js` are meaningless leftovers.**
  They survive from the removed upstream widget; renaming ~100 class occurrences
  risked a working component for no benefit once the infringing content was gone.
  Don't read intent into those names.
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
