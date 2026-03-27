---
sidebar_position: 17
---

# Image Generation

Wunderland agents can generate images from text prompts using OpenAI, OpenRouter, Stability AI, or Replicate. The agent gets a single `generate_image` tool that routes to whichever provider you configure.

## Providers

| Provider | Example Models | Strengths |
|----------|----------------|-----------|
| **OpenAI** | `dall-e-3`, `gpt-image-1` | Strong prompt adherence, text rendering, polished defaults |
| **OpenRouter** | Routed image-capable models | Provider routing and unified account management |
| **Stability AI** | `stable-image-core`, `stable-image-ultra`, `sd3-large` | Granular diffusion controls and seedable generations |
| **Replicate** | `black-forest-labs/flux-schnell`, `flux-dev`, community models | Broad model catalog and provider-native low-level inputs |

## API Keys

Set the key for your preferred provider:

```bash
# OpenAI
export OPENAI_API_KEY=sk-...

# OpenRouter
export OPENROUTER_API_KEY=sk-or-...

# Stability AI
export STABILITY_API_KEY=sk-...

# Replicate
export REPLICATE_API_TOKEN=r8_...
```

Any combination can be set simultaneously. The extension uses its configured default provider and falls back to the first available credentialed provider.

## Auto-Detection

The image generation extension loads automatically when one of these is present:

- `OPENAI_API_KEY`
- `OPENROUTER_API_KEY`
- `STABILITY_API_KEY`
- `REPLICATE_API_TOKEN`

No need to run `wunderland extensions enable` in the common case. If you want to force the extension on with only non-default provider credentials present, you can still enable it explicitly:

```bash
wunderland extensions enable image-generation
```

## The `generate_image` Tool

The agent exposes a single tool with these options:

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `prompt` | Yes | — | Text description of the image to generate |
| `size` | No | `1024x1024` | Output dimensions |
| `aspectRatio` | No | Provider default | Explicit aspect ratio hint such as `1:1`, `16:9`, or `9:16` |
| `quality` | No | `standard` | Image quality level |
| `style` | No | `vivid` | Visual style |
| `provider` | No | Configured default | Override the provider for this request |
| `model` | No | Provider default | Use a provider-native model id for this request |
| `seed` | No | Random | Reproducible generation for providers that support seeds |
| `negativePrompt` | No | — | Exclude traits or artifacts for providers that support it |

### Sizes

| Size | Aspect Ratio | Use Case |
|------|-------------|----------|
| `1024x1024` | 1:1 (square) | Social media posts, profile images |
| `1792x1024` | 16:9 (landscape) | Blog headers, presentations, desktop wallpapers |
| `1024x1792` | 9:16 (portrait) | Mobile wallpapers, stories, vertical content |

### Quality

| Quality | Description | Cost Impact |
|---------|-------------|-------------|
| `standard` | Good for most use cases — fast and affordable | 1x |
| `hd` | Higher detail and consistency, especially for complex scenes | ~2x |

### Style

| Style | Description |
|-------|-------------|
| `vivid` | Hyper-real, dramatic lighting, saturated colors |
| `natural` | Photographic, muted, realistic tones |

Deep provider-native controls still live in the SDK/runtime layer. If you need raw Stability presets or Replicate model inputs from code, use AgentOS `generateImage()` with namespaced `providerOptions`.

## Configuration

### Default Provider

Set your preferred provider globally:

```bash
wunderland extensions configure
```

The CLI provider-default picker supports:

- `openai`
- `openrouter`
- `stability`
- `replicate`

Or in `~/.wunderland/config.json`:

```json
{
  "providerDefaults": {
    "imageGeneration": "openai"
  }
}
```

### Per-Agent Override

Override the global default in `agent.config.json`:

```json
{
  "extensionOverrides": {
    "image-generation": {
      "options": { "defaultProvider": "stability" }
    }
  }
}
```

## Example Usage

In a chat session:

```
You: Generate an image of a rabbit wearing VR goggles,
     floating in a neon-lit cyberpunk city

Agent: [calls generate_image with prompt, size: 1024x1024,
        quality: standard, style: vivid]

       Here's your image: [generated_image.png]
       A rabbit in VR goggles hovering above a cyberpunk cityscape
       with neon signs and rain-slicked streets.
```

Requesting specific options:

```
You: Create a landscape HD image of a minimalist Japanese garden,
     natural style

Agent: [calls generate_image with prompt, size: 1792x1024,
        quality: hd, style: natural]

       Here's your image: [generated_image.png]
```

## Pricing

Pricing varies materially by provider, model, and quality setting. Check the provider’s current pricing page before relying on cost assumptions in production.

## Need Lower-Level Provider Controls?

Wunderland exposes a single `generate_image` tool for agents. If you need direct provider-native knobs from code, use AgentOS `generateImage()` with namespaced `providerOptions` and keep Wunderland for orchestration:

```ts
import { generateImage } from '@framers/agentos';

const result = await generateImage({
  model: 'stability:stable-image-core',
  prompt: 'A brutalist cabin in alpine fog',
  providerOptions: {
    stability: {
      stylePreset: 'photographic',
      seed: 42,
      cfgScale: 8,
    },
  },
});
```

## Troubleshooting

**"Image generation not available"** — Check that one of `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `STABILITY_API_KEY`, or `REPLICATE_API_TOKEN` is set. Run `wunderland extensions info image-generation` to see key status.

**"Content policy violation"** — Both providers enforce content safety policies. Rephrase the prompt to avoid restricted content categories.

**Slow generation** — Larger sizes, HD quality, and routed/community models can take noticeably longer. Start with smaller sizes and standard quality until you know your provider’s latency profile.
