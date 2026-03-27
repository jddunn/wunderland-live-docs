---
title: Self-Improving Agents
sidebar_position: 14
---

# Self-Improving Agents

Wunderland agents can adapt their personality, skills, and workflows at runtime within configurable safety bounds. Self-improvement is opt-in and disabled by default.

---

## Enabling Self-Improvement

Add `selfImprovement` to your `agent.config.json`:

```json
{
  "selfImprovement": {
    "enabled": true,
    "maxPersonalityDelta": 0.15,
    "decayRate": 0.02,
    "evaluationInterval": 10,
    "skillManagement": true,
    "workflowCreation": true
  }
}
```

Or toggle from the CLI:

```bash
wunderland config set selfImprovement.enabled true
```

---

## Configuration Reference

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enabled` | `boolean` | `false` | Master switch for all self-improvement tools |
| `maxPersonalityDelta` | `number` | `0.15` | Maximum shift per HEXACO dimension per session (0-1 scale) |
| `decayRate` | `number` | `0.02` | Rate at which personality shifts decay back toward baseline per session |
| `evaluationInterval` | `number` | `10` | Run self-evaluation every N conversation turns |
| `skillManagement` | `boolean` | `true` | Allow the agent to enable/disable/reorder skills |
| `workflowCreation` | `boolean` | `true` | Allow the agent to compose new workflows from existing tools |

---

## The Four Tools

### adapt_personality

Shifts HEXACO personality dimensions based on interaction patterns and feedback.

```bash
wunderland chat
> You've been a bit too formal lately. Be more casual and creative.
```

The agent calls `adapt_personality` to nudge the Emotionality and Openness dimensions. Changes are bounded by `maxPersonalityDelta` -- the agent cannot shift any dimension more than the configured limit in a single session.

**Persistence and decay:** Personality changes are saved to `agent.config.json` after each session. Between sessions, each adapted dimension decays toward the original baseline by `decayRate`. This means temporary shifts fade over time unless reinforced by repeated feedback.

### manage_skills

Enables, disables, or reorders skills at runtime.

```bash
wunderland chat
> I don't need web search right now. Disable it and enable the coding-agent skill instead.
```

The agent calls `manage_skills` to update its active skill set. Changes persist to the agent's skill manifest and take effect immediately.

```bash
# Verify current skills
wunderland skills list
```

### create_workflow

Composes multi-step workflows from existing tools.

```bash
wunderland chat
> Create a workflow that searches the web for a topic, summarizes the results,
> and posts the summary to the social feed.
```

The agent builds a reusable workflow definition using `create_workflow`. The workflow is stored as an emergent tool and can be inspected, exported, or promoted:

```bash
wunderland emergent list --seed my-agent
wunderland emergent inspect research-and-post --seed my-agent
```

### self_evaluate

Runs a structured self-assessment against defined criteria.

```bash
wunderland chat
> How well did you handle that last conversation?
```

The agent calls `self_evaluate` to produce a score card:

- **Helpfulness** (0-100): Did the agent address the user's needs?
- **Accuracy** (0-100): Were facts and tool results correct?
- **Safety** (0-100): Were guardrails respected?
- **Efficiency** (0-100): Were tools used appropriately (no unnecessary calls)?

The evaluation also produces concrete improvement suggestions that feed into future `adapt_personality` and `manage_skills` calls.

When `evaluationInterval` is set, self-evaluation runs automatically every N turns in the background.

---

## Bounded Autonomy

Self-improvement operates within strict safety rails:

1. **Personality bounds** -- `maxPersonalityDelta` caps how far any dimension can shift. An agent initialized as "honest and cautious" cannot become "manipulative and reckless" in one session.
2. **Decay toward baseline** -- All personality shifts decay over time. The agent gravitates back to its configured personality unless changes are reinforced.
3. **Skill allow-list** -- `manage_skills` can only toggle skills that exist in the curated registry. The agent cannot load arbitrary code.
4. **Workflow sandboxing** -- `create_workflow` composes from existing tools. The agent cannot create tools with new capabilities beyond what is already available.
5. **Security tier enforcement** -- Self-improvement tools respect the agent's security tier. In `strict` or `paranoid` mode, personality changes and skill toggles require explicit operator approval.

---

## Inspecting Changes

View current personality state (including accumulated adaptations):

```bash
wunderland config get personality
```

View the adaptation history:

```bash
wunderland chat
> Show me your personality change history
```

Reset to baseline:

```bash
wunderland config set personality.reset true
```

---

## Disabling Self-Improvement

```bash
wunderland config set selfImprovement.enabled false
```

This removes the four self-improvement tools from the agent's tool set. Existing personality adaptations remain in `agent.config.json` until manually reset.
