import { test as base } from '@playwright/test';
import {
  setupGlobalErrorListener,
  collectPageErrors,
  clearCollectedErrors,
} from './global-error-listener';
import { ensureAuthenticated } from './auth-helper';

/**
 * Extended test fixture with global error listener and auth
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // Setup global error listener
    await setupGlobalErrorListener(page);

    // Ensure authenticated
    await ensureAuthenticated(page);

    // Use the page
    await use(page);

    // Collect errors after test
    await collectPageErrors(page);
  },
});

export { expect } from '@playwright/test';

