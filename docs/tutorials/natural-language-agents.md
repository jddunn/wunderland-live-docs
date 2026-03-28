---
title: "Tutorial: Natural Language Agent Creation"
sidebar_position: 3
---

# Natural Language Agent Creation

Wunderland can build a fully configured agent from a plain English description. Instead of manually selecting presets, skills, channels, and security tiers, you describe what you want and the CLI uses your LLM provider to extract structured configuration automatically.

This tutorial covers the `wunderland create` and `wunderland new` commands, walks through the extraction pipeline, and shows how to fine-tune the results.

---

## Prerequisites

- **Wunderland CLI installed** (`npm install -g wunderland`)
- **An LLM API key** configured in your environment or `~/.wunderland/.env` (OpenAI, Anthropic, OpenRouter, Gemini, or local Ollama)

If you haven't set up the CLI yet, start with the [First Agent tutorial](./first-agent.md).

---

## Quick Start

A single command creates an agent directory with full configuration:

```bash
wunderland create "a research assistant that monitors Hacker News and summarizes daily"
```

The CLI will:

1. Detect your LLM provider (or prompt you to configure one)
2. Send your description to the LLM with the full catalog of presets, skills, channels, and security tiers
3. Parse the structured JSON extraction
4. Show you a preview with confidence scores
5. Write `agent.config.json`, `.env.example`, and scaffold files to a new directory

You can also use `wunderland new`, which unifies preset-based and natural language creation:

```bash
# Interactive — asks how you want to create (preset, NL description, blank, or import)
wunderland new

# Pass a description directly (10+ characters triggers NL mode)
wunderland new "customer support bot for our Shopify store"

# Or use a preset directly
wunderland new --preset research-assistant
```

---

## End-to-End Example

Here is a complete walkthrough you can run right now. Copy-paste and follow along.

### 1. Create the agent

```bash
wunderland create "a Twitter bot that posts daily AI news summaries with a friendly, enthusiastic personality"
```

The CLI outputs a preview like this:

```
╭─ Natural Language Agent Creator ───────────────────────────╮
│ Describe your agent in plain English and the CLI will      │
│ extract a full configuration using your LLM provider.      │
╰────────────────────────────────────────────────────────────╯

▸ Validating LLM provider...
✔ LLM provider configured.

▸ Extracting agent configuration...
✔ Configuration extracted successfully.

▸ Extracted Configuration
  Display Name:       AI News Bot (95% confidence)
  Seed ID:            seed_ai_news_bot
  Bio:                Posts daily AI news summaries on Twitter
  Preset:             research-assistant (80% confidence)
  Skills:             web-search, summarize, twitter-bot (85% confidence)
  Extensions:         tools: web-search, news-search
  Channels:           twitter (95% confidence)
  Security Tier:      balanced
  Permission Set:     supervised
  Tool Access Profile: social-citizen
  Execution Mode:     human-dangerous
  Personality (HEXACO): honesty: 0.80, emotionality: 0.50,
                        extraversion: 0.85, agreeableness: 0.80,
                        conscientiousness: 0.75, openness: 0.70

? Create agent with this configuration? (Y/n)
```

Press `Y` to confirm.

### 2. Review the generated files

```bash
cd seed_ai_news_bot
ls -la
```

```
seed_ai_news_bot/
├── agent.config.json    # Full structured configuration
├── .env.example         # API keys template
├── .gitignore           # Excludes .env and node_modules
├── README.md            # Quickstart for this specific agent
└── skills/              # Custom skills directory (add SKILL.md files here)
    └── .gitkeep
```

### 3. Configure and start

```bash
cp .env.example .env
# Edit .env with your actual API keys
wunderland start
```

Your agent is now running. Connect to it:

```bash
wunderland chat
```

---

## What Gets Extracted

The NL builder extracts every field needed for a complete `agent.config.json`:

| Field | Description | Example |
|---|---|---|
| **displayName** | Human-readable agent name | "HN Digest Bot" |
| **bio** | Short agent description | "Monitors Hacker News for trending stories" |
| **systemPrompt** | Custom system prompt injected into LLM context | "Focus on technical accuracy..." |
| **personality** | HEXACO traits (honesty, emotionality, extraversion, agreeableness, conscientiousness, openness) on a 0-1 scale | `{ honesty: 0.9, openness: 0.8, ... }` |
| **preset** | Agent archetype (research-assistant, customer-support, creative-writer, code-reviewer, etc.) | "research-assistant" |
| **skills** | Curated skills from the 40+ skill catalog | `["web-search", "summarize", "twitter-bot"]` |
| **extensions** | Tool, voice, and productivity extensions | `{ tools: ["web-search", "news-search"] }` |
| **channels** | Platform bindings from the 37-channel catalog | `["twitter", "discord"]` |
| **securityTier** | Security posture (dangerous, permissive, balanced, strict, paranoid) | "balanced" |
| **permissionSet** | Filesystem and tool permissions (unrestricted, autonomous, supervised, read-only, minimal) | "supervised" |
| **toolAccessProfile** | Social and tool access level | "assistant" |
| **executionMode** | Tool execution approval mode (autonomous, human-dangerous, human-all) | "human-dangerous" |

