import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'WUNDERLAND Docs',
  tagline: 'Open-source TypeScript CLI for autonomous AI agents — cognitive memory, HEXACO personalities, multi-agent orchestration, streaming guardrails, voice pipelines, and 21 LLM providers.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.wunderland.sh',
  baseUrl: '/',

  organizationName: 'rabbitholeinc',
  projectName: 'wunderland-sol',

  onBrokenLinks: 'warn',
  trailingSlash: false,

  markdown: {
    format: 'detect',
    mermaid: true,
  },

  themes: [
    '@docusaurus/theme-mermaid',
    'docusaurus-plugin-image-zoom',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  clientModules: ['./src/theme-sync.js'],

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content:
          'Wunderland, AI agent CLI, autonomous AI agents, TypeScript AI framework, cognitive memory, HEXACO personality, multi-agent orchestration, AI guardrails, prompt injection defense, voice agents, RAG memory, agent skills, browser automation, social media automation, LLM providers, Solana agents, AgentOS, npm CLI, agentic AI, build AI agents, LangGraph alternative, CrewAI alternative',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content:
          'Wunderland documentation — build autonomous AI agents with cognitive memory, HEXACO personalities, 5-tier guardrails, voice pipelines, 37 channels, and 21 LLM providers. Free, open-source TypeScript CLI.',
      },
    },
    {
      tagName: 'meta',
      attributes: { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' },
    },
    {
      tagName: 'meta',
      attributes: { name: 'googlebot', content: 'index, follow' },
    },
    {
      tagName: 'meta',
      attributes: { name: 'author', content: 'Rabbit Hole Inc — https://rabbithole.inc' },
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Wunderland Documentation',
        url: 'https://docs.wunderland.sh',
        description:
          'Official documentation for Wunderland — autonomous AI agent CLI framework with cognitive memory and HEXACO personalities.',
        publisher: {
          '@type': 'Organization',
          name: 'Rabbit Hole Inc',
          url: 'https://rabbithole.inc',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://docs.wunderland.sh/?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Wunderland',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'macOS, Linux, Windows',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        url: 'https://wunderland.sh',
        downloadUrl: 'https://www.npmjs.com/package/wunderland',
        codeRepository: 'https://github.com/jddunn/wunderland',
      }),
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    'docusaurus-plugin-sass',
    '@docusaurus/plugin-ideal-image',
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'typedoc-public',
        entryPoints: [
          '.source/wunderland/src/index.ts',
          '.source/wunderland/src/api/index.ts',
          '.source/wunderland/src/config/index.ts',
          '.source/wunderland/src/security/index.ts',
          '.source/wunderland/src/tools/index.ts',
          '.source/wunderland/src/discovery/index.ts',
          '.source/wunderland/src/core/PresetLoader.ts',
        ],
        tsconfig: '.source/wunderland/tsconfig.json',
        out: 'docs/api-reference/public',
        exclude: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**', '**/tests/**'],
        sidebar: {
          autoConfiguration: true,
          pretty: true,
        },
        validation: {
          notExported: false,
        },
        skipErrorChecking: true,
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'typedoc-internal',
        entryPoints: [
          '.source/wunderland/src/api/index.ts',
          '.source/wunderland/src/agency/index.ts',
          '.source/wunderland/src/authorization/index.ts',
          '.source/wunderland/src/browser/index.ts',
          '.source/wunderland/src/core/index.ts',
          '.source/wunderland/src/discovery/index.ts',
          '.source/wunderland/src/evaluation/index.ts',
          '.source/wunderland/src/inference/index.ts',
          '.source/wunderland/src/jobs/index.ts',
          '.source/wunderland/src/knowledge/index.ts',
          '.source/wunderland/src/marketplace/index.ts',
          '.source/wunderland/src/pairing/index.ts',
          '.source/wunderland/src/planning/index.ts',
          '.source/wunderland/src/provenance/index.ts',
          '.source/wunderland/src/rag/index.ts',
          '.source/wunderland/src/scheduling/index.ts',
          '.source/wunderland/src/security/index.ts',
          '.source/wunderland/src/skills/index.ts',
          '.source/wunderland/src/social/index.ts',
          '.source/wunderland/src/storage/index.ts',
          '.source/wunderland/src/structured/index.ts',
          '.source/wunderland/src/tools/index.ts',
          '.source/wunderland/src/runtime/index.ts',
          '.source/wunderland/src/workflows/index.ts',
          '.source/wunderland/src/config/index.ts',
          '.source/wunderland/src/guardrails/index.ts',
          '.source/wunderland/src/voice/index.ts',
        ],
        tsconfig: '.source/wunderland/tsconfig.json',
        out: 'docs/api-reference/modules',
        readme: 'none',
        exclude: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**', '**/tests/**'],
        sidebar: {
          autoConfiguration: true,
          pretty: true,
        },
        validation: {
          notExported: false,
        },
        skipErrorChecking: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          showLastUpdateTime: true,
          editUrl:
            'https://github.com/manicinc/wunderland-sol/tree/master/docs-site/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/wunderland-social-card.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'WUNDERLAND',
      logo: {
        alt: 'Wunderland Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guideSidebar',
          position: 'left',
          label: 'Guides',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API',
        },
        {
          to: '/docs/getting-started/changelog',
          label: 'Changelog',
          position: 'left',
        },
        {
          href: 'https://wunderland.sh',
          label: 'App',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/wunderland',
          label: 'npm',
          position: 'right',
        },
        {
          href: 'https://github.com/jddunn/wunderland',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Getting Started', to: '/docs/'},
            {label: 'Architecture', to: '/docs/architecture/overview'},
            {label: 'Guides', to: '/docs/guides/creating-agents'},
            {label: 'API', to: '/docs/api/overview'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub', href: 'https://github.com/jddunn/wunderland'},
            {label: 'Discord', href: 'https://discord.com/invite/KxF9b6HY6h'},
            {label: 'Twitter', href: 'https://twitter.com/wunderlandsh'},
            {label: 'Contact: hi@rabbithole.inc', href: 'mailto:hi@rabbithole.inc'},
          ],
        },
        {
          title: 'Related',
          items: [
            {label: 'Wunderland App', href: 'https://wunderland.sh'},
            {label: 'AgentOS', href: 'https://agentos.sh'},
            {label: 'AgentOS Docs', href: 'https://docs.agentos.sh'},
          ],
        },
      ],
      copyright: `Copyright \u00a9 ${new Date().getFullYear()} Manic Agency LLC. Open source under Apache 2.0.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'json', 'bash', 'solidity'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
    zoom: {
      selector: '.markdown img',
      background: {
        light: 'rgba(255, 255, 255, 0.9)',
        dark: 'rgba(0, 0, 0, 0.9)',
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
