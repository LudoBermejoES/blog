# Handoff

Context that is **not** in `CLAUDE.md` and would otherwise be lost between machines.
`CLAUDE.md` covers how the project works; this covers the machine, the decisions
already made, and what is still open.

`.claude/` is committed, so the agents, the `/post` `/translate` `/publish`
commands and the skills all travel with the clone. Nothing below is in them.

---

## 1. Setting up the other machine

```bash
git clone git@github.com:LudoBermejoES/blog.git
cd blog
npm install          # links packages/theme as a workspace — npm ci also fine
npm run check        # should be fully green before you change anything
npm run dev
```

**Node ≥ 22.12** (`package.json` engines). Anything newer is fine; this was
developed on 24.x and 25.x.

**SSH remote.** `origin` is `git@github.com:...`, so the new machine needs its SSH
key on the GitHub account, or you must switch the remote to HTTPS.

**`gh` CLI**, authenticated as `LudoBermejoES`. Needed by `/publish` to watch
deploys and by anything touching the Pages API. The scopes in use are
`repo`, `read:org`, `gist`, `admin:public_key`. A plain `repo` scope is enough for
pushing and watching runs.

### TypeScript is pinned to 6.x on purpose

`npm outdated` will keep offering **7.0.2. Do not take it.** `astro check` refuses
to run: TypeScript 7's native compiler does not expose the programmatic API the
Astro language server needs, and it errors out explicitly. This was tested, not
assumed. Track <https://github.com/withastro/roadmap/discussions/1321>.

---

## 2. Deploy and infrastructure

- **Repo:** `LudoBermejoES/blog` · **Live:** <https://blog.ludobermejo.es>
- **GitHub Pages source is `workflow`** (the Actions build), not a `gh-pages`
  branch. `.github/workflows/deploy.yml` builds and deploys on every push to
  `main`.
- **Custom domain** is held two ways and both must stay: `public/CNAME` in the
  repo, and the `cname` field on the Pages API config. With the Actions source,
  the `CNAME` file alone does **not** set the domain — it had to be set via
  `gh api -X PUT repos/LudoBermejoES/blog/pages -f cname=blog.ludobermejo.es`.
- **HTTPS enforcement is on.** Setting the CNAME resets it to `false`; it had to
  be re-enabled after the certificate was issued.
- **DNS** `blog.ludobermejo.es` → `ludobermejoes.github.io`. This was briefly
  wrong (pointed at `ludobermejo.github.io`, missing the `es` — a different
  account name) and worked anyway because GitHub routes on the `Host` header.
  It is correct now; if the domain ever breaks, check this first.

### Why the site has no `base` path

Serving from a custom domain at the root is load-bearing, not cosmetic. The
theme's i18n helpers emit root-absolute links and `stripLocaleFromPath` assumes
the locale is the first path segment. A `user.github.io/blog/` style subpath would
break every nav link and locale switch until `localeHrefs` is made base-aware.
If the custom domain is ever dropped, that work comes first.

### `/` is a language dispatcher, not a page

`defaultLocalePrefix` is `'always'`, so `/en/` is the canonical English home and
`/` would otherwise be a duplicate. `src/pages/index.astro` instead matches
`navigator.languages` against the enabled locales and redirects, falling back to
English. Details that are easy to break:

- An explicit choice in the language switcher is stored in `localStorage` under
  `cd:locale` and **takes precedence over detection**. Without that, someone
  reading in their second language gets bounced back on every visit to the root.
- Full BCP-47 tag is tried before the primary subtag, so `zh-CN` beats a bare
  `zh` while `es-419` and `es-MX` still resolve to `es`.
- It uses `location.replace()` so the dispatcher never traps the Back button.
- It is `noindex` with `x-default` pointing at itself — what Google documents for
  a language selector. Do not "fix" that to indexable.
- With JS off it is a real page listing each language in its own language, which
  is why it needs no translation of its own.

---

## 3. Translator precedents already set

These were chosen deliberately by the agents on the first translation and **must
be matched by later posts**, or the site drifts into two voices per language. The
agents will not remember them across sessions; the files are the record, but the
reasoning is here.

| Language | Register | Notes |
| --- | --- | --- |
| `ja` | **です・ます** | Plain/imperative form is used for maxim bullets only — a conventional list exception, not a register slip. |
| `ko` | **합니다체** | Reader-facing rather than the flatter diary `~다`. |
| `zh` | mainland, direct | Simplified only. Half-width space between Chinese and Latin runs. |
| `eo` | standard orthography | Real diacritics `ĉ ĝ ĥ ĵ ŝ ŭ` — **never** the x- or h-system. |
| `en` | Title Case titles, American spelling | Matches the theme's own UI strings (`Latest Posts`, `Who I Am`). Spanish sentence-case titles get converted. |

**Established terminology** (keep consistent):

- `mestizar` → crossbreed / 交雑 / 이종교배 / 杂交 / `krucbredi`. The biological
  metaphor is the point; do not flatten it to "combine".
