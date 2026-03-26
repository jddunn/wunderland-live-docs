---
sidebar_position: 15
---

# Multi-Agent Agency

The `agency()` API lets you coordinate multiple agents under a single orchestration strategy. It returns an `Agent`-compatible interface, so you can swap a solo agent for an entire team without changing call sites.

## Creating an Agency

### With `createWunderland()`

```typescript
import { createWunderland } from 'wunderland';

const app = await createWunderland({
  llm: { providerId: 'openai', model: 'gpt-4o' },
  agency: {
    agents: {
      researcher: { instructions: 'Find relevant facts.' },
      writer:     { instructions: 'Write a clear summary.' },
    },
    strategy: 'sequential',
  },
});

const result = await app.agent.generate('Summarise fusion energy advances.');
console.log(result.text);
```

### With `agency()` directly

```typescript
import { agency } from '@framers/agentos';

const team = agency({
  agents: {
    researcher: { instructions: 'Find relevant facts.' },
    writer:     { instructions: 'Write a clear, concise summary.' },
  },
  strategy: 'sequential',
});

const result = await team.generate('Summarise recent advances in fusion energy.');
console.log(result.text);
```

Set `OPENAI_API_KEY` (or another provider key) and the agency auto-detects the provider. Pass `model: 'openai:gpt-4o'` or `provider: 'anthropic'` to control the model explicitly.

## Orchestration Strategies

Six built-in strategies cover common multi-agent patterns.

### sequential (default)

Agents run one after another. Each receives the previous agent's output as context, forming a progressive refinement chain.

```typescript
const pipeline = agency({
  model: 'openai:gpt-4o',
  agents: {
    researcher: { instructions: 'Gather facts on the topic.' },
    editor:     { instructions: 'Edit for clarity and concision.' },
    reviewer:   { instructions: 'Check tone and factual accuracy.' },
  },
  strategy: 'sequential',
});

const { text, agentCalls } = await pipeline.generate('Write about quantum computing.');
console.log(agentCalls.length); // 3
```

### parallel

All agents run concurrently. Their outputs are merged by a synthesis step using the agency-level model.

```typescript
const panel = agency({
  model: 'openai:gpt-4o',
  agents: {
    optimist:  { instructions: 'Argue in favour.' },
    pessimist: { instructions: 'Argue against.' },
    neutral:   { instructions: 'Give a balanced view.' },
  },
  strategy: 'parallel',
});

const { text } = await panel.generate('Should AI systems have legal rights?');
```

### debate

Agents argue and refine a shared answer over multiple rounds. The `maxRounds` option (default 3) controls the number of rounds. A synthesis step at the agency level merges the final output.

```typescript
const debaters = agency({
  model: 'openai:gpt-4o',
  agents: {
    proponent: { instructions: 'Defend your position vigorously.' },
    critic:    { instructions: 'Challenge every claim you hear.' },
  },
  strategy: 'debate',
  maxRounds: 4,
});

const { text } = await debaters.generate('Is remote work better than in-office?');
```

### review-loop

One agent produces output; another reviews it and requests revisions. The loop continues until the reviewer is satisfied or `maxRounds` is reached.

```typescript
const loop = agency({
  model: 'openai:gpt-4o-mini',
  agents: {
    drafter:  { instructions: 'Draft a press release.' },
    reviewer: { instructions: 'Review for brand voice and accuracy. Request changes if needed.' },
  },
  strategy: 'review-loop',
  maxRounds: 3,
});

const { text } = await loop.generate('Announce our new product launch.');
```

### hierarchical

A coordinator agent dispatches sub-tasks to specialist agents via tool calls. The coordinator decides which agents to invoke and in what order at runtime. This is the strategy that supports emergent agent synthesis.

```typescript
const team = agency({
  model: 'openai:gpt-4o',
  agents: {
    researcher: { instructions: 'Find factual information.' },
    coder:      { instructions: 'Write and explain code.' },
    writer:     { instructions: 'Produce polished prose.' },
  },
  strategy: 'hierarchical',
});

const { text } = await team.generate('Explain and demonstrate quicksort.');
```

