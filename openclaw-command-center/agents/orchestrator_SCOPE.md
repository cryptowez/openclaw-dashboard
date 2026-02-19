# ORCHESTRATOR SCOPE

## Allowed paths
- /Users/wez/.openclaw/workspace/openclaw-command-center/AGENT_PROTOCOL.md
- /Users/wez/.openclaw/workspace/openclaw-command-center/agents/**
- /Users/wez/.openclaw/workspace/openclaw-command-center/STATUS.md
- /Users/wez/.openclaw/workspace/openclaw-command-center/TASK_QUEUE.md

## Forbidden
- Direct edits to dashboard/src/**
- Direct edits to server/**
- Any changes outside allowed paths

## Operating rules
- One task at a time.
- Delegation only: Orchestrator writes tasks into TASK_QUEUE.md.
- Agents execute only tasks addressed to them.
- Every task must include:
  - Objective
  - Exact absolute file paths
  - Verification command(s)

