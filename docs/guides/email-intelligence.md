---
sidebar_position: 8
title: Email Intelligence
description: Connect Gmail for AI-powered email management with thread hierarchy, project detection, and natural language search.
---

# Email Intelligence

Connect your Gmail accounts to your Wunderbot for AI-powered email intelligence — thread hierarchy reconstruction, cross-thread project detection, natural language search, reports, and scheduled digests.

## Quick Start

### Agentic Setup (Recommended)

The easiest way to connect Gmail is to let the agent guide you. Just describe what you want in plain English:

```bash
wunderland "help me set up Gmail"
wunderland "I downloaded a Google client secret, help me connect"
wunderland "configure my email"
```

The agent knows what credentials Gmail needs (via bundled platform knowledge), can find downloaded `client_secret_*.json` files in your `~/Downloads` directory, parse them, and run the OAuth flow for you. This works from `wunderland chat` as well -- just ask during a conversation.

### CLI

```bash
wunderland connect gmail
```

Opens your browser for Google OAuth. Authorize access, and your Gmail is connected. That's it.

#### Using a downloaded client secret

If you downloaded your Google OAuth credentials JSON from the Cloud Console, point directly to it:

```bash
wunderland connect gmail --credentials ~/Downloads/client_secret_*.json
```

The command accepts both `{"installed": {...}}` and `{"web": {...}}` wrapper formats.

#### Auto-discovery

If no credentials are configured and no `--credentials` flag is provided, `wunderland connect gmail` automatically scans `~/Downloads` for `client_secret*.json` files and offers to use the newest one. Just download the file from the Google Cloud Console and re-run the command.

#### Environment variables

You can also set credentials via environment variables:

```bash
export GOOGLE_CLIENT_ID=your-client-id
export GOOGLE_CLIENT_SECRET=your-secret
wunderland connect gmail
```

### Dashboard (Rabbit Hole)

Navigate to **Dashboard → [Your Agent] → Email** and click **Connect Gmail**.

## Features

| Feature | Description |
|---------|-------------|
| **Gmail Sync** | Incremental polling via Gmail History API — only fetches changes |
| **Thread Hierarchy** | Reconstructs parent→child reply chains from RFC 2822 headers |
| **Project Detection** | Auto-groups related threads by participants and subjects |
| **Natural Language Search** | "What's happening with Project Alpha?" across all indexed email |
| **Attachment Extraction** | PDF, DOCX, XLSX text extraction (eager) + image transcription (deferred) |
| **Reports** | Export project summaries as PDF, Markdown, or JSON |
| **Scheduled Digests** | Daily/weekly email summaries delivered to any channel |
| **Multi-Inbox** | Connect multiple Gmail accounts with unified search |

## Chat Commands

Use these in `wunderland chat` or any connected channel:

| Command | Description |
|---------|-------------|
| *"What's the status of Project Alpha?"* | Natural language query — AI summarizes across threads |
| *"Any new emails from Sarah?"* | Filtered search by sender |
| *"Summarize the API redesign thread"* | Thread-level AI summary |
| `/email inbox` | Structured inbox view |
| `/email projects` | List auto-detected projects |
| `/email search <query>` | Semantic search across all email |
| `/email thread <id>` | Thread hierarchy detail |
| `/email report <project> pdf` | Generate PDF report |
| `/email sync status` | Check sync health |

## Dashboard Views

The Rabbit Hole dashboard provides three views at `/app/dashboard/[seedId]/email/`:

### Inbox Tab
Two-panel layout: thread list on the left, selected thread detail on the right. Includes search, project tag badges, attachment indicators, and AI thread summaries.

### Projects Tab
Card grid of auto-detected and manual project groupings. Each card shows thread count, message count, participants, and last activity. Click "Detect Projects" to trigger auto-detection.

### Intelligence Tab
Analytics dashboard with stat cards (unread, awaiting reply, active projects), stale thread alerts, sync health indicators, and a persistent AI chat widget for asking questions about your email.

## How It Works

### Sync Pipeline

```
Gmail API → Email Sync Service → Thread Reconstruction → RAG Indexing
                                                              ↓
                                                        Full-Text Search
                                                              ↓
User Query → RAG Search → LLM Summary → Response
```

1. **Initial sync**: Fetches up to 5,000 messages via Gmail API pagination
2. **Incremental sync**: Polls every 5 minutes using `history.list` (only changes)
3. **Thread reconstruction**: Builds parent→child trees from `In-Reply-To` and `References` headers
4. **RAG indexing**: Indexes email bodies and attachment text into per-agent FTS collections
5. **Project detection**: Clusters threads by participant overlap, subject similarity, and temporal proximity

### Attachment Processing

| Type | Processing | Timing |
|------|-----------|--------|
| PDF | Text extraction via `pdf-parse` | Eager (on sync) |
| DOCX | Text extraction via `mammoth` | Eager |
| XLSX | Cell data → structured text | Eager |
| Images | Vision LLM description | Deferred (on query) |
| Text/CSV/Code | Direct UTF-8 | Eager |

## Self-Hosted

`wunderland connect gmail` works everywhere — CLI, self-hosted, Docker. It uses browser-based OAuth with PKCE.

Three ways to provide Google OAuth credentials:

1. **`--credentials` flag** (easiest): `wunderland connect gmail --credentials ~/Downloads/client_secret_*.json`
2. **Auto-discovery**: Drop the JSON in `~/Downloads` and run `wunderland connect gmail` — it finds the file automatically.
3. **Environment variables**: Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for fully air-gapped or CI deployments.

## Configuration

Email intelligence is enabled by default when a Gmail account is connected. Configuration in `agent.config.json`:

```json
{
  "emailIntelligence": {
    "enabled": true,
    "syncIntervalMs": 300000,
    "attachmentProcessing": {
      "eagerTypes": ["pdf", "docx", "xlsx", "txt"],
      "deferredTypes": ["png", "jpg", "gif"]
    },
    "projectDetection": {
      "enabled": true,
      "autoApplyThreshold": 0.8
    }
  }
}
```

## API Reference

All endpoints under `/wunderland/email-intelligence/`:

- **Accounts**: list, status, connect, disconnect, trigger sync
- **Messages/Threads**: list, get, thread hierarchy, timeline
- **Projects**: CRUD, merge, detect, apply proposals, AI summary, timeline
- **Intelligence**: natural language query, dashboard stats
- **Attachments**: list, get, transcribe images
- **Reports**: generate project/thread reports (PDF/MD/JSON)
- **Digests**: CRUD, preview, send now

See the [full spec](https://github.com/manicinc/voice-chat-assistant/blob/master/docs/superpowers/specs/2026-03-19-email-intelligence-assistant-design.md) for complete endpoint documentation.
