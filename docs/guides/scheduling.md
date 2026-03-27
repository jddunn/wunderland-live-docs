---
title: Scheduling & Orchestration
sidebar_position: 8
---

# Scheduling & Orchestration

Wunderland now exposes the AgentOS orchestration authoring APIs through `wunderland/workflows`, with execution routed through `createWunderland().runGraph(...)` and `streamGraph(...)`.

The important distinction:

- Authoring is code-first today: `workflow()`, `AgentGraph`, and `mission()`
- Execution is in-process through Wunderland’s runtime bridge
- The `wunderland workflows` CLI command helps discover definitions and examples, but it is not yet a full local workflow runner

## Pick the Right Layer

| API | Use it when | Strength |
| --- | --- | --- |
| `workflow()` | You know the exact steps and want a DAG | Deterministic pipelines, judge branches, explicit ordering |
| `AgentGraph` | You need loops, routers, or custom control flow | Full graph control |
| `mission()` | You know the goal but want the planner to decide the steps | High-level intent-driven orchestration |

## Current CLI Surface

```bash
wunderland workflows list
wunderland workflows examples
wunderland help workflows
```

The `list` subcommand scans conventional directories such as:

- `./workflows/`
- `./missions/`
- `./orchestration/`

## Programmatic Execution

```ts
import { createWunderland } from 'wunderland';
import { workflow } from 'wunderland/workflows';

const app = await createWunderland({
  llm: { providerId: 'openai' },
  tools: 'curated',
});

const compiled = workflow('research-pipeline')
  .input({
    type: 'object',
    required: ['topic'],
    properties: {
      topic: { type: 'string' },
    },
  })
  .returns({
    type: 'object',
    properties: {
      finalSummary: { type: 'string' },
    },
  })
  .step('research', {
    gmi: {
      instructions: 'Research the topic and return JSON like {"scratch":{"research":{...}}}.',
    },
  })
  .then('judge', {
    gmi: {
      instructions: 'Return JSON like {"scratch":{"judge":{"score":8,"verdict":"ship","reasoning":"..."}}}.',
    },
  })
  .compile();

const result = await app.runGraph(compiled, { topic: 'agent orchestration frameworks' });
console.log(result);
```

## LLM-as-Judge Pattern

Use a dedicated judge node instead of mixing evaluation into the writing step.

Recommended pattern:

1. Research node writes structured state to `scratch.research`
2. Judge node writes structured state to `scratch.judge`
3. Branch on `state.scratch.judge.score` or `state.scratch.judge.verdict`
4. Final writer node writes to `artifacts`

Example judge output:

```json
{
  "scratch": {
    "judge": {
      "score": 8,
      "verdict": "ship",
      "reasoning": "Coverage is broad and the claims are grounded."
    }
  }
}
```

## Chain-of-Thought Guidance

Do not build your orchestration around raw hidden chain-of-thought dumps.

Prefer:

- concise rationale fields like `reasoning`, `score`, `verdict`, `risks`
- structured JSON the next node can branch on
- explicit artifacts written by the node that owns final output

Avoid:

- prompts that demand the full private reasoning transcript
- branching on unstructured prose

## Scheduling

Scheduling still uses the existing cron/job surface. Use orchestration for the graph itself, and cron for when it should run.

```bash
wunderland cron list
wunderland cron add "0 9 * * 1-5" daily-report
```
