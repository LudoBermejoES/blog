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

**SSH remote.** `origin` is `git@github.com:LudoBermejoES/blog.git`, so the new
machine needs its SSH key on the GitHub account, or switch the remote to HTTPS.

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

**The About page signature is a Neil Gaiman line**, from *The Sandman, Vol. 6:
Fables & Reflections* — "Sometimes you wake up. Sometimes the fall kills you. And
sometimes, when you fall, you fly." Your Spanish quotes it bare with no
attribution, and the five translations are original renderings rather than
published ones, so **the allusion will not be recognised** by `ja`/`ko`/`zh`
readers. Making it land needs the wording from a published edition in each
language.

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
   intended — but it is redundant next to the blockquote styling. It can be
   stripped at render time in all six.
3. **`Ethos` is translated two ways** — cognate in `ja`/`eo` (エトス, Etoso),
   native word in `ko`/`zh` (신조, 信条). Nobody has settled which is right.
4. **Default locale is `en`.** You author in Spanish, but `/en/` is canonical and
   `x-default`. That was deliberate — English as `x-default` suits an
   international audience, and the dispatcher sends Spanish speakers to `/es/`
   anyway. Changing it is one line, but do it **before** anything is indexed.
5. **Post cards never show a read time.** `PostCard` renders it only when
   `readMinutes` is passed, and the archive and home pages pass
   `post.data.readMinutes` — frontmatter, which nobody fills in. So the code path
   is dead and the cards show only a date. Fixing it means either deriving
   metrics inside `PostCard` from `post.body` (which means moving
   `src/utils/metrics.ts` into the theme, since the theme cannot import site
   utils) or plumbing the values down from the two layouts. Left alone because it
   crosses the site/theme boundary and deserves a deliberate call.
6. **A `docs/glossary.md`** was offered and not created. It would pin the
   translator terminology so the agents stay consistent — worth doing once there
   are a few posts.

---

## 5. Known-unverified

- **The 12 default covers** in `src/assets/blog/default-covers/` came with the
  upstream theme. They are synthetic cyberpunk art with no recognisable footage,
  likeness or mark — but their **licensing is undocumented**, so they are not
  *certified* clean. Everything else on the site has verified provenance (see
  `README.md`). Replacements can be generated the way the monitor loops were.
- **`README.es.md`, `README.ja.md`, `README.ko.md` and `README.zh-CN.md` are
  stale.** They still describe the pre-refurbish theme with five atmospheres and
  a `--theme` flag that no longer exists. The English `README.md` is current.

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
