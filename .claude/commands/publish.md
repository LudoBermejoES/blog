---
description: Publish a post — drop the draft flag in all six locales, verify, deploy
argument-hint: <slug>
---

Publish the post `$1`. Strip surrounding quotes from the argument if present, and
accept either a bare slug (`comenzando`) or a path
(`src/content/blog/es/comenzando.md`) — reduce it to the slug either way.

Publishing is outward-facing and hard to reverse once indexed, so the order below
matters: verify first, deploy last.

## 1. Refuse to publish something incomplete

The post must exist in **all six** locales — `en`, `es`, `ja`, `ko`, `zh`, `eo` —
with the identical slug:

```bash
ls src/content/blog/*/$1.md
```

If any are missing, **stop**. Do not publish, do not remove any draft flag. Tell
the user which locales are missing and that `/translate $1` will produce them.

Publishing a partially translated post is the exact failure the guard exists to
prevent: `[...slug].astro` resolves translations via `<locale>/<same-slug>`, so a
missing one silently drops readers on the archive and points hreflang at the
wrong URL, with a green build.

## 2. Check `pubDate` before changing anything

Read the `pubDate` in the Spanish file and compare it to today.

- **In the future** — the post will build and be live immediately regardless;
  nothing defers it. Say so and ask whether to correct the date.
- **Noticeably in the past** (a draft written a while ago) — ask whether to
  update it to today or keep the original authoring date. Do not decide silently:
  it changes the ordering on the archive and the `<time>` shown on the card.

If the date is today, proceed without asking.

Whatever is agreed, apply it to **all six** files so they stay consistent.

## 3. Drop the draft flag from all six

Remove the `draft: true` line from every one of the six files. Leaving it on a
single copy makes the post incomplete again and `check:translations` will fail —
which is the point.

Prefer removing the line over setting `draft: false`; the schema defaults it to
`false`, so the key is noise once published.

## 4. Verify — this is the gate

```bash
npm run check && npm run build
```

`npm run check` includes `check:translations`, so an incomplete post fails here.
Then confirm the post genuinely rendered in every locale rather than assuming:

```bash
ls dist/*/blog/$1/index.html
```

Six paths, or something is wrong. Also spot-check that it now appears in a
listing and a feed, since a draft is filtered in `postsForLocale` and a stale
build would hide the change:

```bash
grep -c "$1" dist/es/blog/index.html dist/es/rss.xml dist/sitemap-0.xml
```

If `check` or `build` fails, stop and report. Do not commit a failing build.

## 5. Commit and deploy

Only once step 4 is clean:

```bash
git add -A
git commit   # subject: "Publish: <title>"
git push
```

Then watch the deploy and confirm the post is actually reachable in production —
not just that the workflow went green:

```bash
gh run watch <id> --exit-status
curl -sS -o /dev/null -w "%{http_code}\n" https://blog.ludobermejo.es/es/blog/$1/
```

## 6. Report

- The live URLs for all six locales.
- Anything you changed beyond removing the draft flag (a `pubDate` adjustment,
  say), stated plainly.
- If any step failed, say which and stop — do not report a publish as done when
  the deploy or the verification did not pass.
