/**
 * Create a supplier in the suppliers page.
 * Resilient: continues even if some steps fail.
 */
import type { Page } from '@playwright/test';
import { getSimWait, SIM_FAST } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createSupplierFlow(
  page: Page,
  prefix: string,
  testSteps: string[] = [],
): Promise<void> {
  testSteps.push('Navigate to Suppliers');
  try {
    await page.goto('/webapp/suppliers', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  } catch {
    testSteps.push('[createSupplier] Navigation timed out - skipping');
    return;
  }
  if (page.url().includes('auth0.com') || page.url().includes('/api/auth/login')) {
    testSteps.push('[createSupplier] Redirected to auth - skipping');
    return;
  }
  await page.waitForLoadState(SIM_FAST ? 'domcontentloaded' : 'load').catch(() => {});
  await page.waitForTimeout(getSimWait(500));
  await collectPageErrors(page);

  const addBtn = page.locator('button:has-text("Add Supplier"), button:has-text("➕")').first();
  if (!(await addBtn.isVisible().catch(() => false))) {
    testSteps.push('Add Supplier button not found - skip');
    return;
  }
  await addBtn.click();
  await page.waitForTimeout(getSimWait(500));

  const nameInput = page
    .locator('input[name="name"], input[placeholder*="Supplier"], input[placeholder*="e.g."]')
    .first();
  if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    const name = `${prefix}_Supplier`;
    await nameInput.fill(name);
  }

  const saveBtn = page.locator('button:has-text("Save Supplier"), button:has-text("Save")').first();
  if (await saveBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await saveBtn.click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(getSimWait(500));
  }
  await collectPageErrors(page);
}
