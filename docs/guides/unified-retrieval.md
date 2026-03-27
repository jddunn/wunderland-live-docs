# Unified Retrieval System

AgentOS provides a multi-source retrieval pipeline that automatically selects
the best strategy for each query. The system unifies vector search, BM25 keyword
matching, HyDE hypothesis generation, RAPTOR hierarchical summaries, GraphRAG
entity traversal, and cognitive memory into a single query path.

## Architecture

```
  User Query
      │
      ▼
┌──────────────────────────┐
│     QueryClassifier      │  LLM-as-judge or heuristic
│  (tier + strategy)       │  determines retrieval depth
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│     RetrievalPlan        │  Pure data — describes what
│  strategy, sources,      │  sources to query and how
│  hyde, memory, temporal  │  to combine results
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│   UnifiedRetriever       │  Executes plan across all
│  (parallel source fan)   │  sources in parallel
│                          │
│  ┌─────┐ ┌─────┐ ┌────┐ │
│  │Vec+ │ │RAPT-│ │Gra-│ │
│  │BM25 │ │OR   │ │ph  │ │
│  └──┬──┘ └──┬──┘ └─┬──┘ │
│     └───┬───┘      │    │
│  ┌──────┴──────────┐│   │
│  │ RRF Merge       ││   │
│  └───────┬─────────┘│   │
│          └────┬─────┘    │
│          ┌────┴────┐     │
│          │ Rerank  │     │
│          └────┬────┘     │
│               ▼          │
│        Merged Results    │
└──────────────────────────┘
             │
             ▼
     Memory Feedback Loop
  (store as episodic memory)
```

## Strategy Tiers

The classifier assigns one of four strategies based on query complexity:

| Strategy   | Sources                             | When to Use                         |
|------------|-------------------------------------|-------------------------------------|
| `none`     | Skip retrieval                      | Greetings, trivial questions        |
| `simple`   | Vector + BM25 + memory              | Direct lookups, specific terms      |
| `moderate` | + HyDE + GraphRAG + RAPTOR          | Abstract questions, "how" / "why"   |
| `complex`  | + Decompose + Deep Research         | Multi-part, comparative analysis    |

### none (Tier 0)

The query is trivial or conversational. No retrieval is performed — the LLM
answers from its internal knowledge or conversation context.

### simple (Tier 1)

Direct vector similarity search plus BM25 keyword matching. Fast and cheap.
Best when the query vocabulary closely matches stored document vocabulary.
Cognitive memory (episodic + semantic) is also consulted.

### moderate (Tier 2)

All sources enabled. HyDE generates a hypothetical answer before embedding,
bridging vocabulary gaps between questions and documents. GraphRAG traverses
entity relationships from seed chunks. RAPTOR searches hierarchical summary
layers for thematic matches.

### complex (Tier 3)

Full pipeline including deep research decomposition. The query is broken into
sub-queries, each processed at moderate depth, then results are merged and
synthesised. Multi-hypothesis HyDE (3 hypotheses) improves recall. All four
cognitive memory types are consulted.

## Configuration Reference

All settings live under the `rag` key in `agent.config.json`:

```json
{
  "rag": {
    "enabled": true,
    "preset": "balanced",

    "hyde": {
      "enabled": true,
      "hypothesisCount": 3,
      "initialThreshold": 0.7
    },

    "hybrid": {
      "enabled": true,
      "denseWeight": 0.7,
      "sparseWeight": 0.3
    },

    "raptor": {
      "enabled": true,
      "maxDepth": 4,
      "clusterSize": 8
    },

    "chunking": {
      "strategy": "semantic",
      "targetSize": 1000,
      "overlap": 100,
      "preserveCodeBlocks": true
    },

    "queryRouter": {
      "enabled": true,
      "classifierMode": "hybrid",
      "defaultStrategy": "moderate"
    },

    "memoryIntegration": {
      "enabled": true,
      "feedbackLoop": true,
      "memoryTypes": ["episodic", "semantic"]
    }
  }
}
```

### hyde

| Field                  | Type    | Default | Description                              |
|------------------------|---------|---------|------------------------------------------|
| `enabled`              | boolean | `true`  | Enable HyDE hypothesis generation        |
| `hypothesisCount`      | number  | `3`     | Hypotheses per query (more = better recall, higher cost) |
| `initialThreshold`     | number  | `0.7`   | Initial similarity threshold             |
| `adaptiveThreshold`    | boolean | `true`  | Auto-lower threshold when no results     |

### hybrid

| Field         | Type    | Default | Description                       |
|---------------|---------|---------|-----------------------------------|
| `enabled`     | boolean | `true`  | Enable BM25 alongside vectors     |
| `denseWeight` | number  | `0.7`   | Dense vector weight in RRF merge  |
| `sparseWeight`| number  | `0.3`   | BM25 sparse weight in RRF merge   |

### raptor

| Field         | Type    | Default | Description                           |
|---------------|---------|---------|---------------------------------------|
| `enabled`     | boolean | `true`  | Enable RAPTOR summary tree            |
| `maxDepth`    | number  | `4`     | Maximum tree depth (summary layers)   |
| `clusterSize` | number  | `8`     | Target cluster size per layer         |

### chunking

