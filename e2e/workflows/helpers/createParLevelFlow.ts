/**
 * Create a par level in the par-levels page.
 * Resilient: continues even if some steps fail.
 */
import type { Page } from '@playwright/test';
import { getSimWait, safeGoto } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createParLevelFlow(
  page: Page,
  _prefix: string,
  testSteps: string[] = [],
): Promise<void> {
  testSteps.push('Navigate to Par Levels');
  if (!(await safeGoto(page, '/webapp/par-levels'))) {
    return;
  }
  await page.waitForTimeout(getSimWait(800));
  await collectPageErrors(page);

  const addBtn = page
    .locator('button:has-text("Add Par Level"), button:has-text("+ Add Par Level")')
    .first();
  await addBtn.waitFor({ state: 'visible', timeout: 15000 }).catch(() => null);
  if (!(await addBtn.isVisible().catch(() => false))) {
    testSteps.push('Add Par Level button not found - skip');
    return;
  }
  await page.waitForTimeout(getSimWait(800)); // Allow DOM to stabilize
  // Re-query with locator (not getByRole) to avoid strict-mode mismatch and detachment
  const addBtnFresh = page
    .locator('button:has-text("Add Par Level"), button:has-text("+ Add Par Level")')
    .first();
  if (!(await addBtnFresh.isVisible({ timeout: 5000 }).catch(() => false))) {
    testSteps.push('Add Par Level button vanished after stabilization - skip');
    return;
  }
  await addBtnFresh.click({ force: true });
  await page.waitForTimeout(getSimWait(500));

  // Select first available ingredient
  const ingredientSelect = page.locator('select').first();
  if (await ingredientSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
    const options = await ingredientSelect.locator('option:not([value=""])').all();
    if (options.length > 0) {
      const value = await options[0].getAttribute('value');
      if (value) await ingredientSelect.selectOption(value);
      await page.waitForTimeout(getSimWait(500)); // Allow unit auto-fill
    }
  }

  // Par level: form uses type="text" with placeholder="50" (not type="number" or name="parLevel")
  const parInput = page.locator('input[placeholder="50"]').first();
  if (await parInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await parInput.fill('10');
    await page.waitForTimeout(300);
  }

  // Reorder point: form uses input[type="range"] (not name="reorderPointPercentage")
  const reorderSlider = page.locator('input[type="range"]').first();
  if (await reorderSlider.isVisible({ timeout: 1000 }).catch(() => false)) {
    await reorderSlider.fill('20');
    await page.waitForTimeout(300);
  }

  // Click save only if button is enabled (validation passed)
  const saveBtn = page.locator('button[type="submit"]').first();
  if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    const isEnabled = await saveBtn.isEnabled().catch(() => false);
    if (isEnabled) {
      await saveBtn.click({ timeout: 5000 });
      await page.waitForLoadState('load');
      await page.waitForTimeout(getSimWait(500));
    } else {
      testSteps.push('Par level save button disabled - required fields missing, skipping');
    }
  }
  await collectPageErrors(page);
}
