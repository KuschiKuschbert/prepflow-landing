# E2E Test Suite

Comprehensive End-to-End testing suite using Playwright.

## Quick Start

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed
```

## Test Structure

- **fixtures/**: Test fixtures (error listener, auth helper)
- **helpers/**: Utility functions (monkey testing, form helpers, report generator)
- **workflows/**: Test suites (chef flow, deep crawl, stress tests)
- **utils/**: Shared utilities (selectors)

## Test Reports

After running tests, check:

- `QA_AUDIT_REPORT.md` - Comprehensive error report
- `test-failures/` - Screenshots of failures
- `playwright-report/` - HTML test report

See `docs/E2E_TESTING_GUIDE.md` for complete documentation.




