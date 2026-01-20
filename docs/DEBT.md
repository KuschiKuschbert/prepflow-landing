# 🧾 Technical Debt Ledger

> **Rule**: Do not add `// TODO` comments in the code (Limit: 50). Log them here instead.
> **Process**: The "Improver" persona should review this file and submit PRs to clear debt.

## High Priority

- [x] Sanitize logs in `lib/rsi/auto-fix/fix-orchestrator.ts` <!-- id: 105 -->
- [x] Implement Zod validation for `app/api/auth/error/route.ts` <!-- id: 102 -->

- [x] **[WEB]** Eradicate `any` types (Mission Accomplished). Final count: 0 (explicit/justified only).
- [x] **[WEB]** Refactor `app/api/ingredients`- [x] Iteration 3: Dishes API (Type Safety) - **DONE**.
- [x] **[ANDROID]** Extract all hardcoded strings to `strings.xml` (Found 100+ instances of `Text("..")`).
- [x] **[WEB]** Replace `alert()` usage in `PassportIdPage` and `SettingsClient` with Toast notifications.
- [x] **[WEB]** Refactor `KitchenOnFire.tsx` and `DashboardSection.tsx` (Reduce complexity).
- [x] **[WEB]** Refactor `app/api/prep-lists` (Main CRUD) to use strict types (Phase 18).
- [x] **[WEB]** Refactor `app/api/menus` (105 `any` types) - **DONE**.
- [x] **[WEB]** Eradicate `any` types in `app/webapp` (Completed).
- [x] **[WEB]** Eradicate `any` types in `app/api` (Completed).
- [x] **[RSI]** Refactor 536 detected anti-patterns (Focus: Deep Nesting in API routes). See `reports/rsi-architecture-analysis.md`. (Mission Accomplished: Batches 1-12 completed).
- [x] **[RSI]** Audit & Refactor "Magic Numbers" (Batch 13) - Created `lib/constants.ts`.
- [x] **[RSI]** Reduce Complexity in `populate-recipes-data.ts` (Batch 14) - Extracted data modules.
- [x] **[RSI]** Deep Scan for Magic Numbers & Complexity (Batch 16) - Cleaned up Constants & UI.
- [x] **[RSI]** Complexity Reduction (Pages & Drawers) (Batch 17) - Cleaning, Suppliers, DishDrawer.
- [x] **[RSI]** Complexity Reduction II (Batch 18) - Cleaned up AI Specials, Par Levels.
- [x] **[RSI]** Complexity Reduction III (Batch 19) - Refactored Client Components.
- [x] **[RSI]** High Priority Complexity Cleanup (Batch 20) - RSI Core & Employee Module Refactored.
- [x] **[RSI]** Magic Numbers Sweep & Polish (Batch 21) - Square Sync & Global Audit.

## Medium Priority

- [x] **[ANDROID]** Remove `Log.d` from `SupabaseManager.kt` (Security Leak).
- [x] **[WEB]** Convert inline styles in Landing Page components to Tailwind classes (LandingBackground & GradientOrbs DONE).
- [x] **[WEB]** Optimize 15 large images in `public/` (>500KB).
- [x] **[RSI]** Standardize Zod validation in `app/api/prep-lists`
- [x] **[RSI]** Remove unused imports in all components
- [ ] Review `scripts/pre-commit-check.sh` and ensure it handles edge cases (e.g. merge conflicts).
- [x] Verify `check:architecture` rules are strict enough for `lib` vs `components`.

## Low Priority

- [ ] Add more "Personas" for different coding styles (e.g. "Security Expert").
