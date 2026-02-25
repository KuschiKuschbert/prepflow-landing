/**
 * Create a par level in the par-levels page.
 * Resilient: continues even if some steps fail.
 */
import type { Page } from '@playwright/test';
import { getSimWait } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createParLevelFlow(
  page: Page,
  _prefix: string,
  testSteps: string[] = [],
): Promise<void> {
  testSteps.push('Navigate to Par Levels');
  await page.goto('/webapp/par-levels');
  await page.waitForLoadState('load');
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
  await page.waitForTimeout(getSimWait(800)); // Allow DOM to stabilize (avoids "element detached" on re-renders)
  // Re-query and use force click to avoid detached element (list re-renders can detach buttons)
  await page
    .getByRole('button', { name: /Add Par Level/i })
    .first()
    .click({ force: true, timeout: 5000 });
  await page.waitForTimeout(getSimWait(500));

  const ingredientSelect = page.locator('select').first();
  if (await ingredientSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
    const options = await ingredientSelect.locator('option:not([value=""])').all();
    if (options.length > 0) {
      const value = await options[0].getAttribute('value');
      if (value) await ingredientSelect.selectOption(value);
    }
  }

  const parInput = page.locator('input[type="number"], input[name="parLevel"]').first();
  if (await parInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await parInput.fill('10');
  }

  const reorderInput = page.locator('input[name="reorderPointPercentage"]').first();
  if (await reorderInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await reorderInput.fill('20');
  }

  const saveBtn = page.locator('button:has-text("Save"), button[type="submit"]').first();
  if (await saveBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await saveBtn.click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(getSimWait(500));
  }
  await collectPageErrors(page);
}
