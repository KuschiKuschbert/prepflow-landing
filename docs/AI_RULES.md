# 🧠 The Project Brain (AI Rules)

> **Instructions**: Read this file first. It contains the DNA of this project.

## 1. ⚡ Quick Commands
| Action | Command | Description |
| :--- | :--- | :--- |
| **Commit Guard** | `./scripts/pre-commit-check.sh` | Runs Security, Health, Architecture checks (Fast). |
| **Verify All** | `./scripts/safe-merge.sh` | Runs Guards + Tests + Build (Slow). |
| **Test** | `npm test` | Runs 950+ smoke tests. |
| **Teleport** | `npm run teleport` | Dumps context for new sessions. |

## 2. 🎨 Coding Style (Strict)
-   **Next.js 15**:
    -   **Server Components**: Async by default.
    -   **Params**: ALWAYS unwrap params (`await params` or `use(params)`).
    -   **Client Components**: Use `'use client'` at the very top.
-   **Styling**: Vanilla CSS or Tailwind (if requested). No CSS-in-JS libraries.
-   **Structure**:
    -   `components/`: Reusable UI only.
    -   `lib/`: Business logic, helpers, API clients.
    -   `hooks/`: React state logic.
    -   `scripts/`: Automation (The Brain).

## 3. 🛡️ The Brain's Laws
1.  **No Secrets**: Do not hardcode API keys. Use `.env.local`. The Auditor will block you.
2.  **No Bloat**: Images > 500KB are forbidden in `public/`.
3.  **No Debt**: TODOs > 50 block the build.
4.  **No Circular Deps**: The Architect is watching.

## 4. 🧠 Memory Bank (Lessons Learned)
> **Self-Correction Rule**: If you fix a bug or learn a new pattern, you **MUST** add it to this list immediately.

*   **[2026-01-05] Route Params**: Next.js 15 `params` are Promises. Accessing `.id` directly throws "undefined". Fix: `const { id } = await params`.
*   **[2026-01-11] Massive Avatars**: Gemini generated images were ~5MB. We used `sips` to resize them to ~250KB.
*   **[2026-01-11] Test Generation**: `import * as Module` is safer than named imports for smoke testing unknown files.
*   **[2026-01-11] Import Hoisting**: Jest hoists ES6 imports. Use `require()` inside `beforeAll` to meaningfully mock `process.env`.
