/**
 * Dev simulation test - runs persona simulation using AUTH0_BYPASS_DEV.
 * Does NOT require SIM_AUTH_EMAIL. Uses ensureAuthenticated() for dev auth bypass.
 * Run with: SIM_FAST=true SIM_DAYS=2 SIM_FULL_SCOPE=true npx playwright test e2e/workflows/dev-simulation.spec.ts
 */
import { test, expect } from '@playwright/test';
import {
  setupGlobalErrorListener,
  collectPageErrors,
  getCollectedErrors,
  getNonAllowlistedErrors,
  clearCollectedErrors,
} from '../fixtures/global-error-listener';
import { ensureAuthenticated } from '../fixtures/auth-helper';
import { RESTAURANT_PERSONA } from '../simulation/personas/config';
import { runSimulation } from '../simulation/timeline';

test.describe('Dev Simulation: Restaurant (Auth Bypass)', () => {
  test.beforeEach(async ({ page }) => {
    clearCollectedErrors();
    await setupGlobalErrorListener(page);
  });

  test('Run restaurant simulation with dev auth', async ({ page }) => {
    await ensureAuthenticated(page);
    await expect(page).toHaveURL(/\/webapp/);

    await runSimulation(page, RESTAURANT_PERSONA);
    await collectPageErrors(page);
  });

  test.afterAll(() => {
    const errors = getNonAllowlistedErrors();
    if (errors.length > 0) {
      console.log(`\n=== ${errors.length} non-allowlisted errors ===`);
      errors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
    } else {
      console.log('\n=== Zero non-allowlisted errors ===');
    }

    const allErrors = getCollectedErrors();
    console.log(`Total collected errors: ${allErrors.length}`);
  });
});
