#!/usr/bin/env node
/**
 * Fails when a post does not exist in every enabled locale.
 *
 * This exists because the failure it catches is silent. `localeHrefs` in
 * `src/pages/[lang]/blog/[...slug].astro` resolves a post's translations by
 * looking for `<locale>/<same-slug>`; when one is missing, the language switcher
 * quietly sends the reader to the archive instead of the translation and the
 * hreflang alternates point at the wrong URLs. Nothing errors, nothing warns,
 * and the build is green. So the guard has to be explicit.
 *
 * Drafts are exempt: `draft: true` is what lets a Spanish post be committed
 * before its translations exist. Drafts are also excluded from every listing,
 * feed and route, so an exempt post is not reachable either.
 *
 * Usage: npm run check:translations
 */

import { execFile as execFileCallback } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);

const CONTENT_ROOT = path.resolve(process.cwd(), 'src/content/blog');
const SITE_CONFIG_PATH = path.resolve(process.cwd(), 'src/site.config.ts');

function fail(lines) {
  console.error('[check:translations] FAILED\n');
  for (const line of lines) console.error(line);
  process.exit(1);
}

/**
 * Reads the enabled locales from the TypeScript config rather than from the
 * directory listing, so adding a locale to the config immediately starts being
 * enforced even before its content directory exists. Same node type-stripping
 * trick the new-post CLI already uses.
 */
async function enabledLocales() {
  const loader = `
    import { pathToFileURL } from 'node:url';
    const mod = await import(pathToFileURL(process.argv[1]).href);
    const config = mod.THEME_CONFIG?.i18n;
    if (!config) process.exit(2);
    const normalized =
      typeof mod.normalizeI18nConfig === 'function' ? mod.normalizeI18nConfig(config) : config;
    process.stdout.write(JSON.stringify(normalized));
  `;

  const { stdout } = await execFile(
    process.execPath,
    ['--experimental-strip-types', '--input-type=module', '--eval', loader, SITE_CONFIG_PATH],
    { cwd: process.cwd(), encoding: 'utf8' }
  );

  const normalized = JSON.parse(stdout);
  return Object.values(normalized.locales ?? {})
    .filter((locale) => locale?.meta?.enabled)
    .map((locale) => locale.code)
    .sort();
}

/** Cheap frontmatter probe. Only `draft` matters here, so no YAML parser. */
async function isDraft(filePath) {
  const text = await readFile(filePath, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return false;
  return /^draft:\s*true\s*$/m.test(match[1]);
}

async function slugsIn(locale) {
  const dir = path.join(CONTENT_ROOT, locale);
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return new Map();
  }

  const slugs = new Map();
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name);
    if (ext !== '.md' && ext !== '.mdx') continue;
    const slug = entry.name.slice(0, -ext.length);
    slugs.set(slug, await isDraft(path.join(dir, entry.name)));
  }
  return slugs;
}

async function main() {
  const locales = await enabledLocales();
  if (locales.length === 0) fail(['No enabled locales found in src/site.config.ts.']);

  const byLocale = new Map();
  for (const locale of locales) byLocale.set(locale, await slugsIn(locale));

  /*
    A slug counts as a draft — and is therefore exempt — when every copy of it
    that exists is marked draft. One published copy means the post is live in at
    least one locale, and the missing translations are then a real gap.
  */
  const allSlugs = new Set();
  for (const slugs of byLocale.values()) for (const slug of slugs.keys()) allSlugs.add(slug);

  const problems = [];
  let checked = 0;
  let skipped = 0;

  for (const slug of [...allSlugs].sort()) {
    const present = locales.filter((locale) => byLocale.get(locale).has(slug));
    const published = present.filter((locale) => byLocale.get(locale).get(slug) === false);

    if (published.length === 0) {
      skipped += 1;
      continue;
    }

    const missing = locales.filter((locale) => !byLocale.get(locale).has(slug));
    const stillDraft = present.filter((locale) => byLocale.get(locale).get(slug) === true);

    if (missing.length > 0 || stillDraft.length > 0) {
      const detail = [];
      if (missing.length > 0) detail.push(`missing: ${missing.join(', ')}`);
      if (stillDraft.length > 0) detail.push(`still draft: ${stillDraft.join(', ')}`);
      problems.push(`  ${slug}\n      ${detail.join('\n      ')}`);
    }
    checked += 1;
  }

  if (problems.length > 0) {
    fail([
      `Locales: ${locales.join(', ')}`,
      '',
      'These posts are published in at least one locale but incomplete:',
      '',
      ...problems,
      '',
      'Fix by translating them (see the translator agents in .claude/agents/),',
      'or mark every copy `draft: true` to exempt the post until it is ready.',
      '',
      'Why this matters: [...slug].astro resolves translations by looking for',
      '<locale>/<same-slug>. A missing one silently sends readers to the archive',
      'and points hreflang at the wrong URL, with a green build.',
    ]);
  }

  const parts = [`${checked} post(s) complete across ${locales.length} locale(s)`];
  if (skipped > 0) parts.push(`${skipped} draft(s) exempt`);
  console.log(`[check:translations] OK — ${parts.join(', ')}.`);
}

main().catch((error) => {
  fail([error instanceof Error ? error.message : String(error)]);
});
