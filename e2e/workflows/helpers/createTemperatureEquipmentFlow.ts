/**
 * Create temperature equipment in the temperature page.
 * Switches to Equipment tab, adds new equipment.
 * Resilient: continues even if some steps fail.
 */
import type { Page } from '@playwright/test';
import { getSimWait, safeGoto } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createTemperatureEquipmentFlow(
  page: Page,
  prefix: string,
  testSteps: string[] = [],
): Promise<void> {
  testSteps.push('Navigate to Temperature');
  if (!(await safeGoto(page, '/webapp/temperature'))) { return; }
  await page.waitForTimeout(getSimWait(500));
  await collectPageErrors(page);

  const equipmentTab = page
    .locator('button:has-text("Equipment"), a:has-text("Equipment")')
    .first();
  if (await equipmentTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await equipmentTab.click();
    await page.waitForTimeout(getSimWait(500));
  }

  const addBtn = page
    .locator('button:has-text("Add"), button:has-text("Add Equipment"), button:has-text("+")')
    .first();
  if (!(await addBtn.isVisible().catch(() => false))) {
    testSteps.push('Add Equipment button not found - skip');
    return;
  }
  await addBtn.click();
  await page.waitForTimeout(getSimWait(500));

  const nameInput = page
    .locator('input[name="name"], input[placeholder*="Fridge"], input[placeholder*="Equipment"]')
    .first();
  if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    const name = `${prefix}_Fridge`;
    await nameInput.fill(name);
  }

  const typeSelect = page.locator('select[name="equipmentType"], select').first();
  if (await typeSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
    await typeSelect.selectOption({ index: 1 }).catch(() => {});
  }

  const saveBtn = page.locator('button:has-text("Add"), button:has-text("Save")').first();
  if (await saveBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await saveBtn.click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(getSimWait(500));
  }
  await collectPageErrors(page);
}
