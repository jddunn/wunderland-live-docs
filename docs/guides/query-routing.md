---
sidebar_label: Query Routing
sidebar_position: 12
---

# Query Routing

The QueryRouter replaces naive keyword search with intelligent, tiered semantic retrieval. Instead of running the same retrieval pipeline for every message, the router classifies each query by complexity and dispatches it to the appropriate retrieval depth -- from zero retrieval for greetings up to full deep research with citations.

## How It Works

Before retrieval starts, a cheap LLM call (gpt-4o-mini by default) inspects the query and assigns a complexity tier. The tier determines what happens next:

```
User message
  --> Classify (chain-of-thought LLM, ~100ms)
  --> Dispatch (tier-appropriate retrieval)
  --> Generate (grounded answer with sources)
  --> Wrap with personality
  --> Reply
```

The router loads your documentation corpus (markdown files) at startup, chunks them by heading, and builds both a vector index and a keyword fallback index. If the embedding API is unavailable, keyword search handles everything automatically.

## The Four Tiers

| Tier | Triggers on | What happens | Example |
|------|------------|--------------|---------|
| **T0** | Greetings, small talk, general knowledge | No retrieval. LLM answers directly. | "Hello!", "What is TypeScript?" |
| **T1** | Specific facts, config values, single-doc questions | Vector search (top 5 chunks) | "What is the pricing?", "What port does the API use?" |
| **T2** | Cross-document questions, architecture, comparisons | Vector(15) + graph expansion + rerank(5) | "How does auth flow from frontend to backend?" |
| **T3** | Deep investigation, multi-source synthesis | Everything in T2 + deep research with external sources | "Compare all caching strategies and recommend improvements" |

The classifier defaults to T1 on failure. A broken classifier never blocks the conversation.

## How Bots Use the Router

The Discord and Telegram bots initialize a single shared QueryRouter at startup, pointing at the documentation corpus:

```typescript
const router = new QueryRouter({
  knowledgeCorpus: [
    './docs',
    './guides',
  ],
  generationModel: 'gpt-4o-mini',
  generationProvider: 'openai',
});

await router.init();
```

For each incoming question, the bot calls `router.route(message)` and gets back a `QueryResult` with the factual answer, classification metadata, source citations, and timing. The bot then wraps the factual answer with its personality layer before replying.

```typescript
const result = await router.route(userMessage);
// result.answer = "Starter plan costs $19/month."
// result.classification.tier = 1
// result.sources = [{ path: 'docs/pricing.md', heading: 'Pricing', ... }]
```

The router is a shared singleton -- it loads the corpus once, keeps it in memory, and handles concurrent queries safely.

## Configuration via Environment Variables

The QueryRouter resolves credentials and model settings from environment variables:

| Variable | Purpose | Required |
|----------|---------|----------|
| `OPENAI_API_KEY` | Embedding generation + LLM calls (classifier, generator) | Yes (for vector search) |
| `LLM_MODEL` | Override the generation model (e.g., `gpt-4o`) | No |
| `SERPER_API_KEY` | Enables deep research mode (T3 web search) | No |
| `OPENROUTER_API_KEY` | Alternative LLM routing via OpenRouter | No |

If `OPENAI_API_KEY` is not set, the router skips vector store embedding and falls back to keyword search for all tiers. Everything still works, just with lower retrieval quality.

Deep research (T3) is automatically enabled when `SERPER_API_KEY` is present. Without it, T3 queries degrade to T2 behaviour.

## Programmatic Configuration

For fine-grained control beyond environment variables:

```typescript
const router = new QueryRouter({
  knowledgeCorpus: ['./docs'],

  // Classifier settings
  classifierModel: 'gpt-4o-mini',
  classifierProvider: 'openai',
  confidenceThreshold: 0.8,   // bump tier if confidence < 0.8
  maxTier: 2,                  // disable deep research entirely

  // Generation settings
  generationModel: 'gpt-4o-mini',
  generationModelDeep: 'gpt-4o',
  generationProvider: 'openai',
  maxContextTokens: 8000,

  // Feature flags
  graphEnabled: false,         // disable graph expansion
  deepResearchEnabled: false,  // disable T3 research

  // Observability hooks
  onClassification: (c) => console.log(`Tier ${c.tier}`),
  onRetrieval: (r) => console.log(`${r.chunks.length} chunks`),
});
```

