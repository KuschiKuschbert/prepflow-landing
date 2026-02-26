# PrepFlow — Technical Debt Register

> Generated: 2025-02-26 during `improvement/skill-audit` audit run.  
> Items here could NOT be safely auto-fixed and require deliberate human review or a dedicated refactor sprint.

---

## 🔴 High Priority

### TD-001 — `lib/rsi/` widespread use of `console.*`

- **Scope:** 15+ files in `lib/rsi/` (auto-fix, self-optimization, safety, rule-evolution, feedback)
- **Detail:** RSI is a Node.js agent CLI tool; `console.*` is intentional. However, some files shadow the project `logger` pattern inconsistently. Future migration should standardise to a CLI-specific logger (e.g., `lib/logger.ts` `dev` level) to unify output across tools.
- **Risk:** Low (dev-time tool only, never deployed to production). No user-facing impact.
- **Fix:** Introduce a `cli-logger` wrapper that delegates to `logger.dev()` in dev and no-ops elsewhere. Migrate RSI files to use it.

### TD-002 — `scripts/` pervasive `console.*` (100+ files)

- **Scope:** All scripts in `scripts/` directory
- **Detail:** Node.js CLI scripts legitimately use `console.*`. However, mixing `console.log`, `console.error` inconsistently means some scripts silently swallow errors while others are too verbose.
- **Risk:** Low (scripts only, not production). Affects DX.
- **Fix:** Introduce a `scripts/lib/cli-logger.js` utility with consistent `info/warn/error/success` methods. Migrate scripts progressively.

### TD-003 — `contexts/NotificationContext.tsx` is 203 lines (over 120-line hook limit)

- **Scope:** `contexts/NotificationContext.tsx`
- **Detail:** File contains context definition, `NotificationProvider`, `NotificationContainer`, `Toast`, and `useNotification`. Re-classified as a component/context (300-line limit) rather than a hook during batch 1 audit. However, the Toast and NotificationContainer internal components could be extracted to `components/ui/NotificationToast.tsx` for cleaner separation.
- **Risk:** Medium (60+ files import from this path; any refactor must maintain `@/contexts/NotificationContext` as a re-export barrel).
- **Fix:** Extract `Toast` + `NotificationContainer` to `components/ui/` with the original file re-exporting. Update SKILL.md if done.

### TD-004 — `components/ui/CSVImportModal.tsx` generic `T = any` defaults

- **Scope:** `components/ui/CSVImportModal.tsx` lines 24 and 45
- **Detail:** Interface `CSVImportModalProps<T = any>` and function `CSVImportModal<T = any>` use unconstrained `any` as generic default. Justification comments added in batch 1, but the underlying type-safety gap remains. Callers should be passing concrete types.
- **Risk:** Low (type-erasure in callers; no runtime impact).
- **Fix:** Audit all usages of `CSVImportModal` and ensure each passes a concrete type. Consider adding a constraint: `T extends Record<string, unknown> = Record<string, unknown>`.

---

## 🟡 Medium Priority

### TD-005 — `lib/rsi/` architecture: RSI modules import `supabaseAdmin` directly

- **Scope:** Several `lib/rsi/` files
- **Detail:** RSI directly calls Supabase as a side-effect of running auto-fix/refactoring pipelines. This couples agent tooling to the live database, which is dangerous if RSI scripts are run in an environment with production credentials.
- **Risk:** Medium (mis-configuration could affect live data).
- **Fix:** RSI database calls should be gated behind a dev-only check (`if (process.env.NODE_ENV !== 'development') throw ...`) and use a separate read-only role where possible.

### TD-006 — No unit tests for most `lib/` utility modules

- **Scope:** `lib/ingredients/`, `lib/recipes/`, `lib/cache/`, `lib/api-error-handler.ts`, `lib/optimistic-updates.ts`
- **Detail:** These are the most-used utility files and have zero unit test coverage. The project targets 60% minimum / 80% goal coverage.
- **Risk:** Medium (regressions in core business logic not caught until E2E tests).
- **Fix:** Add Jest unit tests for pure functions in these utilities. Start with `lib/cache/data-cache.ts` and `lib/optimistic-updates.ts` as they are well-isolated.

