---
title: "Changelog"
sidebar_position: 10
---

# Changelog

## [0.46.0] - 2026-03-24

### Added
- feat(voice): real-time streaming voice pipeline with 6-state conversational loop
  - `VoicePipelineOrchestrator` with LISTENING → PROCESSING → SPEAKING cycle
  - Barge-in detection (hard-cut and soft-fade modes)
  - Three-tier endpointing: acoustic, heuristic, semantic (LLM-based)
  - Speaker diarization with provider delegation and local x-vector clustering
- feat(voice): 6 streaming extension packs
  - Deepgram real-time STT (`@framers/agentos-ext-streaming-stt-deepgram`)
  - Whisper chunked STT (`@framers/agentos-ext-streaming-stt-whisper`)
  - OpenAI streaming TTS (`@framers/agentos-ext-streaming-tts-openai`)
  - ElevenLabs streaming TTS (`@framers/agentos-ext-streaming-tts-elevenlabs`)
  - Diarization engine (`@framers/agentos-ext-diarization`)
  - Semantic endpoint detector (`@framers/agentos-ext-endpoint-semantic`)
- feat(speech): SpeechProviderResolver with capability-based resolution, priority chains, and automatic fallback
- feat(speech): 4 new core providers — Deepgram batch, AssemblyAI, Azure STT, Azure TTS
- feat(speech): 7 provider extension packs — Google STT/TTS, Amazon Polly, Vosk, Piper, Porcupine, OpenWakeWord
- feat(voice): Twilio, Telnyx, Plivo telephony providers with webhook verification
- feat(voice): TelephonyStreamTransport bridging phone calls to streaming pipeline
- feat(voice): DTMF event support — digits surfaced to LLM context
- feat(voice): TwiML/XML generation for all 3 telephony providers
- feat(cli): `--voice` flags for chat command (STT, TTS, endpointing, diarization, barge-in, port)
- feat(cli): telephony webhook server and CLI flags

### Changed
- refactor(voice): streaming-pipeline.ts rebuilt as reusable pipeline handle
- fix(voice): chat --voice wired with real agent-session adapter
- fix(session): session.stream() reworked to wrap real sendText() path

---

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
- fix: keep the skills tools extension published as `@framers/agentos-ext-skills` so it stays distinct from the `@framers/agentos-skills` runtime package
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
