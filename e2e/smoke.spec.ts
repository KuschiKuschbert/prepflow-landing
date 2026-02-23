/**
 * Smoke E2E Test - Zero Console Errors
 *
 * Minimal test that visits key pages and asserts no console.error/console.warn.
 * Fast execution for CI and local pre-commit checks.
 *
 * Key routes: landing, webapp, ingredients, recipes
 */

import { test, expect } from '@playwright/test';
import {
  setupGlobalErrorListener,
  collectPageErrors,
  getNonAllowlistedErrors,
  clearCollectedErrors,
} from './fixtures/global-error-listener';
import { ensureAuthenticated } from './fixtures/auth-helper';

const SMOKE_PAGES = [
  { url: '/', name: 'Landing' },
  { url: '/webapp', name: 'Webapp Dashboard' },
  { url: '/webapp/ingredients', name: 'Ingredients' },
  { url: '/webapp/recipes', name: 'Recipes' },
];

test.describe('Smoke - Zero Console Errors', () => {
  test.beforeEach(async ({ page }) => {
    clearCollectedErrors();
    await setupGlobalErrorListener(page);
  });

  test('Landing page loads with no console errors', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);

    const errors = getNonAllowlistedErrors();
    expect(errors.length).toBe(0);
  });

  test('Webapp key pages load with no console errors', async ({ page }) => {
    await ensureAuthenticated(page);

    for (const { url, name } of SMOKE_PAGES) {
      if (url === '/') continue; // Landing tested separately
      await page.goto(url);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await collectPageErrors(page);
    }

    const errors = getNonAllowlistedErrors();
    if (errors.length > 0) {
      console.error('Non-allowlisted errors on smoke pages:', errors);
    }
    expect(errors.length).toBe(0);
  });
});
