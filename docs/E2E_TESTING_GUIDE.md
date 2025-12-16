# E2E Testing Guide - Playwright Test Suite

## Overview

This guide explains how to run and interpret the comprehensive End-to-End (E2E) testing suite for PrepFlow. The test suite performs deep crawl, functional stress testing, and critical kitchen workflow validation with global error monitoring and automated QA audit report generation.

## Prerequisites

1. **Node.js**: Version 22.0.0 or higher
2. **Development Server**: The Next.js dev server must be running (`npm run dev`)
3. **Database**: Supabase database should be set up and accessible
4. **Environment Variables**: Ensure `.env.local` is configured with necessary API keys

## Installation

Install Playwright browsers (first time only):

```bash
npx playwright install
```

Or install specific browsers:

```bash
npx playwright install chromium firefox webkit
```

## Running Tests

### Run All Tests

```bash
npm run test:e2e
```

This will:

- Start the dev server automatically (if not running)
- Run all E2E tests across multiple browsers
- Generate `QA_AUDIT_REPORT.md` in the project root
- Save screenshots of failures to `test-failures/` directory

### Run Tests in UI Mode

```bash
npm run test:e2e:ui
```

Opens Playwright's interactive UI mode where you can:

- See tests running in real-time
- Debug individual tests
- Step through test execution
- View network requests and console logs

### Run Tests in Headed Mode (See Browser)

```bash
npm run test:e2e:headed
```

Runs tests with visible browser windows (useful for debugging).

### Run Tests in Debug Mode

