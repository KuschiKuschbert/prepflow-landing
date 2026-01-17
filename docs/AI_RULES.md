# 🧠 The Project Brain (AI Rules)

> **Instructions**: Read this file first. It contains the DNA of this project.

## 0. 🗺️ Source of Truth (SSOT)

This document is the central orchestrator for all AI behaviors.

```mermaid
graph TD
    BRAIN["AI_RULES.md (The Brain)"]
    ARCH["PROJECT_ARCHITECTURE.md"]
    SCRIPTS["SCRIPTS.md"]
    LOOP["RALPH_LOOP.md"]
    PERSONA["docs/personas/"]

    BRAIN --> ARCH
    BRAIN --> SCRIPTS
    BRAIN --> LOOP
    BRAIN --> PERSONA
```

- **Architecture**: See [PROJECT_ARCHITECTURE.md](file:///Users/danielkuschmierz/Prepflow-Ecosystem/prepflow-web/docs/PROJECT_ARCHITECTURE.md)
- **Automation**: See [SCRIPTS.md](file:///Users/danielkuschmierz/Prepflow-Ecosystem/prepflow-web/docs/SCRIPTS.md)
- **Methodology**: See [RALPH_LOOP.md](file:///Users/danielkuschmierz/Prepflow-Ecosystem/prepflow-web/docs/methodology/RALPH_LOOP.md)

## 1. ⚡ Quick Commands

| Action           | Command                         | Description                                        |
| :--------------- | :------------------------------ | :------------------------------------------------- |
| **Commit Guard** | `./scripts/pre-commit-check.sh` | Runs Security, Health, Architecture checks (Fast). |
| **Verify All**   | `./scripts/safe-merge.sh`       | Runs Guards + Tests + Build (Slow).                |
| **Test**         | `npm test`                      | Runs 950+ smoke tests.                             |
| **Teleport**     | `npm run teleport`              | Dumps context for new sessions.                    |

## 2. 🎨 Coding Style (Strict)

- **Next.js 15**:
  - **Server Components**: Async by default.
  - **Params**: ALWAYS unwrap params (`await params` or `use(params)`).
  - **Client Components**: Use `'use client'` at the very top.
- **Styling**: Vanilla CSS or Tailwind (if requested). No CSS-in-JS libraries.
- **Structure**:
  - `components/`: Reusable UI only.
  - `lib/`: Business logic, helpers, API clients.
  - `hooks/`: React state logic.
  - `scripts/`: Automation (The Brain).

## 3. 🛡️ The Brain's Laws

1.  **No Secrets**: Do not hardcode API keys. Use `.env.local`. The Auditor will block you.
2.  **No Bloat**: Images > 500KB are forbidden in `public/`.
3.  **No Debt**: TODOs > 50 block the build.
4.  **No Circular Deps**: The Architect is watching.

## 4. 🧠 Memory Bank (Lessons Learned)

> **Self-Correction Rule**: If you fix a bug or learn a new pattern, you **MUST** add it to this list immediately.

- **[2026-01-05] Route Params**: Next.js 15 `params` are Promises. Accessing `.id` directly throws "undefined". Fix: `const { id } = await params`.
- **[2026-01-11] Massive Avatars**: Gemini generated images were ~5MB. We used `sips` to resize them to ~250KB.
- **[2026-01-11] Test Generation**: `import * as Module` is safer than named imports for smoke testing unknown files.
- **[2026-01-11] Import Hoisting**: Jest hoists ES6 imports. Use `require()` inside `beforeAll` to meaningfully mock `process.env`.
- **[2026-01-14] Ralph Loop**: For complex refactors and bugs, we use the **Ralph Wiggum Technique** (Iterate > Perfection). See [RALPH_LOOP.md](file:///Users/danielkuschmierz/Prepflow-Ecosystem/prepflow-web/docs/methodology/RALPH_LOOP.md).

## 5. 🔄 The Ralph Loop (Methodology)

For any task with high complexity or repeated failures, agents **MUST** follow the Ralph Loop:

1.  **Iterate Immediately**: Don't over-plan; failure is informative data.
2.  **State the Goal**: Define a clear "Completion Promise" (e.g., "DONE" or "TESTS PASSED").
3.  **Self-Correct**: Use error logs to update `task.md` and retry immediately.
4.  **Verify**: Never declare success without a terminal/browser check.

> Use the command **"Ralph this: [task]"** to trigger an autonomous improvement loop.

## 6. 🤖 Recursive Self-Improvement (RSI)

The RSI system matches the **Ralph Loop** methodology with autonomous tooling. It learns from your fixes and prevents regressions.

### Core RSI Commands

| Command              | Description                                                             |
| :------------------- | :---------------------------------------------------------------------- |
| `npm run rsi:status` | **ALWAYS CHECK THIS** before major refactors. Shows active rules.       |
| `npm run rsi:fix`    | Automatically applies learned fixes (linting, patterns, safety).        |
| `npm run rsi:run`    | Triggers the nightly self-improvement loop (Analysis -> Fix -> Evolve). |

### RSI Rules

1.  **Check Status**: Before starting a complex task, run `npm run rsi:status` to see if the RSI has warnings or advice for the current codebase state.
2.  **Prefer Auto-Fix**: If you see a lint error that looks common, try `npm run rsi:fix` first.
3.  **Respect the Config**: Rules in `rsi.eslint.config.mjs` are generated from successful valid patterns. Do not disable them manually; instead, fix the code to comply.
