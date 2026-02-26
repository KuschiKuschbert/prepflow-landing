# Dev Log

## 2026-02-25

- **refactor: TypeScript any migration (Phases 1–3 complete)** – Replaced `any` with proper types across ~70 files per plan. Phase 1 API routes: supabase→SupabaseClient, theme→ExportTheme, changeDetails→Record<string, unknown>, normalizedIngredients→NormalizedIngredient[], backupData→BackupData, fetchDishRecipes Map typed. Phase 2 lib: bulk-action-handlers, square/sync/costs, analytics/types, ai/groq response-parser, recipes/logger, demo-mode, personality/scheduler-events, backup/getUserTablesWithData. Phase 3: ScrollReveal Variants, useIngredientDataSync IngredientsQueryParams, useParLevelsExport ParLevel[], buildDocuments return type, staff EmployeeForm onSubmit(formData), billing SubscriptionDetailsProps. Some justified any kept (auth0, square SDK, cleaning-tasks query). Docs: TYPESCRIPT_ANY_MIGRATION.md created and updated.
- **refactor: TypeScript any migration – final 9 unjustified any fixed** – providers.tsx: requestIdleCallback fallback typed as `(cb: () => void) => void`; recipe-processor: `Promise<{ totalProcessed: number }>`; generate-pdf: ChromiumLaunchOptions; fetchPaginatedTasks: RangableQuery; syncFromSquare: TeamSearchable; factory: ConstructorParameters. Docs: SCRIPTS.md (audit:any), AGENTS.md (Critical Reminder #7), TECH_DEBT_BACKLOG.md (any types). `npm run audit:any` reports 0 unjustified instances.

## 2026-02-25

- **fix: trim menu-dishes route for file size (207→191)**
- **refactor: file size compliance, TypeScript fixes, docs update**: - File size: 7 files refactored (haversine, error-categorizer-rules,
  useDishFormData/helpers, action-handlers/detailHandlers, day-profiles-data)
  - useIngredientOperations, useDishFormData merge, normalizeIngredientConstants
- TS: Add logger to roster/templates; validate ExportTheme in recipe-cards/export
- Docs: DEV_LOG, AGENTS, FEATURE_IMPLEMENTATION, MEMORY, TROUBLESHOOTING_LOG,
  FILE_SIZE_REFACTORING_GUIDE
- **fix: add missing useGeolocation hook (fixes Vercel build)**
- **feat: production-ready deployment guards**: - Make cleanup advisory in pre-deploy (no longer blocks deploy)
- Add format + commit after dev:log in safe-merge
- Add format:check to pre-push hook
- Add docs/TECH_DEBT_BACKLOG.md for gradual fixes
- **fix: format docs/DEV_LOG.md for CI**

- **refactor: file size compliance – 7 files refactored**: All files now pass `npm run lint:filesize`. Extractions: (1) `lib/utils/haversine.ts` from time-attendance/clock-out; (2) `lib/recipes/utils/error-categorizer-rules.ts` from error-categorizer; (3) `app/webapp/recipes/hooks/useDishFormData/helpers.ts` from useDishFormData; (4) `e2e/simulation/personas/action-handlers/detailHandlers.ts` from action-handlers; (5) `e2e/simulation/personas/day-profiles-data.ts` (Action type + CAFE/RESTAURANT/FOOD_TRUCK_DAY_PROFILE) from day-profiles. Minor trims: useIngredientOperations, useIngredientsClientController. Removed unused collectPageErrors import from action-handlers.
- **feat: production-ready deployment guards**: - Make cleanup advisory in pre-deploy (no longer blocks deploy)
- Add format + commit after dev:log in safe-merge
- Add format:check to pre-push hook
- Add docs/TECH_DEBT_BACKLOG.md for gradual fixes
- **fix: format docs/DEV_LOG.md for CI**
- **chore: update bundle baseline for performance page overhaul (+38KB)**
- **feat(performance): performance page overhaul with drill-down, menu filter, and optimizations**: - Split PerformanceChartsLazy into dedicated chart components
- Add chartDataTransformers with single-pass aggregation
- Extract weather utils to weatherChartUtils.ts (file size compliance)
- Add menu filter UI and prefetch with default date range
- Consolidate API logic in performance service
- Add drill-down from category cards/pie segments with scroll-to-table
- Add active filter banner and filtered export/print
- Fix CSV import: bulkImportSalesData for salesData format
- **docs: update DEV_LOG with merged commits**

- **chore: update bundle baseline for performance page overhaul (+38KB)**
- **feat(performance): performance page overhaul with drill-down, menu filter, and optimizations**: - Split PerformanceChartsLazy into dedicated chart components
- Add chartDataTransformers with single-pass aggregation
- Extract weather utils to weatherChartUtils.ts (file size compliance)
- Add menu filter UI and prefetch with default date range
- Consolidate API logic in performance service
- Add drill-down from category cards/pie segments with scroll-to-table
- Add active filter banner and filtered export/print
- Fix CSV import: bulkImportSalesData for salesData format
- **docs: update DEV_LOG with merged commits**
- **feat: weather-based operational tips across app**: - Add WeatherOperationalTip component (dashboard, prep-lists, order-lists, par-levels)
- Add FunctionsWeatherAlerts for rainy-day event alerts (next 7 days)
- Add PerformanceWeatherInsight for days-like-today comparison
- Wire weather context into AI Specials prompt
- Add prefetch for weather endpoints
- Add WeatherWidget to navigation header
- Add Open-Meteo integration, operational-tip mapping, daily weather APIs
- Add supabase migration for daily_weather_logs
- Extract wmo-codes and venue-coordinates for file size compliance
- **chore(deps): bump tailwindcss from 4.1.18 to 4.2.1**: Bumps [tailwindcss](https://github.com/tailwindlabs/tailwindcss/tree/HEAD/packages/tailwindcss) from 4.1.18 to 4.2.1.
- [Release notes](https://github.com/tailwindlabs/tailwindcss/releases)
- [Changelog](https://github.com/tailwindlabs/tailwindcss/blob/main/CHANGELOG.md)
- [Commits](https://github.com/tailwindlabs/tailwindcss/commits/v4.2.1/packages/tailwindcss)
- **updated-dependencies:**: - dependency-name: tailwindcss
  dependency-version: 4.2.1
  dependency-type: direct:development
  update-type: version-update:semver-minor
  ...

- **feat: weather-based operational tips across app**: - Add WeatherOperationalTip component (dashboard, prep-lists, order-lists, par-levels)
- Add FunctionsWeatherAlerts for rainy-day event alerts (next 7 days)
- Add PerformanceWeatherInsight for days-like-today comparison
- Wire weather context into AI Specials prompt
- Add prefetch for weather endpoints
- Add WeatherWidget to navigation header
- Add Open-Meteo integration, operational-tip mapping, daily weather APIs
- Add supabase migration for daily_weather_logs
- Extract wmo-codes and venue-coordinates for file size compliance
- **chore(deps): bump tailwindcss from 4.1.18 to 4.2.1**: Bumps [tailwindcss](https://github.com/tailwindlabs/tailwindcss/tree/HEAD/packages/tailwindcss) from 4.1.18 to 4.2.1.
- [Release notes](https://github.com/tailwindlabs/tailwindcss/releases)
- [Changelog](https://github.com/tailwindlabs/tailwindcss/blob/main/CHANGELOG.md)
- [Commits](https://github.com/tailwindlabs/tailwindcss/commits/v4.2.1/packages/tailwindcss)
- **updated-dependencies:**: - dependency-name: tailwindcss
  dependency-version: 4.2.1
  dependency-type: direct:development
  update-type: version-update:semver-minor
  ...
- **chore(rsi): automated self-improvement cycle (#73)**
- **chore(deps): bump @tanstack/react-query from 5.90.20 to 5.90.21**: Bumps [@tanstack/react-query](https://github.com/TanStack/query/tree/HEAD/packages/react-query) from 5.90.20 to 5.90.21.
- [Release notes](https://github.com/TanStack/query/releases)
- [Changelog](https://github.com/TanStack/query/blob/main/packages/react-query/CHANGELOG.md)
- [Commits](https://github.com/TanStack/query/commits/@tanstack/react-query@5.90.21/packages/react-query)
- **updated-dependencies:**: - dependency-name: "@tanstack/react-query"
  dependency-version: 5.90.21
  dependency-type: direct:production
  update-type: version-update:semver-patch
  ...
- **chore(deps): bump framer-motion from 12.31.0 to 12.34.3**: Bumps [framer-motion](https://github.com/motiondivision/motion) from 12.31.0 to 12.34.3.
- [Changelog](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md)
- [Commits](https://github.com/motiondivision/motion/compare/v12.31.0...v12.34.3)
- **updated-dependencies:**: - dependency-name: framer-motion
  dependency-version: 12.34.3
  dependency-type: direct:production
  update-type: version-update:semver-minor
  ...

## 2026-02-24

- **feat(automation): extend RSI, error-learning, safe-merge, and CI crawl**: - RSI: pass --auto-map to skill:evolve for automatic pattern mapping
- Error-learning: skill:evolve --auto-map, troubleshooting:apply, commit learned docs to main
- Safe-merge: add dev:log:from-git --yes after changelog
- CI: add e2e-crawl job on main (test:crawl, 15min, upload artifacts)
- **fix: resolve minimatch ReDoS vulnerability (GHSA-3ppc-4f35-3m26)**: - Add overrides: minimatch ^10.2.1, test-exclude 7.0.2
- test-exclude 7.x uses minimatch 10.x (6.x required 5.x)
- 0 vulnerabilities; lint, type-check, test, test:coverage, build pass
- Document in SECURITY_BEST_PRACTICES and TROUBLESHOOTING_LOG
- **fix: add Zod imports and ZodError handling to API mutation routes**: - Add import { z } from 'zod' and ZodError catch handling to ~30 API routes
- Add batchRecipeIdsSchema for recipes/ingredients/batch validation
- Extract runsheet-mutations-helpers for useRunsheetMutations (file size)
- Breakpoint codemod: AST-based, only Tailwind className/class strings
- Api-patterns: accept any import from zod (ZodSchema, z)
- Security: narrow raw-sql check to unsafe patterns only
- **perf: webapp loading optimizations - parallel fetches, cache-first, light API, prefetch**: - COGS: parallelize ingredients + recipes fetch
- Performance: parallelize main + previous-period fetch
- MenuList print: use ?locked=1 for locked menus
- Prefetch: add recipe-sharing, ingredients, customers, dish-builder routes
- Recipe-sharing: cache-first pattern
- Functions: cache-first pattern
- Locked menu: phased loading, light API, MenuCard prefetch on hover
- Menu builder: pass initialDishes/initialRecipes from recipes tab
- Docs: PERFORMANCE.md, development.mdc, design.mdc updated
- Trim MenuCard/MenuBuilderClient to meet file size limits
- **chore: file size refactoring, format, pre-deploy fixes, and deploy prep**: - Refactor crawl-console-errors.spec.ts and report-generator.ts for file size compliance
- Add crawl-constants, crawl-helpers, report-generator modules
- Format code, fix breakpoints, voice consistency, schema fixes
- Ignore CRAWL_REPORT and QA_AUDIT_REPORT generated artifacts

- **Automation extensions implemented**: (1) RSI orchestrator passes `--auto-map` to skill:evolve. (2) Error-learning workflow: skill:evolve --auto-map, troubleshooting:apply, commit+push learned docs when CI succeeds on main. (3) Safe-merge runs dev:log:from-git --yes --count=5 after changelog. (4) CI: new e2e-crawl job on main (test:crawl, 15min timeout, uploads CRAWL_REPORT artifacts).
- **fix: resolve minimatch ReDoS vulnerability (GHSA-3ppc-4f35-3m26)**: - Add overrides: minimatch ^10.2.1, test-exclude 7.0.2
- test-exclude 7.x uses minimatch 10.x (6.x required 5.x)
- 0 vulnerabilities; lint, type-check, test, test:coverage, build pass
- Document in SECURITY_BEST_PRACTICES and TROUBLESHOOTING_LOG

Co-authored-by: Cursor <cursoragent@cursor.com>

- **Automation plan implemented**: Added skill:merge, skill:map-suggest, dev:log, file-size hints, changelog in safe-merge, troubleshooting:suggest, rsi:derived-summary

- **minimatch ReDoS vulnerability resolved**: npm audit showed 27 high-severity vulnerabilities (GHSA-3ppc-4f35-3m26). Added package.json overrides: `"minimatch": "^10.2.1"` and `"test-exclude": "7.0.2"`. test-exclude 7.x uses minimatch 10.x (6.x required 5.x). Result: 0 vulnerabilities; lint, type-check, test, test:coverage, build all pass. Documented in TROUBLESHOOTING_LOG and docs/SECURITY_BEST_PRACTICES.md (Dependency Vulnerabilities).
- **Codebase check and cleanup fixes**:
  - **Root cause**: Traced widespread TypeScript corruption to `npm run cleanup:fix` dead-code removal. It was stripping `export const`/`export function` declarations and leaving orphaned bodies.
  - **Fix**: Hardened `scripts/cleanup/fixes/dead-code.js` – never remove `export function`/`export async function` or `export const X = z.object({` / template literals.
  - **Optimistic updates**: Customers page (create), Functions detail page (save/delete), useRunsheetMutations (add/delete/update notifications). Removed `isSaving`, no fetch-after-mutation, rollback on error.
  - **Revert**: Breakpoint codemod incorrectly replaced size keys (`sm`, `md`, `lg`) in object literals with `tablet`/`desktop`. Reverted `components/` and `lib/ui/` changes.
  - **Current state**: type-check passes. Modified files: `customers/page.tsx`, `functions/[id]/page.tsx`, `useRunsheetMutations.ts`, `dead-code.js`.
- **Breakpoint codemod fix**: Rewrote codemod to use jscodeshift AST – only transforms Tailwind class strings in `className`/`class` (JSX) and object property values (style configs). Never replaces object keys like `{ sm: '...', md: '...', lg: '...' }` (size variants). Handles `Property` and `ObjectProperty` node types.
- **Breakpoint codemod applied**: Ran on app/components/lib – 2 files updated (ExportThemeSelector, tailwind-utils).
- **File size fix**: useRunsheetMutations (132→115 lines) – extracted `buildOptimisticRunsheetUpdate` to `runsheet-mutations-helpers.ts`. `npm run lint:filesize` passes.
- **Cleanup check fixes**: (1) api-patterns & security: accept any `import from 'zod'` (was only `import.*z.*from`), so routes with `ZodSchema` pass. (2) security: narrow raw-sql check to only flag template literal/string concat in .rpc()/.query(), not parameterized Supabase RPC. (3) recipes/ingredients/batch: add Zod validation via batchRecipeIdsSchema. Violations: API Zod 29→28, security other 1→0.
- **Zod catch handling added**: menus (POST), admin/errors/[id] (GET, PUT), compliance-records (PUT) – `if (err instanceof z.ZodError)` with 400 response at start of catch.
- **Zod imports + ZodError handling (batch)**: Applied to ~30 API mutation routes: admin/features/_, admin/support-tickets, admin/tiers, compliance/validate, dishes/[id], employees/_, menus/[id]/_, order-lists/[id], performance, prep-lists/_, recipes/_, roster/templates/_, staff/employees/\*, support/contact. type-check passes.

## 2026-02-23 (continued)

- **File size refactoring – crawl spec and report-generator**: Resolved 2 file size violations.
  - **crawl-console-errors.spec.ts** (318→200 lines): Extracted `e2e/helpers/crawl-constants.ts` (65 lines) and `e2e/helpers/crawl-helpers.ts` (62 lines) for HASH_SEED_URLS, selectors, shouldSkip, normalizeUrlToPath, interactWithSectionNav, interactWithHashSections.
  - **report-generator.ts** (408→46 lines): Extracted `e2e/helpers/report-generator/qa-report.ts` (197 lines), `e2e/helpers/report-generator/crawl-report.ts` (137 lines), `e2e/helpers/report-generator/types.ts` (18 lines). Main file re-exports and retains parseTestResults.
  - `npm run lint:filesize` passes; type-check passes.

## 2026-02-23 (continued)

- **Crawl-reported console/network errors – systematic fix**: Addressed 41 non-allowlisted errors from CRAWL_REPORT.
  - **Auth0**: Route used `auth0.handler` (not on Auth0Client); switched to `auth0.middleware(req)` per SDK v4 API.
  - **recipe-share GET**: Recipes select used `name`; changed to `recipe_name` (post-migration).
  - **recipes/exists**: Filter used `ilike('name', name)`; changed to `recipe_name`.
  - **dishes fetchDishRecipes**: Select included `name`; removed, use `recipe_name` for mapped `name`.
  - **compliance-records**: PGRST200 join failure – fetch records and types separately, merge in code.
  - **prep-lists fetchBatchData**: kitchen_sections used `name`; changed to `section_name` with fallback for `name`; updated DBKitchenSection type.
  - **E2E allowlist**: Added Square and Feature Flags "Unauthorized" patterns (expected when not admin).
  - **Docs**: TROUBLESHOOTING_LOG entries for auth0.handler, recipes.name, PGRST200, kitchen_sections.

## 2026-02-23 (continued)

- **Guide Screenshots Capture and Crop**: Implemented DOM-driven capture and crop script.
  - **Capture script**: Replaced fullPage screenshots with main-element clip. Scrolls to top, gets `main` bounding box, clips to top 720px of content. Fallback to viewport if main missing.
  - **Crop script**: `scripts/crop-guide-screenshots.js` — processes images in `public/images/guides/` taller than 900px; extracts top 720px (skip 64px header). Idempotent. `npm run crop:guide-screenshots`.
  - Ran crop on existing images: 8 cropped, 2 skipped (recipe-builder, recipe-form already compact).
  - **Docs**: Updated GUIDE_SCREENSHOTS.md with prerequisites, crop instructions, troubleshooting.

## 2026-02-23 (continued)

- **PageTipsCard on Every Page**: Extended PageTipsCard to all primary webapp pages.
  - Added PAGE_TIPS_CONFIG for dashboard, ingredients, performance, cogs, recipe-sharing, sections, cleaning, specials, setup.
  - Rendered PageTipsCard on: dashboard, IngredientsClient, PerformanceClient, recipe-sharing, sections, cleaning, specials, setup. COGS page redirects to recipes; config added for future use.
  - Tips use PrepFlow voice; guide deep-links where appropriate.

## 2026-02-23 (continued)

- **Tips and First-Time Help Overhaul**: Implemented plan to extend InlineHint, RescueNudge, and PageTipsCard across webapp.
  - **Phase 1a – Dishes**: Added DishesEmptyState with InlineHint, RescueNudge; markFirstDone("dishes") in useDishesClientController when dishes/recipes exist.
  - **Phase 1b – Menu-builder**: EmptyMenuList with InlineHint, RescueNudge; markFirstDone("menu-builder") in MenuBuilderClient when menus exist.
  - **Phase 1c – PageTipsCard tabs**: PageTipsCard with dish-builder and menu-builder config in DishesClient and MenuBuilderClient when list is empty.
  - **Phase 2a – Performance & COGS**: InlineHint + RescueNudge on PerformanceEmptyState, COGSTableEmptyState; markFirstDone wired.
  - **Phase 2b – Broader rollout**: InlineHint + RescueNudge on EquipmentEmptyState, TemperatureLogsEmptyState, PrepListsEmptyState, ParLevelEmptyState, SectionsEmptyState, recipe-sharing EmptyState. markFirstDone wired in temperature, prep-lists, sections, par-levels, recipe-sharing pages.
  - **Phase 3 – PageTipsCard**: Added PAGE_TIPS_CONFIG for suppliers, temperature, prep-lists, par-levels, order-lists. Rendered PageTipsCard on each page.
  - **Phase 4**: Fixed guideStepIndex (5 → 4) for menu-builder and order-lists to match getting-started steps (0–4). Simplified TemperatureLogsEmptyState JSX to resolve TS1005.

## 2026-02-23 (continued)

- **Duplicate recipe ingredients fix**: Prevent and clean duplicate recipe_ingredient rows.
  - **saveRecipeIngredients**: Deduplicate by ingredient_id before insert; sum quantities when same ingredient appears multiple times in payload.
  - **populateBasicData**: Deduplicate by (recipe_id, ingredient_id) before insert; sum quantities. Prevents duplicates from populate-clean-test-data.
  - **POST /api/db/dedupe-recipe-ingredients**: New endpoint to clean existing duplicates. For each (recipe_id, ingredient_id) with multiple rows: keeps one, sums quantities, deletes extras. Supports `?dry=1` to preview.
  - **Docs**: Added endpoint to API_ENDPOINTS.md.
  - **Existing sources**: populateRecipes (populate-empty-dishes) and populate-recipes already had dedup.

## 2026-02-23 (continued)

- **HMR Icon module factory fix**: Resolved "module factory is not available" error during dev hot reloads.
  - Consolidated Icon implementation into `components/ui/Icon.tsx` (single source of truth); `lib/ui/Icon.tsx` now re-exports. Eliminates re-export chain that confused Turbopack HMR.
  - Created `docs/TROUBLESHOOTING_LOG.md` documenting this and other dev-time errors (message channel, Partytown).

## 2026-02-23 (continued)

- **Webapp Tutorial & Tips System**: Implemented all 5 phases of the research-backed guidance system.
  - **Phase 1 – PageHeader help + route-to-guide**: `lib/page-help/page-help-config.ts` (route-to-guide mapping), `usePageHelp.ts`, `PageHeaderHelp.tsx`, extended `PageHeader` with optional help icon. Guide deep-linking via `/webapp/guide?guide=id&step=n`.
  - **Phase 2 – Empty state redesign**: Single primary CTA and time-to-value copy for IngredientEmptyState, RecipesEmptyState, EquipmentEmptyState, PerformanceEmptyState, TemperatureAnalyticsEmptyState, TemperatureLogsEmptyState, COGSTableEmptyState, PrepListsEmptyState, ParLevelEmptyState.
  - **Phase 3 – Inline micro-hint**: `InlineHint.tsx` + `first-done-storage.ts`. Shows "Start here" hint until first success. Wired for ingredients (markFirstDone in useIngredientAdd) and recipes (markFirstDone in useDishFormSubmit).
  - **Phase 4 – PageTipsCard**: `PageTipsCard.tsx` (collapsible, dismissible), `page-tips-content.ts`. Added to settings and compliance pages (no natural empty states). PrepFlow voice, localStorage for dismiss/collapse.
  - **Phase 5 – Rescue nudges**: `RescueNudge.tsx` – appears after 25s idle on empty page. "Need a hand? [Show me how]". Pilot on ingredients and recipes empty states. Dismissible, never repeated.

## 2026-02-23 (continued)

- **Landing page screenshot replacement plan**: Implemented automated capture and unified format.
  - **capture-landing-screenshots.js**: Puppeteer script to capture 8 webapp screenshots (dashboard, ingredients, cogs, recipes, performance, temperature, cleaning, settings). Supports `--base-url`, `--headed` for manual login. Persists session to `.screenshot-session/` for headless runs. Output: PNG files in `public/images/`.
  - **npm run capture:screenshots**: New script. First run: `npm run capture:screenshots -- --headed` to log in; subsequent runs use saved session.
  - **CloserLook.tsx**: Unified all 7 feature screenshots from `.webp` to `.png`.
  - **next.config.ts**: Added quality `80` to `images.qualities` for Hero dashboard-screenshot.
  - **docs/SCRIPTS.md**: Documented capture script, auth flow, and output files.
  - **.gitignore**: Added `.screenshot-session/`.

- **Icon audit system**: Added icon consistency checks to design compliance tooling.
  - **audit-hierarchy.js**: New `icon` category — `directLucideUsage` (Lucide used without Icon wrapper), `emojiIcons` (emoji in UI). Contributes to hierarchy violation count.
  - **audit-icons.js**: In-depth icon audit script — scans app, components, lib for direct Lucide usage (62 in 29 files) and emoji (289 in 99 files). Reports Icon wrapper usage (1,019).
  - **npm run audit:icons**: New script. Options: `--format=short`, `--json`.
  - **docs/ICON_AUDIT_REPORT.md**: Audit report template with summary and top files.
  - **docs/SCRIPTS.md**: Documented audit:icons and updated audit:hierarchy with icon category.

- **Design hierarchy audit fixes**: Resolved all high-priority violations and a representative set of medium-priority color violations.
  - **customOpacity (high)**: Replaced all `text-[var(--foreground)]/60`, `/70`, `/80` with semantic tokens (`text-[var(--foreground-subtle)]`, `text-[var(--foreground-muted)]`). Files: BottomNavBar, UserMenu, AchievementToast, QuickActions, RecentActivity, ConfirmDialog, InputDialog, ThemeTogglePanel, CSVImportModal, ExportOptionsModal, BillingSection, SessionTimeoutWarning, PrivacyNotice, AdaptiveNavSettingsPanel, SearchModal, SearchResultsList, MobileFAB, NavigationErrorBoundary, CategorySection, SuccessMessage, NotificationContext, ErrorGame components, Arcade components.
  - **hardcodedColors (medium)**: Replaced `text-green-400`, `text-red-400`, `text-yellow-400`, `text-blue-400` with semantic tokens (`text-[var(--color-success)]`, `text-[var(--color-error)]`, `text-[var(--color-warning)]`, `text-[var(--color-info)]`) in Square sections, CreateCustomerForm, CreateFunctionForm, FeatureFlagsSection, SuccessMessage, OverviewSection, ConnectionWorkflow, HistorySection, SyncSection, WebhooksSection, CSVImportErrors.
  - **Audit result**: High violations 0 (was ~40+). Medium violations 519 (565 → 519; color 192→146, componentSizing 373 unchanged). ComponentSizing (non-standard card padding p-2, p-3, etc.) left as advisory—many are intentional compact layouts.

- **Design compliance fixes**: Applied theme, voice, and z-index fixes from audit.
  - **Theme**: Hero/FinalCTA CTAs → Cyber Carrot gradient; Toggle thumb, SpecialsFilters dot, ResponsiveCardActions hover → bg-background/bg-foreground
  - **Voice**: ExportDayButton, api-error-handler, utils/error → PrepFlow voice
  - **Z-index**: Modal/dialog overlays z-[100]/z-[1000]/z-[90]/z-[74]/z-[45] → z-[80]/z-[75]/z-50; expanded valid set with 0,10,20 for nested stacking

- **Design compliance audit – gap scripts**: Implemented missing audit checks for design system consistency.
  - **Z-index check** (`scripts/cleanup/checks/z-index.js`): Validates z-index against Cyber Carrot hierarchy (80, 79, 75, 70, 65, 60, 55, 50, 40, 30). Found 139 violations.
  - **Theme consistency check** (`scripts/cleanup/checks/theme-consistency.js`): Flags `bg-white` and `bg-black` that break theme switching. Use `bg-background` instead. Found 158 violations.
  - **audit-hierarchy.js additions**: Font family check (`font-serif` → use `font-sans` or `font-mono`); button gradient check (non-Cyber Carrot gradients like `from-blue-*`).
  - Registered new checks in `cleanup.js` and `config.js`. Full audit sequence: `audit:hierarchy`, `detect-breakpoints`, `cleanup:check`, `check:voice`, `pre-deploy`.

## 2026-02-23

- **Runsheet dietary suitability and notes validation**: Added dietary column and allergen/dietary conflict validation to runsheet export.
  - **Dietary column**: Runsheet table now includes a "Dietary" column showing Vegetarian, Vegan, Gluten-free for meal items linked to dishes/recipes. Uses `getDietarySuitability()` with `consolidateAllergens` for gluten-free derivation.
  - **Notes validation**: When event notes mention allergen or dietary requirements (e.g. "nut allergy", "gluten free only", "vegetarian only"), export validates runsheet items. If notes contradict linked dishes/recipes, export returns 422 with conflict details.
  - **Helpers**: `getDietarySuitability.ts` – derives labels from dish/recipe; `parseNotesForConstraints.ts` – parses notes for allergen/dietary requirements; `validateNotesAgainstRunsheet.ts` – detects contradictions.
  - **ExportDayButton**: Handles 422 response, shows conflict details via `useNotification` when export blocked.
  - Extended export API select to include `is_vegetarian`, `is_vegan`, `allergens` for dishes and recipes.

- **Runsheet theme and layout improvements**: Updated runsheet export for stronger theme visibility and professional catering layout.
  - **Theme visibility** (`getRunsheetVariantCSS.ts`): Table header now uses `background-color: var(--pf-color-primary)`, event info block has 4px left border in primary, header border uses primary, alternating row stripes with theme tint, all with `print-color-adjust: exact`.
  - **Event info layout** (`buildRunsheetContent.ts`): Two-column grid (Event Details | Client & Contact) with section titles; Notes full-width below when present. Uses `.runsheet-event-info-grid`, `.runsheet-event-info-section`, `.runsheet-event-info-notes`.
  - **Table design**: Time column 14px, tabular-nums; Day column styled; typography uses theme font-family; line-height 1.45 for description.
  - **Theme preview**: Added `runsheet` case to `preview-data.ts` and "Runsheet" option to ExportThemeSelector dropdown (Settings > Export) so users can preview theme before export.

- **Runsheet print template**: Added professional restaurant/catering runsheet print template using the unified print system.
  - Created `app/api/functions/[id]/export/helpers/buildRunsheetContent.ts` – builds HTML for event info block (type, attendees, when, location, client, contact, notes) and runsheet table (Time | Description | Type | Linked dishes/recipes/menus).
  - Refactored `app/api/functions/[id]/export/route.ts` to use `generatePrintTemplate` with `variant: 'runsheet'`, `buildRunsheetContent`, `theme` from query (default `cyber-carrot`), and optional `day` param for single-day export.
  - Export supports full runsheet (all days) when `day` is omitted; adds Day column for multi-day exports.
  - Updated `ExportDayButton` to pass `theme` via `getSavedExportTheme()` and support optional `dayNumber` (undefined = full runsheet).
  - Added "Export full runsheet" button in `RunsheetPanel` when `totalDays > 1` (alongside per-day export).

## 2026-02-22

- **Theme-aware readability**: Replaced hardcoded `bg-[#0a0a0a]` base background in webapp layout with `bg-[var(--background)]` so the background correctly switches between dark (#000000) and light (#ffffff) when the user toggles theme in Settings > Preferences.
- Verified ThemeInitializer and data-theme flow remain correct (no changes needed).
- Manual verification: Toggle theme in Settings and confirm Dashboard, Ingredients, Recipes, and cards render correctly in both themes.

## 2026-01-16

- Merged PR #30 to restore build reliability and typing.
- Started follow-up fixes to pin Node to 22.x and narrow TypeScript includes to reduce Turbopack scanning warnings.
- Added guards to performance testing workflow when artifacts are missing.
- Added regression-step artifact existence check to prevent download failures.
- Added a guard in performance testing workflow for missing Lighthouse results.
- Ran Prettier across the repository to clear formatting gates in CI.
