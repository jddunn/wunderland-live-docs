---
title: CLI Command Reference
sidebar_position: 2
---

# CLI Command Reference

Wunderland defaults to the interactive TUI when launched in a TTY with no subcommand. Use explicit subcommands for scripts, setup, diagnostics, or automation.

---

## Core Commands

| Command | Purpose |
| --- | --- |
| `wunderland` | Open the TUI dashboard |
| `wunderland create <description>` | Create an agent from a natural language description |
| `wunderland new` | Unified interactive agent creation (NL, preset, blank, or import) |
| `wunderland quickstart` | Auto-detect your environment and scaffold the fastest working setup |
| `wunderland setup` | Guided initial configuration (QuickStart or Advanced) |
| `wunderland doctor` | Health and configuration checks |
| `wunderland chat` | Interactive chat from the terminal |
| `wunderland start` | Start the agent runtime/server |
| `wunderland init <dir>` | Scaffold a new agent project |
| `wunderland status` | Runtime and connection status |
| `wunderland help <topic>` | Short operator guides |

---

## Setup & Configuration

### `wunderland setup`

Interactive setup wizard. Configures LLM provider, personality, channels, RAG memory, and voice.

```bash
wunderland setup           # Interactive mode
wunderland setup --yes     # Auto-accept defaults
```

**QuickStart mode** covers 5 steps: LLM provider, personality preset, channels, RAG memory, and voice.
**Advanced mode** adds: custom HEXACO sliders, extensions/skills, security pipeline, and granular TTS/STT customization.

### `wunderland quickstart`

One-shot onboarding for the common case.

```bash
wunderland quickstart
```

Use this when you want the shortest path from “nothing configured” to “agent is runnable”.

### `wunderland create <description>`

Create an agent from a natural language description. The CLI sends your description to the configured LLM, extracts a full agent configuration (preset, skills, extensions, channels, HEXACO personality, security tier), previews it with confidence scores, and scaffolds a project directory.

```bash
wunderland create "A research agent that monitors Hacker News and summarizes daily"
wunderland create "A customer support agent for my SaaS product" --yes
wunderland create "A social media bot for Twitter and Instagram" --managed
wunderland create "A data analyst agent" --dir ./agents/analyst
```

| Flag | Effect |
|------|--------|
| `--yes` / `-y` | Skip confirmation prompt |
| `--managed` | Restrict to managed-mode capabilities (no filesystem/CLI tools) |
| `--dir <path>` | Override output directory name |
| `--update` | Merge with existing agent.config.json in current directory |

See the [NL Agent Creation guide](/guides/nl-agent-creation) for tips on writing effective descriptions and details on confidence scores.

### `wunderland new`

Unified interactive agent creation entry point. Presents four modes:

1. **From a preset** -- select from curated agent presets
2. **Describe in plain English** -- NL creation (delegates to `wunderland create`)
3. **Blank agent** -- minimal scaffold for manual configuration
4. **Import manifest** -- load from a shared `agent.manifest.json`

```bash
wunderland new                                    # Interactive mode
wunderland new "Build a twitter bot"              # NL mode (auto-detected for 10+ char descriptions)
wunderland new --preset research-assistant        # Direct preset mode
wunderland new --from ./exported-agent.json       # Direct import mode
```

### `wunderland init <dir>`

Scaffold a new agent project from a preset (non-NL path).

```bash
wunderland init my-agent
wunderland init my-agent --preset research-assistant
wunderland init my-agent --provider openai --model gpt-4o
wunderland init my-agent --security-tier strict
```

### `wunderland config`

Read and write configuration values.

```bash
wunderland config get llmProvider            # Read a value
wunderland config set llmProvider anthropic   # Set a value
wunderland config set llmModel claude-sonnet-4-6
wunderland config set voiceProvider openai
wunderland config set ui.theme cyberpunk
```

Config is stored at `~/.wunderland/config.json`.

### `wunderland doctor`

Check configuration, API keys, provider connectivity, and voice readiness.

```bash
wunderland doctor
```

---

## Chat & Runtime

### `wunderland chat`

Start an interactive chat session.

