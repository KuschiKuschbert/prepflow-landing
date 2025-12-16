# System Audit E2E Test Suite

High-velocity, headed E2E test suite for PrepFlow that stress-tests application logic and server stability.

## Configuration

- **Mode:** Headed (visible browser)
- **Speed:** Maximum (no slowMo delays)
- **Viewport:** 1920x1080
- **Parallelism:** Serial (1 worker) to avoid database race conditions
- **Error Capture:** Console errors, warnings, network errors (400+), uncaught exceptions

## Test Suite Structure

### 1. Global Error Interceptor ("Black Box")

- Captures all `console.error` and `console.warn` messages
- Captures all network responses with status 400 or higher
- Captures uncaught exceptions
- Persists throughout the entire test session

### 2. Chef Workflow (Business Logic Tests)

Executes complex workflows in order:

1. **Login** - Authenticate as standard user
2. **Create Ingredient** - Create dry-store ingredient (`AUTO_TEST_Flour`) with metric units (kg)
3. **Create Recipe/Dish** - Create dish (`AUTO_TEST_Pizza`) and add the ingredient
4. **Create Menu Cycle** - Create menu and add dish to "Dinner Service"
5. **Temperature Log** - Log temperature reading for a fridge (3.5°C)
6. **Equipment Maintenance** - Create equipment maintenance log

### 3. Gremlin Crawler (Chaos Testing)

After business workflows:

- Scans current page for ALL links
- Visits each unique link
- On every page:
  - Finds all form inputs (input, select, textarea)
  - Fills them with valid random data (fuzzing)
  - Does NOT submit forms (to avoid junk data)
  - Checks for broken images (naturalWidth === 0)
  - Takes screenshots

### 4. Teardown (Cleanup)

- Navigates to Inventory, Recipes, Menus
- Searches for `AUTO_TEST_` prefix
- Deletes all matching items to clean the database

### 5. Problem Document

After all tests, generates `QA_AUDIT_REPORT.md` with:

- Summary: Total pages visited, Total errors found
- Error Log: Table of URL | Error Type | Message | Timestamp
- Screenshots: Reference local paths to screenshots taken

## Running the Tests

### Prerequisites

- Development server running (`npm run dev`)
- Database accessible
- Authentication configured (or bypassed in dev mode)

### Run Tests

```bash
# Run system audit test suite
npm run test:e2e e2e/system-audit.spec.ts

# Run with UI mode (interactive)
npm run test:e2e:ui e2e/system-audit.spec.ts

# Run in headed mode (visible browser)
npm run test:e2e:headed e2e/system-audit.spec.ts

# Debug mode
npm run test:e2e:debug e2e/system-audit.spec.ts
```

### View Results

After tests complete:

1. Check `QA_AUDIT_REPORT.md` in project root for detailed report
2. Check `test-results/screenshots/` for page screenshots
3. Check Playwright HTML report: `npm run test:e2e:report`

## Test Prefix

All test data uses prefix: `AUTO_TEST_[Timestamp]`

This ensures:

- Test data is easily identifiable
- Cleanup can find all test items
- No conflicts with real data

## Error Collection

Errors are collected throughout the test session:

- **Console Errors:** JavaScript errors logged to console
- **Console Warnings:** Warning messages
- **Network Errors:** HTTP 400+ responses
- **Uncaught Exceptions:** Unhandled JavaScript errors

All errors include:

- URL where error occurred
- Error type
- Error message
- Timestamp
- Optional screenshot path

## Performance

The test suite is optimized for speed:

- No artificial delays (no slowMo)
- Relies on `waitForLoadState('networkidle')` for stability
- Uses auto-waiting locators
- Serial execution prevents database race conditions

## Troubleshooting

### Tests Fail to Start

- Ensure dev server is running: `npm run dev`
- Check base URL in `playwright.config.ts`
- Verify authentication is configured or bypassed

### Cleanup Fails

- Check database connection
- Verify test prefix matches (`AUTO_TEST_`)
- Manually clean up test data if needed

### Missing Screenshots

- Check `test-results/screenshots/` directory exists
- Verify file permissions
- Check disk space

## Report Format

The `QA_AUDIT_REPORT.md` includes:

```markdown
# System Audit Report

## Summary

- Total Pages Visited: X
- Total Errors Found: Y
- Screenshots Taken: Z

## Pages Visited

- List of all URLs visited

## Error Log

| URL | Error Type | Message | Timestamp |
| --- | ---------- | ------- | --------- |
| ... | ...        | ...     | ...       |

## Screenshots

- List of screenshot paths
```

## Notes

- Tests run serially to avoid database race conditions
- Browser is visible (headed mode) for debugging
- All form inputs are fuzzed but NOT submitted (to avoid junk data)
- Test data is automatically cleaned up after tests complete




