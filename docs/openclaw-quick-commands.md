# OPENCLAW TOKEN-SAVING COMMANDS

## When bot wants to read files: "STOP - I'll paste the code. Wait for my snippet." 

## Before any operation: "Show estimated token cost first"

## If bot reads too much: "Use <5K tokens max - ask me for snippets instead"

## For edits: "I'll paste lines X-Y from [file]. Don't read it yourself."

## Budget check: "Show session token usage and cost so far"

## Reset if needed: "New task - reset context to 0K tokens"

## Hard stop: "STOP - too expensive. Ask for exact snippet only."

## Example workflow:
1. You: "Add dropdown to + button" 
2. Bot: "Paste current + button code from Sidebar.tsx"
3. You: [paste snippet]
4. Bot: [makes edit]
5. Bot: "💰 Est: 1.2K tokens (~$0.01) - Proceed?"
6. You: "y"
7. Bot: [commits + pushes]

## Cost comparison:
- ❌ Old way: Read entire file (40K tokens, $0.40)
- ✅ New way: User paste snippet (1K tokens, $0.01)
- 💰 Savings: 97.5%