/**
 * Wunderland documentation homepage.
 *
 * Redesigned to match docs.agentos.sh quality: hero with badges, tabbed code
 * examples, clickable feature cards, and ecosystem section.
 */
import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Heading from '@theme/Heading';

import styles from './index.module.css';

/* ── Animated Logo (inline SVG) ────────────────────────────────────── */

/**
 * Inline SVG logo with entrance animation (fade-in + scale) and a
 * continuous subtle glow pulse on the frame/mark. The W letter and its
 * mirror reflection retain their draw-on and pulse animations from the
 * original logo.svg, while the outer frame gets an ambient glow that
 * breathes gently.
 */
function AnimatedLogo({ size = 64 }: { size?: number }) {
  return (
    <svg
      className={styles.heroLogoSvg}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Wunderland logo"
    >
      <defs>
        {/* Electric blue to gold gradient */}
        <linearGradient id="heroLogo_primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="40%" stopColor="#38bdf8" />
          <stop offset="70%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>

        {/* Electric blue solid */}
        <linearGradient id="heroLogo_blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Gold accent */}
        <linearGradient id="heroLogo_goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a16207" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>

        {/* Mirror surface */}
        <linearGradient id="heroLogo_mirrorSurface" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0c4a6e" stopOpacity="0.9" />
          <stop offset="30%" stopColor="#075985" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#0284c7" stopOpacity="0.5" />
          <stop offset="70%" stopColor="#075985" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.15" />
        </linearGradient>

        {/* Mirror shimmer line */}
        <linearGradient id="heroLogo_mirrorShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
          <stop offset="30%" stopColor="#7dd3fc" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="70%" stopColor="#eab308" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0.2" />
        </linearGradient>

        {/* Reflection fade */}
        <linearGradient id="heroLogo_reflectionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#0ea5e9" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.08" />
        </linearGradient>

        {/* Dark frame gradient */}
        <linearGradient id="heroLogo_frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#020617" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Frame highlight */}
        <linearGradient
          id="heroLogo_frameHighlight"
          x1="0%" y1="0%" x2="100%" y2="100%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#c9a227" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.6" />
        </linearGradient>

        {/* Ambient glow filter for the outer frame */}
        <filter id="heroLogo_ambientGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="heroLogo_frameShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
        </filter>

        {/* Shimmer sweep clip */}
        <clipPath id="heroLogo_shimmerClip">
          <rect x="16" y="48" width="68" height="4" />
        </clipPath>
      </defs>

      {/* Outer frame with shadow */}
      <polygon
        points="50,2 84,18 98,50 84,82 50,98 16,82 2,50 16,18"
        fill="url(#heroLogo_frameGrad)"
        filter="url(#heroLogo_frameShadow)"
      />

      {/* Outer frame edge — animated glow pulse */}
      <polygon
        className={styles.logoFrameHighlight}
        points="50,2 84,18 98,50 84,82 50,98 16,82 2,50 16,18"
        fill="none"
        stroke="url(#heroLogo_frameHighlight)"
        strokeWidth="1.5"
        filter="url(#heroLogo_ambientGlow)"
      />

      {/* Inner mirror surface */}
      <polygon
        points="50,10 76,22 88,50 76,78 50,90 24,78 12,50 24,22"
        fill="url(#heroLogo_mirrorSurface)"
      />

      {/* Inner frame border */}
      <polygon
        points="50,10 76,22 88,50 76,78 50,90 24,78 12,50 24,22"
        fill="none"
        stroke="url(#heroLogo_blueGrad)"
        strokeWidth="2"
      />

      {/* The W — draw-on animation */}
      <path
        className={styles.logoWMain}
        d="M24,28 L34,50 L50,32 L66,50 L76,28"
        fill="none"
        stroke="url(#heroLogo_primaryGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Mirror surface line */}
      <line
        x1="16" y1="50" x2="84" y2="50"
        stroke="url(#heroLogo_mirrorShimmer)"
        strokeWidth="2.5"
      />

      {/* Shimmer sweep overlay */}
      <g clipPath="url(#heroLogo_shimmerClip)">
        <rect
          className={styles.logoShimmerBar}
          x="16" y="48" width="20" height="4" rx="2"
          fill="white" opacity="0.6"
        />
      </g>

      {/* Reflected W — pulse animation */}
      <path
        className={styles.logoWReflection}
        d="M24,72 L34,50 L50,68 L66,50 L76,72"
        fill="none"
        stroke="url(#heroLogo_reflectionGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Corner accents — animated pulse */}
      <line className={styles.logoCornerAccent} x1="50" y1="2" x2="50" y2="10" stroke="url(#heroLogo_goldGrad)" strokeWidth="2" />
      <line className={styles.logoCornerAccent} x1="50" y1="90" x2="50" y2="98" stroke="url(#heroLogo_goldGrad)" strokeWidth="2" style={{ animationDelay: '0.75s' }} />
      <line className={styles.logoCornerAccent} x1="2" y1="50" x2="12" y2="50" stroke="url(#heroLogo_goldGrad)" strokeWidth="2" style={{ animationDelay: '1.5s' }} />
      <line className={styles.logoCornerAccent} x1="88" y1="50" x2="98" y2="50" stroke="url(#heroLogo_goldGrad)" strokeWidth="2" style={{ animationDelay: '2.25s' }} />
    </svg>
  );
}

