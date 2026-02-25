/**
 * Helper function for viewing order list (select menu, view ingredients, optionally print/export).
 * Order lists page is menu-centric: select menu -> view ingredients table -> print/export.
 */
import type { Page } from '@playwright/test';
import { getSimWait } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';
import { clickPrintIfAvailable } from './printOrExportHelpers';

export async function createOrderListFlow(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Navigate to Order Lists page');
  await page.goto('/webapp/order-lists');
  await page.waitForLoadState('load');
  await page.waitForTimeout(getSimWait(1200));
  await collectPageErrors(page);

  const noMenus = page.locator('text=No Menus Found').first();
  if (await noMenus.isVisible({ timeout: 3000 }).catch(() => false)) {
    testSteps.push('No menus - skipping order list');
    return;
  }

  testSteps.push('Select menu and wait for table');
  const menuSelect = page.locator('#menu-select').first();
  const menuSelectVisible = await menuSelect.isVisible({ timeout: 8000 }).catch(() => false);
  if (!menuSelectVisible) {
    testSteps.push('Menu select not visible - no menus available, skipping order list');
    return;
  }
  const firstOption = menuSelect.locator('option[value]:not([value=""])').first();
  const hasOptions =
    (await firstOption.count()) > 0 &&
    (await firstOption.isVisible({ timeout: 2000 }).catch(() => false));

  if (!hasOptions) {
    testSteps.push('No menu options available - skipping order list');
    return;
  }

  const firstVal = await firstOption.getAttribute('value');
  if (firstVal) {
    await menuSelect.selectOption(firstVal);
    await page.waitForTimeout(getSimWait(1500)); // Fetch ingredients
  }

  // Wait for table or empty state
  const table = page.locator('.order-list-print table, text=Item Name').first();
  const noIngredients = page.locator('text=No ingredients found for this menu').first();
  await Promise.race([
    table.waitFor({ state: 'visible', timeout: 5000 }),
    noIngredients.waitFor({ state: 'visible', timeout: 5000 }),
  ]).catch(() => {});

  await page.waitForTimeout(getSimWait(500));

  if (!(await noIngredients.isVisible({ timeout: 1000 }).catch(() => false))) {
    await clickPrintIfAvailable(page);
    await page.waitForTimeout(getSimWait(300));
  }

  await collectPageErrors(page);
  testSteps.push('Order list flow completed');
}