- `Ethos` heading → `エトス` and `Etoso` (cognates) but `신조` and `信条` (native
  words). This is an inconsistency nobody has settled — see open items.
- LARP gets a `(LARP)` gloss in `ja` and `ko` because the term is niche there;
  `zh` deliberately has none.
- `Hadinapló` is Hungarian for "war diary" and is identical in all six.

**The signature quote is Neil Gaiman**, from *The Sandman, Vol. 6: Fables &
Reflections* — "Sometimes you wake up. Sometimes the fall kills you. And
sometimes, when you fall, you fly." Your Spanish quotes it bare with no
attribution, and the five translations are original renderings, not published
ones. So **the allusion will not be recognised** by `ja`/`ko`/`zh` readers. If you
want it to land, it needs the wording from a published edition in each language.

---

## 4. Open — waiting on you

Nothing here is broken; these are decisions only you can make.

1. **`escenarios digitales`** in the first post was ambiguous to all five
   translators and each resolved it differently ("settings", シナリオ, 시나리오,
   `scenejoj`) — all reading it as RPG scenarios because of the roleplaying
   mention. **If you meant 3D environments for a virtual tabletop, all six need
   changing.**
2. **The `>` in `signature` renders as a visible character.** It sits inside a
   styled `<blockquote>` with a magenta border, so readers see `> Y a veces…`. It
   is consistent with the `$ ` terminal chrome in `metaLine`, so it may be
   intended — but it is redundant next to the blockquote styling. Say the word and
   it can be stripped at render time in all six.
3. **`Ethos` heading**, above — cognate in two languages, native word in two.
4. **Default locale is `en`.** You author in Spanish, but `/en/` is canonical and
   `x-default`. That was a deliberate call (English as `x-default` suits an
   international audience, and the dispatcher sends Spanish speakers to `/es/`
   anyway). Changing it is one line, but do it **before** anything is indexed.
5. **A `docs/glossary.md`** was offered and not created — it would pin the
   terminology decisions above so the agents stay consistent. Worth doing once
   there are a few posts.

---

## 5. Known-unverified

- **The 12 default covers** in `src/assets/blog/default-covers/` came with the
  upstream theme. They are synthetic cyberpunk art with no recognisable footage,
  likeness or mark — but their **licensing is undocumented**, so they are not
  *certified* clean. Everything else on the site has verified provenance (see
  `README.md`). Replacements can be generated the same way the monitor loops were.
- **`README.es.md`, `README.ja.md`, `README.ko.md`, `README.zh-CN.md` are stale.**
  They still describe the pre-refurbish theme with five atmospheres and a
  `--theme` flag that no longer exists. The English `README.md` is current.

---

## 6. Traps that are not in CLAUDE.md's list

- **Astro caches the content store.** Deleting or renaming content files and then
  building can still emit the *old* routes. This wasted real time: after removing
  the starter posts the build kept producing them. `rm -rf .astro dist` before
  rebuilding when content files have been deleted.
- **A `draft: true` post emits no route at all.** So `ls dist/*/blog/<slug>/`
  being empty is correct, not a failure. Verify drafts against the six *source*
  files instead.
- **zsh globs filenames in `for f in $FILES`.** Paths like
  `src/pages/[lang]/blog/[...slug].astro` contain glob characters and silently
  break unquoted loops — a rename pass appeared to succeed while changing nothing.
  Use a script (python/node) for bulk file edits, not a shell loop.
- **`grep -c` exits non-zero on zero matches**, so `n=$(grep -c x f || echo 0)`
  produces `"0\n0"` and every comparison against it fails. Cost a wrong conclusion
  about dead code.
- **Screenshots of the site can time out** via the browser tooling. Computed
  styles (`getComputedStyle`, `img.naturalWidth`) are both faster and better
  evidence for layout questions than an image.

---

## 7. Where the project came from

The theme is a heavy refurbish of the upstream
[`anglefeint/astro-theme-anglefeint`](https://github.com/anglefeint/astro-theme-anglefeint)
starter, rebuilt on [CYBERCORE CSS](https://github.com/sebyx07/cybercore-css).
Worth knowing because it explains odd-looking leftovers:

- **87 theme files → 33.** Five atmosphere shells became one, 21 stylesheets
  became one, and all 16 effect scripts were deleted. A page now ships exactly one
  inline script (the locale switcher).
- **The upstream shipped two clips of commercial film footage** (*Resident Evil*,
  the Red Queen hologram — one still carrying burned-in subtitles) and a
  **proprietary font** whose embedded licence forbade redistribution outright.
  Both were being served from this domain. Removed; replaced with generated CC0
  assets. Full account in `README.md`.
- **The `rq-tv-*` CSS class names and `red-queen-tv.js` were left named as they
  were** where they survive — renaming ~100 class occurrences risked a working
  widget for no benefit once the infringing content was gone. Do not read those
  names as meaningful.
- Deploy surface went from roughly **9.5 MB to under 3 MB**.
