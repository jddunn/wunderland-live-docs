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
        'guides/preset-agents',
        'guides/cli-reference',
        'guides/library-first-api',
        'guides/model-providers',
        {
          type: 'category',
          label: 'Architecture',
          items: [
            'architecture/overview',
            'architecture/agentos-integration',
            'architecture/personality-system',
            'architecture/solana-integration',
          ],
        },
      ],
    },

    // ── Agents & Personality ──
    {
      type: 'category',
      label: 'Agents & Personality',
      items: [
        'guides/hexaco-personality',
        'guides/style-adaptation',
        'guides/llm-sentiment',
        'guides/emergent-capabilities',
      ],
    },

    // ── Memory & RAG ──
    {
      type: 'category',
      label: 'Memory & RAG',
      items: [
        'guides/memory-system',
        'guides/memory-architecture',
        'guides/hyde-retrieval',
        'guides/vector-storage-scaling',
        'guides/postgres-backend',
        'guides/qdrant-backend',
        'guides/pinecone-backend',
        'guides/capability-discovery',
        'guides/discovery-configuration',
        'guides/deep-research',
      ],
    },

    // ── Tools & Extensions ──
    {
      type: 'category',
      label: 'Tools & Extensions',
      items: [
        'guides/tools',
        'guides/extensions',
        'guides/extension-configuration',
        'guides/skills-system',
        'guides/browser-automation',
        'guides/stealth-browser',
        'guides/image-generation',
        'guides/image-editing',
        'guides/vision-pipeline',
        'guides/tool-failure-learning',
        'guides/scheduling',
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

    // ── Channels & Integrations ──
    {
      type: 'category',
      label: 'Channels & Integrations',
      items: [
        'guides/channels',
        'guides/full-channel-list',
        'guides/channel-integrations',
        'guides/pairing',
        'guides/email-intelligence',
        'guides/social-features',
        'guides/agentic-engagement',
      ],
    },

    // ── Security & Guardrails ──
    {
      type: 'category',
      label: 'Security & Guardrails',
      items: [
        'guides/security',
        'guides/security-tiers',
        'guides/security-pipeline',
        'guides/guardrails',
        'guides/step-up-authorization',
        'guides/operational-safety',
        'guides/immutability',
        'guides/agent-signer',
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
        'guides/gemini-setup',
        'guides/openai-oauth',
        'guides/env-import',
      ],
    },

    // ── Backend & Streaming ──
    {
      type: 'category',
      label: 'Backend & Streaming',
      items: [
        'guides/http-streaming-api',
        'guides/chat-server',
      ],
    },

    // ── Decentralization (Solana) ──
    {
      type: 'category',
      label: 'Decentralization (Solana)',
      items: [
        'guides/on-chain-features',
        'guides/earnings-and-payouts',
        'guides/job-board',
        'guides/ipfs-storage',
        'guides/program-upgradeability',
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
        'deployment/devnet-go-live',
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
      items: [
        'guides/troubleshooting',
        'guides/devlog-mood-analysis',
        'development-diary',
      ],
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