```bash
wunderland chat                        # Default mode
wunderland chat --provider openai      # Override provider
wunderland chat --model gpt-4o-mini    # Override model
wunderland chat --overdrive            # Auto-approve tool calls
wunderland chat --auto-approve-tools   # Fully autonomous
```

Config-backed agents also write dated plain-text session logs under `./logs/YYYY-MM-DD/*.log` by default.

**In-chat commands:**
| Command | Action |
|---------|--------|
| `/help` | Show available commands |
| `/tools` | List available tools |
| `/clear` | Clear conversation history |
| `/exit` | End the session |

### `wunderland start`

Start the agent runtime server.

```bash
wunderland start                    # Default port
wunderland start --port 3001        # Custom port
wunderland start --overdrive        # Auto-approve tools
```

`wunderland start` keeps daemon `stdout.log` / `stderr.log` in the daemon directory, and also writes dated session logs under the agent folder’s `./logs/YYYY-MM-DD/*.log` path by default.

### `wunderland status`

Show runtime status, active connections, and persisted LLM usage/cost totals. By default this reads the shared ledger at `~/.framers/usage-ledger.jsonl`. Use `AGENTOS_USAGE_LEDGER_PATH` or `WUNDERLAND_USAGE_LEDGER_PATH` when you want a different shared file.

```bash
wunderland status
```

---

## Voice Commands

```bash
wunderland voice status              # Check provider readiness
wunderland voice tts                 # List TTS providers
wunderland voice stt                 # List STT providers
wunderland voice test "Hello"        # Synthesize a test phrase
wunderland voice clone               # Voice cloning guidance
```

### Details

- `status` — Shows telephony, TTS, and STT provider readiness with configuration details
- `tts` — Lists all text-to-speech providers and whether they are configured
- `stt` — Lists all speech-to-text providers and whether they are configured
- `test <text>` — Synthesizes a short sample through the preferred runtime TTS provider
- `clone` — Explains supported voice-cloning provider paths (ElevenLabs)

### Quick Voice Setup

```bash
# If you have an OpenAI key, voice is one command:
wunderland config set voiceProvider openai

# Or re-run setup (voice is included in QuickStart)
wunderland setup
```

---

## Video Commands

```bash
wunderland video generate <prompt>             # Generate a video from text
wunderland video generate <prompt> --provider runway    # Use a specific provider
wunderland video generate <prompt> --duration 10        # Duration in seconds
wunderland video generate <prompt> --output ./out.mp4   # Custom output path
wunderland video animate <image> <prompt>      # Animate a still image
wunderland video animate photo.png "slow zoom out, cinematic"
wunderland video analyze <file>                # Analyze a video file
wunderland video analyze clip.mp4              # Scene descriptions, objects, sentiment
wunderland video analyze clip.mp4 --model gpt-4o        # Override vision model
```

### Details

- `generate` — Text-to-video via Runway Gen-3 or Fal.ai. Produces an MP4 file.
- `animate` — Image-to-video. Takes a still image and a motion prompt.
- `analyze` — Runs scene detection, object recognition, and sentiment analysis via a vision-capable LLM.

Requires `RUNWAY_API_KEY` or `FAL_API_KEY` for generation. Analysis requires a vision-capable LLM key.

---

## Audio Commands

```bash
wunderland audio music <prompt>                # Generate a music track
wunderland audio music "lo-fi hip hop, rainy day"
wunderland audio music <prompt> --provider suno         # Use a specific provider
wunderland audio music <prompt> --duration 30           # Duration in seconds
wunderland audio music <prompt> --output ./track.mp3    # Custom output path
wunderland audio sfx <prompt>                  # Generate a sound effect
wunderland audio sfx "door creaking open slowly"
wunderland audio sfx <prompt> --provider stability      # Use Stable Audio
```

### Details

- `music` — Text-to-music via Suno or Fal.ai. Default duration is 30 seconds.
- `sfx` — Text-to-sound-effect via Stable Audio or Fal.ai. Default duration is 5 seconds.

Requires `SUNO_API_KEY`, `STABILITY_API_KEY`, or `FAL_API_KEY`.

### Common Flags (Video & Audio)