### graph

Explicit dependency DAG. Agents declare `dependsOn` arrays naming their predecessors. Agents with no dependencies (roots) run first in parallel. As each agent completes, any downstream agents whose dependencies are all satisfied start immediately, maximising concurrency within the DAG constraints.

```typescript
const dag = agency({
  model: 'openai:gpt-4o',
  strategy: 'graph',
  agents: {
    researcher:  { instructions: 'Find facts.' },
    illustrator: { instructions: 'Create a diagram.', dependsOn: ['researcher'] },
    writer:      { instructions: 'Write a summary.',  dependsOn: ['researcher'] },
    reviewer:    { instructions: 'Review everything.', dependsOn: ['writer', 'illustrator'] },
  },
});

const { text } = await dag.generate('Explain how transformers work.');
```

If any agent in the roster declares `dependsOn`, the strategy is auto-detected as `graph` even if you omit `strategy`.

## Graph Strategy in Detail

### How `dependsOn` Works

Each agent config can include a `dependsOn` array listing the names of agents that must complete before it runs. The strategy performs a topological sort and groups agents into tiers:

```
Tier 0: researcher          (no deps — root)
Tier 1: illustrator, writer (both depend only on researcher)
Tier 2: reviewer            (depends on writer + illustrator)
```

Within each tier, agents run concurrently. Each downstream agent receives the original prompt plus the concatenated outputs of its predecessors:

```
Original task: <prompt>

Outputs from dependencies:
[researcher]:
<researcher output>
```

### Cycle Detection

The topological sort detects cycles at compile time and throws an `AgencyConfigError`:

```typescript
// This throws: "Cycle detected in agent dependencies"
agency({
  strategy: 'graph',
  agents: {
    a: { instructions: '...', dependsOn: ['b'] },
    b: { instructions: '...', dependsOn: ['a'] },
  },
});
```

### Invalid References

Referencing an agent name that is not in the roster also throws:

```typescript
// Throws: 'Agent "writer" depends on "editor" which is not in the agents roster.'
agency({
  strategy: 'graph',
  agents: {
    writer: { instructions: '...', dependsOn: ['editor'] },
  },
});
```

## Streaming Events

Both `generate()` and `stream()` are supported. The streaming interface emits structured events:

```typescript
const team = agency({
  model: 'openai:gpt-4o',
  agents: {
    researcher: { instructions: 'Research the topic.' },
    writer:     { instructions: 'Write the summary.' },
  },
  strategy: 'sequential',
});

const stream = team.stream('Explain quantum entanglement.');
for await (const part of stream.fullStream) {
  switch (part.type) {
    case 'agent-start':
      console.log(`[START] ${part.agent}`);
      break;
    case 'text':
      process.stdout.write(part.text); // part.agent tells you which agent emitted it
      break;
    case 'agent-end':
      console.log(`\n[END] ${part.agent} (${part.durationMs}ms)`);
      break;
  }
}
```

For a simpler token-only stream:

```typescript
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

### Lifecycle Callbacks

Register callbacks on the agency itself for observability:

```typescript
const team = agency({
  agents: { /* ... */ },
  on: {
    agentStart:        (e) => console.log(`[>] ${e.agent}`),
    agentEnd:          (e) => console.log(`[<] ${e.agent} (${e.durationMs}ms)`),
    handoff:           (e) => console.log(`[HANDOFF] ${e.fromAgent} -> ${e.toAgent}`),
    toolCall:          (e) => console.log(`[TOOL] ${e.agent} called ${e.toolName}`),
    guardrailResult:   (e) => console.log(`[GUARD] ${e.guardrailId}: ${e.passed ? 'pass' : 'block'}`),
    emergentForge:     (e) => console.log(`[FORGE] ${e.agentName} approved=${e.approved}`),
    approvalRequested: (e) => console.log(`[HITL] ${e.type}: ${e.description}`),
    limitReached:      (e) => console.warn(`[LIMIT] ${e.metric}: ${e.value}/${e.limit}`),
    error:             (e) => console.error(`[ERROR] ${e.agent}: ${e.error.message}`),
  },
});
```

## Human-in-the-Loop Approvals

Gate any lifecycle point behind an async approval handler.

### Built-in Handlers

```typescript
import { hitl } from '@framers/agentos';

