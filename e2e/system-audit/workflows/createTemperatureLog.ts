/**
 * Chef Workflow - Temperature Log.
 */
import { Page, expect } from '@playwright/test';
import { collectPageErrors } from '../../fixtures/global-error-listener';

/**
 * Chef Workflow - Temperature Log.
 */
export async function chefWorkflowCreateTemperatureLog(
  page: Page,
  visitedPages: Set<string>,
): Promise<void> {
  await page.goto('/webapp/temperature');
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);
  visitedPages.add(page.url());

  const addButton = page.locator('button:has-text("Add Log"), button:has-text("New Log")').first();
  await addButton.click();
  await page.waitForTimeout(500);

  const equipmentSelect = page
    .locator('select[name="equipment_id"], select[name="equipment"]')
    .first();
  if ((await equipmentSelect.count()) > 0) {
    await equipmentSelect.selectOption({ index: 1 });
  }

  await page.fill(
    'input[name="temperature_celsius"], input[type="number"][placeholder*="Temperature"]',
    '3.5',
  );

  const locationInput = page.locator('input[name="location"]').first();
  if ((await locationInput.count()) > 0) {
    await locationInput.fill('Main Fridge');
  }

  const submitButton = page
    .locator('button[type="submit"], button:has-text("Save"), button:has-text("Add Log")')
    .first();
  await submitButton.click();
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);

  await expect(page.locator('text=3.5').or(page.locator('text=Success')).first()).toBeVisible({
    timeout: 10000,
  });
}


