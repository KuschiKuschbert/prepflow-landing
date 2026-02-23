# Dev Log

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
