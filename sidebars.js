// @ts-check

function loadOptionalTypedocSidebar(modulePath) {
  try {
    const loaded = require(modulePath);
    return Array.isArray(loaded) ? loaded : loaded?.items ?? [];
  } catch {
    return [];
  }
}

const publicTypedocSidebarItems = loadOptionalTypedocSidebar('./docs/api-reference/public/typedoc-sidebar.cjs');
const internalTypedocSidebarItems = loadOptionalTypedocSidebar('./docs/api-reference/modules/typedoc-sidebar.cjs');

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  guideSidebar: [
    'intro',

    // ── Getting Started ──
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/installation',
        'getting-started/quickstart',
        'getting-started/configuration',
        'getting-started/agent-config-reference',
      ],
    },

    // ── Tutorials ──
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'tutorials/first-agent',
        'tutorials/natural-language-agents',
        'tutorials/voice-agent',
        'tutorials/ivr-phone-agent',
      ],
    },

    // ── Core Concepts ──
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'guides/creating-agents',
        'guides/nl-agent-creation',
        'guides/preset-agents',
        'guides/library-first-api',
        'guides/multi-agent-agency',
        'guides/agent-serialization',
        'architecture/overview',
        'architecture/agentos-integration',
      ],
    },

    // ── Personality ──
    {
      type: 'category',
      label: 'Personality',
      items: [
        'guides/hexaco-personality',
        'architecture/personality-system',
        'guides/style-adaptation',
        'guides/llm-sentiment',
      ],
    },

    // ── Memory & RAG ──
    {
      type: 'category',
      label: 'Memory & RAG',
      items: [
        'guides/memory-system',
        'guides/working-memory',
        'guides/unified-retrieval',
        'guides/query-routing',
        'guides/deep-research',
        'guides/hyde-retrieval',
        'guides/capability-discovery',
        'guides/vector-storage-scaling',
      ],
    },

    // ── Tools & Skills ──
    {
      type: 'category',
      label: 'Tools & Skills',
      items: [
        'guides/tools',
        'guides/skills-system',
        'guides/extensions',
        'guides/cli-tools',
        'guides/emergent-capabilities',
        'guides/self-improving-agents',
        'guides/scheduling',
      ],
    },

    // ── Media Generation ──
    {
      type: 'category',
      label: 'Media Generation',
      items: [
        'guides/image-generation',
        'guides/image-editing',
        'guides/vision-pipeline',
        'guides/video-audio-generation',
        'guides/document-export',
        'guides/browser-automation',
      ],
    },

    // ── Voice & Telephony ──
    {
      type: 'category',
      label: 'Voice & Telephony',
      items: [
        'guides/voice-runtime',
        'guides/telephony-setup',
        'guides/speaker-diarization',
        'guides/turn-detection',
        'guides/voice-production',
      ],
    },

    // ── Channels ──
    {
      type: 'category',
      label: 'Channels',
      items: [
        'guides/channels',
        'guides/full-channel-list',
        'guides/channel-oauth-setup',
        'guides/social-features',
        'guides/email-intelligence',
      ],
    },

    // ── Security ──
    {
      type: 'category',
      label: 'Security',
      items: [
        'guides/security',
        'guides/security-tiers',
        'guides/guardrails',
        'guides/immutability',
      ],
    },

    // ── LLM Providers ──
    {
      type: 'category',
      label: 'LLM Providers',
      items: [
        'guides/llm-providers',
        'guides/inference-routing',
        'guides/ollama-local',
        'guides/provider-preferences',
      ],
    },

    // ── Use Cases ──
    {
      type: 'category',
      label: 'Use Cases',
      items: [
        'use-cases/autonomous-web-agent',
        'use-cases/social-media-automation',
        'use-cases/deep-research-agent',
        'use-cases/voice-concierge',
        'use-cases/lead-generation-pipeline',
        'use-cases/competitive-intelligence',
      ],
    },

    // ── Deployment ──
    {
      type: 'category',
      label: 'Deployment',
      items: [
        'deployment/self-hosting',
        'deployment/cloud-hosting',
        'deployment/environment-variables',
        'deployment/local-first',
      ],
    },

    // ── Troubleshooting ──
    {
      type: 'category',
      label: 'Troubleshooting',
      items: ['guides/troubleshooting'],
    },
  ],

  apiSidebar: [
    'api/overview',
    'api/cli-reference',
    {
      type: 'category',
      label: 'Public API',
      items: publicTypedocSidebarItems,
    },
    {
      type: 'category',
      label: 'Internal Modules',
      items: internalTypedocSidebarItems,
    },
  ],
};

module.exports = sidebars;
