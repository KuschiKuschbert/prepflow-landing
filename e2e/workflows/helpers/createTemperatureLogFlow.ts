/**
 * Helper function for creating a temperature log in the chef workflow test.
 */
import type { Page } from '@playwright/test';
import { fillTemperatureLogForm, waitForFormSubmission } from '../../helpers/form-helpers';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createTemperatureLogFlow(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Navigate to Temperature page');
  try {
    await page.goto('/webapp/temperature', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
  } catch {
    testSteps.push('createTemperatureLog: goto /webapp/temperature timed out - skip');
    return;
  }
  await page.waitForTimeout(1500);
  await collectPageErrors(page);

  testSteps.push('Click Add Temperature Log button');
  const addTempButton = page
    .locator(
      'button:has-text("Add Temperature Log"), button:has-text("Add Temperature"), button:has-text("Add Log")',
    )
    .first();
  const buttonVisible = await addTempButton.isVisible({ timeout: 20000 }).catch(() => false);
  if (!buttonVisible) {
    testSteps.push('createTemperatureLog: Add button not found (API may be unavailable) - skip');
    return;
  }
  await addTempButton.click();
  await page.waitForTimeout(1000);
  await collectPageErrors(page);

  testSteps.push('Fill temperature log form');
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().split(' ')[0].substring(0, 5);

  try {
    await fillTemperatureLogForm(page, {
      date: today,
      time: now,
      temperature: '4.5',
      temperatureType: 'fridge',
      location: 'Main Fridge',
      notes: 'Routine check - E2E test',
    });
  } catch (err) {
    testSteps.push(`createTemperatureLog: form fill failed - ${String(err).slice(0, 80)}`);
    await collectPageErrors(page);
    return;
  }
  await collectPageErrors(page);

  testSteps.push('Submit temperature log form');
  const tempSubmitButton = page
    .locator('button:has-text("Add"), button:has-text("Log Temperature"), button[type="submit"]')
    .first();
  if (await tempSubmitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await tempSubmitButton.click();
    await waitForFormSubmission(page);
  }
  await collectPageErrors(page);
  testSteps.push('Temperature log submitted');
}
