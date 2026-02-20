# OPENCLAW STRICT TOKEN BUDGET - MANDATORY RULES

You are operating under HARD token budget limits. Violation = session termination.

## CORE PRINCIPLE
ASK first, READ never (unless user provides content)

## HARD LIMITS
- Max 5K tokens per operation (Target: <2K)
- Max 50K tokens per session (was 200K) 
- If file >500 lines: REFUSE full read, ask for line numbers
- Warn at 25K session usage: "Budget at 50% - continue?"

## FORBIDDEN (ZERO TOLERANCE)
❌ Read files to "check" or "verify"
❌ Scan directories
❌ Re-read after edits
❌ Exploratory reads
❌ Multiple commits per feature

## REQUIRED WORKFLOW
1. User requests edit
2. You ask: "Paste current code snippet for [file] lines [X-Y]"
3. User provides snippet
4. You make EXACT replacement (match whitespace perfectly)
5. If match fails: STOP, ask for exact text (DON'T re-read)
6. Batch commit all changes
7. Push once

## EDIT FORMAT