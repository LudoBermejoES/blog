/**
 * `cyberdream-new-page` scaffolding.
 *
 * The old version offered five --theme variants, one per atmosphere shell.
 * cyberdream has a single shell, so the flag is gone. Passing it produces a
 * clear error rather than being silently ignored.
 */

import { toTitleFromSlug, validatePageSlug } from './shared.mjs';

export function parseNewPageArgs(argv) {
  const args = argv.slice(2);
  const positional = [];
  let removedThemeFlag = false;

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (token === '--theme') {
      removedThemeFlag = true;
      i += 1; // skip its value
      continue;
    }
    positional.push(token);
  }

  return { slug: positional[0], removedThemeFlag };
}

export function usageNewPage() {
  return 'Usage: cyberdream-new-page <slug>';
}

export function buildNewPageTemplate({ slug }) {
  const title = toTitleFromSlug(slug.split('/').pop());

  return `---
import type { GetStaticPaths } from 'astro';
import CyberdreamShell from '@cyberdream/astro-theme/layouts/CyberdreamShell.astro';
import { ENABLED_LOCALES, type Locale } from '@cyberdream/site-i18n/config';

export const getStaticPaths = (() => ENABLED_LOCALES.map((lang: Locale) => ({ params: { lang } }))) satisfies GetStaticPaths;

const locale = Astro.params.lang as Locale;
const pageTitle = '${title}';
const pageDescription = 'A custom ${title} page.';
---

<CyberdreamShell locale={locale} title={pageTitle} description={pageDescription}>
  <header class="cd-hero">
    <h1 class="cd-hero__title">{pageTitle}</h1>
  </header>
  <div class="cd-prose">
    <p>{pageDescription}</p>
  </div>
</CyberdreamShell>
`;
}

export { validatePageSlug };
