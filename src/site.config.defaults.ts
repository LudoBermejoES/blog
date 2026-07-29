import { deepMerge, type DeepPartial } from '@cyberdream/astro-theme/utils/merge';
import type { ThemeConfig } from './site.config.schema.ts';

const defaultThemeConfig: ThemeConfig = {
  site: {
    title: 'My Blog',
    description:
      'Cinematic web interfaces, AI-era engineering notes, and system architecture essays.',
    url: 'https://example.com',
    author: 'Your Name',
    tagline: 'Built with Astro.',
  },
  theme: {
    blogPageSize: 9,
    homeLatestCount: 3,
    enableAboutPage: true,
    pagination: {
      windowSize: 7,
      showJumpThreshold: 12,
      jump: {
        enabled: true,
        enterToGo: true,
      },
      style: {
        enabled: true,
        mode: 'random',
        variants: 9,
        fixedVariant: 1,
      },
    },
    effects: {
      enableRedQueen: true,
    },
    comments: {
      enabled: false,
      repo: '',
      repoId: '',
      category: '',
      categoryId: '',
      mapping: 'pathname',
      term: '',
      number: '',
      strict: '0',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'dark',
      lang: 'en',
      loading: 'lazy',
      crossorigin: 'anonymous',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: {
      en: {
        meta: {
          label: 'English',
          hreflang: 'en',
          ogLocale: 'en_US',
        },
        site: {
          hero: 'Write a short introduction for your site and what readers can expect from your posts.',
        },
      },
      ja: {
        meta: {
          label: '日本語',
          hreflang: 'ja',
          ogLocale: 'ja_JP',
          fallback: ['en'],
        },
        site: {
          hero: 'このサイトの紹介文と、読者がどんな記事を期待できるかを書いてください。',
        },
      },
      ko: {
        meta: {
          label: '한국어',
          hreflang: 'ko',
          ogLocale: 'ko_KR',
          fallback: ['en'],
        },
        site: {
          hero: '사이트 소개와 방문자가 어떤 글을 기대할 수 있는지 간단히 작성하세요.',
        },
      },
      es: {
        meta: {
          label: 'Español',
          hreflang: 'es',
          ogLocale: 'es_ES',
          fallback: ['en'],
        },
        site: {
          hero: 'Escribe una breve presentación del sitio y qué tipo de contenido encontrarán tus lectores.',
        },
      },
      zh: {
        meta: {
          label: '中文',
          hreflang: 'zh-CN',
          ogLocale: 'zh_CN',
          fallback: ['en'],
        },
        site: {
          hero: '在这里写一段站点简介，并告诉读者你将发布什么类型的内容。',
        },
      },
    },
    routing: {
      defaultLocalePrefix: 'always',
    },
  },
  social: {
    links: [],
  },
};

export function defineThemeConfig(config: DeepPartial<ThemeConfig>): ThemeConfig {
  return deepMerge(defaultThemeConfig, config);
}
