/**
 * Helper function for creating a compliance record in the chef workflow test.
 * Requires at least one compliance type (populate-clean-test-data seeds these).
 * Flow: Compliance page -> Add Compliance Record -> fill form -> Save Record.
 */
import type { Page } from '@playwright/test';
import { waitForFormSubmission } from '../../helpers/form-helpers';
import { getSimWait } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

function futureDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0]!;
}

export async function createComplianceRecordFlow(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Navigate to Compliance page');
  await page.goto('/webapp/compliance');
  await page.waitForLoadState('load');
  await page.waitForTimeout(getSimWait(1200));
  await collectPageErrors(page);

  testSteps.push('Click Add Compliance Record');
  const addRecordBtn = page.locator('button:has-text("Add Compliance Record")').first();
  await addRecordBtn.waitFor({ state: 'visible', timeout: 10000 });
  await addRecordBtn.click();
  await page.waitForTimeout(getSimWait(1000));

  const form = page.locator('text=Add New Compliance Record').first();
  await form.waitFor({ state: 'visible', timeout: 5000 });

  const typeSelect = page.locator('select').filter({ hasText: 'Choose a compliance type' }).first();
  await typeSelect.waitFor({ state: 'visible', timeout: 5000 });
  const typeOptions = typeSelect.locator('option[value]:not([value=""])');
  const typeCount = await typeOptions.count();
  if (typeCount === 0) {
    testSteps.push('No compliance types - canceling');
    const cancelBtn = page.locator('button:has-text("Cancel")').first();
    await cancelBtn.click();
    return;
  }

  testSteps.push('Fill compliance record form');
  const firstTypeVal = await typeOptions.first().getAttribute('value');
  if (firstTypeVal) {
    await typeSelect.selectOption(firstTypeVal);
  }
  await page.waitForTimeout(getSimWait(400));

  const docNameInput = page
    .locator(
      'input[placeholder*="Annual Pest Control"], input[placeholder*="Pest"], input[placeholder*="document"]',
    )
    .first();
  await docNameInput.fill('Sim Test Compliance Doc');
  await page.waitForTimeout(getSimWait(300));

  const expiryInputs = page.locator('input[type="date"]');
  const expiryCount = await expiryInputs.count();
  if (expiryCount >= 2) {
    await expiryInputs.nth(1).fill(futureDate(365));
    await page.waitForTimeout(getSimWait(200));
  }

  const saveBtn = page.locator('button:has-text("Save Record")').first();
  await saveBtn.click();
  await waitForFormSubmission(page);
  await page.waitForTimeout(getSimWait(600));

  await collectPageErrors(page);
  testSteps.push('Compliance record flow completed');
}
