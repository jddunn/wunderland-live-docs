---
sidebar_label: NL Agent Creation
sidebar_position: 3
---

# Natural Language Agent Creation

Create fully configured Wunderland agents by describing what you want in plain English. The CLI sends your description to an LLM, extracts structured configuration, and scaffolds a ready-to-run project.

---

## You Don't Need to Know the Command

You don't need to remember `wunderland create` exists. Just describe what you want at the top level:

```bash
wunderland "Build me a research agent that monitors AI news"
```

The CLI's NL intent router recognizes this as a creation intent and dispatches to `wunderland create` automatically. The same works for teams (`wunderland agency create`), missions (`wunderland mission`), and questions (`wunderland chat`). See the [CLI Reference](/api/cli-reference#natural-language-routing) for the full routing table.

---

## `wunderland create`

The primary command for NL agent creation:

```bash
wunderland create "A research agent that monitors Hacker News, summarizes top stories, and posts daily digests to Slack"
```

### What Happens

1. **LLM provider check** -- the CLI validates that an API key is configured (OpenAI, Anthropic, OpenRouter, Ollama, or Gemini). If none is set, it prompts you.
2. **Extraction** -- your description is sent to the LLM with a structured prompt. The LLM returns JSON with:
   - **Identity**: display name, bio, seed ID, system prompt
   - **HEXACO personality traits**: honesty, emotionality, extraversion, agreeableness, conscientiousness, openness (0--1 scale)
   - **Preset**: best-matching preset (research-assistant, customer-support, creative-writer, code-reviewer, data-analyst, security-auditor, devops-assistant, personal-assistant, ai-receptionist)
   - **Skills**: curated skill selections from 69 available skills
   - **Extensions**: tools (web-search, web-browser, cli-executor, etc.), voice, and productivity packs
   - **Channels**: platform bindings (slack, discord, telegram, webchat, etc.)
   - **Security tier**: dangerous, permissive, balanced, strict, or paranoid
   - **Permission set**: unrestricted, autonomous, supervised, read-only, or minimal
   - **Tool access profile**: social-citizen, social-observer, social-creative, assistant, or unrestricted
   - **Execution mode**: autonomous, human-dangerous, or human-all
3. **Preview** -- the CLI displays the extracted configuration with confidence scores.
4. **Confirmation** -- you review and confirm (or cancel).
5. **Scaffold** -- the CLI creates a project directory with `agent.config.json`, `.env.example`, `.gitignore`, `skills/`, and `README.md`.

### Example Output

```
  Extracted Configuration

  Display Name  Research Bot (92% confidence)
  Seed ID       seed_research_bot
  Bio           Monitors Hacker News and summarizes top stories daily
  Preset        research-assistant (95% confidence)
  Skills        web-search, summarize, hacker-news (88% confidence)
  Extensions    tools: web-search, news-search
  Channels      slack
  Security Tier balanced
  Permission Set supervised
  Execution Mode human-dangerous
  Personality   honesty: 0.85, emotionality: 0.30, extraversion: 0.40,
                agreeableness: 0.65, conscientiousness: 0.90, openness: 0.80

  Create agent with this configuration? (Y/n)
```

---

## Confidence Scores

Each extracted field has a confidence score (0--100%):

| Level | Range | Meaning |
|-------|-------|---------|
| **High** | 80--100% | The description explicitly mentioned this or strongly implied it |
| **Medium** | 50--79% | Reasonable inference from context |
| **Low** | 0--49% | Guessed based on general defaults; review carefully |

Low-confidence fields are highlighted in the preview. You can cancel, adjust your description, and re-run.

---

## Flags

| Flag | Effect |
|------|--------|
| `--yes` / `-y` | Skip confirmation prompt; scaffold immediately |
| `--managed` | Restrict to managed-mode capabilities (no filesystem/CLI tools) |
| `--dir <path>` | Override output directory name |

```bash
# Non-interactive: create and scaffold without confirmation
wunderland create "A social media bot for Twitter and Instagram" --yes

# Managed mode: safe for hosted deployments
wunderland create "A customer FAQ bot" --managed

# Custom output directory
wunderland create "A data analyst agent" --dir ./agents/analyst
```

---

## `wunderland new` (Interactive Mode)

The unified entry point that presents four creation modes:

```bash
wunderland new
```

```
  Create a New Agent

  How do you want to create your agent?

  > From a preset          research, social-media, operations, etc.
    Describe in plain English   AI extracts full config from your description
    Blank agent            minimal scaffold, configure later
    Import manifest        from a shared agent.manifest.json
```

### Direct Dispatch

`wunderland new` also supports direct dispatch without the interactive menu:

```bash
# NL mode (auto-detected when description is 10+ characters)
wunderland new "Build a twitter bot that posts daily tech news"

# Preset mode
wunderland new --preset research-assistant

# Import mode
wunderland new --from ./exported-agent.manifest.json
```

---

## Writing Effective Descriptions

Better descriptions produce higher-confidence extractions. Tips:

### Be Specific About Channels

```bash
# Vague -- the LLM guesses channels
wunderland create "A social media bot"

# Specific -- channels extracted with high confidence
wunderland create "A bot that posts to Twitter, LinkedIn, and Bluesky"
```

### Mention Data Sources

```bash
# Good -- skills like web-search, hacker-news, news-search get picked up
wunderland create "An agent that monitors Hacker News and TechCrunch for AI news"
```

