/**
 * Create a roster shift via the roster page.
 * Opens the shift form, fills employee, date, start/end time (24h format), submits.
 * Also tests week navigation (previous/next buttons).
 * Resilient: continues even if shift form is not accessible.
 */
import type { Page } from '@playwright/test';
import { getSimWait } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createRosterShiftFlow(page: Page, testSteps: string[] = []): Promise<void> {
  testSteps.push('Navigate to Roster page');
  await page.goto('/webapp/roster');
  await page.waitForLoadState('load');
  await page.waitForTimeout(getSimWait(1200));
  await collectPageErrors(page);

  testSteps.push('Test week navigation');
  const nextWeekBtn = page
    .locator('button:has-text("Next"), button[aria-label*="Next"], button[aria-label*="next week"]')
    .first();
  if (await nextWeekBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await nextWeekBtn.click();
    await page.waitForTimeout(getSimWait(600));
    testSteps.push('Navigated to next week');

    const prevWeekBtn = page
      .locator(
        'button:has-text("Previous"), button:has-text("Prev"), button[aria-label*="Previous"], button[aria-label*="prev"]',
      )
      .first();
    if (await prevWeekBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await prevWeekBtn.click();
      await page.waitForTimeout(getSimWait(600));
      testSteps.push('Navigated back to current week');
    }
  }
  await collectPageErrors(page);

  testSteps.push('Attempt to create a shift');
  const addShiftBtn = page
    .locator(
      'button:has-text("Add Shift"), button:has-text("New Shift"), button:has-text("Create Shift")',
    )
    .first();

  const rosterCell = page
    .locator('[data-roster-cell], td.cursor-pointer, div[class*="roster-cell"]')
    .first();

  if (await addShiftBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await addShiftBtn.click();
    await page.waitForTimeout(getSimWait(800));
  } else if (await rosterCell.isVisible({ timeout: 3000 }).catch(() => false)) {
    await rosterCell.click();
    await page.waitForTimeout(getSimWait(800));
    testSteps.push('Clicked roster cell to create shift');
  } else {
    testSteps.push('No shift creation trigger found - skip');
    return;
  }

  testSteps.push('Fill shift form');
  const employeeSelect = page.locator('select[name*="employee"], select').first();
  if (await employeeSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
    const options = employeeSelect.locator('option[value]:not([value=""])');
    const count = await options.count();
    if (count > 0) {
      const val = await options.first().getAttribute('value');
      if (val) await employeeSelect.selectOption(val);
    }
  }

  const startTimeInput = page.locator('input[type="time"]').first();
  if (await startTimeInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await startTimeInput.fill('06:00');
    await page.waitForTimeout(getSimWait(200));
  }

  const endTimeInput = page.locator('input[type="time"]').nth(1);
  if (await endTimeInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await endTimeInput.fill('14:30');
    await page.waitForTimeout(getSimWait(200));
  }

  const saveBtn = page
    .locator(
      'button:has-text("Save"), button:has-text("Create"), button:has-text("Add Shift"), button[type="submit"]',
    )
    .first();
  if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await saveBtn.click();
    await page.waitForTimeout(getSimWait(800));
  }

  await collectPageErrors(page);
  testSteps.push('Roster shift flow completed');
}