### TD-007 — `lib/translations/de-DE.ts` is 892 lines (over 150-line utility limit)

- **Scope:** `lib/translations/de-DE.ts`
- **Detail:** Translation files are data files, not logic. The 150-line utility limit doesn't well-apply to translation files. However, there is no scalable strategy for adding further locales.
- **Risk:** Low (no logic, pure data). DX impact if file grows.
- **Fix:** Document in `data` file exceptions (alongside the existing `data-files: 2000 lines max` rule). If more locales are added, consider a JSON-based i18n system (e.g., `next-intl`).

### TD-008 — Hardcoded `window.innerWidth < 768` breakpoint in `PerformanceCharts.tsx`

- **Scope:** `app/webapp/performance/components/PerformanceCharts.tsx:51`
- **Detail:** Uses `window.innerWidth < 768` magic number for mobile detection instead of the project's custom `desktop:` breakpoint (1025px). Inconsistent with the design system.
- **Risk:** Low (UI only; charts may display as mobile at wrong breakpoint).
- **Fix:** Replace with `window.innerWidth < 1025` to match the `desktop:` breakpoint, or use a `useMediaQuery('(max-width: 1024px)')` hook.

---

## 🟢 Low Priority / Informational

### TD-009 — E2E test file size exemptions in `scripts/filesize-ignore.json`

- **Scope:** `e2e/helpers/form-helpers.ts` (304 lines) and `e2e/simulation/personas/action-handlers.ts` (314 lines)
- **Detail:** These files were added to `filesize-ignore.json` during the initial snapshot commit to bypass the pre-commit hook. They genuinely exceed the 300-line component limit.
- **Risk:** Low (test files only).
- **Fix:** When modifying these files, refactor them to extract sub-helpers and remove from the ignore list.

### TD-010 — `lib/landing-styles.ts` is 413 lines (over 150-line utility limit)

- **Scope:** `lib/landing-styles.ts`
- **Detail:** Landing style constants and utility functions in one file. Large but data-heavy.
- **Risk:** Low (pure data/constants).
- **Fix:** Split into `lib/landing-styles/constants.ts` and `lib/landing-styles/utils.ts` if the file continues to grow.

### TD-011 — `lib/populate-helpers/functions-data.ts` is 446 lines (over 150-line utility limit)

- **Scope:** `lib/populate-helpers/functions-data.ts`
- **Detail:** Seed data file for functions/events test data. Data files have a documented 2000-line exception, so this is within bounds but noted for awareness.
- **Risk:** None (dev-only data, never deployed as logic).

### TD-012 — No consistent API response wrapper for streaming endpoints

- **Scope:** `app/api/ai-specials/route.ts`, `app/api/ai/performance-tips/route.ts`
- **Detail:** AI streaming endpoints use `ReadableStream` directly rather than a wrapper. If the streaming response format changes, callers need updating individually.
- **Risk:** Medium (tight coupling between AI endpoint format and client components).
- **Fix:** Extract a `createStreamingResponse(stream)` utility that enforces consistent headers and error handling for all streaming endpoints.

---

## 📋 Items Requiring Human Decision

| ID     | File                               | Decision Needed                                         |
| ------ | ---------------------------------- | ------------------------------------------------------- |
| TD-003 | `contexts/NotificationContext.tsx` | Split Toast/Container to separate file vs keep as-is    |
| TD-004 | `CSVImportModal.tsx`               | Audit all generic callers and add type constraints      |
| TD-005 | `lib/rsi/`                         | Add dev-only guard + read-only Supabase role for RSI    |
| TD-006 | Multiple `lib/` files              | Prioritise unit test creation sprint                    |
| TD-008 | `PerformanceCharts.tsx`            | Align mobile breakpoint with design system (768 → 1024) |

---

_This register should be revisited quarterly. Items fixed should be removed and documented in the relevant `SKILL.md` retrofit log._
