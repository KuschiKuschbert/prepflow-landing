# 🔄 Methodology (Ralph Loop & RSI)

## The Ralph Loop

For any task with high complexity or repeated failures, follow the Ralph Loop:

1.  **Iterate Immediately**: Don't over-plan; failure is informative data.
2.  **State the Goal**: Define a clear "Completion Promise" (e.g., "DONE" or "TESTS PASSED").
3.  **Self-Correct**: Use error logs to update `task.md` and retry immediately.
4.  **Verify**: Never declare success without a terminal/browser check.

> Use the command **"Ralph this: [task]"** to trigger an autonomous improvement loop.

## Recursive Self-Improvement (RSI)

The RSI system matches the methodology with autonomous tooling.

### Core RSI Commands

| Command              | Description                                                             |
| :------------------- | :---------------------------------------------------------------------- |
| `npm run rsi:status` | Shows active rules and advice for the current codebase state.           |
| `npm run rsi:fix`    | Automatically applies learned fixes (linting, patterns, safety).        |
| `npm run rsi:run`    | Triggers the nightly self-improvement loop.                             |
