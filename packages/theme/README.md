# @cyberdream/astro-theme

Core package for the Cyberdream Astro theme.

## Install

```bash
npm install @cyberdream/astro-theme
```

## Upgrade

```bash
npm update @cyberdream/astro-theme
```

For starter projects, review the repository release notes when scaffold commands change. If an older project still routes `npm run new-post` or `npm run new-page` through local wrapper files, migrate the package scripts to the package-owned bins:

```bash
npm pkg set scripts.new-post="cyberdream-new-post"
npm pkg set scripts.new-page="cyberdream-new-page"
```

## Usage in Starter/Site

Use the package exports in your pages/layout wiring, for example:

```astro
---
import HomePage from '@cyberdream/astro-theme/layouts/HomePage.astro';
---

<HomePage {...Astro.props} />
```

For content schema:

```ts
export { collections } from '@cyberdream/astro-theme/content-schema';
```

`sourceLinks` in blog frontmatter accepts standard `http(s)` URLs and bare domains such as `github.com/cyberdream/astro-theme-cyberdream`. Bare domains are normalized to `https://...` during schema parsing.

## Site Config Injection

This package reads site-specific config from alias imports:

- `@cyberdream/site-config/site`
- `@cyberdream/site-config/theme`
- `@cyberdream/site-config/social`
- `@cyberdream/site-i18n/config`
- `@cyberdream/site-i18n/messages`

In the starter/site project, map these aliases to `src/config/*` and `src/i18n/*` in both Vite and TS config.

Giscus comments are configured from site-side `theme.comments` (core IDs + behavior fields like `mapping`, `inputPosition`, `theme`, and `lang`). If required core fields are not set, comments are not rendered. When `mapping="specific"` set `term`; when `mapping="number"` set `number`.

## CLI

- `cyberdream-new-post`
- `cyberdream-new-page`

Examples:

```bash
# create one post slug in all default locales
cyberdream-new-post my-first-post

# create post only for selected locales
cyberdream-new-post my-first-post --locales en,fr

# or via environment variable
CYBERDREAM_LOCALES=en,fr cyberdream-new-post my-first-post

# create a custom page with theme variant
cyberdream-new-page projects --theme base
cyberdream-new-page projects --theme ai
cyberdream-new-page projects --theme cyber
cyberdream-new-page projects --theme hacker
cyberdream-new-page projects --theme matrix
```

Starter projects can invoke these directly (or wrap them in npm scripts). For most users, `#starter` is the recommended installation path.
