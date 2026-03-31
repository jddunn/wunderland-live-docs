---
sidebar_position: 18
---

# Citation Verification

Verify that your agent's claims are actually grounded in its sources.

## Overview

When an agent generates a response using RAG or deep research, citation verification checks each factual claim against the source documents. Claims are scored using cosine similarity between embeddings, producing per-claim verdicts: supported, weak, unverifiable, or contradicted.

## Quick Start

### Enable Automatic Verification

Add to your `agent.config.json`:

```json
{
  "queryRouter": {
    "verifyCitations": true
  }
}
```

Deep research responses (`depth: "deep"`) are always verified. With `verifyCitations: true`, moderate-depth queries also verify.

### Use the CLI

```bash
# Verify citations during deep research
wunderland chat --provider openai

# Ask a factual question — citations verified automatically
> What is the population of Tokyo?
```

### Help Topic

```bash
wunderland help citations
```

## How It Works

1. **Claim extraction** — the response is split into atomic factual claims
2. **Batch embedding** — all claims and source documents are embedded in one call
3. **Cosine similarity** — each claim is compared against each source
4. **Verdict assignment** — based on similarity thresholds:
   - **supported** (>= 0.6) — claim matches a source
   - **weak** (0.3 - 0.6) — partial match
   - **unverifiable** (< 0.3) — no source matches
   - **contradicted** — NLI detects contradiction

## On-Demand Verification

Agents can explicitly verify text using the `verify_citations` tool:

```
You: "Check if this summary is accurate"
Agent calls: verify_citations({
  text: "The Earth is 4.5 billion years old. It orbits the Sun every 365.25 days.",
  sources: [{ content: "Earth formed approximately 4.54 billion years ago." }],
  webFallback: true
})
```

When `webFallback: true`, claims that can't be verified against provided sources are checked via web search (requires `SERPER_API_KEY` or `TAVILY_API_KEY`).

## The `fact-grounding` Skill

Install the `fact-grounding` skill to make your agent automatically verify claims:

```bash
wunderland init my-agent --preset research-assistant
```

Or add to your agent config:

```json
{
  "skills": ["fact-grounding"]
}
```

The skill instructs the agent to:
- Verify key factual claims before presenting
- Mark unverified claims with "[unverified]"
- Cite sources inline: "According to [Source]..."
- Flag contradictions with both sides

## Integration with Deep Research

Citation verification plugs into the deep research pipeline:

```
Query → Decompose → Search (7 providers) → Reranker Chain → Synthesis → Citation Verification
```

The reranker chain ensures the best sources reach synthesis. Citation verification then confirms the synthesized claims match those sources.

## Configuration Reference

| Config Key | Default | Description |
|---|---|---|
| `queryRouter.verifyCitations` | `false` | Enable automatic verification |
| `supportThreshold` | `0.6` | Cosine similarity for "supported" |
| `unverifiableThreshold` | `0.3` | Below this = "unverifiable" |

## Environment Variables

| Variable | Purpose |
|---|---|
| `SERPER_API_KEY` | Web fallback for unverifiable claims |
| `TAVILY_API_KEY` | Alternative search for web fallback |
| `COHERE_API_KEY` | Reranking before citation (optional) |

## Related

- `wunderland help citations` — CLI quick reference
- `wunderland help retrieval` — RAG and search pipeline
- `wunderland help security` — guardrails including grounding guard
