---
sidebar_position: 11
---

# Speaker Diarization

Identify and label individual speakers in multi-party conversations. Essential for meeting transcription, conference calls, and multi-user IVR.

## Overview

Speaker diarization answers "who spoke when" by segmenting audio into speaker-labeled turns. Wunderland supports diarization through STT providers that offer it natively, plus a local x-vector fallback.

## Provider Support

| Provider | Diarization | Real-time | Max Speakers | Notes |
|----------|------------|-----------|--------------|-------|
| Deepgram | Yes | Streaming | 10+ | Best for real-time, `diarize=true` param |
| AssemblyAI | Yes | Batch + Streaming | 10+ | `speaker_labels=true`, high accuracy |
| Azure Speech | Yes | Streaming | 10 | Conversation transcription API |
| Google Cloud | Yes | Streaming | 6 | `diarizationConfig` in recognition config |
| Whisper (local) | No | N/A | N/A | No native diarization |
| Vosk (local) | No | N/A | N/A | No native diarization |

## Configuration

```json
{
  "voice": {
    "stt": {
      "provider": "deepgram",
      "model": "nova-2",
      "diarization": true,
      "expectedSpeakers": 3
    }
  }
}
```

CLI flag:
```bash
wunderland start --voice-diarization --voice-stt deepgram
```

## Output Format

Each transcript segment includes a speaker label:

```typescript
interface DiarizedSegment {
  speaker: string;       // "speaker_0", "speaker_1", etc.
  text: string;
  start: number;         // seconds
  end: number;
  confidence: number;
}
```

Example output:
```
[speaker_0] Hi, I wanted to discuss the Q2 timeline.
[speaker_1] Sure, let me pull up the latest schedule.
[speaker_0] The design handoff is done, right?
[speaker_2] Yes, I finished that yesterday.
```

## Use Cases

- **Meeting transcription**: Record and label who said what across a team call
- **Customer support**: Distinguish agent vs customer in call recordings
- **Conference calls**: Multi-party IVR with speaker tracking
- **Compliance**: Attribute statements to specific speakers for audit trails

## Accuracy Expectations

- 2 speakers: 90-95% accuracy (most providers)
- 3-5 speakers: 80-90% accuracy
- 6+ speakers: 70-85% (diminishing returns, provider-dependent)
- Short utterances (<2 seconds) are hardest to attribute correctly

## Latency Impact

Diarization adds 50-200ms latency per segment depending on provider. For real-time conversations, Deepgram streaming diarization has the lowest overhead (~50ms). Batch providers (AssemblyAI) are more accurate but add 1-3s post-processing.

## Combining with Turn Detection

Diarization pairs naturally with semantic turn detection. When diarization identifies a speaker change, the turn detector can use this as an additional signal that the current speaker has finished:

```json
{
  "voice": {
    "endpointing": "semantic",
    "diarization": true,
    "diarizationAsEndpointSignal": true
  }
}
```
