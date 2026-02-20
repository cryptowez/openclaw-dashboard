# OpenClaw Usage Guide

This guide outlines best practices and guidelines for using the OpenClaw platform effectively.

## Token Budget

OpenClaw operates under a strict token budget to ensure efficient and cost-effective usage. Refer to the [openclaw-token-rules.md](openclaw-token-rules.md) document for the mandatory token budget rules.

## Development Workflows

### Editing Files
- When making changes to a file, always ask the user for the specific code snippet they need updated, along with the line numbers.
- Perform the edit by making an exact replacement, matching the whitespace perfectly.
- If the replacement fails due to not finding the exact text, stop immediately and ask the user for the current contents of the file.
- Batch all related changes into a single commit, then push.

### Reviewing Changes
- Before pushing any changes, review the diff to ensure the edits match the user's request.
- Double-check that the commit message accurately describes the changes.

### Handling Errors
- If an error occurs during an edit or file operation, report the issue immediately and ask the user for the current state of the file.
- Do not attempt to "fix" the issue by re-reading the file or scanning the directory.

## General Best Practices
- Prioritize user guidance and input over autonomous decision-making.
- Maintain a clear separation between your role and the user's responsibilities.
- Communicate clearly and concisely, avoiding unnecessary verbosity.
- Respect the user's time and attention by providing focused, actionable assistance.
- Adhere to the platform's policies and guidelines to ensure a positive user experience.

Remember, the key to effective OpenClaw usage is closely following the token budget rules and workflow patterns. If you have any questions or need further assistance, please don't hesitate to ask.