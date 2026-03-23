---
title: "Changelog"
sidebar_position: 10
---

# Changelog

## [0.45.0] - 2026-03-22

### Added
- feat(security): wire 5 guardrail extension packs into SecurityPipeline + SecurityTiers
  - PII Redaction (`@framers/agentos-ext-pii-redaction`)
  - ML Classifiers (`@framers/agentos-ext-ml-classifiers`)
  - Topicality (`@framers/agentos-ext-topicality`)
  - Code Safety (`@framers/agentos-ext-code-safety`)
  - Grounding Guard (`@framers/agentos-ext-grounding-guard`)
- feat(runtime): guardrail packs now active in start/chat with CLI flags
  - `--no-guardrails` — disable all guardrail packs
  - `--guardrails=pii,code,grounding` — enable specific packs
- feat(config): `security.guardrailPacks` in agent.config.json for per-agent overrides
- feat(security): 5 security tiers with per-tier guardrail pack defaults
  - `dangerous` — no guardrails
  - `permissive` — code safety only
  - `balanced` — PII + code safety
  - `strict` — PII + ML classifiers + code safety
  - `paranoid` — all 5 packs enabled
- feat: rename `@framers/agentos-ext-skills` to `@framers/agentos-skills`
- feat(api): new sub-path exports: `wunderland/config`, `wunderland/security`, `wunderland/runtime`, `wunderland/storage`, `wunderland/guardrails`, `wunderland/voice`
- feat(api): barrel exports for config, guardrails, and voice modules

### Changed
- refactor: guardrail factory functions renamed `create*Pack` → `create*Guardrail` for clarity
- docs: comprehensive updates to all documentation sites

---

## [0.40.0] - 2026-03-14

### Added
- feat(cli): voice setup in QuickStart mode — auto-detects OpenAI key, offers 4 provider paths (openai-auto, openai-new, elevenlabs, local)
- feat(cli): new `llm` help topic covering 5 providers, switching, OAuth, env vars
- feat(cli): new `faq` help topic with 9 common Q&As
- feat(cli): rewritten `voice` help topic with full provider coverage (TTS, STT, VAD)
- feat(cli): `voiceVoice`, `sttProvider`, `sttModel` config fields
- feat(cli): alias resolution for help topics (ollama/openai/anthropic → llm, faqs/questions → faq)
- feat: voice runtime with speech catalog and CLI voice commands
- feat: complete Ollama implementation with hardware auto-detection
- feat(cli): infinite context window integration in chat loop
- feat: persistent dedup cache with title similarity for curated picks
- feat: include skills, deep-research, and more in default extensions
- feat: local memory tool and updated extension loader
- feat: add `read_document` to safe navigation tools
- feat(cli): overdrive mode, accept-all, tier-aware auth to reduce permission over-prompting
- feat(cli): `--format json` for doctor and status commands
- feat(cli): first-run detection, quickstart, and unified new command
- feat(cli): standalone tool keys wizard (search, media, voice, devtools)
- feat(cli): real-time API key validation with retry in setup wizard
- feat(cli): extensions search subcommand with category filter + categorized listing
- feat(cli): skills search + recommend subcommands with categorized listing
- feat(cli): `signupUrl`/`validationUrl` for LLM providers + `TOOL_KEY_PROVIDERS` constant
- feat(cli): plugins command improvements, system prompt updates
- feat: cognitive memory config and runtime updates
- feat: full agency automation — per-agent storage, tool activation, memory pipeline
- feat: personalized welcome messages with role-based suggestions
- feat(tool-calling): add `deep_research` to fallback map
- feat(discovery): `recallProfile` (`aggressive` default, `balanced`, `precision`) for discovery tuning
- feat(runtime): per-turn tool schema narrowing based on discovery results
- feat(runtime): `session.sendText({ toolSelectionMode })` override (`discovered` | `all`)
- feat(runtime): strict tool-name mode via `toolCalling.strictToolNames`
- feat(runtime): defensive API key resolution for static/lazy/async inputs

### Fixed
- fix: correct vector store query result types and remove invalid generic calls
- fix(cli): prevent partial agent folder on CTRL+C and warn on env key fallback
- fix: propagate folder-access grants to CLI executor ShellService
- fix: harden system prompt confidentiality against extraction attacks
- fix: prevent TUI ghosting when navigating back from views
- fix: add TUI agents view to prevent crash on "List agents"
- fix: prevent cross-conversation message history corruption
- fix(cli): reduce permission prompt noise — session cache + read-only fast-path
- fix(cli): reduce tool-calling verbosity — gate logs behind debug mode
- fix(runtime): inject suggestedFallbacks on empty search results + prompt guidance
- fix: hoist toolExtensions declaration above lazyTools scope
- fix: resolve TypeScript build errors in storage module
- fix: use guildMemberAdd with role polling for welcome messages
- fix(runtime): sanitize/dedupe outbound tool function names for OpenAI-compatible schemas
- fix(discovery): validate discovery embedding API keys before initialization

### Changed
- docs: comprehensive tutorials, guides, use cases, and CLI reference for docs.wunderland.sh
- docs: 5-provider LLM documentation overhaul
- docs: system prompt confidentiality section in presets guide
- docs: expanded README and LIBRARY_API.md for adaptive tool exposure

---

## [0.38.0] - 2025-12

Previous release. See [git history](https://github.com/jddunn/wunderland/commits/master) for details.