| Flag | Effect |
|------|--------|
| `--provider <name>` | Override the default provider (runway, fal, suno, stability) |
| `--model <name>` | Override the model (provider-specific) |
| `--duration <seconds>` | Set output duration |
| `--output <path>` | Custom output file path |

---

## Extensions & Skills

### `wunderland extensions`

```bash
wunderland extensions list           # List available extensions
wunderland extensions info image-generation
wunderland extensions enable web-search
wunderland extensions disable giphy
wunderland extensions configure      # Set global provider defaults
wunderland extensions configure image-generation
```

### `wunderland skills`

```bash
wunderland skills list               # List available skills
wunderland skills info web-search
wunderland skills enable summarize
wunderland skills disable summarize
```

### `wunderland models`

```bash
wunderland models                    # Show current provider/model info
```

---

## Workflows & Orchestration

### `wunderland workflows`

```bash
wunderland workflows list            # Find local workflow/mission definition files
wunderland workflows examples        # Show bundled orchestration examples
wunderland help workflows            # Authoring guide: workflow() vs AgentGraph vs mission()
```

Current CLI status:

- `list` scans conventional authoring directories like `./workflows`, `./missions`, and `./orchestration`
- `examples` points to bundled runnable examples in `packages/wunderland/examples/`
- `run` executes local YAML workflow definitions in-process through Wunderland’s graph runtime
- `status` and `cancel` are still backend-oriented paths

For in-process orchestration today:

```ts
import { createWunderland } from 'wunderland';
import { workflow } from 'wunderland/workflows';

const app = await createWunderland({ llm: { providerId: 'openai' } });
const compiled = workflow('demo')
  .input({ type: 'object', properties: { topic: { type: 'string' } } })
  .returns({ type: 'object', properties: { summary: { type: 'string' } } })
  .step('draft', { gmi: { instructions: 'Return JSON under artifacts.summary.' } })
  .compile();

const result = await app.runGraph(compiled, { topic: 'agent orchestration' });
```

---

## Agent Management

### `wunderland list-presets`

List all available agent presets.

```bash
wunderland list-presets
```

Presets include: `research-assistant`, `customer-support`, `coding-agent`, `creative-writer`, and more.

### `wunderland seal`

Seal an agent's configuration (immutability).

```bash
wunderland seal
```

### `wunderland export` / `wunderland import`

Export and import agent configurations.

```bash
wunderland export my-agent.json
wunderland import my-agent.json
```

### `wunderland emergent`

Inspect, export, import, and administer runtime-forged tools.

```bash
wunderland emergent list --seed <seedId>
wunderland emergent inspect <name|id> --seed <seedId>
wunderland emergent export <name|id> --seed <seedId> --output ./my-tool.emergent-tool.yaml
wunderland emergent import ./my-tool.emergent-tool.yaml --seed <seedId>
wunderland emergent promote <name|id> --seed <seedId>
wunderland emergent demote <name|id> --seed <seedId>
wunderland emergent audit <name|id> --seed <seedId>
```

`export` and `import` use the portable `agentos.emergent-tool.v1` package format. `compose` tools are portable by default. `sandbox` tools are portable only when source code is present. Redacted sandbox exports can still be reviewed or committed to Git, but they are intentionally not importable into another runtime.

---

## Agency (Multi-Agent Teams)

### `wunderland agency`

Manage multi-agent collectives (agencies).

```bash
wunderland agency                                  # Show help
wunderland agency list                             # List configured agencies
wunderland agency list --seed <id>                 # List from backend
wunderland agency status <name>                    # Show agency status and agents
wunderland agency run <name> "<prompt>"            # Execute an agency
wunderland agency run <name> "<prompt>" --stream   # Stream with agent events
```

### `wunderland agency create`

Create a new agency. Accepts either a simple name (shows a manual template) or a natural language description (LLM-powered extraction).

```bash
# Manual: shows JSON template
wunderland agency create research-team --strategy graph

# NL-powered: extracts agency name, strategy, agents, roles, and dependencies
wunderland agency create "research team with a researcher, analyst, and writer"
wunderland agency create "debate council where an optimist and pessimist argue, then a moderator synthesizes" --yes
```

