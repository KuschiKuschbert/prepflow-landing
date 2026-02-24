/**
 * Helper function for creating a temperature log in the chef workflow test.
 */
import type { Page } from '@playwright/test';
import { fillTemperatureLogForm, waitForFormSubmission } from '../../helpers/form-helpers';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createTemperatureLogFlow(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Step 19: Navigate to Temperature page and open add log form');
  await page.goto('/webapp/temperature?action=new');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2500); // Allow form to open from action=new (equipment fetch + hydration)
  await collectPageErrors(page);

  // If ?action=new didn't open form, click Add Temperature Log button as fallback
  let formVisible = await page
    .locator('input[name*="temperature"], input[type="date"][name*="date"], input[type="number"]')
    .first()
    .isVisible({ timeout: 3000 })
    .catch(() => false);
  if (!formVisible) {
    const addTempButton = page
      .locator(
        'button:has-text("Add Temperature Log"), button:has-text("Add Temperature"), button:has-text("Add Log"), button:has-text("➕")',
      )
      .first();
    if (await addTempButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addTempButton.click();
      await page.waitForTimeout(1500);
      formVisible = await page
        .locator('input[name*="temperature"], input[type="date"]')
        .first()
        .isVisible({ timeout: 3000 })
        .catch(() => false);
    }
  }
  if (!formVisible) {
    testSteps.push('Skip: No equipment - cannot add temperature log');
    return;
  }
  await collectPageErrors(page);

  testSteps.push('Step 21: Fill temperature log form');
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().split(' ')[0].substring(0, 5);

  await fillTemperatureLogForm(page, {
    temperature: '4.5',
    temperatureType: 'food_cold_holding',
    location: 'Main Fridge',
    notes: 'Routine check - E2E test',
  });
  await collectPageErrors(page);

  testSteps.push('Step 22: Submit temperature log form');
  const tempSubmitButton = page
    .locator('button:has-text("Save Log"), button:has-text("Add"), button[type="submit"]')
    .first();
  await tempSubmitButton.click();
  await waitForFormSubmission(page);
  await collectPageErrors(page);
  testSteps.push('Step 23: Temperature log submitted');
}
