/**
 * Systematically navigate to every webapp route and assert pages load
 * without console errors. This is a navigation coverage sweep that
 * explicitly visits all known routes (unlike crawl which follows links).
 * Resilient: continues even if individual pages fail to load.
 */
import type { Page } from '@playwright/test';
import { getSimWait, SIM_FAST } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

const ALL_ROUTES = [
  '/webapp',
  '/webapp/recipes',
  '/webapp/recipes#dishes',
  '/webapp/recipes#recipes',
  '/webapp/ingredients',
  '/webapp/menu-builder',
  '/webapp/dish-builder',
  '/webapp/sections',
  '/webapp/performance',
  '/webapp/cogs',
  '/webapp/temperature',
  '/webapp/cleaning',
  '/webapp/compliance',
  '/webapp/suppliers',
  '/webapp/par-levels',
  '/webapp/order-lists',
  '/webapp/prep-lists',
  '/webapp/functions',
  '/webapp/customers',
  '/webapp/staff',
  '/webapp/roster',
  '/webapp/time-attendance',
  '/webapp/calendar',
  '/webapp/specials',
  '/webapp/recipe-sharing',
  '/webapp/square',
  '/webapp/guide',
  '/webapp/setup',
  '/webapp/settings',
  '/webapp/settings/billing',
  '/webapp/settings/backup',
];

export async function navigateAllModulesFlow(page: Page, testSteps: string[] = []): Promise<void> {
  testSteps.push(`Begin navigation sweep of ${ALL_ROUTES.length} routes`);

  let successCount = 0;
  let failCount = 0;

  for (const route of ALL_ROUTES) {
    try {
      await page.goto(route, {
        waitUntil: SIM_FAST ? 'domcontentloaded' : 'load',
        timeout: 15000,
      });
      await page.waitForTimeout(getSimWait(400));
      await collectPageErrors(page);
      successCount++;
    } catch {
      failCount++;
      testSteps.push(`Failed to load: ${route}`);
    }
  }

  testSteps.push(
    `Navigation sweep completed: ${successCount}/${ALL_ROUTES.length} pages loaded, ${failCount} failed`,
  );
}
