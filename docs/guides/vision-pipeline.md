---
title: Vision & OCR Pipeline
sidebar_position: 25
---

# Vision & OCR Pipeline

Wunderland includes a progressive vision pipeline for extracting text and
understanding images. The pipeline uses a 3-tier architecture that automatically
selects the best available provider.

## Quick Start

### CLI

```bash
# Extract text from an image
wunderland vision ocr ./document.png

# Describe image content
wunderland vision describe ./photo.jpg

# Generate a CLIP embedding vector
wunderland vision embed ./image.png
```

### Programmatic

```typescript
import { createVisionPipeline } from '@framers/agentos';

const vision = await createVisionPipeline({ strategy: 'progressive' });
const result = await vision.process(imageBuffer);

console.log(result.text);           // Extracted text
console.log(result.confidence);     // 0.0–1.0 confidence score
console.log(result.contentType);    // 'printed' | 'handwritten' | 'document-layout' | 'photograph'
```

## Three-Tier Architecture

| Tier | Providers | Install | Best For |
|------|-----------|---------|----------|
| **Tier 0** — Local OCR | PaddleOCR, Tesseract.js | `npm install ppu-paddle-ocr` | Printed text, screenshots |
| **Tier 1** — Enhanced Local | TrOCR, Florence-2, CLIP | Included via `@huggingface/transformers` | Handwriting, document layout, embeddings |
| **Tier 2** — Cloud Vision | Google Cloud Vision, OpenAI, Anthropic | Set `OPENAI_API_KEY` etc. | Complex images, highest accuracy |

## Processing Strategies

| Strategy | Description | Cost |
|----------|-------------|------|
| `progressive` | Start local, escalate if confidence is low (default) | $ |
| `local-only` | Never call cloud APIs | Free |
| `cloud-only` | Skip local, send directly to cloud | $$$ |
| `parallel` | Run all tiers simultaneously, merge best results | $$$ |

## Content Detection

The pipeline automatically classifies images into four content types and routes
processing to the most appropriate tier:

- **printed** — Machine-printed text (PaddleOCR excels)
- **handwritten** — Cursive or informal text (TrOCR excels)
- **document-layout** — Structured documents with tables and figures (Florence-2 excels)
- **photograph** — Natural images without text focus (Cloud Vision excels)

## CLIP Embeddings

Generate 512-dimensional vectors for semantic image search:

```typescript
const { embedding } = await vision.embed(imageBuffer);
// Use with any vector store for image-to-image or text-to-image search
```

## Installation

```bash
# Best local OCR (optional but recommended)
npm install ppu-paddle-ocr

# Fallback OCR with 100+ languages (optional)
npm install tesseract.js

# Tier 1 models download automatically on first use
# Tier 2 requires cloud API keys (OPENAI_API_KEY, GOOGLE_CLOUD_VISION_KEY, etc.)
```

## Agent Configuration

Enable vision in your agent config:

```json
{
  "ragMemory": {
    "multimodal": true,
    "vision": {
      "strategy": "progressive",
      "indexImages": true
    }
  }
}
```

## Further Reading

- [Vision Pipeline — Full API Reference](https://docs.agentos.sh/features/vision-pipeline) (AgentOS docs)
- [Multimodal RAG](https://docs.agentos.sh/features/multimodal-rag)
- [Image Editing](./image-editing.md)
