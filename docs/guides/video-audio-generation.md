---
title: Video & Audio Generation
sidebar_position: 12
---

# Video & Audio Generation

Wunderland includes built-in tools for generating video, animating images, analyzing video content, and creating music and sound effects. All features are accessible from the CLI and available as tools in `wunderland chat`.

---

## Video Generation

### Generate a video from text

```bash
wunderland video generate "aerial flyover of a neon-lit cyberpunk city at night"
```

The CLI sends the prompt to the configured video provider (Runway Gen-3 or Fal.ai), polls for completion, and saves the resulting MP4 locally.

### Animate a still image

```bash
wunderland video animate ./photo.png "slow zoom out, camera pans right, cinematic lighting"
```

Image-to-video takes a source image and a motion description. Useful for creating short clips from generated artwork or product images.

### Analyze a video

```bash
wunderland video analyze ./clip.mp4
```

Runs scene detection, object recognition, action classification, and sentiment analysis using a vision-capable LLM. Returns structured JSON with timestamps, descriptions, and confidence scores.

```bash
# Override the vision model
wunderland video analyze ./clip.mp4 --model gpt-4o
```

### Flags

| Flag | Effect | Default |
|------|--------|---------|
| `--provider <name>` | Video provider: `runway`, `fal` | First available |
| `--model <name>` | Provider-specific model override | Provider default |
| `--duration <seconds>` | Target video duration | `5` |
| `--output <path>` | Output file path | Auto-generated in current directory |

---

## Music Generation

```bash
wunderland audio music "lo-fi hip hop beat, rainy day vibes, 90bpm"
```

Generates a music track from a text prompt using Suno or Fal.ai.

```bash
# Specify provider and duration
wunderland audio music "epic orchestral battle theme" --provider suno --duration 60

# Custom output path
wunderland audio music "calm piano ambient" --output ./background.mp3
```

---

## Sound Effect Generation

```bash
wunderland audio sfx "door creaking open slowly in an empty hallway"
```

Generates a short sound effect using Stable Audio or Fal.ai. Default duration is 5 seconds.

```bash
# Longer sound effect
wunderland audio sfx "thunderstorm building over 15 seconds" --duration 15

# Use a specific provider
wunderland audio sfx "mechanical keyboard typing" --provider stability
```

---

## Provider Configuration

Set default providers so you do not need to pass `--provider` every time:

```bash
wunderland extensions configure
```

Or set them directly:

```bash
wunderland config set videoProvider runway
wunderland config set musicProvider suno
wunderland config set sfxProvider stability
```

### Provider Matrix

| Capability | Providers | Env Var |
|------------|-----------|---------|
| Video generation | Runway Gen-3, Fal.ai | `RUNWAY_API_KEY`, `FAL_API_KEY` |
| Image animation | Runway Gen-3, Fal.ai | `RUNWAY_API_KEY`, `FAL_API_KEY` |
| Video analysis | OpenAI (GPT-4o), Anthropic (Claude Sonnet), Google (Gemini Pro) | LLM key with vision support |
| Music generation | Suno, Fal.ai | `SUNO_API_KEY`, `FAL_API_KEY` |
| Sound effects | Stable Audio, Fal.ai | `STABILITY_API_KEY`, `FAL_API_KEY` |

---

## Using in Chat

All video and audio tools are available as agent tools in interactive chat sessions:

```bash
wunderland chat
> Generate a 10-second video of waves crashing on a rocky shore at sunset
> Create a lo-fi beat to go with it
> Analyze this video file: ./demo.mp4
```

The agent calls `generate_video`, `generate_music`, `analyze_video`, etc. as tool invocations. When `selfImprovement` is enabled the agent can learn your preferred providers and styles over time.

---

## Combining with Provider Preferences

Use `providerPreferences` in `agent.config.json` to control which provider handles each media type. See [Provider Preferences](./provider-preferences) for details.

```json
{
  "providerPreferences": {
    "video": { "preferred": ["runway"], "blocked": [] },
    "music": { "preferred": ["suno"], "blocked": [] },
    "sfx": { "preferred": ["stability"], "blocked": ["fal"] }
  }
}
```
