# PrepFlow Scripts Reference

Complete reference guide for all development, testing, and deployment scripts in the PrepFlow codebase.

**See Also:**

- Development scripts: `.cursor/rules/development.mdc`
- Operations scripts: `.cursor/rules/operations.mdc`
- Testing scripts: `.cursor/rules/testing.mdc`

---

## 📋 Table of Contents

- [Development & Code Quality](#development--code-quality)
- [Performance & Analysis](#performance--analysis)
- [Database & Setup](#database--setup)
- [Screenshots & Assets](#screenshots--assets)
- [Deployment & Verification](#deployment--verification)
- [Testing](#testing)
- [Future Scripts](#future-scripts)

---

## Development & Code Quality

### File Size Enforcement

**Script:** `scripts/check-file-sizes.js`
**Command:** `npm run lint:filesize`
**Referenced in:** `development.mdc`

Enforces file size limits to maintain code quality:

- **Page Components:** Maximum 500 lines
- **Complex Components:** Maximum 300 lines
- **API Routes:** Maximum 200 lines
- **Utility Functions:** Maximum 150 lines
- **Hooks:** Maximum 100 lines

**Usage:**

```bash
npm run lint:filesize
```

**Integration:** Runs automatically in CI pipeline and pre-commit hooks.

---

### Breakpoint Detection

**Script:** `scripts/detect-breakpoints.js`
**Command:** `npm run detect-breakpoints`
**Referenced in:** `design.mdc`, `AGENTS.md`

Analyzes breakpoint usage across the codebase:

- Identifies active breakpoints (used in project)
- Identifies unused breakpoints (defined but not used)
- Identifies rogue breakpoints (used but not defined - standard Tailwind breakpoints)

**Usage:**

```bash
npm run detect-breakpoints
```

**Output:** Reports breakpoint usage statistics and identifies potential issues.

---

### Visual Hierarchy Audit

**Script:** `scripts/audit-hierarchy.js`
**Command:** `npm run audit:hierarchy`
**Referenced in:** `design.mdc`, `docs/VISUAL_HIERARCHY_STANDARDS.md`

Scans the codebase for visual hierarchy violations. Rules are scoped by area (landing strict, webapp flexible per design.mdc). Includes icon consistency checks (direct Lucide usage, emoji icons). Advisory only; does not block pre-deploy or CI.

**Categories:** typography, color, componentSizing, icon (direct Lucide, emoji)

**Usage:**

```bash
npm run audit:hierarchy              # Scan all (landing + webapp)
npm run audit:hierarchy -- --scope=landing   # Landing only (strict)
npm run audit:hierarchy -- --scope=webapp    # Webapp only
npm run audit:hierarchy -- --json            # JSON output
```

**Options:**

- `--scope=landing|webapp|all` - Limit scan to scope (default: all)
- `--json` - Output results as JSON
- `--verbose` - Show detailed violation information

**Integration:** Advisory. Run during design reviews; fix high-priority violations when touching affected files.

---

### Icon Audit (In-Depth)

**Script:** `scripts/audit-icons.js`
**Command:** `npm run audit:icons`
**Referenced in:** `design.mdc` (Icon Standards)

In-depth icon consistency audit per design system. Scans for direct Lucide usage (without Icon wrapper) and emoji icons. Use for detailed remediation planning.

**Usage:**

```bash
npm run audit:icons              # Detailed report (default)
npm run audit:icons -- --format=short   # Compact summary
npm run audit:icons -- --json           # JSON output
```

**Checks:**

- **Direct Lucide:** Lucide icons used as `<IconName className=` or `<IconName size=` — should use `<Icon icon={IconName} size="sm" />`
- **Emoji icons:** 🏪 📍 ✨ 📊 📋 🎯 ⚡ etc. — should use Lucide icons with Icon wrapper

**Integration:** Advisory. Run alongside `audit:hierarchy` for design compliance reviews.

---

### CHANGELOG Generation

**Script:** `scripts/generate-changelog.js`
**Command:** `npm run changelog`
**Referenced in:** `development.mdc`

Automatically generates `CHANGELOG.md` from git commits using Conventional Commits format.

**Commit Types Supported:**

- 🚀 `feat:` - New features
- 🐛 `fix:` - Bug fixes
- 📚 `docs:` - Documentation
- 💎 `style:` - Code style changes
- ♻️ `refactor:` - Code refactoring
- ⚡ `perf:` - Performance improvements
- 🧪 `test:` - Test additions/changes
- 🔧 `chore:` - Maintenance tasks
- ⚙️ `ci:` - CI/CD changes
- 📦 `build:` - Build system changes
- ⏪ `revert:` - Reverted commits

**Usage:**

```bash
npm run changelog
```

**How It Works:**

- Analyzes git commits since last tag (or all commits if no tag)
- Parses Conventional Commits format: `type(scope): subject`
- Groups commits by type
- Generates formatted CHANGELOG.md entry

---

### Codemods

#### Breakpoint Migration Codemod

**Script:** `scripts/codemods/breakpoint-migration.js`
**Commands:**

- `npm run codemod:breakpoints` - Dry-run (preview changes)
- `npm run codemod:breakpoints:write` - Apply changes
  **Referenced in:** `development.mdc`

Automated code transformation for breakpoint migrations:

- `sm:` → `tablet:` (481px+)
- `md:` → `tablet:` (481px+)
- `lg:` → `desktop:` (1025px+)

**Usage:**

```bash
# Preview changes first
npm run codemod:breakpoints

# Apply changes
npm run codemod:breakpoints:write
```

**Handles:**

- String literals in JSX attributes
- Template literals in JSX
- Object properties
- String concatenations

---

#### Console Migration Codemod

**Script:** `scripts/codemods/console-migration.js`
**Commands:**

- `npm run codemod:console` - Dry-run (preview changes)
- `npm run codemod:console:write` - Apply changes
  **Referenced in:** `development.mdc`

Migrates console calls to logger utility:

- `console.log(...)` → `logger.dev(...)`
- `console.error(...)` → `logger.error(...)`
- `console.warn(...)` → `logger.warn(...)`
- `console.info(...)` → `logger.info(...)`
- `console.debug(...)` → `logger.debug(...)`

**Usage:**

```bash
# Preview changes first
npm run codemod:console

# Apply changes
npm run codemod:console:write
```

**Features:**

- Automatically adds logger import if not present
- Preserves all arguments and call structure
- Detects existing logger imports to avoid duplicates

---

#### Run All Codemods

**Command:** `npm run codemod:all`
**Referenced in:** `development.mdc`

Runs both codemods in dry-run mode for preview.

**Usage:**

```bash
npm run codemod:all
```

---

## Performance & Analysis

### Bundle Analysis

**Script:** `scripts/analyze-bundle.js`
**Command:** `npm run analyze` or `npm run bundle:analyze`
**Referenced in:** `operations.mdc` (Performance Standards)

Analyzes Next.js bundle composition and identifies large chunks.

**Usage:**

```bash
npm run analyze
```

**Prerequisites:** Run `npm run build` first to generate `.next` directory.

**Output:** Reports bundle sizes, chunk composition, and identifies optimization opportunities.

---

### Performance Budget Checks

**Script:** `scripts/check-performance-budget.js`
**Command:** Not directly exposed (can be run via `node scripts/check-performance-budget.js`)
**Referenced in:** `operations.mdc` (Performance Standards)

Checks performance metrics against defined budgets:

- Core Web Vitals (LCP, FID, CLS, FCP, TTI, SI, TBT)
- Resource budgets (total size, JS, CSS, images, fonts, third-party)

**Usage:**

```bash
node scripts/check-performance-budget.js
```

**Configuration:** Budgets defined in script constants.

---

### Performance Regression Detection

**Script:** `scripts/check-performance-regression.js`
**Command:** Not directly exposed
**Referenced in:** `operations.mdc` (Performance Standards)

Detects performance regressions by comparing current metrics against baseline.

**Usage:**

```bash
node scripts/check-performance-regression.js
```

---

### Performance Report Generation

**Script:** `scripts/generate-performance-report.js`
**Command:** Not directly exposed
**Referenced in:** `operations.mdc` (Performance Standards)

Generates comprehensive performance reports with metrics and recommendations.

**Usage:**

```bash
node scripts/generate-performance-report.js
```

---

### Performance Report Sending

**Script:** `scripts/send-performance-report.js`
**Command:** Not directly exposed
**Referenced in:** `operations.mdc` (Performance Standards)

Sends performance reports to configured recipients (email, Slack, etc.).

**Usage:**

```bash
node scripts/send-performance-report.js
```

---

### Performance Optimization

**Script:** `scripts/optimize-performance.js`
**Command:** Not directly exposed
**Referenced in:** `operations.mdc` (Performance Optimization)

Automated performance optimization suggestions and fixes.

**Usage:**

```bash
node scripts/optimize-performance.js
```

---

### Image Optimization

**Script:** `scripts/optimize-images.js`
**Command:** Not directly exposed
**Referenced in:** `operations.mdc` (Performance Optimization)

Optimizes images in `public/images/` and `public/icons/` directories:

- Converts to WebP format
- Compresses PNG/JPEG images
- Generates responsive sizes

**Usage:**

```bash
node scripts/optimize-images.js
```

**Target Images:**

- Dashboard screenshot
- PrepFlow logo
- Recipe screenshot
- Settings screenshot
- Stocklist screenshot
- App icons

---

## Database & Setup

### Database Setup

**Script:** `scripts/setup-database.js`
**Command:** Not directly exposed
**Referenced in:** `operations.mdc` (Database Management)

Sets up database tables and schema in Supabase.

**Usage:**

```bash
node scripts/setup-database.js
```

**Note:** Requires Supabase credentials in environment variables.

**Tables Created:**

- ingredients
- recipes
- recipe_ingredients
- menu_dishes
- users
- And other domain tables

---

### Ingredient Population

**Script:** `scripts/populate-ingredients.js`
**Command:** Not directly exposed
**Referenced in:** `operations.mdc` (Database Management)

Populates ingredients table with sample/test data.

**Usage:**

```bash
node scripts/populate-ingredients.js
```

**Note:** Useful for development and testing.

---

### Link Data to Users

**Script:** `scripts/link-data-to-users.ts`
**Command:** `npm run link:data`

Links orphan data (ingredients, recipes, dishes, menus, suppliers with `null` user_id) to one or more user accounts. Use when existing data is not visible after login because it has no `user_id` set.

**Usage:**

```bash
# Reassign all orphan data to one user
npm run link:data -- --to you@example.com

# Copy orphan data to multiple users (test, your account, admin)
npm run link:data -- --copy-to test@example.com,you@example.com,admin@example.com

# Preview without making changes
npm run link:data -- --to you@example.com --dry-run
```

**Options:**

- `--to <email>` - Reassign all data with null user_id to this user
- `--copy-to <email1>,<email2>,...` - Copy orphan data to each listed user (so all can see it)
- `--dry-run` - Show what would be done without making changes

**Note:** Requires Supabase credentials in `.env.local`. Users are created in Supabase Auth via JIT if they do not exist.

---

### Batch Database Repair

**Example Script:** `scripts/fix-fts.ts`
**Command:** `npx tsx scripts/fix-fts.ts`
**Referenced in:** `AI_RULES.md`

Specialized scripts for repairing or backfilling large datasets (> 2000 rows) that would timeout in standard SQL migrations.

**Pattern:**

1.  **Iterative**: Processes records in small batches (e.g., 100).
2.  **Robust**: Retries or fails gracefully without locking the database.
3.  **Client-Side**: Runs via Node.js (`supabase-js`) rather than server-side SQL timeout limits.

**Usage:**

```bash
npx tsx scripts/your-repair-script.ts
```

---

## Screenshots & Assets

### Capture Landing Page Screenshots

**Script:** `scripts/capture-landing-screenshots.js`
**Command:** `npm run capture:screenshots`
**Referenced in:** Landing Page Screenshot Replacement Plan

Captures current webapp screens for the landing page (Hero, ProductFeatures, Highlights, CloserLook).

**Prerequisites:**

- Dev server running: `npm run dev` (port 3000)
- Authenticated session (webapp routes are protected)

**First run (manual login):**

```bash
npm run capture:screenshots -- --headed
```

A browser window opens. Log in via Auth0 when prompted. After you reach the webapp, press Enter in the terminal. The script captures all 9 screenshots and persists your session to `.screenshot-session/` for future headless runs.

**Subsequent runs (headless):**

```bash
npm run capture:screenshots
```

Uses the saved session in `.screenshot-session/`—no login required.

**Options:**

- `--base-url=<url>` — Base URL (default: `http://localhost:3000`)
- `--headed` — Show browser for manual login

**Output:** PNG files in `public/images/`:

- `dashboard-screenshot.png`
- `ingredients-management-screenshot.png`
- `cogs-calculator-screenshot.png`
- `recipe-book-screenshot.png`
- `performance-analysis-screenshot.png`
- `functions-screenshot.png`
- `temperature-monitoring-screenshot.png`
- `cleaning-roster-screenshot.png`
- `settings-screenshot.png`

**Auth alternatives:** If you prefer not to persist session, set `DISABLE_ALLOWLIST=true` in `.env.local` to bypass allowlist, then capture with any authenticated session. The `--headed` flow is recommended for CI or one-off runs.

**After capturing:** Next.js caches optimized images. If you still see old screenshots, run `rm -rf .next/cache/images` and restart the dev server.

---

### Add Screenshots

**Script:** `scripts/add-screenshots.sh`
**Command:** `bash scripts/add-screenshots.sh`
**Referenced in:** `development.mdc` (Development Utilities)

Helper script to add new screenshots to the project.

**Usage:**

```bash
bash scripts/add-screenshots.sh
```

**Functionality:**

- Checks for required screenshot files
- Provides instructions for adding screenshots
- Verifies screenshot files exist

**Required Screenshots:**

- `ingredients-management-screenshot.png`
- `cogs-calculator-screenshot.png`
- `cleaning-roster-screenshot.png`

---

### Copy Screenshots

**Script:** `scripts/copy-screenshots.sh`
**Command:** `bash scripts/copy-screenshots.sh`
**Referenced in:** `development.mdc` (Development Utilities)

Copies screenshots from source location to project.

**Usage:**

```bash
bash scripts/copy-screenshots.sh
```

---

### Replace Screenshots

**Script:** `scripts/replace-screenshots.sh`
**Command:** `bash scripts/replace-screenshots.sh`
**Referenced in:** `development.mdc` (Development Utilities)

Replaces existing screenshots with new versions.

**Usage:**

```bash
bash scripts/replace-screenshots.sh
```

---

## Deployment & Verification

### Pre-Deployment Check

**Script:** `scripts/pre-deploy-check.sh`
**Command:** `npm run pre-deploy`
**Referenced in:** `operations.mdc` (Deployment Process)

**MANDATORY:** Run before pushing to `main` to verify your code will deploy successfully on Vercel.

Runs the same deploy-critical checks as CI (`.github/workflows/ci-cd.yml`). Order:

1. Node version check (>=22.0.0)
2. Dependencies installation (`npm ci`)
3. Security audit (`npm audit --audit-level=moderate`)
4. Lint check (`npm run lint`)
5. Type check (`npm run type-check`)
6. Format check (`npm run format:check`)
7. Script audit (`npm run audit:scripts`)
8. Cleanup check (`npm run cleanup:check`) - **Advisory only** (non-blocking)
9. Build check (`npm run build`) - Most important, this is what Vercel runs
10. Bundle budget check (`npm run check:bundle`)

**Usage:**

```bash
# Run all pre-deployment checks
npm run pre-deploy
```

**Exit Codes:**

- `0` - All checks passed, safe to deploy
- `1` - One or more checks failed, fix issues before deploying

**Integration:** Should be run manually before pushing to `main`. Pre-deploy mirrors CI blocking checks—passing locally indicates CI will pass. Consider adding to pre-push hook (future enhancement).

**See Also:**

- `operations.mdc` (Deployment Process) - Complete deployment checklist

---

### Vercel Setup Verification

**Script:** `scripts/verify-vercel-setup.sh`
**Command:** `bash scripts/verify-vercel-setup.sh`
**Referenced in:** `operations.mdc` (Deployment Process)

Verifies Vercel deployment configuration:

- Checks git repository
- Verifies GitHub Actions workflows
- Checks environment variables
- Validates Next.js configuration

**Usage:**

```bash
bash scripts/verify-vercel-setup.sh
```

**Checks:**

- Git repository exists
- GitHub Actions workflow exists
- Environment variables configured
- Next.js config valid
- Build succeeds

---

### Legal and Node Version Checks

**Script:** `scripts/check-legal-and-node.js`
**Command:** Not directly exposed
**Referenced in:** `operations.mdc` (Pre-deployment Checklist)

Checks legal compliance and Node.js version requirements.

**Usage:**

```bash
node scripts/check-legal-and-node.js
```

**Checks:**

- Node.js version matches requirements (>=22.0.0)
- Legal/license compliance
- Package.json engines field

---

### Responsive Breakpoint Refactoring

**Script:** `scripts/refactor-responsive-breakpoints.js`
**Command:** Not directly exposed
**Referenced in:** `development.mdc` (Codemods)

Legacy script for breakpoint refactoring (superseded by codemods).

**Note:** Use codemods instead (`npm run codemod:breakpoints`).

---

## Testing

### Unit Tests

**Command:** `npm test`
**Referenced in:** `testing.mdc` (Test Execution)

Runs Jest unit tests.

**Usage:**

```bash
npm test
```

---

### Watch Mode

**Command:** `npm run test:watch`
**Referenced in:** `testing.mdc` (Test Execution)

Runs tests in watch mode for development.

**Usage:**

```bash
npm run test:watch
```

---

### Coverage Report

**Command:** `npm run test:coverage`
**Referenced in:** `testing.mdc` (Test Execution)

Runs tests with coverage report.

**Usage:**

```bash
npm run test:coverage
```

**Target:** ≥ 60% coverage (target 80%)

---

### Dependency Audit

**Script:** `scripts/audit-dependencies.js`
**Command:** `npm run audit:deps`
**Referenced in:** `operations.mdc` (Dependency Management)

Audits dependencies for:

- Unused dependencies
- Heavy dependencies
- Security vulnerabilities
- Update recommendations

**Usage:**

```bash
npm run audit:deps
```

**Output:** Reports unused dependencies, heavy packages, and optimization suggestions.

---

---

## Recursive Self-Improvement (RSI)

### RSI Status Check

**Script:** `scripts/rsi/status.js`
**Command:** `npm run rsi:status`
**Referenced in:** `AI_RULES.md`, `.cursorrules`

Checks the current health and active rules of the RSI system.

**Usage:**

```bash
npm run rsi:status
```

**Output:** Lists active learned rules, pending improvements, and system health.

---

### RSI Auto-Fix

**Script:** `scripts/rsi/auto-fix.js`
**Command:** `npm run rsi:fix`
**Referenced in:** `AI_RULES.md`, `.cursorrules`

Automatically applies learned fixes to the codebase. This is your "first aid" kit for lint errors.

**Usage:**

```bash
npm run rsi:fix
```

---

### RSI Nightly Loop

**Script:** `scripts/rsi/orchestrator.js`
**Command:** `npm run rsi:run`
**Referenced in:** `AI_RULES.md`

Accepts the current codebase state and attempts to improve it autonomously. Runs nightly via GitHub Actions.

**Usage:**

```bash
npm run rsi:run
```

---

## Future Scripts

The following scripts are planned but not yet implemented:

### Integration Tests

**Command:** `npm run test:integration` (Future)
**Referenced in:** `testing.mdc` (Test Execution)

Will run integration tests for API endpoints and database operations.

**Status:** Planned

---

### E2E Tests

**Command:** `npm run test:e2e` (Future)
**Referenced in:** `testing.mdc` (Test Execution)

Will run end-to-end tests using Playwright or Cypress.

**Status:** Planned

---

### Run All Tests

**Command:** `npm run test:all` (Future)
**Referenced in:** `testing.mdc` (Test Execution)

Will run all test suites (unit, integration, E2E).

**Status:** Planned

---

## Script Execution Workflow

### Pre-Commit

- `lint:filesize` - File size checks (via lint-staged)

### Pre-Deployment

- `lint` - ESLint checks
- `type-check` - TypeScript validation
- `format:check` - Prettier formatting check
- `build` - Production build
- `audit:deps` - Dependency audit
- `verify-vercel-setup.sh` - Vercel setup verification

### CI Pipeline

- `lint` - ESLint
- `type-check` - TypeScript
- `format:check` - Prettier
- `build` - Build verification

### Development

- `changelog` - Generate changelog before release
- `detect-breakpoints` - Analyze breakpoint usage
- `codemod:*` - Run codemods for migrations
- `test:watch` - Watch mode testing

---

## Quick Reference

| Script               | Command                       | Category    | Status     |
| -------------------- | ----------------------------- | ----------- | ---------- |
| File Size Check      | `npm run lint:filesize`       | Development | ✅ Active  |
| Breakpoint Detection | `npm run detect-breakpoints`  | Development | ✅ Active  |
| CHANGELOG Generation | `npm run changelog`           | Development | ✅ Active  |
| Breakpoint Codemod   | `npm run codemod:breakpoints` | Development | ✅ Active  |
| Console Codemod      | `npm run codemod:console`     | Development | ✅ Active  |
| Bundle Analysis      | `npm run analyze`             | Performance | ✅ Active  |
| Dependency Audit     | `npm run audit:deps`          | Testing     | ✅ Active  |
| Unit Tests           | `npm test`                    | Testing     | ✅ Active  |
| Test Coverage        | `npm run test:coverage`       | Testing     | ✅ Active  |
| Integration Tests    | `npm run test:integration`    | Testing     | 📋 Planned |
| E2E Tests            | `npm run test:e2e`            | Testing     | 📋 Planned |

---

## Contributing

When adding new scripts:

1. **Document in this file** - Add entry with purpose, usage, and examples
2. **Cross-reference in .mdc files** - Add references in relevant `.cursor/rules/*.mdc` files
3. **Add npm script** - If appropriate, add command to `package.json`
4. **Update this table** - Add to Quick Reference table above

---

**Last Updated:** 2025-01-XX
**Maintained by:** PrepFlow Development Team
