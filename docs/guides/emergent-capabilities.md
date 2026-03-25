---
sidebar_position: 14
---

# Emergent Capabilities

Agents can create new tools at runtime when no existing capability matches their need. Enable with `emergent: true` in your agent config.

## Enable in agent.config.json

```json
{
  "emergent": true,
  "emergentConfig": {
    "maxSessionTools": 10,
    "sandboxTimeoutMs": 5000,
    "judgeModel": "gpt-4o-mini"
  }
}
```

Or via `createWunderland()`:

```typescript
import { createWunderland } from 'wunderland';

const app = await createWunderland({
  llm: { providerId: 'openai' },
  emergent: true,
  emergentConfig: {
    maxSessionTools: 10,
    sandboxTimeoutMs: 5000,
    judgeModel: 'gpt-4o-mini',
  },
});
```

When enabled, the agent gains access to the `forge_tool` meta-tool during conversation.

## How It Works

### Two Creation Modes

**Compose mode** chains existing tools into pipelines. No sandbox needed — only invokes pre-approved tools.

```json
{
  "name": "research_and_summarize",
  "implementation": {
    "mode": "compose",
    "steps": [
      { "tool": "web_search", "input": { "query": "$input.topic" } },
      { "tool": "generate_text", "input": { "prompt": "Summarize: $prev.output" } }
    ]
  }
}
```

**Sandbox mode** writes novel JavaScript in an isolated VM (128MB memory, 5s timeout). Blocked APIs: eval, Function, require, process, child_process, fs.write*.

```json
{
  "name": "parse_csv",
  "implementation": {
    "mode": "sandbox",
    "code": "function execute(input) { return input.csv.split('\\n').map(r => r.split(',')); }",
    "allowlist": []
  }
}
```

### LLM-as-Judge Verification

Every forged tool undergoes LLM-as-judge review before activation:

| Mode | When | What it checks |
|------|------|----------------|
| Creation review | First forge | Code safety, test correctness, determinism |
| Reuse validation | Each invocation | Output matches declared schema |
| Promotion panel | Tier upgrade | Independent safety + correctness reviewers |

### Tiered Promotion

| Tier | Scope | Promotion Rule |
|------|-------|----------------|
| Session | Current conversation only | Auto on creation + judge approval |
| Agent | Persisted across sessions | 5+ uses, confidence > 0.8, panel approved |
| Shared | All agents | Human approval required (HITL gate) |

## Example: Agent Forges a Tool During Chat

```
User: I need to convert temperatures between Celsius and Fahrenheit frequently.

Agent: I don't have a temperature conversion tool, but I can create one.
       [Calling forge_tool...]

       I've created "convert_temperature" — a sandboxed tool that converts
       between Celsius, Fahrenheit, and Kelvin. It passed safety review.

User: Convert 100°F to Celsius.

Agent: [Calling convert_temperature...]
       100°F = 37.78°C
```

The tool starts at **session** tier. After 5+ successful uses with >0.8 confidence, the agent can automatically promote it to **agent** tier for persistence.

## CLI Commands

```bash
wunderland emergent list              # List all emergent tools for the current agent
wunderland emergent inspect <id>      # Show source code, judge verdicts, usage stats
wunderland emergent promote <id>      # Promote to shared tier (requires human approval)
wunderland emergent demote <id>       # Deactivate a tool (preserved for audit)
wunderland emergent audit <id>        # Show full audit trail
```

## Safety Invariants

- Emergent tools **cannot** modify the guardrail pipeline
- Emergent tools **cannot** access other agents' memory or credentials
- Sandbox runs in an isolated V8 context with hard memory and timeout limits
- All forged code is logged to the audit trail
- Human approval is required for shared-tier promotion

## Configuration Reference

```typescript
{
  emergent: true,
  emergentConfig: {
    maxSessionTools: 10,       // max tools per session
    maxAgentTools: 50,         // max persisted per agent
    sandboxMemoryMB: 128,     // VM memory limit
    sandboxTimeoutMs: 5000,   // VM execution timeout
    promotionThreshold: { uses: 5, confidence: 0.8 },
    judgeModel: 'gpt-4o-mini',
    promotionJudgeModel: 'gpt-4o',
    allowedSandboxAPIs: [],   // e.g. ['fetch', 'crypto']
    fetchDomainAllowlist: [], // e.g. ['api.example.com']
  },
}
```
