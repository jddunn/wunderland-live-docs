---
sidebar_position: 50
title: CLI Tools & Shell Execution
description: Agent shell execution, security tiers, and CLI discovery
---

# CLI Tools & Shell Execution

Wunderland agents can execute shell commands, manage files, and interact with host-installed CLIs through the **cli-executor** extension. This guide covers the available tools, security controls, CLI discovery, and best practices.

## Overview

The cli-executor extension provides **6 tools** that give agents controlled access to the host system:

| Tool | Description |
|------|-------------|
| `shell_execute` | Run any shell command with output capture |
| `file_read` | Read file contents from disk |
| `file_write` | Write or overwrite file contents |
| `list_directory` | List files and subdirectories at a given path |
| `create_spreadsheet` | Create xlsx or csv files from structured data |
| `create_document` | Create docx or pdf documents from text/markdown content |

### shell_execute

The primary tool. Accepts a `command` string (and optional `cwd` for working directory) and returns stdout, stderr, and exit code. Commands run in the host shell (`bash` by default, configurable).

```typescript
// Agent invocation
{
  "tool": "shell_execute",
  "input": {
    "command": "git status --porcelain",
    "cwd": "/home/user/project"
  }
}
```

### file_read / file_write

File I/O tools that respect the agent's configured workspace boundaries. `file_read` returns file contents as a string. `file_write` accepts a `path` and `content` string.

### list_directory

Lists the contents of a directory. Returns an array of entries with name, type (file/directory), and size.

### create_spreadsheet / create_document

Structured output tools for generating office-format documents. `create_spreadsheet` accepts rows/columns data and produces `.xlsx` or `.csv`. `create_document` accepts markdown or plain text and produces `.docx` or `.pdf`.

---

## Security Tiers

Every Wunderland agent operates under a **security tier** that determines what the cli-executor tools are allowed to do. There are five tiers, from most permissive to most restrictive:

| Tier | CLI Execution | File Writes | External APIs | Use Case |
|------|--------------|-------------|---------------|----------|
| `dangerous` | Allowed | Allowed | Allowed | Isolated testing only -- all security layers disabled |
| `permissive` | Allowed | Allowed | Allowed | Trusted dev environments with basic input screening |
| `balanced` | Allowed | Blocked | Allowed | **Recommended default** -- CLI access without file mutation |
| `strict` | Blocked | Blocked | Allowed | High-security -- no shell access, API calls only |
| `paranoid` | Blocked | Blocked | Blocked | Maximum isolation -- no host interaction at all |

### How Tiers Affect Tools

- **`dangerous` / `permissive`**: All 6 tools fully operational. `shell_execute` can run any command.
- **`balanced`**: `shell_execute` works but `file_write`, `create_spreadsheet`, and `create_document` are blocked unless the agent requests folder access through the HITL (human-in-the-loop) approval flow.
- **`strict` / `paranoid`**: `shell_execute`, `file_write`, `create_spreadsheet`, and `create_document` are all blocked. `file_read` and `list_directory` are blocked in `paranoid`.

### Setting the Tier

In `agent.config.json`:

```json
{
  "security": {
    "tier": "balanced"
  }
}
```

Or programmatically:

```typescript
import { createPipelineFromTier } from 'wunderland/advanced';

const pipeline = createPipelineFromTier('balanced');
orchestrator.registerGuardrail(pipeline);
```

---

## dangerouslySkipSecurityChecks

The cli-executor extension accepts a `dangerouslySkipSecurityChecks` flag that bypasses all command blocking and filesystem restrictions:

```typescript
createExtensionPack({
  options: {
    dangerouslySkipSecurityChecks: true, // DANGEROUS -- bypasses all security
  },
});
```

:::danger
This flag disables dangerous-command detection, filesystem boundary enforcement, and all permission checks. Only use it in fully isolated environments (containers, VMs, CI runners) where the agent cannot cause real damage. Never enable this in production or on shared systems.
:::

When this flag is **not** set (the default), the extension:
- Blocks known destructive commands (`rm -rf /`, `format`, `mkfs`, etc.)
- Restricts file operations to the agent's configured workspace directory
- Enforces the active security tier's permissions

---

## CLI Discovery

Wunderland includes a **CLI Registry** with 54 bundled CLI descriptors across 8 categories. The registry scans the host PATH for installed binaries and their versions.

### Categories

