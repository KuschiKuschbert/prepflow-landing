# PrepFlow Directory Cleanup Plan

This document lists unnecessary or obsolete items that can be removed or reorganized. Applied on: 2026-02-08.

---

## 1. Generated / temporary files (safe to delete and ignore)

| Item                                   | Action                                         | Reason                                         |
| -------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| `lint_report.json`                     | Delete + add to `.gitignore`                   | Generated lint report; should not be committed |
| `lint_report.txt`                      | Delete + add to `.gitignore`                   | Same                                           |
| `architecture_full.txt`                | Delete + add to `.gitignore`                   | One-off architecture dump                      |
| `.lighthouseci/assertion-results.json` | Optional: add `.lighthouseci/` to `.gitignore` | CI artifact                                    |
| `.lighthouseci/links.json`             | Optional: same                                 | CI artifact                                    |

---

## 2. Root-level one-off docs (move to `docs/archive/` or delete)

These are progress/audit/setup notes that duplicate or predate `docs/`. Prefer moving to `docs/archive/` so nothing is lost.

**Suggested to archive (obsolete progress/audit):**

- `ADD_NEW_SCREENSHOTS.md`, `CAPTURE_SCREENSHOTS_*.md`, `HOW_TO_ADD_SCREENSHOTS.md`, `PREPARE_FOR_SCREENSHOTS.md`, `QUICK_SCREENSHOT_SETUP.md`, `SCREENSHOT_*.md`
- `API_ROUTE_REFACTORING_PROGRESS.md`, `AUDIT_PROGRESS_*.md`, `AUDIT_REPORT.md`, `AUTO_FIX_SUMMARY.md`, `BEST_PRACTICES_AUDIT_SUMMARY.md`
- `BUILD_VERIFICATION_COMPLETE.md`, `COMPLIANCE_*.md`, `CURRENT_COMPLIANCE_STATUS.md`, `DATABASE_PATTERNS_REVIEW_SUMMARY.md`
- `DEPLOYMENT_TROUBLESHOOTING.md`, `EMAIL_SETUP.md`, `ERROR_HANDLING_MIGRATION.md`, `GTM_SETUP.md`, `IMAGE_INTEGRATION.md`
- `IMPLEMENTATION_GUIDE.md`, `LOCALHOST_*.md`, `LOGO_INTEGRATION.md`, `MANUAL_FIX_PLAN.md`, `MENU_BUILDER_RECIPES_FEATURE.md`
- `MOBILE_NAVIGATION_*.md`, `NEXT_*.md`, `OPTIMISTIC_UPDATES_*.md`, `PERFORMANCE_*.md`, `PHASE_5_*.md`
- `QUICK_MIGRATION_GUIDE.md`, `QUICK_START.md`, `SETUP_*.md`, `TYPESCRIPT_ERRORS_STATUS.md`, `VERIFICATION_STEPS.md`
- `ANALYTICS_SETUP.md`, `AUTH0_LOCALHOST_SETUP.md`, `CONTINUITY_AUDIT_REPORT.md`, `CSS_PRELOAD_OPTIMIZATION.md`
- `PERFORMANCE_OPTIMIZATION.md`, `SCRAPER_*.md` (root-level), `ERROR_HANDLING_STANDARDS.md` (consider keeping or moving to docs/)

**Keep at root (canonical):**

- `README.md`, `AGENTS.md`, `QA_AUDIT_REPORT.md` (if you still use it), `ERROR_HANDLING_STANDARDS.md` (or move to docs/)

**Personal / one-off:**

- `EMAIL_TO_DANIEL.txt` – delete if not needed.

---

## 3. Root-level SQL files (legacy; canonical is `supabase/migrations/` and `migrations/`)

**Referenced by README/setup – keep for now:**

- `database-setup.sql` – README and setup docs point to this.
- `setup-database.sql` – referenced by setup-database.sh and docs.

**Likely obsolete (one-off fixes; already applied via migrations):**

- `COMPLETE_DATABASE_FIX.sql`, `COMPLETE_TABLE_STRUCTURE_FIX.sql`, `CREATE_MISSING_TABLES.sql`, `RECREATE_TABLES.sql`
- `fix-sales-data-table.sql`, `fix-sales-data-unique-constraint.sql`, `database-migration-add-categories.sql`
- `menu-builder-add-recipes-migration.sql`, `supabase-*.sql` (multiple), `setup-database.sql` (if superseded by scripts/setup-database.js)

**Recommendation:** Move all root `*.sql` except `database-setup.sql` (and optionally `setup-database.sql`) to `docs/archive/sql-legacy/` or delete after confirming migrations are applied.

---

## 4. Scripts

**Broken npm script:**

- `package.json` has `"find-allergen-conflicts": "node scripts/find-allergen-vegan-conflicts.js"` but `scripts/find-allergen-vegan-conflicts.js` does not exist. **Action:** Remove this script from `package.json`.

**Missing codemods (referenced by cleanup and docs):**

- `scripts/codemods/breakpoint-migration.js` and `scripts/codemods/console-migration.js` are referenced in `.cursor/rules/development.mdc`, `cleanup.mdc`, and `scripts/cleanup/fixes/` but are not present (only `ultimate-prefixer.js` is in `scripts/codemods/`). Either add these codemods or update references to the actual fix path (e.g. cleanup.js).

**Recipe scraper:**

- `scripts/recipe-scraper/` was removed (migrated to `lib/recipes/`). No action except ensuring no remaining references.

**Optional script cleanup (review before delete):**

- `scripts/stop-scraper-manual.js`, `scripts/stop-scraper.js`, `scripts/verify-scraper-stopped.js` – may still be used by recipe-scraper API; verify against `app/api/recipe-scraper/` before removing.

---

## 5. Data directory

- `data/recipe-database/` – only `index.json` is tracked (per `.gitignore`). The many `.gz` files (if present) are likely scraped data; ensure `data/**/*.gz` or equivalent is in `.gitignore` if they should not be committed.
- `data/sample-ingredients-*.ts` – sample data; keep or move to `lib/data/` if used.

---

## 6. Other

- **`server.js`** – Legacy dev server; keep only if you still use `npm run dev:legacy`.
- **`.deploy-trigger`** – Remove if it’s a one-off deploy trigger file.
- **`reports/`** – RSI reports (`rsi-*.md`); keep if you use them; otherwise add `reports/` to `.gitignore` if they are generated.
- **`FIND_MY_SCREENSHOTS.sh`** – One-off helper; move to `scripts/` or delete.
- **`setup-database.sh`** – References `setup-database.sql`; keep if you use shell setup.

---

## Summary of actions taken in this pass

1. Add to `.gitignore`: `lint_report.json`, `lint_report.txt`, `architecture_full.txt`.
2. Remove broken npm script: `find-allergen-conflicts` from `package.json`.
3. Delete (if present): `lint_report.json`, `lint_report.txt`, `architecture_full.txt`.
4. Create `docs/archive/` and move the root-level one-off docs listed in §2 (optional; can do in a follow-up).
5. Move or delete root-level legacy SQL as in §3 (optional; confirm migrations first).

You can run the optional steps (archive docs, legacy SQL) after review.
