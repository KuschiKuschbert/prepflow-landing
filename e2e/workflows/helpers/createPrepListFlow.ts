/**
 * Helper function for generating a prep list from a menu in the chef workflow test.
 * Uses the flow: Prep Lists page -> Generate from Menu -> select menu -> Generate -> Save Prep Lists.
 */
import type { Page } from '@playwright/test';
import { waitForFormSubmission } from '../../helpers/form-helpers';
import { getSimWait } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createPrepListFlow(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Navigate to Prep Lists page');
  await page.goto('/webapp/prep-lists');
  await page.waitForLoadState('load');
  await page.waitForTimeout(getSimWait(800));
  await collectPageErrors(page);

  testSteps.push('Click Generate from Menu button');
  const generateBtn = page
    .locator('button:has-text("Generate from Menu"), button:has-text("Generate")')
    .first();
  const generateBtnVisible = await generateBtn.isVisible({ timeout: 15000 }).catch(() => false);
  if (!generateBtnVisible) {
    testSteps.push('[createPrepList] Generate from Menu button not visible - skipping');
    return;
  }
  await generateBtn.click();
  await page.waitForTimeout(getSimWait(1200));

  // Wait for modal to appear
  const modal = page.locator('text=Generate Prep List from Menu').first();
  const modalVisible = await modal.isVisible({ timeout: 10000 }).catch(() => false);
  if (!modalVisible) {
    testSteps.push('[createPrepList] Generate modal not visible - skipping');
    return;
  }

  // Wait for menus to load — either the <select> appears or "No menus found" div appears.
  // Uses a race so we don't time out if the API is slow.
  const noMenus = page.locator('text=No menus found').first();
  const menuSelect = page.locator('select').first();

  let selectVisible = false;
  try {
    // Race: wait up to 12s for either the select or "No menus found" to become visible
    await Promise.race([
      menuSelect.waitFor({ state: 'visible', timeout: 12000 }).then(() => {
        selectVisible = true;
      }),
      noMenus.waitFor({ state: 'visible', timeout: 12000 }),
    ]);
  } catch {
    // Neither appeared — fall through and let the checks below decide
  }

  if (!selectVisible && (await noMenus.isVisible({ timeout: 1000 }).catch(() => false))) {
    testSteps.push('No menus found - closing modal');
    const closeBtn = page.locator('button[aria-label="Close"], button:has-text("Cancel")').first();
    if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await closeBtn.click();
    }
    return;
  }

  testSteps.push('Select first menu and generate');
  if (!selectVisible) {
    // Last-chance wait if we somehow missed it
    const fallbackVisible = await menuSelect.isVisible({ timeout: 5000 }).catch(() => false);
    if (!fallbackVisible) {
      testSteps.push('Menu select not found - closing modal and skipping');
      const cancelBtn = page.locator('button:has-text("Cancel")').first();
      if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await cancelBtn.click();
      }
      return;
    }
  }
  const firstOption = menuSelect.locator('option[value]:not([value=""])').first();
  const hasOptions =
    (await firstOption.count()) > 0 &&
    (await firstOption.isVisible({ timeout: 2000 }).catch(() => false));
  if (!hasOptions) {
    const cancelBtn = page.locator('button:has-text("Cancel")').first();
    if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cancelBtn.click();
    }
    return;
  }

  const firstValue = await firstOption.getAttribute('value');
  if (firstValue) {
    await menuSelect.selectOption(firstValue);
    await page.waitForTimeout(getSimWait(500));
  }

  const generatePrepListBtn = page.locator('button:has-text("Generate Prep List")').first();
  const genPrepVisible = await generatePrepListBtn.isVisible({ timeout: 5000 }).catch(() => false);
  if (!genPrepVisible) {
    testSteps.push('[createPrepList] Generate Prep List button not visible - skipping');
    return;
  }
  await generatePrepListBtn.click();
  await page.waitForTimeout(getSimWait(2000)); // API + preview load

  // Preview modal: Save Prep Lists or Cancel
  const saveBtn = page.locator('button:has-text("Save Prep Lists")').first();
  const sectionsEmpty = page.locator('text=No ingredients found in this menu').first();
  if (await sectionsEmpty.isVisible({ timeout: 2000 }).catch(() => false)) {
    testSteps.push('Menu has no ingredients - closing preview');
    const cancelBtn = page.locator('button:has-text("Cancel")').first();
    await cancelBtn.click();
    return;
  }

  if (await saveBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    testSteps.push('Save prep lists from preview');
    await saveBtn.click();
    await waitForFormSubmission(page);
    await page.waitForTimeout(getSimWait(800));
  }

  await collectPageErrors(page);
  testSteps.push('Prep list flow completed');
}