| Category | Count | Examples |
|----------|-------|---------|
| LLM | 5 | claude, gemini, ollama, lmstudio, aichat |
| Dev Tools | 10 | git, gh, docker, docker-compose, kubectl, terraform, make, jq, yq, tmux |
| Runtimes | 8 | node, python3, deno, bun, ruby, go, rustc, java |
| Package Managers | 7 | npm, pnpm, yarn, pip, uv, brew, cargo |
| Cloud | 9 | gcloud, aws, az, flyctl, vercel, netlify, railway, heroku, wrangler |
| Databases | 5 | psql, mysql, sqlite3, redis-cli, mongosh |
| Media | 5 | ffmpeg, ffprobe, magick, sox, yt-dlp |
| Networking | 5 | curl, wget, ssh, rsync, scp |

### Using the Registry

```typescript
import { CLIRegistry } from '@framers/agentos/sandbox/subprocess';

const registry = new CLIRegistry();

// Scan all registered CLIs
const results = await registry.scan();
for (const r of results) {
  if (r.installed) {
    console.log(`${r.displayName}: v${r.version} at ${r.binaryPath}`);
  }
}

// Check a specific binary
const git = await registry.check('git');
if (git.installed) {
  console.log(`Git v${git.version}`);
}

// Filter by category
const dbClis = await registry.byCategory('database');
```

### Adding Custom CLIs

Register additional CLIs at runtime or by adding JSON files to `src/sandbox/subprocess/registry/`:

```typescript
registry.register({
  binaryName: 'my-deploy',
  displayName: 'My Deploy Tool',
  description: 'Internal deployment automation',
  category: 'devtools',
  installGuidance: 'brew install my-deploy',
});
```

---

## Best Practices for Agent Shell Usage

1. **Use the `balanced` tier** for production agents. It allows CLI execution while preventing accidental file mutations.

2. **Scope agent workspaces**. Configure `agentWorkspace.agentId` so each agent's file operations are isolated to its own directory.

3. **Prefer structured tools over raw shell**. Use `file_read`/`file_write` instead of `cat`/`echo >` when possible -- they enforce workspace boundaries and produce cleaner logs.

4. **Set timeouts**. Configure `timeout` in the extension options (default 60s) to prevent runaway processes from blocking the agent.

5. **Audit shell usage**. Enable output signing (`balanced` tier or above) so all agent shell interactions have tamper-evident audit trails.

6. **Use `--bare` and `--porcelain` flags** when calling git or other CLIs that support machine-readable output. This produces cleaner, more parseable results for agents.

7. **Avoid interactive commands**. Agents cannot interact with stdin prompts. Use flags like `--yes`, `--force`, or `--non-interactive` where available.

---

## Troubleshooting

### "CLI not detected"

The CLI Registry reports a binary as not installed when `which <binary>` fails.

**Common causes:**
- The binary is not installed. Follow the `installGuidance` from the registry entry.
- The binary is installed but not on the current PATH. Verify with `echo $PATH` and ensure the binary's directory is included.
- On macOS, GUI-launched processes may have a different PATH than terminal sessions. Ensure `/usr/local/bin`, `/opt/homebrew/bin`, or the relevant directory is in the system PATH.
- The binary has an unexpected name (e.g., `python` vs `python3`, `docker-compose` vs `docker compose`).

**Fix**: Install the binary, or adjust PATH in your shell profile (`~/.bashrc`, `~/.zshrc`).

### "Permission denied"

The `shell_execute` tool returns a permission error.

**Common causes:**
- The active security tier (`strict` or `paranoid`) blocks CLI execution entirely.
- The binary lacks execute permissions. Run `chmod +x /path/to/binary`.
- The agent's workspace directory does not have write permissions for `file_write` operations.
- On Linux, AppArmor or SELinux may block execution.

**Fix**: Lower the security tier to `balanced` or `permissive`, or grant appropriate filesystem permissions.

### "Command blocked"

The cli-executor rejects a command as dangerous.

**Common causes:**
- The command matches the built-in blocklist (e.g., `rm -rf /`, `format`, `mkfs`, `:(){:|:&};:`).
- The command attempts to write files when the security tier blocks writes.
- The command targets a path outside the agent's configured workspace.

**Fix**: Review the command for safety. If the command is intentional and the environment is isolated, use the `dangerous` security tier or `dangerouslySkipSecurityChecks`.

### "Command timed out"

**Common causes:**
- The command is genuinely long-running (large build, network download).
- The command is waiting for interactive input that will never arrive.

**Fix**: Increase the `timeout` option in the extension configuration. Ensure the command uses non-interactive flags.