hitl.autoApprove()                      // always approve (tests / CI)
hitl.autoReject('dry-run mode')         // always reject
hitl.cli()                              // interactive stdin prompt
hitl.webhook('https://my-service/ok')   // POST to HTTP endpoint
hitl.slack({ channel: '#approvals', token: process.env.SLACK_BOT_TOKEN })
```

### Approval Triggers

```typescript
const guarded = agency({
  model: 'openai:gpt-4o',
  agents: { worker: { instructions: 'Execute tasks.' } },
  hitl: {
    approvals: {
      beforeTool:             ['delete-record', 'send-email'],
      beforeAgent:            ['financial-agent'],
      beforeEmergent:         true,
      beforeReturn:           true,
      beforeStrategyOverride: true,
    },
    handler: hitl.cli(),
    timeoutMs:  30_000,
    onTimeout:  'reject',   // 'reject' | 'approve' | 'error'
  },
});
```

### Custom Handler

```typescript
const custom = agency({
  agents: { worker: { instructions: 'Do work.' } },
  hitl: {
    approvals: { beforeReturn: true },
    handler: async (request) => {
      const ok = await myApprovalDatabase.lookup(request.id);
      return {
        approved: ok,
        reason: ok ? 'Approved by policy' : 'Blocked by policy',
        modifications: ok ? undefined : { output: '[redacted]' },
      };
    },
  },
});
```

## CLI Commands

Manage agencies from the Wunderland CLI:

```bash
wunderland agency list                  # List all configured agencies
wunderland agency create <name>         # Scaffold a new agency config
wunderland agency status <name>         # Show agent roster, strategy, and run history
wunderland agency run <name> "prompt"   # Execute an agency and print the result
```

These commands read from your `agent.config.json` or the `~/.wunderland/` directory.

## Nested Agencies

An `agency()` instance satisfies the `Agent` interface and can be placed directly in another agency's roster. The outer strategy treats it as a single opaque agent call.

```typescript
const researchTeam = agency({
  model: 'openai:gpt-4o-mini',
  agents: {
    searcher: { instructions: 'Search for sources.' },
    analyst:  { instructions: 'Analyse and rank sources.' },
  },
  strategy: 'sequential',
});

const publishingTeam = agency({
  model: 'openai:gpt-4o',
  agents: {
    researchTeam,                                         // nested agency
    writer: { instructions: 'Write from research.' },
    editor: { instructions: 'Polish and fact-check.' },
  },
  strategy: 'sequential',
});

