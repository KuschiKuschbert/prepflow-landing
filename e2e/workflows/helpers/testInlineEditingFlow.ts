/**
 * Test inline editing interactions on par levels and menu titles.
 * Clicks editable fields, types new values, and saves or cancels.
 * Resilient: continues even if inline editing is not available.
 */
import type { Page } from '@playwright/test';
import { getSimWait, safeGoto } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

async function testParLevelInlineEdit(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test par level inline editing');
  if (!(await safeGoto(page, '/webapp/par-levels'))) {
    testSteps.push('[testInlineEdit] par-levels nav failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(1000));

  const editableCell = page
    .locator(
      'input[type="number"][name*="par"], input[type="number"][name*="level"], td input[type="number"], [contenteditable="true"]',
    )
    .first();

  if (await editableCell.isVisible({ timeout: 5000 }).catch(() => false)) {
    const currentValue = await editableCell.inputValue().catch(() => '');
    await editableCell.fill('25');
    await page.waitForTimeout(getSimWait(300));
    testSteps.push('Edited par level inline value to 25 kg');

    await editableCell.fill(currentValue || '10');
    await page.waitForTimeout(getSimWait(300));
    testSteps.push('Restored original par level value');
  } else {
    const editBtn = page.locator('button:has-text("Edit"), button[aria-label*="Edit"]').first();
    if (await editBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await editBtn.click();
      await page.waitForTimeout(getSimWait(600));

      const parInput = page.locator('input[type="number"]').first();
      if (await parInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await parInput.fill('25');
        await page.waitForTimeout(getSimWait(300));
        testSteps.push('Edited par level value via edit button');
      }

      const cancelBtn = page.locator('button:has-text("Cancel")').first();
      if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await cancelBtn.click();
      }
    } else {
      testSteps.push('No inline editing available on par levels');
    }
  }

  await collectPageErrors(page);
}

async function testMenuTitleInlineEdit(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test menu title inline editing');
  if (!(await safeGoto(page, '/webapp/menu-builder'))) {
    testSteps.push('[testInlineEdit] menu-builder nav failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(1200));

  const menuTitle = page
    .locator(
      'h2[contenteditable], h3[contenteditable], [data-editable="true"], input[name*="menu_name"], input[name*="title"]',
    )
    .first();

  if (await menuTitle.isVisible({ timeout: 3000 }).catch(() => false)) {
    await menuTitle.click();
    await page.waitForTimeout(getSimWait(300));
    testSteps.push('Clicked editable menu title');
  } else {
    const editTitleBtn = page
      .locator('button[aria-label*="Edit title"], button[aria-label*="Rename"]')
      .first();
    if (await editTitleBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editTitleBtn.click();
      await page.waitForTimeout(getSimWait(500));
      testSteps.push('Clicked edit title button');

      const cancelBtn = page.locator('button:has-text("Cancel")').first();
      if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await cancelBtn.click();
      }
    } else {
      testSteps.push('No inline menu title editing found');
    }
  }

  await collectPageErrors(page);
}

export async function testInlineEditingFlow(page: Page, testSteps: string[] = []): Promise<void> {
  testSteps.push('Begin inline editing tests');

  await testParLevelInlineEdit(page, testSteps);
  await testMenuTitleInlineEdit(page, testSteps);

  testSteps.push('Inline editing tests completed');
}
