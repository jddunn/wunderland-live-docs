---
sidebar_label: Gemini CLI
title: Gemini CLI Provider Setup
description: Use Gemini via your local Gemini CLI — no API key required
---

# Gemini CLI Provider

Use your Google account to power Wunderland agents — no API key needed. The `gemini-cli` provider invokes your locally-installed Gemini CLI as a subprocess.

:::danger Terms of Service Risk — Read Before Using
**Google's Gemini CLI Terms of Service contain language that may prohibit this usage pattern.** The ToS states:

> *"Directly accessing the services powering Gemini CLI using third-party software, tools, or services is a violation of applicable terms and policies, and such actions may be grounds for suspension or termination of your account."*

While Google's own documentation promotes headless/scripted use of `gemini -p`, they have **aggressively enforced** this policy — users report Google account suspensions for using third-party tools with Gemini CLI OAuth authentication.

**Safer alternative:** Use the `gemini` provider with a `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/apikey). This uses the Gemini API directly (separate ToS) and carries zero third-party usage risk.

**If you proceed with `gemini-cli`**, you accept full responsibility for any account actions Google may take. A first-offense reinstatement process exists but requires manual appeal.
:::

## Prerequisites

1. **Gemini CLI** installed on your machine
2. **Google account** logged in (free tier, AI Pro, or AI Ultra)

### Install Gemini CLI

```bash
npm install -g @google/gemini-cli
```

### Log in

```bash
gemini
```

Select "Sign in with Google" and follow the browser-based login flow.

## Setup with Wunderland

### Interactive login

```bash
wunderland login
```

Select **"Gemini CLI (Google account)"** from the menu. Wunderland will verify your installation and authentication:

```
  Gemini CLI Provider
  ────────────────────
  ✓ CLI installed    /usr/local/bin/gemini (v1.0.5)
  ✓ Authenticated
  ✓ Model available  gemini-2.5-flash

  Ready to use! No API key needed.
```

### Direct provider flag

```bash
wunderland login --provider gemini-cli
```

### Manual config

```json title="~/.wunderland/config.json"
{
  "llmProvider": "gemini-cli",
  "llmModel": "gemini-2.5-flash"
}
```

## Available Models

| Model | Best For | Context | Output Limit |
|-------|---------|---------|-------------|
| `gemini-2.5-flash` (default) | Most tasks — fast and capable | 1M | 65K |
| `gemini-2.5-pro` | Complex reasoning, deep analysis | 1M | 65K |
| `gemini-2.0-flash` | Previous-gen, still capable | 1M | 8K |
| `gemini-2.0-flash-lite` | Lightest, fastest | 1M | 8K |

All models are **$0 per token** — your Google account handles access.

**Rate limits by plan:**

| Plan | Price | Limits |
|------|-------|--------|
| Free (Google account) | $0 | 60 req/min, 1,000 req/day |
| Google AI Pro | $19.99/mo | Higher daily limits |
| Google AI Ultra | $249.99/mo | Highest daily limits |

Override the model:

```bash
wunderland chat --provider gemini-cli --model gemini-2.5-pro
```

Or via environment variable:

```bash
export GEMINI_CLI_MODEL=gemini-2.5-pro
```

## How It Works

1. Wunderland spawns `gemini -p --output-format json -m <model>` as a subprocess
2. Your conversation is piped via stdin
3. System prompts are injected via a temporary file using the `GEMINI_SYSTEM_MD` environment variable (Gemini CLI's official mechanism for custom system prompts)
4. The JSON response is parsed back into AgentOS's standard format
5. The temp file is cleaned up after each call

### Tool Calling

Gemini CLI does not support `--json-schema` for structured output. Instead, Wunderland injects tool schemas into the system prompt with XML response format instructions. The model responds with `<tool_call>` XML blocks which are parsed via regex. This is less reliable than Claude Code's `--json-schema` approach — if parsing fails, the response falls back to plain text.

## Troubleshooting

### "Gemini CLI is not installed"

```bash
npm install -g @google/gemini-cli
```

### "Not authenticated"

```bash
gemini  # opens browser Google login flow
```

### "Rate limited"

Your Google account's usage quota has been reached. Wait a few minutes and try again. Free tier: 60 req/min, 1,000 req/day. Upgrade to [Google AI Pro](https://one.google.com/explore-plan/gemini-advanced) for higher limits.

### "Account suspended (403)"

:::danger
If your Google account receives a 403 suspension after using `gemini-cli`, this is Google enforcing their third-party usage policy. To appeal:
1. Visit the reinstatement form linked in the error message
2. Recertify compliance with the ToS
3. Wait 1-2 days for reinstatement (first offense)

**Second offense is permanent.** Consider switching to the `gemini` provider with an API key to avoid this entirely.
:::

## vs. Gemini API Key Provider

| Feature | `gemini-cli` | `gemini` |
|---------|-------------|----------|
| Auth | Google account login | `GEMINI_API_KEY` (AI Studio) |
| Cost | $0 per token | Pay-per-token (free tier available) |
| ToS risk | **Medium — see warning above** | None |
| Setup | Install CLI + login | Get API key from AI Studio |
| System prompt | Temp file + env var | Direct API parameter |
| Tool calling | XML prompt-based (less reliable) | Native API tool calling |
| Best for | Experimentation (at your own risk) | Production, any serious use |

**Recommendation:** Use `gemini` with an API key for production. Use `gemini-cli` only if you understand and accept the ToS risk and want zero-cost experimentation.
