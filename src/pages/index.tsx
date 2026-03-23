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

/* ── Badges ────────────────────────────────────────────────────────── */

function Badges() {
  return (
    <div className={styles.badges}>
      <a href="https://github.com/jddunn/wunderland" target="_blank" rel="noopener noreferrer">
        <img
          src="https://img.shields.io/github/stars/jddunn/wunderland?style=flat-square&logo=github&color=c9a227&labelColor=08070e"
          alt="GitHub Stars"
        />
      </a>
      <a href="https://www.npmjs.com/package/wunderland" target="_blank" rel="noopener noreferrer">
        <img
          src="https://img.shields.io/npm/v/wunderland?style=flat-square&logo=npm&color=9945ff&labelColor=08070e"
          alt="npm version"
        />
      </a>
      <a href="https://www.npmjs.com/package/wunderland" target="_blank" rel="noopener noreferrer">
        <img
          src="https://img.shields.io/npm/dm/wunderland?style=flat-square&color=0ea5e9&labelColor=08070e"
          alt="npm downloads"
        />
      </a>
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
          <img src="/img/logo.svg" alt="Wunderland" width={72} height={72} />
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

# Start an agent (interactive TUI dashboard)
$ wunderland start --preset enterprise --security-tier strict
  ✓ Loading agent config: enterprise.json
  ✓ Security tier: strict
  ✓ Guardrail packs: pii-redaction, ml-classifiers, code-safety (3 of 5 active)
  ✓ LLM provider: openai (gpt-4o)
  ✓ Agent running on http://localhost:3000
  ✓ Press Ctrl+C to stop

# Chat with an agent (streaming + guardrails)
$ wunderland chat --guardrails=pii,code,grounding
  [wunderland] Security tier: balanced
  [wunderland] Guardrail packs: pii-redaction, code-safety, grounding-guard
  You: What's John Smith's SSN?
  Agent: I can't provide personal information like SSNs. [PII_REDACTED]

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

const app = createWunderland({
  provider: { id: 'openai', apiKey: process.env.OPENAI_API_KEY },
  model: 'gpt-4o',
  security: { tier: 'balanced' }, // PII redaction + code safety
});

// Stream a response
const session = await app.chat('Explain microservices vs monolith trade-offs');
for await (const chunk of session) {
  process.stdout.write(chunk.text);
}
// Output: "Microservices offer independent deployment and scaling..."`,
  },
  {
    label: '🤝 Multi-Agent',
    language: 'typescript',
    code: `import { createWunderland } from 'wunderland';

const app = createWunderland({
  provider: { id: 'openai', apiKey: process.env.OPENAI_API_KEY },
  model: 'gpt-4o',
  workflow: {
    tasks: [
      // ── PARALLEL: run simultaneously (no dependencies) ──
      { id: 'research', role: 'researcher',
        prompt: 'Research top 3 competitors in AI agent frameworks',
        dependsOn: [] },
      { id: 'data', role: 'analyst',
        prompt: 'Analyze market size and growth trends',
        dependsOn: [] },

      // ── SEQUENTIAL: waits for BOTH parallel tasks ──
      { id: 'strategy', role: 'strategist',
        prompt: 'Create pricing strategy from research + data',
        dependsOn: ['research', 'data'] }, // receives their outputs

      // ── SEQUENTIAL: waits for strategy ──
      { id: 'report', role: 'writer',
        prompt: 'Write executive summary',
        dependsOn: ['strategy'] },
    ],
  },
});
// Execution: research ∥ data → strategy → report`,
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

const ECOSYSTEM: PackageInfo[] = [
  {
    name: 'wunderland',
    description: 'Core CLI + runtime \u2014 everything you need to create, run, and manage autonomous agents.',
    npm: 'wunderland',
  },
  {
    name: '@framers/agentos',
    description: 'Underlying AgentOS engine powering Wunderland \u2014 tool orchestration, memory, streaming.',
    npm: '@framers/agentos',
  },
  {
    name: '@framers/agentos-ext-pii-redaction',
    description: 'PII detection and redaction guardrail extension for sensitive data protection.',
    npm: '@framers/agentos-ext-pii-redaction',
  },
  {
    name: '@framers/agentos-ext-ml-classifiers',
    description: 'ML-based content classifiers for prompt injection detection and content safety.',
    npm: '@framers/agentos-ext-ml-classifiers',
  },
  {
    name: '@framers/agentos-extensions',
    description: '45+ extensions \u2014 channels, tools, voice providers, browser automation, and more.',
    npm: '@framers/agentos-extensions',
  },
];

function EcosystemSection() {
  return (
    <section className={styles.ecosystemSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Ecosystem
        </Heading>
        <div className={styles.ecosystemGrid}>
          {ECOSYSTEM.map((pkg) => (
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
        <CodeExamples />
        <FeatureCards />
        <EcosystemSection />
      </main>
    </Layout>
  );
}
