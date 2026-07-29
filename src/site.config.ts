/**
 * Single user-facing config entry for Cyberdream.
 * Edit this file only. Other files under src/config/* and src/i18n/* are adapters.
 */
import { defineThemeConfig } from './site.config.defaults.ts';

export type {
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
export { defineThemeConfig } from './site.config.defaults.ts';
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

    // The name is a proper noun and stays identical in every language.
    title: 'Hadinapló',
    author: 'Ludo Bermejo',

    // Global fallbacks only. Every enabled locale overrides both below, so
    // these apply solely to a locale added without its own translation.
    description: 'Un diario para el futuro',
    tagline: 'Un diario para el futuro',
  },

  i18n: {
    // deepMerge recurses into plain objects, so naming a single locale adds it
    // to the theme defaults rather than replacing the whole set.
    locales: {
      en: {
        messages: {
          siteDescription: 'A diary for the future',
          tagline: 'A diary for the future',
        },
      },
      es: {
        messages: {
          siteDescription: 'Un diario para el futuro',
          tagline: 'Un diario para el futuro',
        },
      },
      ja: {
        messages: {
          siteDescription: '未来のための日記',
          tagline: '未来のための日記',
        },
      },
      ko: {
        messages: {
          siteDescription: '미래를 위한 일기',
          tagline: '미래를 위한 일기',
        },
      },
      zh: {
        messages: {
          siteDescription: '写给未来的日记',
          tagline: '写给未来的日记',
        },
      },
      eo: {
        meta: {
          label: 'Esperanto',
          hreflang: 'eo',
          // ogLocale is deliberately unset. Open Graph expects
          // language_TERRITORY and Esperanto has no territory, so emitting a
          // fabricated region code would be worse than omitting the tag —
          // BaseHead renders og:locale only when this is present.
          fallback: ['en'],
        },
        messages: {
          siteDescription: 'Taglibro por la estonteco',
          tagline: 'Taglibro por la estonteco',
        },
      },
    },
  },
});
