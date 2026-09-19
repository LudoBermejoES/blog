# Handoff

Context for picking this up on another machine.

**How the project works lives in `CLAUDE.md`** — deploy rules, the language
dispatcher, translator precedents, the content schema, and the traps worth
knowing. That file is the reference; this one is only what does not belong there:
machine setup, decisions still waiting on you, and the current state of things.

`.claude/` is committed, so the agents, the `/post` `/translate` `/publish`
commands and the skills all travel with the clone.

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
developed on 24.x and 25.x. TypeScript stays on 6.x — `CLAUDE.md` says why.

**The remote can be either protocol, and the two machines differ.** The clone
line above uses SSH, which needs that machine's key on the GitHub account. The
machine this was last worked on uses **HTTPS** instead — `origin` is
`https://github.com/LudoBermejoES/blog` and pushes authenticate through `gh`'s
credential helper (`credential.https://github.com.helper=!gh auth git-credential`
in `~/.gitconfig`), so no SSH key is involved at all. Either works; check
`git remote -v` before assuming.

**`gh` CLI**, authenticated as `LudoBermejoES`. `/publish` uses it to watch
deploys, and the Pages API needs it. Plain `repo` scope is enough for pushing and
watching runs; the account currently also carries `read:org`, `gist` and
`admin:public_key`.

---

## 2. Current infrastructure state

- **Repo:** `LudoBermejoES/blog` · **Live:** <https://blog.ludobermejo.es>
- **DNS:** `blog.ludobermejo.es` → `ludobermejoes.github.io`. This was briefly
  wrong — it pointed at `ludobermejo.github.io`, missing the `es`, which is a
  different account name — and worked anyway because GitHub routes on the `Host`
  header. It is correct now. **If the domain ever breaks, check this first.**
- Pages is on the Actions source with the custom domain and HTTPS enforcement
  both set. The rules that keep it that way are in `CLAUDE.md`.

---

## 3. Content notes

**The About page signature is a Neil Gaiman line**, from the story *Fear of
Falling* in *The Sandman, Vol. 6: Fables & Reflections* — "And sometimes, when
you fall, you fly." Your Spanish quotes it bare with no attribution, and the five
translations are original renderings rather than published ones, so **the
allusion will not be recognised** by `ja`/`ko`/`zh` readers.

Deliberately left that way. `docs/glossary.md` lists which published editions
exist in each language, for the day you have the books to hand — the wording is
not on the open web, and a fan translation off a blog is worth no more than the
agents' own.

---

## 4. Open — waiting on you

**Replace the 12 default covers.** See section 5 — it is the one open item, and
it is yours because it needs your Midjourney account.

### Settled — don't re-open these

Decided deliberately. Each one looked like a bug and isn't.

- **Default locale stays `en`.** You author in Spanish, but `/en/` is canonical
  and `x-default`. English as `x-default` suits an international audience and the
  root dispatcher sends Spanish speakers to `/es/` anyway. Changing it is still
  one line, but the window for a free change closes once anything is indexed.
- **The `>` in `signature` stays.** It renders as a visible character inside the
  styled `<blockquote>`, and that is wanted: it reads as terminal chrome, the
  same as the `$ ` in `metaLine`.
- **`Ethos` is `Ethos` in all six.** It was split — cognate in `ja`/`eo`, native
  word in `ko`/`zh` — and unified on the Latin spelling, because the word is
  Greek to begin with and leaving it foreign everywhere is more honest than
  naturalising it in four languages.
- **`escenarios digitales` means 3D environments built in a game engine.** The
  Spanish now says so outright and all five translations were corrected. Full
  account in `docs/glossary.md`; it is the entry most likely to be got wrong
  again.
- **Post cards show a read time again.** `src/utils/metrics.ts` moved to
  `packages/theme/src/utils/metrics.ts` and `PostCard` derives the figure from
  `post.body`, so it no longer depends on a `readMinutes` frontmatter field that
  nobody fills in. The field still works as an override.
- **`docs/glossary.md` exists.** Terminology fixed across the six languages, and
  the reason for each. The translator agents are told to read it and to add to
  it.

---

## 5. Known-unverified

- **The 12 default covers** in `src/assets/blog/default-covers/` came with the
  upstream theme. They are synthetic cyberpunk art with no recognisable footage,
  likeness or mark — but their **licensing is undocumented**, so they are not
  *certified* clean. Everything else on the site has verified provenance (see
  `README.md`).

  **Decided: replace them with Midjourney art from your own account.** Keep the
  12 filenames (`ai-01..03`, `cyber-01..04`, `hacker-01..02`, `matrix-01..03`)
  and the 2000×1000 size — `cli-new-post.mjs` assigns a cover by slug hash over
  that directory and `check-scaffold.mjs` asserts on `ai-01.webp` by name.

  Generating them procedurally, the way the monitor loops were, was considered
  and rejected: that was worth doing for the monitor loops because they ship
  inside the npm package (`files` in `packages/theme/package.json`), and these
  covers live in `src/assets/` and never leave the site. A script would buy
  better paperwork and worse pictures. When they're in, the provenance paragraph
  in `README.md` and the first line of this bullet both need rewriting — and the
  honest wording is "generated with Midjourney under a private account", not
  "certified clean".
- **`README.es.md`, `README.ja.md`, `README.ko.md` and `README.zh-CN.md` are
  stale.** They still describe the pre-refurbish theme with five atmospheres and
  a `--theme` flag that no longer exists. The English `README.md` is current.
- **`scripts/validate-doc-metadata.mjs` is rotted**, the same way
  `check:scaffold` was. It requires `doc_id`, `doc_role`, `doc_scope` and
  `update_triggers` frontmatter on every `.md` outside a small exclude list — and
  no document in the repo has any of it, including `README.md` and this file. It
  is wired into nothing, so it fails silently by never running. Either give it a
  contract the repo actually follows or delete it; leaving it is what made
  `check:scaffold` assert on an export that didn't exist.

---

## 6. Where the project came from

A heavy refurbish of the upstream
[`anglefeint/astro-theme-anglefeint`](https://github.com/anglefeint/astro-theme-anglefeint)
starter, rebuilt on [CYBERCORE CSS](https://github.com/sebyx07/cybercore-css).
Worth knowing because it explains odd-looking leftovers:

- **87 theme files → 33.** Five atmosphere shells became one, 21 stylesheets
  became one, and all 16 effect scripts were deleted. A page now ships exactly one
  inline script (the locale switcher).
- **The upstream shipped two clips of commercial film footage** (*Resident Evil*,
  the Red Queen hologram — one still carrying burned-in subtitles) and a
  **proprietary font** whose embedded licence forbade redistribution outright.
  Both were being served from this domain. Removed and replaced with generated
  CC0 assets; full account in `README.md`.
- Deploy surface went from roughly **9.5 MB to under 3 MB**.
