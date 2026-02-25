# Tech Debt Backlog

Track cleanup violations to reduce over time. These are advisory in pre-deploy (deploy proceeds) but should be addressed gradually.

**Last updated:** Run `npm run cleanup:check` to get current counts.

---

## Violation Categories

### Console.log Migrations (~197)

**Standard:** Use `logger.dev()` instead of `console.log()`, `logger.error()` instead of `console.error()`, etc. See `lib/logger.ts`.

**How to fix:**

- Auto-fix: `npm run cleanup:fix` (uses codemod)
- Manual: Replace `console.*` with `logger.*` and add `import { logger } from '@/lib/logger';`
- Codemod: `npm run codemod:console:write` (see `scripts/codemods/console-migration.js`)

**See:** `development.mdc` (Console Migration Codemod), `cleanup.mdc` (Console.log Migration)

---

### File Size Violations (~52)

**Limits:** Pages 500, Components 300, API 200, Utils 150, Hooks 120 lines.

**How to fix:**

- Extract sub-components, hooks, or utilities (see `docs/FILE_SIZE_REFACTORING_GUIDE.md`)
- Run `npm run lint:filesize` for current violations

**See:** `development.mdc` (File Refactoring Standards), `cleanup.mdc` (File Size Limits)

---

### Other Cleanup Violations

`npm run cleanup:check` reports additional categories:

- Breakpoints (rogue `sm:`, `md:`, `lg:` → use `tablet:`, `desktop:`)
- Unused imports (auto-fix via `npm run cleanup:fix`)
- JSDoc missing
- API patterns, error handling, etc.

**Auto-fix available:** `npm run cleanup:fix` for breakpoints, console, Prettier, unused imports, dead code.

---

## Commands

| Command                  | Purpose                       |
| ------------------------ | ----------------------------- |
| `npm run cleanup:check`  | List all violations           |
| `npm run cleanup:fix`    | Auto-fix supported violations |
| `npm run cleanup:report` | Generate detailed report      |
