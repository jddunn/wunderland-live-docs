---
sidebar_position: 12
---

# Turn Detection & Endpointing

Control when your voice agent responds. Three strategies from fast-and-simple to intelligent-and-contextual.

## The Problem

In a voice conversation, the agent needs to know when the user has finished speaking. Too early and you cut them off. Too late and there's an awkward pause. Turn detection (endpointing) solves this.

## Three Strategies

### 1. Acoustic (Fastest, Simplest)

Detects silence after speech using Voice Activity Detection (VAD). When the user stops making sound for a configured duration, the turn ends.

```json
{
  "voice": {
    "endpointing": "acoustic",
    "silenceTimeout": 800,
    "minSpeechDuration": 300
  }
}
```

- **Latency**: ~0ms (pure signal processing)
- **Accuracy**: Low. Pauses mid-sentence trigger false positives ("Let me think... [agent interrupts]")
- **Best for**: Simple command-and-response interfaces, IVR menu navigation

### 2. Heuristic (Balanced)

Combines silence detection with punctuation analysis from the STT transcript. Waits for both silence AND a sentence-ending punctuation mark (period, question mark, exclamation).

```json
{
  "voice": {
    "endpointing": "heuristic",
    "silenceTimeout": 600,
    "requirePunctuation": true
  }
}
```

- **Latency**: ~50ms (waits for STT partial)
- **Accuracy**: Medium. Works well for clear speakers. Struggles with run-on sentences and "um/uh" fillers.
- **Best for**: General voice assistants, phone agents, most production use cases

### 3. Semantic (Most Intelligent)

Uses an LLM to classify whether the user's utterance is complete. After silence is detected, the current transcript is sent to a fast model (gpt-4o-mini or equivalent) with the prompt: "Is this utterance complete, or is the speaker likely to continue?"

```json
{
  "voice": {
    "endpointing": "semantic",
    "semanticModel": "gpt-4o-mini",
    "semanticTimeout": 1500
  }
}
```

- **Latency**: 200-500ms (LLM inference)
- **Accuracy**: High. Correctly waits through "Let me think...", "So basically...", "The thing is..."
- **Cost**: Extra LLM call per potential turn boundary
- **Best for**: Premium voice experiences, complex conversations, multi-turn reasoning

## Comparison

| Strategy | Latency | Accuracy | Cost | Use Case |
|----------|---------|----------|------|----------|
| Acoustic | ~0ms | Low | Free | IVR menus, commands |
| Heuristic | ~50ms | Medium | Free | General voice agents |
| Semantic | 200-500ms | High | LLM call/turn | Premium experiences |

## Tuning Parameters

### silenceTimeout (ms)
How long to wait after the last speech before triggering endpoint. Lower = faster but more false positives.
- IVR: 500-800ms
- Conversation: 800-1200ms
- Thoughtful discussion: 1500-2000ms

### minSpeechDuration (ms)
Minimum speech before considering an endpoint. Prevents triggering on coughs, "um", breaths.
- Default: 300ms
- Noisy environments: 500ms

### semanticTimeout (ms)
Maximum time to wait for the semantic classifier response before falling back to heuristic.
- Default: 1500ms
- Low-latency mode: 800ms

## CLI Flags

```bash
wunderland start --voice-endpointing acoustic
wunderland start --voice-endpointing heuristic
wunderland start --voice-endpointing semantic
```
