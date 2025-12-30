/**
 * Helper function for creating a temperature log in the chef workflow test.
 */
import type { Page } from '@playwright/test';
import { fillTemperatureLogForm, waitForFormSubmission } from '../../helpers/form-helpers';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createTemperatureLogFlow(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Step 19: Navigate to Temperature page');
  await page.goto('/webapp/temperature');
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);

  testSteps.push('Step 20: Click Add Temperature Log button');
  const addTempButton = page
    .locator(
      'button:has-text("Add Temperature"), button:has-text("Add Log"), button:has-text("➕")',
    )
    .first();
  await addTempButton.click();
  await page.waitForTimeout(1000);
  await collectPageErrors(page);

  testSteps.push('Step 21: Fill temperature log form');
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().split(' ')[0].substring(0, 5);

  await fillTemperatureLogForm(page, {
    date: today,
    time: now,
    temperature: '4.5',
    temperatureType: 'fridge',
    location: 'Main Fridge',
    notes: 'Routine check - E2E test',
  });
  await collectPageErrors(page);

  testSteps.push('Step 22: Submit temperature log form');
  const tempSubmitButton = page
    .locator('button:has-text("Add"), button:has-text("Log Temperature"), button[type="submit"]')
    .first();
  await tempSubmitButton.click();
  await waitForFormSubmission(page);
  await collectPageErrors(page);
  testSteps.push('Step 23: Temperature log submitted');
}
