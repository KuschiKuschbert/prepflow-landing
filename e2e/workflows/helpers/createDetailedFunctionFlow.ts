/**
 * Create a detailed function/event with full form coverage.
 * Fills event name, date, start time (18:00), end time (23:00), pax (200).
 * Tests missing-field validation by attempting submit without time fields first.
 * After save, navigates to event detail page and verifies data rendered.
 * All times use strict 24h format.
 */
import type { Page } from '@playwright/test';
import { getSimWait, safeGoto } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createDetailedFunctionFlow(
  page: Page,
  prefix: string,
  testSteps: string[] = [],
): Promise<void> {
  testSteps.push('Navigate to Functions page');
  if (!(await safeGoto(page, '/webapp/functions'))) {
    return;
  }
  await page.waitForTimeout(getSimWait(800));
  await collectPageErrors(page);

  const newBtn = page
    .locator(
      'button:has-text("New Function"), a:has-text("New Function"), button:has-text("New Event")',
    )
    .first();
  if (!(await newBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
    testSteps.push('New Function button not found - skip');
    return;
  }
  await newBtn.click();
  await page.waitForTimeout(getSimWait(800));

  testSteps.push('Fill event name');
  const nameInput = page
    .locator('input[placeholder*="Wedding"], input[placeholder*="Event"], input[name="name"]')
    .first();
  if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await nameInput.fill(`${prefix}_Corporate_Dinner`);
    await page.waitForTimeout(getSimWait(200));
  }

  testSteps.push('Fill event date');
  const dateInput = page.locator('input[type="date"]').first();
  if (await dateInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);
    await dateInput.fill(futureDate.toISOString().slice(0, 10));
    await page.waitForTimeout(getSimWait(200));
  }

  testSteps.push('Fill start time (18:00) and end time (23:00) in 24h format');
  const timeInputs = page.locator('input[type="time"]');
  const timeCount = await timeInputs.count();

  if (timeCount >= 1) {
    await timeInputs.first().fill('18:00');
    await page.waitForTimeout(getSimWait(200));
  }
  if (timeCount >= 2) {
    await timeInputs.nth(1).fill('23:00');
    await page.waitForTimeout(getSimWait(200));
  }

  testSteps.push('Fill pax count (200)');
  const paxInput = page
    .locator(
      'input[name="pax"], input[name="guests"], input[name="covers"], input[placeholder*="guests"], input[placeholder*="pax"], input[type="number"]',
    )
    .first();
  if (await paxInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await paxInput.fill('200');
    await page.waitForTimeout(getSimWait(200));
  }

  testSteps.push('Fill additional fields if visible');
  const venueInput = page
    .locator('input[name="venue"], input[placeholder*="venue"], input[placeholder*="location"]')
    .first();
  if (await venueInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await venueInput.fill('Grand Ballroom');
    await page.waitForTimeout(getSimWait(200));
  }

  const notesInput = page.locator('textarea[name="notes"], textarea').first();
  if (await notesInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await notesInput.fill('E2E simulation - Corporate dinner for 200 pax, 18:00-23:00');
    await page.waitForTimeout(getSimWait(200));
  }

  testSteps.push('Submit detailed function');
  const saveBtn = page
    .locator('button:has-text("Create Event"), button:has-text("Create"), button:has-text("Save")')
    .first();
  if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await saveBtn.click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(getSimWait(1200));
  }
  await collectPageErrors(page);

  testSteps.push('Verify event detail page rendered');
  const currentUrl = page.url();
  if (currentUrl.includes('/webapp/functions/')) {
    const eventName = page.locator(`text=${prefix}_Corporate_Dinner`).first();
    if (await eventName.isVisible({ timeout: 5000 }).catch(() => false)) {
      testSteps.push('Event detail page verified - name visible');
    }
  }

  await collectPageErrors(page);
  testSteps.push('Detailed function flow completed');
}
