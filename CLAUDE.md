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

Write the post in whichever language comes naturally, then translate it into the other five. Do not ship a post in one language and promise the rest later — a locale with a missing translation degrades quietly rather than erroring, so the gap is easy to miss.

Scaffold all six files at once with:

```bash
npm run new-post -- my-post-slug
```

That creates the same slug under every configured locale.

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
npm run check            # workspace link + adapters + fonts + scaffold + astro check
npm run new-post -- slug # scaffold a post in all six locales
npm run assets:monitor   # regenerate the generated CC0 monitor loops and OG still
npm run assets:favicon   # rebuild favicon.ico from favicon.svg
```