const { text } = await publishingTeam.generate('Write about quantum computing.');
```

Nesting can go arbitrarily deep. `usage` and `agentCalls` are aggregated through all layers. Calling `close()` propagates inward.

## Configuration Reference

```typescript
agency({
  // ── Identity ────────────────────────────────────────────
  name: 'my-agency',
  model: 'openai:gpt-4o',             // or provider: 'anthropic'

  // ── Agent roster ────────────────────────────────────────
  agents: {
    agentName: {
      instructions: '...',
      model: 'openai:gpt-4o-mini',    // per-agent model override
      tools: [...],                    // per-agent tool list
      maxSteps: 5,                     // max tool-call rounds
      dependsOn: ['otherAgent'],       // graph strategy edges
    },
  },

  // ── Strategy ────────────────────────────────────────────
  strategy: 'sequential',             // 'sequential' | 'parallel' | 'debate'
                                      // 'review-loop' | 'hierarchical' | 'graph'
  maxRounds: 3,                       // debate / review-loop rounds
  adaptive: false,                    // let orchestrator override strategy at runtime

  // ── Emergent agents ─────────────────────────────────────
  emergent: {
    enabled: false,
    tier: 'session',                  // 'session' | 'agent' | 'shared'
    judge: true,                      // LLM-as-judge before activation
  },

  // ── HITL ────────────────────────────────────────────────
  hitl: {
    approvals: {
      beforeTool:             [],     // tool names requiring approval
      beforeAgent:            [],     // agent names requiring approval
      beforeEmergent:         false,
      beforeReturn:           false,
      beforeStrategyOverride: false,
    },
    handler: hitl.autoApprove(),
    timeoutMs: 30_000,
    onTimeout: 'reject',
  },

  // ── Memory ──────────────────────────────────────────────
  memory: {
    shared: true,
    types: ['episodic', 'semantic'],
    working: { enabled: true, maxTokens: 4096, strategy: 'sliding-window' },
    consolidation: { enabled: true, interval: 'PT1H' },
  },

  // ── RAG ─────────────────────────────────────────────────
  rag: {
    vectorStore: { provider: 'in-memory', embeddingModel: 'text-embedding-3-small' },
    documents: [{ path: './docs/manual.pdf', loader: 'pdf' }],
    topK: 5,
    minScore: 0.75,
  },

  // ── Guardrails ──────────────────────────────────────────
  guardrails: {
    input:  ['injection-shield', 'pii-redaction'],
    output: ['grounding-guard', 'code-safety'],
    tier:   'balanced',
  },

  // ── Security ────────────────────────────────────────────
  security: {
    tier: 'balanced',                 // 'dangerous' | 'permissive' | 'balanced'
                                      // 'strict' | 'paranoid'
  },

  // ── Permissions ─────────────────────────────────────────
  permissions: {
    tools: ['read-file', 'query-db'],
    network: true,
    filesystem: false,
    spawn: false,
    requireApproval: ['delete-record'],
  },

  // ── Resource controls ───────────────────────────────────
  controls: {
    maxTotalTokens:    100_000,
    maxCostUSD:        2.00,
    maxDurationMs:     120_000,
    maxAgentCalls:     50,
    maxStepsPerAgent:  5,
    maxEmergentAgents: 3,
    onLimitReached:    'warn',        // 'stop' | 'warn' | 'error'
  },

  // ── Observability ───────────────────────────────────────
  observability: {
    logLevel: 'info',
    traceEvents: true,
    otel: { enabled: true },
  },

  // ── Voice ───────────────────────────────────────────────
  voice: {
    enabled: false,
    transport: 'streaming',
    stt: 'deepgram',
    tts: 'elevenlabs',
    ttsVoice: 'rachel',
  },

  // ── Channels ────────────────────────────────────────────
  channels: {
    discord:  { token: '...' },
    telegram: { token: '...' },
    slack:    { token: '...', signingSecret: '...' },
  },

  // ── Structured output ───────────────────────────────────
  output: z.object({
    title: z.string(),
    body:  z.string(),
  }),

  // ── Lifecycle callbacks ─────────────────────────────────
  on: {
    agentStart:      (e) => {},
    agentEnd:        (e) => {},
    handoff:         (e) => {},
    toolCall:        (e) => {},
    guardrailResult: (e) => {},
    emergentForge:   (e) => {},
    approvalRequested: (e) => {},
    limitReached:    (e) => {},
    error:           (e) => {},
  },

  // ── Provenance ──────────────────────────────────────────
  provenance: {
    enabled: true,
    hashChain: true,
    record: { toolCalls: true, agentOutputs: true },
    export: 'jsonl',                  // 'jsonl' | 'otlp' | 'solana'
  },
});
```

## See Also

- [Emergent Capabilities](/guides/emergent-capabilities) -- runtime tool creation and sandboxed execution
- [Preset Agents](/guides/preset-agents) -- 8 ready-made agent configs
- [Skills System](/guides/skills-system) -- attaching curated skills to agents
- [Security Tiers](/guides/security-tiers) -- 5-tier permission model
- [Guardrails](/guides/guardrails) -- content filtering and PII redaction
