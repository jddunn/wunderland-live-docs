---
title: Provider Preferences
sidebar_position: 15
---

# Provider Preferences

The `providerPreferences` config lets you control which provider handles each media type (image, video, audio). Preferences are set in `agent.config.json` and respected by all generation tools.

---

## Configuration

Add a `providerPreferences` block to `agent.config.json`:

```json
{
  "providerPreferences": {
    "image": {
      "preferred": ["bfl", "replicate"],
      "blocked": ["stability"],
      "weights": { "bfl": 0.8, "replicate": 0.2 }
    },
    "video": {
      "preferred": ["runway"],
      "blocked": []
    },
    "music": {
      "preferred": ["suno"],
      "blocked": []
    },
    "sfx": {
      "preferred": ["stability"],
      "blocked": ["fal"]
    }
  }
}
```

Or set preferences from the CLI:

```bash
wunderland config set providerPreferences.video.preferred '["runway"]'
wunderland config set providerPreferences.image.preferred '["bfl", "replicate"]'
wunderland config set providerPreferences.music.preferred '["suno"]'
wunderland config set providerPreferences.sfx.preferred '["stability"]'
```

---

## How Preferences Are Resolved

When a generation tool runs, the provider is selected in this order:

1. **Explicit `--provider` flag** -- CLI flag always wins
2. **Tool input param** -- The LLM can request a specific provider via tool arguments
3. **`providerPreferences` preferred list** -- First available provider from the ordered list
4. **Any available provider** -- Falls back to whatever API key is configured
5. **Error** -- No provider available, tool returns an error

### Blocked Providers

Providers in the `blocked` array are never used, even as fallbacks. This is useful when a provider is configured (API key set) but you want to exclude it for cost or quality reasons.

```bash
# Block fal.ai for video generation
wunderland config set providerPreferences.video.blocked '["fal"]'
```

### Weighted Selection

When `weights` is set and multiple preferred providers are available, the tool selects randomly weighted by the configured values. This is useful for distributing load or A/B testing providers.

```json
{
  "providerPreferences": {
    "image": {
      "preferred": ["bfl", "replicate", "openai"],
      "weights": { "bfl": 0.5, "replicate": 0.3, "openai": 0.2 }
    }
  }
}
```

Without weights, the first available provider in the `preferred` list is always used.

---

## Media Type Reference

| Media Type | Providers | Env Var |
|------------|-----------|---------|
| `image` | `openai`, `replicate`, `stability`, `bfl`, `fal` | `OPENAI_API_KEY`, `REPLICATE_API_TOKEN`, `STABILITY_API_KEY`, `BFL_API_KEY`, `FAL_API_KEY` |
| `video` | `runway`, `fal` | `RUNWAY_API_KEY`, `FAL_API_KEY` |
| `music` | `suno`, `fal` | `SUNO_API_KEY`, `FAL_API_KEY` |
| `sfx` | `stability`, `fal` | `STABILITY_API_KEY`, `FAL_API_KEY` |

---

## Viewing Current Preferences

```bash
wunderland config get providerPreferences
```

Output:

```json
{
  "image": { "preferred": ["bfl"], "blocked": [], "weights": {} },
  "video": { "preferred": ["runway"], "blocked": [] },
  "music": { "preferred": ["suno"], "blocked": [] },
  "sfx": { "preferred": ["stability"], "blocked": ["fal"] }
}
```

---

## Interaction with Extensions Configure

`wunderland extensions configure` sets shared provider defaults for all media types. Provider preferences overlay these defaults -- they control the selection order when multiple providers are available for the same media type.

```bash
# Set global defaults (which provider is used when no preference is set)
wunderland extensions configure

# Fine-tune selection order per media type
wunderland config set providerPreferences.video.preferred '["runway", "fal"]'
```

---

## Resetting Preferences

Remove all preferences (fall back to extension defaults):

```bash
wunderland config set providerPreferences '{}'
```

Remove preferences for a single media type:

```bash
wunderland config set providerPreferences.video '{}'
```
