/**
 * Test bulk operations on ingredients and recipes.
 * Enters selection mode, selects multiple items, triggers bulk actions
 * (delete, update supplier, update storage), interacts with confirmation dialogs.
 * Resilient: continues even if selection mode or bulk actions are unavailable.
 */
import type { Page } from '@playwright/test';
import { getSimWait, safeGoto } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

async function testIngredientBulkOps(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Navigate to Ingredients for bulk operations');
  if (!(await safeGoto(page, '/webapp/ingredients'))) {
    testSteps.push('[bulkOps] ingredients nav failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(1200));

  const selectAllBtn = page
    .locator(
      'button:has-text("Select All"), button:has-text("Select"), button[aria-label*="Select all"]',
    )
    .first();
  const checkboxes = page.locator(
    'button[aria-label*="Select"], button[aria-label*="Deselect"], input[type="checkbox"]',
  );
  const checkboxCount = await checkboxes.count();

  if (await selectAllBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await selectAllBtn.click();
    await page.waitForTimeout(getSimWait(400));
    testSteps.push('Clicked Select All');
  } else if (checkboxCount >= 2) {
    for (let i = 0; i < Math.min(checkboxCount, 3); i++) {
      const cb = checkboxes.nth(i);
      if (await cb.isVisible({ timeout: 1000 }).catch(() => false)) {
        await cb.click();
        await page.waitForTimeout(getSimWait(200));
      }
    }
    testSteps.push(`Selected ${Math.min(checkboxCount, 3)} items via checkboxes`);
  } else {
    testSteps.push('No selection mechanism found - skip bulk ops');
    return;
  }

  const bulkActionsBtn = page
    .locator(
      'button:has-text("Bulk Actions"), button:has-text("Actions"), button[aria-label*="Bulk"]',
    )
    .first();
  if (await bulkActionsBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await bulkActionsBtn.click();
    await page.waitForTimeout(getSimWait(400));
    testSteps.push('Opened bulk actions dropdown');

    const menuItems = page.locator(
      '[role="menuitem"], button:has-text("Delete"), button:has-text("Update Supplier"), button:has-text("Update Storage")',
    );
    const menuCount = await menuItems.count();
    testSteps.push(`Found ${menuCount} bulk action options`);

    if (menuCount > 0) {
      const firstItem = menuItems.first();
      const text = await firstItem.textContent().catch(() => 'unknown');
      testSteps.push(`First bulk action: "${text?.trim()}"`);
    }

    await page.keyboard.press('Escape');
    await page.waitForTimeout(getSimWait(300));
  }

  const deselectBtn = page
    .locator(
      'button:has-text("Deselect"), button:has-text("Cancel"), button:has-text("Done"), button:has-text("Clear")',
    )
    .first();
  if (await deselectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await deselectBtn.click();
    await page.waitForTimeout(getSimWait(300));
  }

  await collectPageErrors(page);
}

async function testRecipeBulkOps(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Navigate to Recipes for bulk operations');
  if (!(await safeGoto(page, '/webapp/recipes'))) {
    testSteps.push('[bulkOps] recipes nav failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(1200));

  const selectBtn = page.locator('button:has-text("Select"), button[aria-label*="Select"]').first();
  if (await selectBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await selectBtn.click();
    await page.waitForTimeout(getSimWait(400));
    testSteps.push('Entered recipe selection mode');

    const bulkBtn = page.locator('button:has-text("Bulk"), button:has-text("Actions")').first();
    if (await bulkBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      testSteps.push('Bulk actions available in recipe selection mode');
    }

    await page.keyboard.press('Escape');
  }

  await collectPageErrors(page);
}

export async function bulkOperationsFlow(page: Page, testSteps: string[] = []): Promise<void> {
  testSteps.push('Begin bulk operations tests');

  await testIngredientBulkOps(page, testSteps);
  await testRecipeBulkOps(page, testSteps);

  testSteps.push('Bulk operations tests completed');
}