| Field                | Type    | Default      | Description                         |
|----------------------|---------|--------------|-------------------------------------|
| `strategy`           | string  | `"semantic"` | `"fixed"` or `"semantic"`           |
| `targetSize`         | number  | `1000`       | Target chunk size (characters)      |
| `overlap`            | number  | `100`        | Overlap between chunks (characters) |
| `preserveCodeBlocks` | boolean | `true`       | Keep code blocks as atomic chunks   |

### queryRouter

| Field             | Type    | Default      | Description                            |
|-------------------|---------|--------------|----------------------------------------|
| `enabled`         | boolean | `true`       | Enable auto-classification             |
| `classifierMode`  | string  | `"hybrid"`   | `"heuristic"`, `"llm"`, or `"hybrid"` |
| `defaultStrategy` | string  | `"moderate"` | Fallback when classifier unavailable   |

### memoryIntegration

| Field          | Type     | Default                       | Description                          |
|----------------|----------|-------------------------------|--------------------------------------|
| `enabled`      | boolean  | `true`                        | Search cognitive memory              |
| `feedbackLoop` | boolean  | `true`                        | Store retrieval as episodic memory   |
| `memoryTypes`  | string[] | `["episodic", "semantic"]`    | Memory types to search               |

## CLI Commands

### Query with strategy selection

```bash
# Auto-detect strategy (default)
wunderland rag query "How does auth work?"

# Force a specific strategy
wunderland rag query "How does auth work?" --strategy moderate

# Enable specific sources
wunderland rag query "Compare approaches" --strategy complex --deep-research --hyde --hyde-count 5

# Search cognitive memory alongside documents
wunderland rag query "What did we discuss yesterday?" --memory --memory-types episodic,semantic
```

### Ingest with semantic chunking

```bash
# Semantic chunking (default)
wunderland rag ingest ./docs/architecture.md

# Fixed chunking with custom size
wunderland rag ingest ./data.txt --chunking fixed --chunk-size 500 --chunk-overlap 50

# Build RAPTOR tree and BM25 index after ingestion
wunderland rag ingest ./docs --build-raptor --build-bm25

# Extract GraphRAG entities
wunderland rag ingest ./codebase --extract-entities
```

### Preview a retrieval plan

```bash
wunderland rag plan "Compare all caching strategies"
# Output:
#   Strategy: complex
#   Sources: vector Y  bm25 Y  graph Y  raptor Y  memory Y  multimodal N
#   HyDE: 3 hypothesis(es)
#   Deep Research: enabled
#   Memory Types: episodic, semantic, procedural, prospective
```

### Check system status

```bash
wunderland rag status
# Output:
#   Vector Store: hnswlib (1,234 documents, 5,678 chunks)
#   BM25 Index: enabled (5,678 documents)
#   RAPTOR Tree: 3 layers (leaf: 5,678, L1: 710, L2: 89)
#   GraphRAG: 89 entities, 145 relationships
#   HyDE: enabled
#   Reranker: lexical
#   Embeddings: available
#   Memory: connected (episodic: 45, semantic: 123)
```

## When to Use Each Strategy

### Use `simple` when:

- The user asks a fact-based question with specific terms
- Query vocabulary closely matches document vocabulary
- Speed is critical (under 200ms target)
- Example: "What port does the API run on?"

### Use `moderate` when:

- The question is abstract or uses different vocabulary than docs
- You need cross-document synthesis
- GraphRAG entity relationships would help
- Example: "How does the authentication flow from frontend to backend?"

### Use `complex` when:

- The question has multiple parts requiring separate research
- Comparative analysis across many sources is needed
- Deep synthesis with external data would improve the answer
- Example: "Compare all caching strategies in this codebase and recommend improvements"

## Memory Integration

When `memoryIntegration.enabled` is true, the retrieval pipeline searches the
agent's cognitive memory alongside the document corpus:

- **Episodic memory**: Past interactions, events, conversation history
- **Semantic memory**: Facts, knowledge, learned concepts
- **Procedural memory**: Workflows, how-to knowledge, skills
- **Prospective memory**: Upcoming intentions, reminders, planned actions

The feedback loop (`feedbackLoop: true`) stores every successful retrieval
as a new episodic memory trace. This means frequently-retrieved information
gets a "memory cache hit" shortcut on subsequent queries, progressively
improving retrieval speed for repeated topics.

## Performance Implications

| Strategy   | Typical Latency | LLM Calls | Token Cost   |
|------------|----------------|-----------|--------------|
| `none`     | 0ms            | 0         | 0            |
| `simple`   | 50-200ms       | 0         | Embedding only |
| `moderate` | 200-800ms      | 1 (HyDE)  | ~500 tokens  |
| `complex`  | 1-5s           | 3+ (HyDE + decompose) | ~2000 tokens |

Tips for optimising:
- Use `heuristic` classifier mode to avoid the classification LLM call
- Set `rag.hyde.hypothesisCount: 1` for moderate queries where speed matters
- Disable RAPTOR and GraphRAG for small corpora (under 100 documents)
- Use `rag.preset: "fast"` for latency-sensitive applications

## Chat Runtime Integration

During `wunderland chat`, the query router automatically classifies each user
message and retrieves context before the LLM generates its response. The
configuration from `agent.config.json` is respected.

To see retrieval strategy details during chat:

```bash
wunderland chat --verbose
```

To disable the query router:

```bash
wunderland chat --no-query-router
```
