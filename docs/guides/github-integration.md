---
title: GitHub Integration
sidebar_position: 13
---

# GitHub Integration

Wunderland includes 26 GitHub tools that give agents full repository management capabilities directly from the terminal. All tools are available in `wunderland chat` and can be composed into workflows with `wunderland emergent`.

---

## Setup

Set your GitHub personal access token:

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The token requires these scopes:

| Scope | Required For |
|-------|-------------|
| `repo` | Repository read/write, issues, pull requests |
| `workflow` | GitHub Actions triggers |
| `read:org` | Listing organization repos (optional) |

Verify the token is detected:

```bash
wunderland doctor
```

The doctor output shows GitHub tool availability under the "Tools" section.

---

## Available Tools (26)

### Repository Management

| Tool | Description |
|------|-------------|
| `github_repo_list` | List repos for the authenticated user or an organization |
| `github_repo_create` | Create a new repository |
| `github_repo_info` | Get detailed info about a specific repo |
| `github_repo_delete` | Delete a repository (requires admin scope) |
| `github_repo_clone` | Clone a repo to the agent's workspace |

### Pull Requests

| Tool | Description |
|------|-------------|
| `github_pr_list` | List open/closed/all PRs for a repo |
| `github_pr_create` | Create a new pull request |
| `github_pr_review` | Submit a review (approve, request changes, comment) |
| `github_pr_merge` | Merge a pull request |
| `github_pr_close` | Close a pull request without merging |
| `github_pr_diff` | Get the diff for a pull request |
| `github_pr_comments` | List or add comments on a pull request |

### Issues

| Tool | Description |
|------|-------------|
| `github_issue_list` | List issues with label/state/assignee filters |
| `github_issue_create` | Create a new issue |
| `github_issue_update` | Update title, body, labels, or assignees |
| `github_issue_close` | Close an issue |
| `github_issue_comment` | Add a comment to an issue |

### Branches and Commits

| Tool | Description |
|------|-------------|
| `github_branch_list` | List branches for a repo |
| `github_branch_create` | Create a new branch from a ref |
| `github_branch_delete` | Delete a branch |
| `github_commit_list` | List commits on a branch |
| `github_commit_info` | Get details for a specific commit |

### Actions and Releases

| Tool | Description |
|------|-------------|
| `github_actions_list` | List workflow runs for a repo |
| `github_actions_trigger` | Trigger a workflow dispatch event |
| `github_release_list` | List releases for a repo |
| `github_release_create` | Create a new release with tag |

---

## Usage in Chat

```bash
wunderland chat
> List my open pull requests on jddunn/wunderland
> Review PR #42 -- check for security issues and suggest improvements
> Create an issue titled "Add retry logic to video generation" with label "enhancement"
> Show me the last 5 commits on the master branch
```

The agent selects the appropriate GitHub tool, constructs the API call, and returns structured results.

---

## Forged Tool Workflows

Use `wunderland emergent` to create reusable GitHub automation:

```bash
wunderland chat
> Create a workflow that reviews all open PRs on a repo, posts review comments,
> and merges any that pass all checks

wunderland emergent list --seed my-agent
# Shows the forged "pr-review-and-merge" workflow

wunderland emergent export pr-review-and-merge --seed my-agent --output ./pr-bot.emergent-tool.yaml
```

Forged tools that use GitHub are portable -- export them and import into other agents:

```bash
wunderland emergent import ./pr-bot.emergent-tool.yaml --seed another-agent
```

---

## Security Considerations

- GitHub tools are risk tier 2 (async review). In default security mode, the agent requests approval before mutating operations (create, merge, delete).
- Use `--overdrive` to auto-approve tool calls for trusted automation.
- The `github_repo_delete` and `github_branch_delete` tools are risk tier 3 and always require explicit confirmation unless `--dangerously-skip-permissions` is set.
- All GitHub API calls are logged in the session log at `./logs/YYYY-MM-DD/*.log`.
