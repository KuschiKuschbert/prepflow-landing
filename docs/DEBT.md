# 🧾 Technical Debt Ledger

> **Rule**: Do not add `// TODO` comments in the code (Limit: 50). Log them here instead.
> **Process**: The "Improver" persona should review this file and submit PRs to clear debt.

## High Priority

- [x] **[WEB]** Eradicate `any` types (Completed for targeted scope). Revisited & Fixed: `scripts/recipe-scraper`, `lib/cache`, `lib/feature-gate`, `lib/auth0-api-helpers`, `lib/populate-helpers`.
- [x] **[WEB]** Refactor `app/api/ingredients`- [x] Iteration 3: Dishes API (Type Safety) - **DONE**.
- [x] **[ANDROID]** Extract all hardcoded strings to `strings.xml` (Found 100+ instances of `Text("..")`).
- [x] **[WEB]** Replace `alert()` usage in `PassportIdPage` and `SettingsClient` with Toast notifications.
- [x] **[WEB]** Refactor `KitchenOnFire.tsx` and `DashboardSection.tsx` (Reduce complexity).
- [x] **[WEB]** Refactor `app/api/prep-lists` (Main CRUD) to use strict types (Phase 18).
- [x] **[WEB]** Refactor `app/api/menus` (105 `any` types) - **DONE**.
- [x] **[WEB]** Eradicate `any` types in `app/webapp` (Completed! Fixed top ~197 offenders and RSI handled the rest).
- [x] **[WEB]** Eradicate `any` types in `app/api` (Major success! Reduced from ~473 to ~25). Remaining ones are tricky/complex.

## Medium Priority

- [x] **[ANDROID]** Remove `Log.d` from `SupabaseManager.kt` (Security Leak).
- [ ] **[WEB]** Convert inline styles in Landing Page components to Tailwind classes (LandingBackground & GradientOrbs DONE).
- [x] **[WEB]** Optimize 15 large images in `public/` (>500KB).
- [ ] Review `scripts/pre-commit-check.sh` and ensure it handles edge cases (e.g. merge conflicts).
- [x] Verify `check:architecture` rules are strict enough for `lib` vs `components`.

## Low Priority

- [ ] Add more "Personas" for different coding styles (e.g. "Security Expert").
