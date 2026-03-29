---
sidebar_label: Document Export
sidebar_position: 14
---

# Document Export

The Document Export extension generates professional PDF, DOCX, PPTX, CSV, and XLSX documents from structured content. It ships as `@framers/agentos-ext-document-export` and provides two tools -- `document_export` for generation and `document_suggest` for format recommendation.

No API keys required. The extension is built-in and available to all agents.

## Quick Start

In `wunderland chat`, the agent can export any substantive response:

```
You: Research the history of the internet and give me a report.
Agent: [produces research]... I can export this as PDF, DOCX, or PPTX. Want me to?
You: PDF please.
Agent: Done! Download your report: http://localhost:3777/exports/2026-03-28T12-00-00-history-of-the-internet.pdf
```

## Supported Formats

| Format | Extension | Best For | Key Features |
|--------|-----------|----------|--------------|
| **PDF** | `.pdf` | Reports, research, formal documents | Cover page, headers/footers, page numbers, styled tables, inline markdown, images, charts |
| **DOCX** | `.docx` | Editable documents for Word/Google Docs | Same content as PDF, fully editable, themed table headers, numbered/bulleted lists |
| **PPTX** | `.pptx` | Presentations, pitch decks, summaries | 5 themes, 7 slide layouts, native charts, speaker notes, slide numbers, embedded images |
| **CSV** | `.csv` | Data export, spreadsheet import | RFC 4180 compliant, multiple table blocks separated by blank rows |
| **XLSX** | `.xlsx` | Formatted spreadsheets | Multi-sheet, styled headers, auto-SUM formulas, numeric detection, frozen header rows |

## Tools

### `document_export`

Generate a document from structured content.

**Input:**

```json
{
  "format": "pdf",
  "content": {
    "title": "Q4 Revenue Analysis",
    "subtitle": "Fiscal Year 2026",
    "author": "Research Team",
    "date": "2026-03-28",
    "theme": "corporate",
    "sections": [
      {
        "heading": "Executive Summary",
        "level": 1,
        "paragraphs": [
          "Revenue grew **23%** year-over-year, driven by enterprise expansion.",
          "See the [full methodology](https://example.com/methods) for details."
        ]
      },
      {
        "heading": "Revenue by Region",
        "level": 2,
        "table": {
          "headers": ["Region", "Q3", "Q4", "Growth"],
          "rows": [
            ["North America", "4.2M", "5.1M", "+21%"],
            ["Europe", "2.8M", "3.5M", "+25%"],
            ["Asia Pacific", "1.5M", "2.0M", "+33%"]
          ]
        },
        "chart": {
          "type": "bar",
          "title": "Q4 Revenue by Region",
          "data": [
            {
              "label": "Q3",
              "values": [4.2, 2.8, 1.5],
              "categories": ["NA", "EU", "APAC"]
            },
            {
              "label": "Q4",
              "values": [5.1, 3.5, 2.0],
              "categories": ["NA", "EU", "APAC"]
            }
          ]
        }
      },
      {
        "heading": "Key Metrics",
        "level": 2,
        "keyValues": [
          { "key": "Total Revenue", "value": "$10.6M" },
          { "key": "YoY Growth", "value": "23%" },
          { "key": "New Customers", "value": "847" }
        ]
      }
    ]
  },
  "options": {
    "pageSize": "a4",
    "orientation": "portrait",
    "coverPage": true,
    "pageNumbers": true
  }
}
```

**Output:**

```json
{
  "filePath": "/workspace/exports/2026-03-28T12-00-00-q4-revenue-analysis.pdf",
  "downloadUrl": "http://localhost:3777/exports/2026-03-28T12-00-00-q4-revenue-analysis.pdf",
  "previewUrl": "http://localhost:3777/exports/2026-03-28T12-00-00-q4-revenue-analysis.pdf/preview",
  "format": "pdf",
  "sizeBytes": 48256,
  "filename": "2026-03-28T12-00-00-q4-revenue-analysis.pdf"
}
```

### `document_suggest`

Analyse a response to determine if export should be offered. No LLM call -- pure heuristic.

```json
{
  "responseText": "Full analysis text...",
  "wordCount": 850,
  "hasTableData": true,
  "hasSections": true,
  "isAnalytical": false
}
```

**Rules:**
- 500+ words -> PDF, DOCX
- Tabular data -> CSV, XLSX
- Distinct sections -> PPTX
- Analytical/quantitative -> PDF, XLSX
- Minimum 200 words before any suggestion

## Content Sections

Each section in `content.sections[]` can contain any combination of:

| Field | Type | Description |
|-------|------|-------------|
| `heading` | `string` | Section heading text |
| `level` | `1 \| 2 \| 3` | Heading depth (H1/H2/H3) |
| `paragraphs` | `string[]` | Body text with inline markdown (`**bold**`, `*italic*`, `[link](url)`) |
| `table` | `{ headers, rows }` | Tabular data rendered as a formatted table |
| `chart` | `{ type, data, title? }` | Embedded chart (bar, line, pie, doughnut, area, scatter) |
| `list` | `{ items, ordered? }` | Bulleted or numbered list |
| `keyValues` | `[{ key, value }]` | Definition table (rendered as two-column table) |
| `image` | `{ url?, base64?, caption?, width? }` | Embedded image from URL or data URI |
| `speakerNotes` | `string` | PPTX only -- notes attached to the slide |
| `layout` | `string` | PPTX only -- slide layout hint |