```bash
npm run test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

### View Test Report

```bash
npm run test:e2e:report
```

Opens the HTML test report in your browser.

## Test Suites

### 1. Chef Flow Tests (`chef-flow.spec.ts`)

**Purpose**: Tests the critical "Chef" workflow end-to-end.

**What it tests**:

1. Creating a new ingredient (metric units: KG/g)
2. Creating a complex recipe using those ingredients
3. Assigning that dish to a menu cycle
4. Filling out a temperature log
5. Filling out an equipment maintenance log

**Duration**: ~2-5 minutes

**Key Features**:

- Tracks all steps taken during the test
- Captures errors at each step
- Verifies successful creation of each entity

### 2. Deep Crawl Tests (`deep-crawl.spec.ts`)

**Purpose**: Discovers and tests all webapp pages.

**What it tests**:

- Visits all `/webapp/**` pages (breadth-first crawl, max depth 3)
- Runs limited monkey tests on each page (5 interactions max)
- Captures errors on each page
- Takes screenshots when errors are found

**Duration**: ~5-10 minutes (depends on number of pages)

**Limits**:

- Maximum 50 pages
- Maximum depth: 3 levels
- 5 monkey interactions per page

### 3. Stress Tests (`stress-test.spec.ts`)

**Purpose**: Tests application under stress conditions.

**What it tests**:

- Rapid ingredient creation (10 ingredients)
- Rapid recipe creation (5 recipes)
- Rapid temperature log creation (10 logs)
- Large recipe with 20+ ingredients
- Concurrent page navigation (multiple tabs)

**Duration**: ~3-5 minutes

**Key Features**:

- Tests rapid form submissions
- Tests concurrent operations
- Tests large data sets
- Verifies no crashes or performance degradation

## Understanding the QA Audit Report

After tests complete, `QA_AUDIT_REPORT.md` is generated in the project root.

### Report Structure

1. **Summary Section**
   - Total tests run
   - Passed/Failed/Skipped counts
   - Total duration
   - Error counts by type

2. **Failed Tests Section**
   - List of all failed tests
   - Error messages
   - Steps taken before failure

3. **Error Details Section**
   - **Console Errors**: JavaScript errors logged to console
   - **Console Warnings**: Non-critical warnings
   - **Uncaught Exceptions**: Unhandled JavaScript errors
   - **Network Errors**: HTTP 4xx/5xx responses

4. **Recommendations Section**
   - Actionable items based on errors found

### Error Information

Each error includes:

- **URL**: Where the error occurred
- **Message**: Exact error message
- **Stack Trace**: For uncaught exceptions
- **Status Code**: For network errors
- **Timestamp**: When the error occurred
- **Screenshot**: Filename if screenshot was captured

### Screenshots

Screenshots are saved to `test-failures/` directory with descriptive names:

- Format: `error-{type}-{url-slug}-{timestamp}.png`
- Example: `error-console.error-webapp_ingredients-2025-01-15T10-30-45-123Z.png`

## Global Error Listener

The test suite includes a global error listener that captures:

1. **Console Errors** (`console.error`)
2. **Console Warnings** (`console.warn`)
3. **Uncaught Exceptions** (unhandled JavaScript errors)
4. **Network Errors** (HTTP 4xx and 5xx responses)

**Important**: The test suite does NOT stop on the first error. It collects all errors and continues testing, then reports them all in `QA_AUDIT_REPORT.md`.

## Monkey Testing

Monkey testing (chaos testing) automatically:

- Finds all interactive elements (buttons, inputs, selects, links)
- Attempts to interact with them
- Verifies no application crashes occur
- Logs any errors encountered

**Limitations**:

- Limited to 5 interactions per page during deep crawl
- Skips navigation away from current page
- Waits for stability after each interaction

## Authentication Handling

The test suite handles authentication automatically:

- **Development Mode**: Auth is bypassed (per `middleware.ts`)
- **Production Mode**: Would require Auth0 credentials (not configured for E2E)

Tests assume the user is logged in or auth is bypassed.

## Test Data

All tests use unique test data with timestamps to avoid conflicts:

- Ingredient names: `Test Tomato {timestamp}`
- Recipe names: `Test Chicken Stir-fry {timestamp}`
- Temperature logs: Current date/time
- Equipment maintenance: Current date

## Troubleshooting

### Tests Fail to Start

**Issue**: `Error: browserType.launch: Executable doesn't exist`

**Solution**: Run `npx playwright install` to install browser binaries.

### Dev Server Not Starting

**Issue**: `Error: connect ECONNREFUSED 127.0.0.1:3000`

**Solution**:

1. Ensure dev server is running: `npm run dev`
2. Or let Playwright start it automatically (configured in `playwright.config.ts`)

### Authentication Errors

**Issue**: Tests redirect to `/api/auth/signin`

**Solution**:

1. Ensure `NODE_ENV=development` in your environment
2. Or set `DISABLE_ALLOWLIST=true` in `.env.local`

### Timeout Errors

**Issue**: Tests timeout waiting for elements

**Solution**:

1. Check if the page loaded correctly
2. Verify selectors in `e2e/utils/selectors.ts`
3. Increase timeout in test if needed

### No Errors Found But Tests Fail

**Issue**: Tests fail but `QA_AUDIT_REPORT.md` shows no errors

**Solution**: Check Playwright test output for assertion failures (not JavaScript errors).

## Best Practices

1. **Run tests before committing**: `npm run test:e2e`
2. **Review QA_AUDIT_REPORT.md**: After each test run
3. **Fix critical errors first**: Uncaught exceptions and 5xx errors
4. **Address warnings**: Console warnings indicate potential issues
5. **Update selectors**: If UI changes, update `e2e/utils/selectors.ts`

## CI/CD Integration

To run tests in CI:

```yaml
# Example GitHub Actions
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: test-results
    path: |
      test-results/
      test-failures/
      QA_AUDIT_REPORT.md
```

## File Structure

```
e2e/
├── fixtures/
│   ├── global-error-listener.ts    # Error collection
│   ├── auth-helper.ts               # Authentication
│   └── test-setup.ts                # Test fixtures
├── helpers/
│   ├── monkey-test.ts               # Chaos testing
│   ├── form-helpers.ts              # Form interactions
│   └── report-generator.ts          # Report generation
├── workflows/
│   ├── chef-flow.spec.ts            # Critical path tests
│   ├── deep-crawl.spec.ts            # Page discovery
│   └── stress-test.spec.ts          # Stress testing
├── utils/
│   └── selectors.ts                  # Centralized selectors
└── reporter.ts                        # Custom reporter
```

## Next Steps

1. Run the test suite: `npm run test:e2e`
2. Review `QA_AUDIT_REPORT.md`
3. Fix any critical errors found
4. Re-run tests to verify fixes
5. Integrate into CI/CD pipeline

## Support

For issues or questions:

1. Check `QA_AUDIT_REPORT.md` for error details
2. Review test output in terminal
3. Check `test-failures/` for screenshots
4. Review Playwright HTML report: `npm run test:e2e:report`




