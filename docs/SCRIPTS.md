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

## Screenshots & Assets

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

Runs all checks that Vercel and CI run during deployment:

- Node version check (>=22.0.0)
- Dependencies installation (`npm ci`)
- Lint check (`npm run lint`)
- Type check (`npm run type-check`)
- Format check (`npm run format:check`)
- Cleanup check (`npm run cleanup:check`)
- Build check (`npm run build`) - **Most important, this is what Vercel runs**

**Usage:**

```bash
# Run all pre-deployment checks
npm run pre-deploy
```

**Exit Codes:**

- `0` - All checks passed, safe to deploy
- `1` - One or more checks failed, fix issues before deploying

**Integration:** Should be run manually before pushing to `main`. Consider adding to pre-push hook (future enhancement).

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
