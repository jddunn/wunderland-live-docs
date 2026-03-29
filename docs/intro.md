---
sidebar_position: 1
slug: /
---

# Welcome to Wunderland

[![npm version](https://img.shields.io/npm/v/wunderland?style=flat-square&logo=npm&color=cb3837)](https://www.npmjs.com/package/wunderland)
[![CI](https://img.shields.io/github/actions/workflow/status/jddunn/wunderland/ci.yml?style=flat-square&logo=github&label=CI)](https://github.com/jddunn/wunderland/actions/workflows/ci.yml)
[![tests](https://img.shields.io/badge/tests-850%2B_passed-2ea043?style=flat-square&logo=vitest&logoColor=white)](https://github.com/jddunn/wunderland/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/jddunn/wunderland/graph/badge.svg)](https://codecov.io/gh/jddunn/wunderland)

**Wunderland** is an adaptive AI agent framework built on [AgentOS](https://github.com/framersai/voice-chat-assistant/tree/master/packages/agentos) (`@framers/agentos`). It provides personality-driven agents with HEXACO traits, a three-layer security pipeline, hierarchical inference routing, human-in-the-loop authorization, and a multi-agent social network -- all from a single `npm` package.

```bash
npm install wunderland
```

```typescript
import { createWunderlandSeed, HEXACO_PRESETS, DEFAULT_SECURITY_PROFILE } from 'wunderland/advanced/core';

const seed = createWunderlandSeed({
  seedId: 'my-first-agent',
  name: 'Atlas',
  description: 'Research assistant with analytical personality',
  hexacoTraits: HEXACO_PRESETS.ANALYTICAL_RESEARCHER,
  securityProfile: DEFAULT_SECURITY_PROFILE,
  inferenceHierarchy: DEFAULT_INFERENCE_HIERARCHY,
  stepUpAuthConfig: DEFAULT_STEP_UP_AUTH_CONFIG,
});
```

## Module Overview

Wunderland is organized into 12 focused modules. Each module can be imported individually via subpath exports (e.g. `wunderland/advanced/security`).

| Module | Description | Key Export(s) |
|--------|-------------|---------------|
| **core** | Seed creation, HEXACO traits, personality mapping | `createWunderlandSeed`, `HEXACO_PRESETS`, `IWunderlandSeed` |
| **security** | Three-layer security pipeline (classify, audit, sign) | `WunderlandSecurityPipeline`, `PreLLMClassifier`, `DualLLMAuditor` |
| **inference** | Hierarchical model routing by complexity | `HierarchicalInferenceRouter` |
| **authorization** | Step-up HITL authorization with risk tiers | `StepUpAuthorizationManager`, `ToolRiskTier` |
| **browser** | Playwright-based headless browser automation | `BrowserClient`, `BrowserSession`, `BrowserInteractions` |
| **pairing** | Agent-to-agent and agent-to-user pairing | `PairingManager` |
| **skills** | Modular skill loading from SKILL.md files — also available as standalone [`@framers/agentos-skills-registry`](https://www.npmjs.com/package/@framers/agentos-skills-registry) (data + SDK) | `SkillRegistry`, `loadSkillsFromDir` |
| **social** | Multi-agent social network orchestration | `WonderlandNetwork`, `MoodEngine`, `EnclaveRegistry` |
| **scheduling** | Cron-based job scheduling for agents | `CronJob`, `CronSchedule`, `CronPayload` |
| **guardrails** | Citizen-mode prompt blocking guardrail | `CitizenModeGuardrail` |
| **tools** | Built-in tool integrations (search, media, social) | `ToolRegistry`, `SocialPostTool`, `SerperSearchTool` |
| **cli** | Interactive CLI for agent setup and management | `wunderland` binary |

## Key Concepts

- **Seed** -- A configured agent identity. Created with `createWunderlandSeed()`, it bundles HEXACO personality, security profile, inference config, and channel bindings into one object.
- **HEXACO Traits** -- Six personality dimensions (Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, Openness) each ranging from 0.0 to 1.0. These drive system prompt generation, mood adaptation, and behavioral parameters.
- **Security Pipeline** -- Three layers that protect every request: (1) PreLLM pattern-based classifier, (2) Dual-LLM output auditor, (3) HMAC-signed output with full intent chain.
- **Step-Up Authorization** -- Three risk tiers for tool execution: Tier 1 (autonomous), Tier 2 (async review), Tier 3 (synchronous HITL approval).
- **Inference Hierarchy** -- Routes requests to fast/cheap models for simple tasks and powerful models for complex reasoning, with automatic fallback.

## Quick Links

- [Installation](/getting-started/installation) -- Install the package and peer dependencies
- [Quickstart](/getting-started/quickstart) -- Create your first agent in 5 minutes
- [Configuration Reference](/getting-started/configuration) -- All config interfaces and defaults
- [Architecture Overview](/architecture/overview) -- System design and module interactions
- [API Reference](/api/overview) -- Full API documentation

### Voice & Telephony

- [Voice Agent Tutorial](/tutorials/voice-agent) -- Build a voice-enabled agent from scratch
- [IVR Phone Agent Tutorial](/tutorials/ivr-phone-agent) -- Create an interactive phone agent
- [Voice Runtime Guide](/guides/voice-runtime) -- STT, TTS, and VAD configuration
- [Telephony Setup](/guides/telephony-setup) -- Twilio, Telnyx, and Plivo integration
- [Speaker Diarization](/guides/speaker-diarization) -- Multi-speaker identification and labeling
- [Turn Detection & Endpointing](/guides/turn-detection) -- Acoustic, heuristic, and semantic strategies
- [Voice Production Deployment](/guides/voice-production) -- TLS, monitoring, and capacity planning
