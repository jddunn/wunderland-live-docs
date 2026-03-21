---
sidebar_position: 8
title: Email Intelligence
description: Connect Gmail for AI-powered email management with thread hierarchy, project detection, and natural language search.
---

# Email Intelligence

Connect your Gmail accounts to your Wunderbot for AI-powered email intelligence — thread hierarchy reconstruction, cross-thread project detection, natural language search, reports, and scheduled digests.

## Quick Start

### CLI

```bash
wunderland connect gmail
```

Opens your browser for Google OAuth. Authorize access, and your Gmail is connected. That's it.

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

`wunderland connect gmail` works everywhere — CLI, self-hosted, Docker. It uses browser-based OAuth with PKCE (no API keys to configure).

For fully air-gapped deployments, set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` environment variables with your own Google Cloud OAuth credentials.

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
