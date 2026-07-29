#!/usr/bin/env node

import { access, mkdir, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import {
  buildNewPageTemplate,
  parseNewPageArgs,
  usageNewPage,
  validatePageSlug,
} from './scaffold/new-page.mjs';

const PAGES_ROOT = path.resolve(process.cwd(), 'src/pages/[lang]');

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const rawArgs = process.argv.slice(2);
  if (rawArgs.includes('--help') || rawArgs.includes('-h') || rawArgs[0] === 'help') {
    console.log(usageNewPage());
    process.exit(0);
  }

  const { slug, removedThemeFlag } = parseNewPageArgs(process.argv);

  if (removedThemeFlag) {
    console.error(
      '--theme was removed: cyberdream has a single shell (CyberdreamShell). Drop the flag.'
    );
    process.exit(1);
  }

  if (!slug) {
    console.error(usageNewPage());
    process.exit(1);
  }
  if (!validatePageSlug(slug)) {
    console.error(
      'Invalid page slug. Use lowercase letters, numbers, hyphens, and optional nested paths.'
    );
    process.exit(1);
  }
  const targetPath = path.join(PAGES_ROOT, `${slug}.astro`);

  if (await exists(targetPath)) {
    console.error(`File already exists: ${targetPath}`);
    process.exit(1);
  }

  const targetDir = path.dirname(targetPath);
  await mkdir(targetDir, { recursive: true });
  await writeFile(targetPath, buildNewPageTemplate({ slug }), 'utf8');

  console.log(`Created page: ${targetPath}`);
  console.log('This route is generated for all locales via getStaticPaths().');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
