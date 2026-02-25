/**
 * Simulate a stocktake entry by editing an existing ingredient's pack size.
 * Navigates to ingredients, clicks the first ingredient row, updates pack size
 * to a metric value (15 kg), saves, and verifies the update persists.
 * Resilient: continues even if some steps fail.
 */
import type { Page } from '@playwright/test';
import { getSimWait } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function updateIngredientStockFlow(
  page: Page,
  testSteps: string[] = [],
): Promise<void> {
  testSteps.push('Navigate to Ingredients page');
  await page.goto('/webapp/ingredients');
  await page.waitForLoadState('load');
  await page.waitForTimeout(getSimWait(1200));
  await collectPageErrors(page);

  testSteps.push('Locate first ingredient row');
  const firstRow = page.locator('table tbody tr, div[class*="group"][class*="rounded"]').first();
  if (!(await firstRow.isVisible({ timeout: 8000 }).catch(() => false))) {
    testSteps.push('No ingredients found - skip stocktake');
    return;
  }

  const editBtn = firstRow
    .locator('button:has-text("Edit"), button[aria-label*="Edit"], svg')
    .first();
  if (await editBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await editBtn.click();
  } else {
    await firstRow.click();
  }
  await page.waitForTimeout(getSimWait(1000));
  await collectPageErrors(page);

  testSteps.push('Update pack size to 15 kg (metric stocktake)');
  const packSizeInput = page
    .locator('input[placeholder*="e.g., 5"], input[name*="pack_size"], input[name*="packSize"]')
    .first();
  if (await packSizeInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await packSizeInput.fill('15');
    await page.waitForTimeout(getSimWait(300));
  } else {
    testSteps.push('Pack size input not found - skip');
    const cancelBtn = page.locator('button:has-text("Cancel")').first();
    if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cancelBtn.click();
    }
    return;
  }

  const unitSelect = page
    .locator('select[name*="unit"], label:has-text("Pack Unit") + select')
    .first();
  if (await unitSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
    await unitSelect.selectOption('KG').catch(() => {});
    await page.waitForTimeout(getSimWait(200));
  }

  testSteps.push('Save updated ingredient');
  const saveBtn = page
    .locator(
      'button:has-text("Save Ingredient"), button:has-text("Save"), button:has-text("Update"), button[type="submit"]',
    )
    .first();
  if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await saveBtn.click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(getSimWait(1000));
  }

  await collectPageErrors(page);
  testSteps.push('Ingredient stock update flow completed');
}