When given a description (20+ characters with spaces), the CLI:
1. Sends the description to your configured LLM
2. Extracts: agency name, orchestration strategy, shared goals, and named agents with roles/instructions/dependencies
3. Previews the extracted configuration
4. Writes the `agency` block to `agent.config.json` (creates or merges)

| Flag | Effect |
|------|--------|
| `--strategy <name>` | Override strategy: sequential, parallel, graph, debate, review-loop, hierarchical |
| `--yes` / `-y` | Skip confirmation prompt |
| `--seed <id>` | Agent seed ID for backend queries |
| `--stream` | Stream output with agent events (for `run`) |

---

## Ollama (Local LLM)

### `wunderland ollama-setup`

Auto-detect hardware, install Ollama, recommend models, and configure.

```bash
wunderland ollama-setup              # Interactive
wunderland ollama-setup --yes        # Non-interactive
wunderland ollama-setup --tier mid   # Force tier
wunderland ollama-setup --skip-pull  # Configure without downloading
wunderland ollama-setup mistral:7b   # Override model
```

---

## Authentication

### `wunderland login`

Authenticate with a ChatGPT subscription (OpenAI OAuth).

```bash
wunderland login
```

### `wunderland auth-status`

Check current authentication state.

```bash
wunderland auth-status
```

### `wunderland logout`

Remove stored OAuth tokens.

```bash
wunderland logout
```

---

## Workflows & Scheduling

### `wunderland workflows`

```bash
wunderland workflows list                          # Discover local workflow/mission files
wunderland workflows examples                      # Show bundled orchestration examples
wunderland workflows run workflows/research.workflow.yaml      # Execute a workflow
wunderland workflows explain workflows/research.workflow.yaml  # Print the compiled graph
wunderland workflows status <id>                  # Backend workflow status
wunderland workflows cancel <id>                  # Backend workflow cancellation
```

### `wunderland cron`

```bash
wunderland cron add "0 9 * * 1-5" daily-report  # Schedule
wunderland cron list                              # List jobs
wunderland cron remove <job-id>                   # Remove
wunderland cron pause <job-id>                    # Pause
wunderland cron resume <job-id>                   # Resume
```

---

## Help Topics

```bash
wunderland help getting-started    # First-run guide
wunderland help voice              # Voice/speech setup
wunderland help llm                # LLM provider info
wunderland help auth               # OAuth and API keys
wunderland help tui                # TUI dashboard usage
wunderland help presets            # Agent presets
wunderland help security           # Approvals and permissions
wunderland help faq                # Frequently asked questions
wunderland help ui                 # Themes and ASCII mode
wunderland help export             # PNG export
```

---

## Global Flags

| Flag | Effect |
|------|--------|
| `--yes` / `-y` | Auto-confirm prompts |
| `--dry-run` | Show what would happen without writing |
| `--config <path>` | Override config directory |
| `--theme <name>` | Set UI theme (`cyberpunk`, `plain`) |
| `--ascii` | Force ASCII-only glyphs |
| `--no-color` | Disable colors |
| `--overdrive` | Auto-approve tool calls |
| `--auto-approve-tools` | Fully autonomous tool execution |
| `--dangerously-skip-permissions` | Skip permission checks |
| `--dangerously-skip-command-safety` | Disable shell safety checks |
| `--export-png <path>` | Export command output as PNG |

---

## Common Operator Flows

### NL Agent Creation

```bash
wunderland create "A research assistant that searches the web and summarizes articles"
cd seed_research_assistant
cp .env.example .env
wunderland start
```

### First-Time Setup

```bash
wunderland setup
wunderland doctor
wunderland chat
```

### Daily Development

```bash
wunderland start          # Terminal 1
wunderland chat           # Terminal 2
```

### Voice Testing

```bash
wunderland voice status
wunderland voice test "Hello from Wunderland"
```

### Provider Switching

```bash
wunderland config set llmProvider anthropic
wunderland config set llmModel claude-sonnet-4-6
wunderland doctor   # verify
wunderland chat     # test
```

For the runtime-backed voice path, see the [Voice Runtime guide](../guides/voice-runtime).
