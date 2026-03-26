---
title: LLM Providers Quickstart
sidebar_position: 27
---

# LLM Providers Quickstart

Wunderland supports 9 LLM providers out of the box. Set an API key and you are
ready to go.

## Provider Matrix

| Provider | Env Var | Default Model | Streaming | Tools | Vision | Cost |
|----------|---------|---------------|-----------|-------|--------|------|
| **OpenAI** | `OPENAI_API_KEY` | gpt-4o | Yes | Yes | Yes | $$$ |
| **Anthropic** | `ANTHROPIC_API_KEY` | claude-sonnet-4-20250514 | Yes | Yes | Yes | $$$ |
| **Gemini** | `GEMINI_API_KEY` | gemini-2.5-flash | Yes | Yes | Yes | $$ |
| **Groq** | `GROQ_API_KEY` | llama-3.3-70b | Yes | Yes | No | $ |
| **Together** | `TOGETHER_API_KEY` | Llama 3.3 70B | Yes | Yes | No | $ |
| **Mistral** | `MISTRAL_API_KEY` | mistral-large | Yes | Yes | No | $$ |
| **xAI** | `XAI_API_KEY` | grok-2 | Yes | Yes | Yes | $$ |
| **OpenRouter** | `OPENROUTER_API_KEY` | gpt-4o | Yes | Yes | Varies | Varies |
| **Ollama** | `OLLAMA_BASE_URL` | llama3.2 | Yes | Partial | Varies | Free |

## Quick Setup

### Option 1: Interactive Wizard

```bash
wunderland setup
```

The wizard walks you through provider selection, model choice, and key entry.

### Option 2: Environment Variables

```bash
# Set one key and go
export OPENAI_API_KEY=sk-...
wunderland chat
```

### Option 3: Config Commands

```bash
wunderland config set llmProvider anthropic
wunderland config set llmModel claude-sonnet-4-20250514
```

## Auto-Detection

When no provider is explicitly configured, Wunderland checks for API keys in
this order and uses the first one found:

1. `OPENAI_API_KEY`
2. `ANTHROPIC_API_KEY`
3. `GEMINI_API_KEY`
4. `GROQ_API_KEY`
5. `TOGETHER_API_KEY`
6. `MISTRAL_API_KEY`
7. `XAI_API_KEY`
8. `OPENROUTER_API_KEY`
9. `OLLAMA_BASE_URL`

Override with `--provider <name>` on any CLI command.

## Fallback

Set `OPENROUTER_API_KEY` alongside your primary key to get automatic fallback.
If the primary provider fails (rate limit, timeout), OpenRouter retries with
200+ available models.

```bash
# Primary: Anthropic. Fallback: OpenRouter (automatic)
export ANTHROPIC_API_KEY=sk-ant-...
export OPENROUTER_API_KEY=sk-or-...
```

## OAuth (ChatGPT Subscription)

Use your ChatGPT Plus/Pro subscription instead of an API key:

```bash
wunderland login     # Opens browser for device code auth
wunderland chat --oauth
```

## Ollama (Local, Free, Private)

```bash
# Auto-detect hardware and pull recommended models
wunderland ollama-setup

# Or manually
ollama pull llama3.2
wunderland config set llmProvider ollama
```

## Per-Agent Override

Individual agents can use different providers via `agent.config.json`:

```json
{
  "llmProvider": "anthropic",
  "llmModel": "claude-sonnet-4-20250514"
}
```

## Help

```bash
wunderland help llm         # Detailed provider guide
wunderland help providers   # Same thing (alias)
wunderland models           # List available models for your configured provider
wunderland doctor           # Verify API key connectivity
```

## Further Reading

- [LLM Providers — Full Reference](https://docs.agentos.sh/architecture/llm-providers) (AgentOS docs)
- [Cost Optimization](https://docs.agentos.sh/features/cost-optimization)
- [Inference Routing](./inference-routing.md)
- [Ollama Setup](./ollama-local.md)
