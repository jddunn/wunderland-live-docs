---
sidebar_label: Claude Code CLI
title: Claude Code CLI Provider Setup
description: Use Claude via your local Claude Code CLI — no API key required
---

# Claude Code CLI Provider

Use your Anthropic Max subscription to power Wunderland agents — no API key needed. The `claude-code-cli` provider invokes your locally-installed Claude Code CLI as a subprocess.

:::tip Officially Supported
Anthropic **explicitly supports** programmatic use of Claude Code via the `-p` flag. Their [headless mode documentation](https://code.claude.com/docs/en/headless) provides examples for scripted calls, CI/CD pipelines, and automation. This is the intended use case.
:::

## Prerequisites

1. **Claude Code CLI** installed on your machine
2. **Anthropic account** logged in (Free, Pro, or Max plan)

### Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Or download from [claude.ai/download](https://claude.ai/download).

### Log in

```bash
claude
```

Follow the browser-based login flow. Once authenticated, Claude Code caches your credentials locally.

## Setup with Wunderland

### Interactive login

```bash
wunderland login
```

Select **"Claude Code CLI (Max subscription)"** from the menu. Wunderland will verify your installation and authentication automatically:

```
  Claude Code CLI Provider
  ────────────────────────
  ✓ CLI installed    /usr/local/bin/claude (v1.5.0)
  ✓ Authenticated
  ✓ Model available  claude-sonnet-4-20250514

  Ready to use! No API key needed.
```

### Direct provider flag

```bash
wunderland login --provider claude-code-cli
```

### Manual config

```json title="~/.wunderland/config.json"
{
  "llmProvider": "claude-code-cli",
  "llmModel": "claude-sonnet-4-20250514"
}
```

Or per-agent:

```json title="agent.config.json"
{
  "llmProvider": "claude-code-cli",
  "llmModel": "claude-opus-4-20250514"
}
```

## Available Models

| Model | Best For | Context | Output Limit |
|-------|---------|---------|-------------|
| `claude-sonnet-4-20250514` (default) | Most tasks — balanced speed and quality | 200K | 16K |
| `claude-opus-4-20250514` | Complex reasoning, deep analysis | 200K | 32K |
| `claude-haiku-4-5-20251001` | Fast, lightweight tasks | 200K | 8K |

All models are **$0 per token** — your subscription handles billing.

Override the model:

```bash
wunderland chat --provider claude-code-cli --model claude-opus-4-20250514
```

Or via environment variable:

```bash
export CLAUDE_CODE_MODEL=claude-opus-4-20250514
```

## How It Works

1. Wunderland spawns `claude --bare -p --output-format json` as a subprocess
2. Your conversation is piped via stdin
3. Claude Code uses your local authentication (no tokens leave your machine)
4. The JSON response is parsed back into AgentOS's standard format

The `--bare` flag strips Claude Code's own plugins, hooks, and MCP servers for clean, reproducible output. `--max-turns 1` ensures a single completion per call (no agentic tool loops).

### Tool Calling

When Wunderland needs the model to call tools, it uses Claude Code's `--json-schema` flag to enforce structured output. The model responds with either text or a structured tool call array. This gives reliable tool calling without any custom parsing.

## Troubleshooting

### "Claude Code CLI is not installed"

```bash
npm install -g @anthropic-ai/claude-code
# or
brew install claude-code  # macOS
```

### "Not authenticated"

```bash
claude  # opens browser login flow
```

### "Timed out"

Claude Code didn't respond within 2 minutes. Try:
- Using a faster model: `claude-haiku-4-5-20251001`
- Checking your internet connection
- Running `claude --bare -p "test"` manually to diagnose

### "Rate limited"

Your Max plan's usage limits have been reached. Wait a few minutes and try again. Limits assume ordinary individual usage — running large automated pipelines may trigger enforcement.

## vs. Anthropic API Key Provider

| Feature | `claude-code-cli` | `anthropic` |
|---------|-------------------|-------------|
| Auth | Claude Code login (subscription) | `ANTHROPIC_API_KEY` (Console) |
| Cost | $0 per token (subscription) | Pay-per-token |
| Setup | Install CLI + login | Get API key from Console |
| Rate limits | Subscription limits | API rate limits |
| Best for | Personal use, development | Production, high-volume |

Use `claude-code-cli` for personal development and experimentation. Use `anthropic` for production deployments where you need predictable billing and higher rate limits.
