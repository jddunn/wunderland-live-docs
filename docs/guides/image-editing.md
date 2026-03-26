---
title: Image Editing
sidebar_position: 26
---

# Image Editing

Edit, upscale, and create variations of existing images using AgentOS
provider-agnostic APIs.

## Quick Start

### CLI

```bash
# Edit an image with a text prompt
wunderland image edit ./photo.jpg --prompt "Make it a sunset scene" --output edited.png

# Upscale an image 4x
wunderland image upscale ./thumbnail.jpg --scale 4 --output upscaled.png

# Create 3 variations
wunderland image variate ./photo.jpg --n 3 --output variations/
```

### Programmatic

```typescript
import { editImage, upscaleImage, variateImage } from '@framers/agentos';

// Img2img / style transfer
const edited = await editImage({
  image: imageBuffer,
  prompt: 'Oil painting in impressionist style',
  strength: 0.65,
});

// Upscale
const upscaled = await upscaleImage({
  image: imageBuffer,
  scale: 4,
});

// Variations
const variations = await variateImage({
  image: imageBuffer,
  n: 3,
});
```

## Three APIs

| API | Purpose | Providers |
|-----|---------|-----------|
| `editImage()` | Img2img, inpainting, outpainting | OpenAI, Stability, Replicate, Local SD |
| `upscaleImage()` | 2x/4x super resolution | Stability, Replicate, Local SD |
| `variateImage()` | Create N variations | OpenAI, Stability, Replicate |

## Inpainting

Provide a mask image where white pixels mark the area to regenerate:

```typescript
const result = await editImage({
  image: roomPhoto,
  mask: maskBuffer,        // White = edit area, black = preserve
  prompt: 'A large bookshelf filled with colorful books',
  strength: 0.9,
});
```

## Strength Parameter

| Range | Behavior |
|-------|----------|
| `0.0–0.3` | Subtle adjustments (color grading, minor touch-ups) |
| `0.4–0.6` | Moderate changes (style transfer, lighting) |
| `0.7–1.0` | Major transformation (content regenerated, composition preserved) |

## Provider Setup

| Provider | Env Var | Cost |
|----------|---------|------|
| OpenAI | `OPENAI_API_KEY` | $$$ |
| Stability AI | `STABILITY_API_KEY` | $$ |
| Replicate | `REPLICATE_API_TOKEN` | $$ |
| Local SD (A1111/ComfyUI) | `STABLE_DIFFUSION_LOCAL_BASE_URL` | Free |

### Local Stable Diffusion

```bash
# A1111
export STABLE_DIFFUSION_LOCAL_BASE_URL=http://localhost:7860

# ComfyUI
export STABLE_DIFFUSION_LOCAL_BASE_URL=http://localhost:8188
export STABLE_DIFFUSION_LOCAL_BACKEND=comfyui
```

## Further Reading

- [Image Editing — Full API Reference](https://docs.agentos.sh/features/image-editing) (AgentOS docs)
- [Image Generation](./image-generation.md)
- [Vision Pipeline](./vision-pipeline.md)
