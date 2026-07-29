/**
 * Single user-facing config entry for Anglefeint.
 * Edit this file only. Other files under src/config/* and src/i18n/* are adapters.
 */
import { defineThemeConfig } from './site.config.defaults.ts';

export type {
  AboutConfig,
  LocaleCode,
  LocaleConfig,
  LocaleMetaConfig,
  LocaleSiteConfig,
  NormalizedLocaleConfig,
  NormalizedThemeI18nConfig,
  SocialLink,
  ThemeConfig,
  ThemeI18nConfig,
} from './site.config.schema.ts';
export { DEFAULT_ABOUT_CONFIG, defineThemeConfig } from './site.config.defaults.ts';
export { normalizeI18nConfig } from './site.config.runtime.ts';

/**
 * Edit this object only.
 * Omitted fields safely fall back to theme defaults.
 */
export const THEME_CONFIG = defineThemeConfig({
  site: {
    // Drives canonical URLs, hreflang alternates, Open Graph, JSON-LD, the
    // sitemap and the RSS feeds. astro.config.mjs reads it as `site`, so this
    // is the single place the deployed origin is declared.
    // Served at the domain root via public/CNAME, so no `base` is needed.
    url: 'https://blog.ludobermejo.es',
  },
  // Example:
  // i18n: {
  //   defaultLocale: 'en',
  //   locales: {
  //     en: {
  //       meta: { label: 'English', hreflang: 'en', ogLocale: 'en_US' },
  //       site: { hero: 'Your localized hero copy.' },
  //       about: { metaLine: '$ profile booted | mode: builder' },
  //       messages: { nav: { home: 'Home' } },
  //     },
  //   },
  // },
});
