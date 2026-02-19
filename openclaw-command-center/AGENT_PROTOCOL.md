# Agent Protocol

## Agents
- Orchestrator
- Frontend-Agent
- Backend-Agent
- Integration-Agent
- Reporting-Agent

## Routing Rules
1. Orchestrator is the only agent allowed to assign tasks.
2. One task at a time. No parallel work.
3. Agents may only touch files/folders explicitly allowed for their role.
4. Every agent must return:
   - DONE
   - Changed files list
   - How to run/verify

## Folder Ownership (Allowlists)

### Frontend-Agent (allowed)
- /Users/wez/.openclaw/workspace/openclaw-command-center/dashboard/src/**
- /Users/wez/.openclaw/workspace/openclaw-command-center/dashboard/public/**
- /Users/wez/.openclaw/workspace/openclaw-command-center/dashboard/index.html
- /Users/wez/.openclaw/workspace/openclaw-command-center/dashboard/vite.config.*

### Backend-Agent (allowed)
- /Users/wez/.openclaw/workspace/openclaw-command-center/server/**

### Integration-Agent (allowed)
- /Users/wez/.openclaw/workspace/openclaw-command-center/dashboard/src/api.ts
- /Users/wez/.openclaw/workspace/openclaw-command-center/dashboard/.env*
- /Users/wez/.openclaw/workspace/openclaw-command-center/server/.env*
- /Users/wez/.openclaw/workspace/openclaw-command-center/.env*
- /Users/wez/.openclaw/workspace/openclaw-command-center/package*.json
- /Users/wez/.openclaw/workspace/openclaw-command-center/dashboard/package*.json
- /Users/wez/.openclaw/workspace/openclaw-command-center/server/package*.json

### Reporting-Agent (allowed)
- /Users/wez/.openclaw/workspace/openclaw-command-center/STATUS.md
- /Users/wez/.openclaw/workspace/openclaw-command-center/**/run-*.log
- /Users/wez/.openclaw/workspace/openclaw-command-center/**/runs/**

## STOP Conditions
Stop and request the next command if:
- Any required file is missing
- Local repo does not match expected state
- Build or verification fails
- An edit would overwrite existing UI without backup