## Slide Themes

Five built-in themes control colours, fonts, and chart palettes across all generators:

| Theme | Background | Accent | Use Case |
|-------|-----------|--------|----------|
| `dark` | Deep navy (#1a1a2e) | Cyan (#00d4ff) | Conference talks, tech demos |
| `light` | White (#ffffff) | Blue (#2563eb) | General purpose, academic (default) |
| `corporate` | Light grey (#f8f9fa) | Bootstrap blue (#0d6efd) | Business reports, quarterly reviews |
| `creative` | Warm amber (#fef3c7) | Gold (#f59e0b) | Marketing, workshops, pitches |
| `minimal` | White (#ffffff) | Grey (#6b7280) | Data-focused, research, monochrome |

Set the theme in the content object:

```json
{
  "content": {
    "title": "Product Launch",
    "theme": "creative",
    "sections": [...]
  }
}
```

## Chart Rendering

Charts are rendered natively in PPTX (via pptxgenjs). In PDF and DOCX, charts are rendered as styled data tables with ASCII bar visualisations for bar/line/area types and percentage columns for pie/doughnut types.

**Supported chart types:**

| Type | Description | Columns in PDF/DOCX |
|------|-------------|---------------------|
| `bar` | Vertical bar comparison | Category, Dataset values, ASCII bar |
| `line` | Trend over categories | Category, Dataset values, ASCII bar |
| `area` | Filled line chart | Category, Dataset values, ASCII bar |
| `pie` | Proportional slices | Label, Value, Percentage |
| `doughnut` | Pie with centre hole | Label, Value, Percentage |
| `scatter` | X/Y data points | Dataset, X, Y |

**Chart data structure:**

```json
{
  "chart": {
    "type": "pie",
    "title": "Market Share",
    "data": [
      {
        "label": "2026",
        "values": [45, 30, 15, 10],
        "categories": ["Product A", "Product B", "Product C", "Other"]
      }
    ]
  }
}
```

## Slide Layouts

For PPTX generation, each section can specify a `layout` hint:

| Layout | Description |
|--------|-------------|
| `title` | Large centred title slide (use for openers) |
| `content` | Standard title + body (default) |
| `two-column` | Side-by-side content columns |
| `image-left` | Image on left, text on right |
| `image-right` | Image on right, text on left |
| `chart-full` | Full-bleed chart slide |
| `comparison` | Two-panel comparison layout |

## Export Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `filename` | `string` | Slugified title | Custom output filename (without extension) |
| `pageSize` | `letter \| a4 \| legal` | `letter` | Page size for PDF/DOCX |
| `orientation` | `portrait \| landscape` | `portrait` | Page orientation |
| `coverPage` | `boolean` | `true` | Whether to generate a cover/title page |
| `pageNumbers` | `boolean` | `true` | Whether to show page numbers in footer |

## Integration with Missions

Document export fits naturally at the end of research and analysis pipelines. Use the `document_export` tool in the final phase of a mission to produce deliverables.

```yaml
name: quarterly-analysis
goal: "Analyse Q4 data and produce an executive report"
planner:
  strategy: parallel-then-linear
phases:
  - name: research
    parallel: true
    steps:
      - tool: web_search
        input: { query: "industry trends Q4 2026" }
      - tool: deep_research
        input: { query: "competitor analysis Q4", depth: moderate }
  - name: synthesize
    steps:
      - tool: self_evaluate
        input: { criteria: [accuracy, completeness] }
  - name: export
    steps:
      - tool: document_export
        input:
          format: pdf
          content: "{{synthesized_report}}"
          options: { coverPage: true, pageNumbers: true }
      - tool: document_export
        input:
          format: pptx
          content: "{{executive_slides}}"
          options: { coverPage: true }
```

## CLI Usage

In `wunderland chat`, the agent automatically has access to both tools. Ask for exports naturally:

```
You: Summarize the latest AI research papers and export as a PDF.
You: Turn that analysis into a slide deck with the corporate theme.
You: Export the data as an Excel spreadsheet.
You: Can you make a Word doc version of that report?
```

The agent uses `document_suggest` internally to proactively offer exports after long, structured, or data-heavy responses.

## File Management

Exported files are saved to `{workspaceDir}/exports/` with timestamped filenames:

```
exports/
  2026-03-28T12-00-00-q4-revenue-analysis.pdf
  2026-03-28T12-05-30-market-overview.pptx
  2026-03-28T12-10-15-sales-data.xlsx
```

The `ExportFileManager` handles:
- Automatic directory creation
- Timestamped, slugified filenames to avoid collisions
- Download URL generation (`/exports/{filename}`)
- Preview URL generation (`/exports/{filename}/preview`)
- File listing, resolution, and deletion

Previews are format-specific: CSV and XLSX render as HTML tables (first 10 rows); PDF, DOCX, and PPTX show a plain-text size summary.