### Specify Security Needs

```bash
# Triggers strict tier and read-only permissions
wunderland create "A read-only research agent that never executes code or modifies files"
```

### Describe the Personality

```bash
# Influences HEXACO trait extraction
wunderland create "A cautious, analytical security auditor with low risk tolerance"
```

---

## Example Descriptions

### Research Agent

```bash
wunderland create "A research agent that searches the web, reads academic papers, and produces structured literature reviews with citations"
```

### Customer Support Agent

```bash
wunderland create "A customer support agent for a SaaS product that answers FAQ questions, escalates complex issues, and tracks sentiment"
```

### Social Media Bot

```bash
wunderland create "A social media manager that creates content for Twitter, LinkedIn, and Instagram, schedules posts, and tracks engagement metrics"
```

### Code Reviewer

```bash
wunderland create "A code review agent that analyzes pull requests on GitHub, checks for security vulnerabilities, and suggests improvements"
```

### Data Analyst

```bash
wunderland create "A data analyst that processes CSV files, generates visualizations, and writes summary reports in markdown"
```

---

## Multi-Agent Teams from Natural Language

Beyond single agents, Wunderland can scaffold entire multi-agent teams from a single description. The CLI parses your prompt, identifies distinct agent roles, infers an orchestration strategy, and generates a full agency block in `agent.config.json`.

### Basic Usage

```bash
# One line → full agent team
wunderland agency create "Research team: a researcher who finds AI papers on arxiv, an analyst who evaluates methodology and results, and a writer who produces executive summaries. Use sequential strategy."

# This generates an agency block in agent.config.json:
# {
#   "agency": {
#     "name": "research-team",
#     "strategy": "sequential",
#     "agents": {
#       "researcher": { "instructions": "Find AI papers on arxiv...", "model": "gpt-4o" },
#       "analyst": { "instructions": "Evaluate methodology...", "model": "gpt-4o" },
#       "writer": { "instructions": "Produce executive summaries...", "model": "gpt-4o" }
#     }
#   }
# }

# Then run it
wunderland agency run research-team "What are the latest advances in retrieval-augmented generation?"
```

### Team Examples

#### Customer Support Team

Triage, resolve, and escalate -- three agents covering the full support lifecycle.

```bash
wunderland agency create "Customer support team: a triage agent that classifies incoming tickets by severity and category, a resolver agent that looks up knowledge base articles and drafts responses, and an escalation agent that detects unresolved frustration and routes to human operators. Use sequential strategy with content-safety guardrails."

wunderland agency run customer-support-team "My account was charged twice and I cannot access my dashboard."
```

#### Content Pipeline

Four-stage content production from raw research through published output.

```bash
wunderland agency create "Content pipeline: a researcher who gathers sources from the web and academic papers, a writer who produces a 600-word blog post, an editor who reviews for clarity and brand voice, and a publisher who posts the final version to the CMS and social channels. Use sequential strategy."

wunderland agency run content-pipeline "Write about how vector databases power semantic search in modern AI applications."
```

#### Code Review Team

Parallel static analysis with a final synthesis step.

```bash
wunderland agency create "Code review team: a reviewer who checks logic, naming, and test coverage; a security auditor who scans for vulnerabilities, injection risks, and dependency issues; and a style checker who enforces linting rules, formatting, and documentation standards. Use parallel strategy so all three run concurrently."

wunderland agency run code-review-team "Review the auth middleware in src/middleware/auth.ts"
```

### Flags

| Flag | Effect |
|------|--------|
| `--yes` / `-y` | Skip confirmation and scaffold immediately |
| `--strategy <name>` | Override the inferred strategy (sequential, parallel, hierarchical, graph) |
| `--dir <path>` | Override the output directory |

---

## Updating an Existing Agent

Use the `--update` flag to modify an existing agent's configuration with a new description:

```bash
wunderland create "add voice support and connect to Discord" --update
```

When `--update` is used, the CLI reads the existing `agent.config.json` in the current directory and passes it as context to the LLM. The LLM merges your new requirements with the existing configuration rather than starting from scratch.

---

## How It Works Internally

The NL builder uses `extractAgentConfig()` from `NaturalLanguageAgentBuilder.ts`:

1. A system prompt lists all available presets, skills, tools, channels, security tiers, permission sets, tool access profiles, and execution modes.
2. The user's description is appended to the prompt.
3. The LLM returns a JSON object matching the `ExtractedAgentConfig` schema.
4. The response is parsed with fault tolerance (handles code fences, leading text, nested JSON).
5. Each field is validated: invalid presets are dropped, channels are alias-resolved (e.g., "X" becomes "twitter"), security tiers are clamped to valid values.
6. A `seedId` is auto-generated from the display name if not provided.
7. The CLI maps the security tier to pipeline configuration (pre-LLM classifier, dual-LLM audit, output signing, risk threshold).

---

## Next Steps

- [Creating Agents](/guides/creating-agents) -- Preset-based creation and advanced patterns
- [HEXACO Personality](/guides/hexaco-personality) -- Deep dive into personality traits
- [Security Tiers](/guides/security-tiers) -- Understanding the 5 security tiers
- [Extensions Guide](/guides/extensions) -- Managing tools and extensions
- [CLI Reference](/api/cli-reference) -- Full command reference