## How Personality Wraps the Answer

The QueryRouter produces a factual, source-grounded answer. The bot's personality layer then wraps it:

1. **QueryRouter** generates: "The Starter plan costs $19/month. The Pro plan costs $49/month."
2. **Personality engine** applies mood + HEXACO traits + style adaptation
3. **Final reply**: The factual content is preserved but delivered in the bot's voice

This separation means the retrieval pipeline is personality-agnostic -- the same QueryRouter instance can serve multiple bots with different personalities.

## Bundled Platform Knowledge

Every Wunderland agent knows AgentOS out of the box. The QueryRouter ships with **243 pre-built knowledge entries** that are bundled inside the `@framers/agentos` npm package — no setup required, no external docs to configure.

### What the Agent Knows

| Category | Count | Coverage |
|----------|-------|---------|
| **Tools** | 105 | Every channel adapter (Discord, Telegram, LinkedIn, Bluesky, etc.), productivity tools, orchestration tools |
| **Skills** | 79 | All curated skills from the registry |
| **FAQ** | 30 | Common questions about voice, models, streaming, OCR, and more |
| **API** | 14 | Core API functions — generateText, streamText, agent, agency, etc. |
| **Troubleshooting** | 15 | Missing API keys, model errors, embedding failures |

### How It Improves Bot Responses

Without platform knowledge, a question like "What vector stores does AgentOS support?" would either get a generic LLM answer (possibly hallucinated) or return no results if your project docs don't cover it.

With platform knowledge, the same question retrieves the bundled FAQ entry that lists all seven supported vector store backends (InMemory, SQL, HNSW, Qdrant, Neo4j, Postgres, Pinecone) with accurate details. The agent answers from verified platform documentation rather than guessing.

This is especially useful for:

- **Support bots** that need to answer questions about AgentOS features and configuration
- **Developer assistants** that help users build with AgentOS APIs
- **Onboarding agents** that guide new users through setup and capabilities

### No Setup Needed

Platform knowledge loads automatically during `router.init()`. It is merged into the same corpus as your project docs and indexed by both the vector store and keyword fallback engine. You do not need to point `knowledgeCorpus` at any AgentOS documentation directories.

To disable it (e.g., if your agent is purely project-focused):

```typescript
const router = new QueryRouter({
  knowledgeCorpus: ['./docs'],
  includePlatformKnowledge: false,
});
```

## Troubleshooting

### Bot answers everything from general knowledge (never retrieves)

The classifier is assigning T0 to everything. Check:

- **Corpus loaded?** The router logs `Embedded N chunks into vector store` at startup. If N is 0, your `knowledgeCorpus` paths might be wrong or the directories are empty.
- **Topic list populated?** The classifier needs to know what topics exist. If the corpus has no markdown headings, the topic list will be empty and the classifier will assume all queries are general knowledge.
- **Confidence threshold too low?** If set below 0.5, the classifier rarely bumps tiers. Try raising to 0.7 or 0.8.

### Bot always does full retrieval (even for greetings)

The classifier is failing and falling back to T1. Check:

- **API key valid?** The classifier needs a working LLM call. If `OPENAI_API_KEY` is invalid or rate-limited, every classification fails and defaults to T1.
- **Model accessible?** Ensure `classifierModel` is a model your API key can access.

### Retrieval returns irrelevant chunks

- **Keyword fallback active?** If you see `[QueryRouter] Embedding initialisation failed` in logs, vector search is disabled. Set `OPENAI_API_KEY` to enable proper semantic search.
- **Corpus too broad?** If your `knowledgeCorpus` includes unrelated files, trim the directories to only relevant documentation.
- **Chunks too large?** The router caps chunks at 6000 characters. Very long sections without subheadings become a single large chunk that matches many queries poorly. Add more heading structure to your markdown.

### T3 queries never trigger deep research

Deep research requires `SERPER_API_KEY` to be set. Without it, `deepResearchEnabled` defaults to `false` and T3 queries degrade to T2 behaviour. Set the env var and restart.

### High latency on first query

The `init()` call embeds the entire corpus, which can take a few seconds depending on corpus size and API speed. Subsequent queries hit the in-memory vector store and are fast (~50ms for embedding + search). Make sure `init()` is called at bot startup, not on the first incoming message.