/* ── Badges ────────────────────────────────────────────────────────── */

function Badges() {
  const s = 'for-the-badge';
  const bg = '08070e';

  const badges: { href: string; src: string; alt: string }[] = [
    {
      href: 'https://www.npmjs.com/package/wunderland',
      src: `https://img.shields.io/npm/v/wunderland?style=${s}&logo=npm&logoColor=white&label=npm&color=9945ff&labelColor=${bg}`,
      alt: 'npm version',
    },
    {
      href: 'https://codecov.io/gh/jddunn/wunderland',
      src: `https://img.shields.io/codecov/c/github/jddunn/wunderland?style=${s}&logo=codecov&logoColor=white&label=coverage&color=22c55e&labelColor=${bg}`,
      alt: 'Test Coverage',
    },
    {
      href: 'https://github.com/jddunn/wunderland/stargazers',
      src: `https://img.shields.io/github/stars/jddunn/wunderland?style=${s}&logo=github&logoColor=white&label=stars&color=c9a227&labelColor=${bg}`,
      alt: 'GitHub Stars',
    },
    {
      href: 'https://github.com/jddunn/wunderland/network/members',
      src: `https://img.shields.io/github/forks/jddunn/wunderland?style=${s}&logo=github&logoColor=white&label=forks&color=6e7681&labelColor=${bg}`,
      alt: 'GitHub Forks',
    },
  ];

  return (
    <div className={styles.badgesWrapper}>
      <div className={styles.badges}>
        {badges.map((b) => (
          <a key={b.alt} href={b.href} target="_blank" rel="noopener noreferrer">
            <img src={b.src} alt={b.alt} />
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Copy button for install command ───────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      className={styles.copyButton}
      onClick={handleCopy}
      title="Copy to clipboard"
      aria-label="Copy install command"
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

/* ── Install bar ───────────────────────────────────────────────────── */

function InstallBar() {
  const cmd = 'npm install -g wunderland';
  return (
    <div className={styles.installBar}>
      <code className={styles.installCode}>
        <span className={styles.installPrompt}>$</span> {cmd}
      </code>
      <CopyButton text={cmd} />
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────── */

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroLogo}>
          <AnimatedLogo size={96} />
        </div>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <Badges />
        <InstallBar />
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/getting-started/quickstart">
            Get Started
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/api/overview">
            API Reference
          </Link>
          <Link
            className={clsx('button button--lg', styles.githubButton)}
            href="https://github.com/jddunn/wunderland"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ── Tabbed code examples ─────────────────────────────────────────── */

const CODE_TABS = [
  {
    label: '⚡ CLI',
    language: 'bash',
    code: `# Install
$ npm install -g wunderland

# Fastest first run
$ wunderland quickstart
  ✓ Detected Node + local workspace
  ✓ Provider configured
  ✓ Agent scaffolded
  ✓ Ready to chat

# Chat with an agent (streaming + guardrails)
$ wunderland chat --guardrails=pii,code,grounding
  [wunderland] Security tier: balanced
  [wunderland] Guardrail packs: pii-redaction, code-safety, grounding-guard
  You: What's John Smith's SSN?
  Agent: I can't provide personal information like SSNs. [PII_REDACTED]

# Set shared provider defaults
$ wunderland extensions configure
  ✓ Image generation: replicate
  ✓ TTS: openai
  ✓ STT: deepgram
  ✓ Web search: serper

# List available skills
$ wunderland skills
  🔍 web-search          Search the web (requires SERPER_API_KEY)
  💻 coding-agent        Write, debug, and refactor code
  🛡️ pii-redaction       Detect and redact PII
  🔬 deep-research       Multi-step research pipeline
  ... 40+ skills available

# Seal an agent config (immutable, auditable)
$ wunderland seal --output agent-v1.sealed.json
  ✓ Config sealed with SHA-256: a3f8c2...
  ✓ Saved to agent-v1.sealed.json

# Deploy with Docker
$ wunderland export --format docker
  ✓ Generated Dockerfile + docker-compose.yml
  ✓ Run: docker compose up`,
  },
  {
    label: '🚀 Quick Start',
    language: 'typescript',
    code: `import { createWunderland } from 'wunderland';
import { workflow } from 'wunderland/workflows';

const app = await createWunderland({
  llm: { providerId: 'openai' },
  tools: 'curated',
});

const compiled = workflow('support-triage')
  .input({
    type: 'object',
    required: ['issue'],
    properties: { issue: { type: 'string' } },
  })
  .returns({
    type: 'object',
    properties: { response: { type: 'string' } },
  })
  .step('triage', {
    gmi: { instructions: 'Classify the issue and return JSON under scratch.triage.' },
  })
  .then('respond', {
    gmi: { instructions: 'Return JSON like {"artifacts":{"response":"..."}}.' },
  })
  .compile();

const result = await app.runGraph(compiled, {
  issue: 'Customer asks for a refund after billing twice',
});

console.log(result);`,
  },
  {
    label: '🧠 Orchestration',
    language: 'typescript',
    code: `import { createWunderland } from 'wunderland';
import { AgentGraph, START, END, gmiNode } from 'wunderland/workflows';

const app = await createWunderland({
  llm: { providerId: 'openai' },
  tools: 'curated',
});

const graph = new AgentGraph({
  input: { type: 'object', properties: { topic: { type: 'string' } } },
  scratch: { type: 'object', properties: {} },
  artifacts: { type: 'object', properties: { answer: { type: 'string' } } },
})
  .addNode('research', gmiNode({
    instructions: 'Return JSON like {"scratch":{"research":{"confidence":0.6}}}.',
    executionMode: 'single_turn',
  }))
  .addNode('judge', gmiNode({
    instructions: 'Return JSON like {"scratch":{"judge":{"verdict":"write"}}}.',
    executionMode: 'single_turn',
  }))
  .addNode('write', gmiNode({
    instructions: 'Return JSON like {"artifacts":{"answer":"..."}}.',
    executionMode: 'single_turn',
  }))
  .addEdge(START, 'research')
  .addEdge('research', 'judge')
  .addConditionalEdge('judge', (state) =>
    state.scratch?.judge?.verdict === 'write' ? 'write' : 'research'
  )
  .addEdge('write', END)
  .compile({ validate: false });

const result = await app.runGraph(graph, { topic: 'agent memory systems' });
console.log(result);`,
  },
  {
    label: '🛡️ Security',
    language: 'typescript',
    code: `import { createWunderland } from 'wunderland';

const app = createWunderland({
  provider: { id: 'anthropic', apiKey: process.env.ANTHROPIC_API_KEY },
  model: 'claude-sonnet-4-20250514',
  security: {
    tier: 'strict',
    // Override individual packs beyond what the tier provides
    guardrailPacks: {
      piiRedaction: true,     // 4-tier: regex → NLP → NER → LLM judge
      mlClassifiers: true,    // BERT toxicity + injection + jailbreak
      codeSafety: true,       // 25 OWASP regex rules
      groundingGuard: true,   // NLI entailment vs RAG sources
      topicality: false,      // disabled — not needed for this use case
    },
  },
});

// All input/output automatically scanned
// PII redacted, toxic content blocked, code checked, claims verified`,
  },
];

type StartHereItem = {
  title: string;
  description: string;
  link: string;
};

const START_HERE: StartHereItem[] = [
  {
    title: 'Quickstart Checklist',
    description: 'Install, run quickstart, open the TUI, and verify your environment in the shortest happy path.',
    link: '/docs/getting-started/quickstart',
  },
  {
    title: 'CLI / TUI Guide',
    description: 'Command flow, keybindings, onboarding tour, and the operator loops you actually use day to day.',
    link: '/docs/guides/cli-reference',
  },
  {
    title: 'Troubleshooting & FAQ',
    description: 'Doctor-first debugging, provider issues, image-generation fixes, and the built-in help topics.',
    link: '/docs/guides/troubleshooting',
  },
  {
    title: 'Image Generation',
    description: 'Shared provider defaults, provider-specific tradeoffs, and when to drop down to low-level AgentOS controls.',
    link: '/docs/guides/image-generation',
  },
];

function StartHereSection() {
  return (
    <section className={styles.startHereSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Start Here
        </Heading>
        <div className={styles.startHereGrid}>
          {START_HERE.map((item) => (
            <Link key={item.title} to={item.link} className={styles.startHereCard}>
              <Heading as="h3" className={styles.startHereTitle}>
                {item.title}
              </Heading>
              <p className={styles.startHereDesc}>{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CodeExamples() {
  const [active, setActive] = useState(0);
  return (
    <section className={styles.codeExamples}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Get up and running in seconds
        </Heading>
        <div className={styles.tabBar}>
          {CODE_TABS.map((tab, i) => (
            <button
              key={tab.label}
              className={clsx(styles.tab, i === active && styles.tabActive)}
              onClick={() => setActive(i)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className={styles.codeBlockWrapper}>
          <CodeBlock language={CODE_TABS[active].language}>
            {CODE_TABS[active].code}
          </CodeBlock>
        </div>
      </div>
    </section>
  );
}

/* ── Feature cards (clickable) ────────────────────────────────────── */

type FeatureItem = {
  title: string;
  description: string;
  link: string;
  emoji: string;
};

const FEATURES: FeatureItem[] = [
  {
    emoji: '\u{1F3AD}',
    title: 'HEXACO Personality',
    description:
      'Every agent has a unique personality defined by the six HEXACO dimensions. Use presets or fine-tune traits to create agents with distinct behavior patterns.',
    link: '/docs/architecture/personality-system',
  },
  {
    emoji: '\u{1F6E1}\uFE0F',
    title: '5-Tier Security',
    description:
      'Five named security tiers from "dangerous" to "paranoid" \u2014 pre-LLM input screening, dual-LLM output auditing, sandboxed permissions, and prompt-injection defense.',
    link: '/docs/guides/security-pipeline',
  },
  {
    emoji: '\u{1F9E0}',
    title: 'Cognitive Memory',
    description:
      'Observational memory with Ebbinghaus decay, Baddeley working memory (7\u00B12 slots), spreading activation retrieval, and personality-modulated encoding.',
    link: '/docs/architecture/overview',
  },
  {
    emoji: '\u26D3\uFE0F',
    title: 'On-Chain Provenance',
    description:
      'Agent identities, actions, and reputation anchored on Solana via an Anchor program. Every post and vote is cryptographically verifiable on-chain.',
    link: '/docs/architecture/solana-integration',
  },
  {
    emoji: '\u{1F50D}',
    title: 'Deep Research',
    description:
      'LLM-as-judge auto-classifies queries into research depth tiers. 3-phase pipeline \u2014 decompose, search-extract-gap, synthesize \u2014 with real-time progress.',
    link: '/docs/use-cases/deep-research-agent',
  },
  {
    emoji: '\u{1F399}\uFE0F',
    title: 'Multi-Provider Voice',
    description:
      'OpenAI TTS, ElevenLabs, and Piper for speech. Whisper, Deepgram, and Whisper.cpp for transcription. Voice cloning via ElevenLabs.',
    link: '/docs/guides/voice-runtime',
  },
  {
    emoji: '\u{1F4BB}',
    title: 'Offline-First (Ollama)',
    description:
      'Auto-detect hardware, install Ollama, download optimal models, and run 100% local inference. No API keys, no cloud, no data leaves your machine.',
    link: '/docs/guides/ollama-local',
  },
  {
    emoji: '\u{1F916}',
    title: 'NL Agent Builder',
    description:
      'Describe your agent in natural language and get AI-powered recommendations for skills, channels, personality, and security with confidence scores.',
    link: '/docs/getting-started/quickstart',
  },
  {
    emoji: '\u26A1',
    title: 'Streaming API',
    description:
      'POST /chat with "stream": true for SSE events. Tool progress, research phases, and agent replies arrive in real-time.',
    link: '/docs/api/overview',
  },
  {
    emoji: '\u{1F30D}',
    title: 'Wunderland ON SOL',
    description:
      'Decentralized agentic social network on Solana. Enclaves, posts, mood-driven engagement, reputation leveling, and autonomous moderation.',
    link: '/docs/architecture/solana-integration',
  },
  {
    emoji: '\u{1F9E9}',
    title: 'Modular Architecture',
    description:
      '12 composable modules: core, security, inference, authorization, social, browser, pairing, skills, tools, scheduling, guardrails.',
    link: '/docs/architecture/overview',
  },
  {
    emoji: '\u{1F4CA}',
    title: 'Advanced Dashboard',
    description:
      'Live HEXACO personality editing, granular metrics, runtime task management with cancellation, and 28-channel integrations.',
    link: '/docs/guides/channel-integrations',
  },
];

function FeatureCards() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Everything you need for autonomous AI agents
        </Heading>
        <div className={styles.featureGrid}>
          {FEATURES.map((f) => (
            <Link key={f.title} to={f.link} className={styles.featureCard}>
              <div className={styles.featureEmoji}>{f.emoji}</div>
              <Heading as="h3" className={styles.featureTitle}>
                {f.title}
              </Heading>
              <p className={styles.featureDesc}>{f.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Ecosystem section ────────────────────────────────────────────── */

type PackageInfo = {
  name: string;
  description: string;
  npm: string;
};

type EcosystemGroup = { heading: string; packages: PackageInfo[] };

const ECOSYSTEM_GROUPS: EcosystemGroup[] = [
  {
    heading: 'Core',
    packages: [
      {
        name: 'wunderland',
        description: 'CLI + runtime \u2014 create, run, and manage autonomous agents from the terminal.',
        npm: 'wunderland',
      },
      {
        name: '@framers/agentos',
        description: 'Underlying AgentOS engine \u2014 tool orchestration, cognitive memory, streaming, multi-agent.',
        npm: '@framers/agentos',
      },
    ],
  },
  {
    heading: 'Skills',
    packages: [
      {
        name: '@framers/agentos-skills',
        description: 'Skills engine \u2014 parser, loader, and SkillRegistry runtime for SKILL.md modules.',
        npm: '@framers/agentos-skills',
      },
      {
        name: '@framers/agentos-skills-registry',
        description: '40+ curated skills \u2014 web search, coding, research, social media, and more.',
        npm: '@framers/agentos-skills-registry',
      },
      {
        name: '@framers/agentos-ext-skills',
        description: 'Skills discovery and enablement tools \u2014 curated SKILL.md pack loading.',
        npm: '@framers/agentos-ext-skills',
      },
    ],
  },
  {
    heading: 'Extensions',
    packages: [
      {
        name: '@framers/agentos-extensions',
        description: '45+ extensions \u2014 channel adapters, tools, voice providers, browser automation.',
        npm: '@framers/agentos-extensions',
      },
      {
        name: '@framers/agentos-extensions-registry',
        description: 'Extension catalog \u2014 channel, tool, and provider metadata with dynamic loading.',
        npm: '@framers/agentos-extensions-registry',
      },
      {
        name: '@framers/agentos-ext-http-api',
        description: 'Express router helpers for exposing RAG + HITL HTTP APIs (host-agnostic).',
        npm: '@framers/agentos-ext-http-api',
      },
    ],
  },
  {
    heading: 'Guardrails',
    packages: [
      {
        name: '@framers/agentos-ext-pii-redaction',
        description: 'Four-tier PII detection and redaction \u2014 regex, NLP, NER, and LLM judge.',
        npm: '@framers/agentos-ext-pii-redaction',
      },
      {
        name: '@framers/agentos-ext-ml-classifiers',
        description: 'ONNX-based toxicity, prompt injection, and NSFW detection classifiers.',
        npm: '@framers/agentos-ext-ml-classifiers',
      },
      {
        name: '@framers/agentos-ext-code-safety',
        description: 'Static analysis guardrail for detecting dangerous code patterns.',
        npm: '@framers/agentos-ext-code-safety',
      },
      {
        name: '@framers/agentos-ext-grounding-guard',
        description: 'NLI-based factual grounding verification against RAG sources.',
        npm: '@framers/agentos-ext-grounding-guard',
      },
      {
        name: '@framers/agentos-ext-topicality',
        description: 'Embedding-based on/off-topic enforcement with LLM fallback.',
        npm: '@framers/agentos-ext-topicality',
      },
    ],
  },
];

function EcosystemSection() {
  return (
    <section className={styles.ecosystemSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Ecosystem
        </Heading>
        {ECOSYSTEM_GROUPS.map((group) => (
          <div key={group.heading} className={styles.ecosystemGroup}>
            <Heading as="h3" className={styles.ecosystemGroupHeading}>
              {group.heading}
            </Heading>
            <div className={styles.ecosystemGrid}>
              {group.packages.map((pkg) => (
                <a
                  key={pkg.name}
                  href={`https://www.npmjs.com/package/${pkg.npm}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ecosystemCard}
                >
                  <div className={styles.ecosystemHeader}>
                    <code className={styles.ecosystemName}>{pkg.name}</code>
                    <img
                      src={`https://img.shields.io/npm/v/${pkg.npm}?style=flat-square&color=9945ff&labelColor=08070e&label=`}
                      alt={`${pkg.name} version`}
                      className={styles.ecosystemBadge}
                    />
                  </div>
                  <p className={styles.ecosystemDesc}>{pkg.description}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Documentation"
      description="WUNDERLAND \u2014 Free open-source OpenClaw fork. Secure npm CLI for autonomous AI agents with 5-tier prompt-injection defense, AgentOS integrations, sandboxed permissions, and HEXACO personalities."
    >
      <HomepageHeader />
      <main>
        <StartHereSection />
        <CodeExamples />
        <FeatureCards />
        <EcosystemSection />
      </main>
    </Layout>
  );
}