Each field comes with a **confidence score** (0-1) so you know which parts the LLM was certain about and which might need manual adjustment.

---

## Writing Better Descriptions

The quality of your description directly affects extraction accuracy. Here are patterns that produce high-confidence results:

| Description | What gets extracted |
|---|---|
| "Build me a Twitter bot that posts AI news daily" | twitter channel, web-search + news-search + twitter-bot skills, social-citizen profile, balanced security |
| "I need a strict code reviewer for our GitHub PRs" | code-reviewer preset, github + coding-agent skills, strict security, high conscientiousness |
| "Create a friendly voice receptionist for my dental clinic" | ai-receptionist preset, voice-conversation skill, high agreeableness + extraversion |
| "Research assistant that deeply analyzes academic papers" | research-assistant preset, deep-research + summarize skills, high openness + conscientiousness |
| "Paranoid security auditor that scans our repos" | security-auditor preset, github skills, paranoid security tier |
| "Slack + Discord support bot, no shell access, read-only" | slack + discord channels, customer-support preset, strict security, read-only permissions |

**Tips:**

- **Name the purpose explicitly** -- "monitors competitor pricing" is better than "research bot"
- **Mention channels** -- "responds on Slack and Discord" maps directly to channel adapters
- **State security requirements** -- "strict, no shell access" or "paranoid" maps to security tiers
- **Reference skills by name** -- "uses web search and GitHub" gets matched to curated skills
- **Describe personality** -- "friendly and enthusiastic" raises extraversion and agreeableness; "methodical and precise" raises conscientiousness

---

## Confidence Scores

Every extracted field includes a confidence score. The CLI visualizes these:

- **High (80-100%)** -- The LLM found a direct match in your description. No changes needed.
- **Medium (50-79%)** -- Inferred from context. Worth reviewing.
- **Low (0-49%)** -- Best guess based on defaults. You should edit `agent.config.json` manually.

If a field shows low confidence, open `agent.config.json` after creation and adjust it. The [Agent Configuration Reference](/getting-started/agent-config-reference) documents every field.

---

## Flags and Options

```bash
# Skip confirmation prompt (auto-accept)
wunderland create "my agent description" --yes

# Specify output directory
wunderland create "my agent description" --dir ./agents/my-bot

# Create for managed hosting (restricts filesystem/CLI tools)
wunderland create "my agent description" --managed
```

---

## The `wunderland new` Command

`wunderland new` is a unified entry point that combines multiple creation modes:

```bash
# Interactive mode — choose preset, NL description, blank, or import
wunderland new

# NL mode (auto-detected when description is 10+ characters)
wunderland new "daily HN digest bot that posts to Slack"

# Preset mode
wunderland new --preset code-reviewer

# Import from a shared manifest
wunderland new --from agent.manifest.json
```

The interactive mode presents a menu:

```
▸ Create a New Agent

? How do you want to create your agent?
  ● From a preset         (research, social-media, operations, etc.)
  ○ Describe in plain English  (AI extracts full config from your description)
  ○ Blank agent           (minimal scaffold, configure later)
  ○ Import manifest       (from a shared agent.manifest.json)
```

---

## How It Works Under the Hood

The extraction pipeline uses the `NaturalLanguageAgentBuilder` module:

1. **Prompt construction** -- Your description is embedded into a structured prompt containing the full catalog of presets (9), skills (40+), channels (37), security tiers (5), permission sets (5), tool access profiles (5), and execution modes (3).

2. **LLM invocation** -- The prompt is sent to your configured provider (OpenAI, Anthropic, OpenRouter, Gemini, or Ollama) at low temperature (0.1) for deterministic extraction.

3. **JSON parsing** -- The response is parsed with fallback strategies: direct JSON, fenced code blocks, or best-effort brace matching.

4. **Validation** -- Every extracted field is validated against the known catalogs. Invalid presets, channels, or tiers are dropped with warnings.

5. **Channel normalization** -- Aliases like "X", "Twitter/X", "Google Chat", "MS Teams", and "Dev.to" are mapped to their canonical platform names.

6. **Security wiring** -- The selected security tier is expanded into pipeline configuration (pre-LLM classifier, dual-LLM audit, output signing, risk threshold).

7. **File generation** -- `agent.config.json`, `.env.example`, `.gitignore`, `README.md`, and the `skills/` directory are written to the target directory.

---

## Next Steps

- [Agent Configuration Reference](/getting-started/agent-config-reference) -- Full field reference for `agent.config.json`
- [Preset Agents](/guides/preset-agents) -- Browse the 9 built-in presets
- [Security Tiers](/guides/security-tiers) -- Understand each security posture
- [Skills System](/guides/skills-system) -- Browse and create custom skills
- [Creating Agents](/guides/creating-agents) -- Programmatic agent creation with Seeds
