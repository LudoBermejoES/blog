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
        site: {
          hero: 'An unpretentious diary of what I do each day: technology, writing, teaching, tabletop roleplaying, 3D and games — all crossbred, because it reads better that way.',
        },
        messages: {
          blog: {
            archiveDescription: 'Written each night: what I built, taught, played or suffered through that day.',
          },
          siteDescription: 'A diary for the future',
          tagline: 'A diary for the future',
        },
      },
      es: {
        site: {
          hero: 'Un diario sin pretensiones de lo que hago cada día: tecnología, escritura, enseñanza, rol, 3D y juegos, todo mestizado, porque así se entiende mejor.',
        },
        messages: {
          blog: {
            archiveDescription: 'Entradas escritas cada noche: lo que construí, enseñé, jugué o sufrí ese día.',
          },
          siteDescription: 'Un diario para el futuro',
          tagline: 'Un diario para el futuro',
        },
      },
      ja: {
        site: {
          hero: '気負わずに毎日のことを書き留める日記です。技術、執筆、教育、TRPG、3D、ゲーム——どれも交ぜて書いています。そのほうがよく見えてくるからです。',
        },
        messages: {
          blog: {
            archiveDescription: '毎晩書いた記録です。その日に作ったもの、教えたこと、遊んだこと、そして手を焼いたこと。',
          },
          siteDescription: '未来のための日記',
          tagline: '未来のための日記',
        },
      },
      ko: {
        site: {
          hero: '거창하지 않은 매일의 기록입니다. 기술, 글쓰기, 교육, TRPG, 3D, 게임을 한데 섞어 씁니다. 그렇게 섞을 때 더 잘 보이기 때문입니다.',
        },
        messages: {
          blog: {
            archiveDescription: '매일 밤 쓴 기록입니다. 그날 만든 것, 가르친 것, 플레이한 것, 그리고 고생한 것.',
          },
          siteDescription: '미래를 위한 일기',
          tagline: '미래를 위한 일기',
        },
      },
      zh: {
        site: {
          hero: '一份不加修饰的日常记录：技术、写作、教学、桌面角色扮演、3D 和游戏，混在一起写。因为混着写才看得更清楚。',
        },
        messages: {
          blog: {
            archiveDescription: '每晚写下的记录：那天做成了什么、教了什么、玩了什么，又被什么折腾了一番。',
          },
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
        site: {
          hero: 'Senpretenda taglibro pri tio, kion mi faras ĉiutage: teknologio, verkado, instruado, rolludoj, 3D kaj ludoj — ĉio krucbredita, ĉar tiel ĝi pli bone kompreniĝas.',
        },
        messages: {
          blog: {
            archiveDescription: 'Afiŝoj skribitaj ĉiunokte: kion mi konstruis, instruis, ludis aŭ suferis tiun tagon.',
          },
          siteDescription: 'Taglibro por la estonteco',
          tagline: 'Taglibro por la estonteco',
        },
      },
    },
  },
});
