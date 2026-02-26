/**
 * Create a function (event) in the functions page.
 * Resilient: continues even if some steps fail.
 */
import type { Page } from '@playwright/test';
import { getSimWait, safeGoto } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createFunctionFlow(
  page: Page,
  prefix: string,
  testSteps: string[] = [],
): Promise<void> {
  testSteps.push('Navigate to Functions');
  if (!(await safeGoto(page, '/webapp/functions'))) { return; }
  await page.waitForTimeout(getSimWait(500));
  await collectPageErrors(page);

  const newBtn = page
    .locator('button:has-text("New Function"), a:has-text("New Function")')
    .first();
  if (!(await newBtn.isVisible().catch(() => false))) {
    testSteps.push('New Function button not found - skip');
    return;
  }
  await newBtn.click();
  await page.waitForTimeout(getSimWait(500));

  const nameInput = page
    .locator('input[placeholder*="Wedding"], input[placeholder*="Event"]')
    .first();
  if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    const name = `${prefix}_Event`;
    await nameInput.fill(name);
  }

  const dateInput = page.locator('input[type="date"]').first();
  if (await dateInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    const d = new Date();
    const dateStr = d.toISOString().slice(0, 10);
    await dateInput.fill(dateStr);
  }

  const saveBtn = page
    .locator('button:has-text("Create Event"), button:has-text("Create")')
    .first();
  if (await saveBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    if (!(await saveBtn.isDisabled().catch(() => false))) {
      await saveBtn.click({ force: true });
      await page.waitForTimeout(getSimWait(500));
    } else {
      testSteps.push('Create Event button disabled - skipping submit');
    }
  }
  await collectPageErrors(page);
}
