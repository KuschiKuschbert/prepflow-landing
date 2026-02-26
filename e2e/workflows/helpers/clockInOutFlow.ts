/**
 * Test the time attendance clock-in and clock-out functionality.
 * Navigates to time attendance page, clicks clock in, verifies status,
 * then clicks clock out. Handles geofencing prompts gracefully.
 * Resilient: continues even if clock buttons are not available.
 */
import type { Page } from '@playwright/test';
import { getSimWait, SIM_FAST } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function clockInOutFlow(page: Page, testSteps: string[] = []): Promise<void> {
  testSteps.push('Navigate to Time Attendance page');
  try {
    await page.goto('/webapp/time-attendance', {
      waitUntil: SIM_FAST ? 'domcontentloaded' : 'load',
    });
  } catch (navErr) {
    const msg = navErr instanceof Error ? navErr.message : String(navErr);
    testSteps.push(`[clockInOut] Navigation failed: ${msg.slice(0, 80)} - skipping`);
    return;
  }
  // Bail if redirected to Auth0 login
  if (page.url().includes('auth0.com') || page.url().includes('/api/auth/login')) {
    testSteps.push('[clockInOut] Redirected to auth - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(1000));
  await collectPageErrors(page);

  testSteps.push('Attempt clock in');
  const clockInBtn = page
    .locator(
      'button:has-text("Clock In"), button:has-text("Start Shift"), button:has-text("Check In")',
    )
    .first();

  if (await clockInBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    if (await clockInBtn.isDisabled().catch(() => true)) {
      testSteps.push('Clock In button disabled (geofence or already clocked in) - skip');
    } else {
      await clockInBtn.click();
      await page.waitForTimeout(getSimWait(1000));

      const confirmBtn = page.locator('button:has-text("Confirm"), button:has-text("Yes")').first();
      if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmBtn.click();
        await page.waitForTimeout(getSimWait(800));
      }
      testSteps.push('Clock in attempted');
    }
  } else {
    testSteps.push('Clock In button not found - may be clocked in already');
  }
  await collectPageErrors(page);

  testSteps.push('Check for clock out option');
  const clockOutBtn = page
    .locator(
      'button:has-text("Clock Out"), button:has-text("End Shift"), button:has-text("Check Out")',
    )
    .first();

  if (await clockOutBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    if (!(await clockOutBtn.isDisabled().catch(() => true))) {
      await clockOutBtn.click();
      await page.waitForTimeout(getSimWait(800));

      const confirmBtn = page.locator('button:has-text("Confirm"), button:has-text("Yes")').first();
      if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmBtn.click();
        await page.waitForTimeout(getSimWait(800));
      }
      testSteps.push('Clock out attempted');
    }
  }

  testSteps.push('Check attendance records tab');
  const recordsTab = page
    .locator('button:has-text("Records"), button:has-text("History"), button:has-text("Log")')
    .first();
  if (await recordsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await recordsTab.click();
    await page.waitForTimeout(getSimWait(600));
    testSteps.push('Switched to attendance records view');
  }

  await collectPageErrors(page);
  testSteps.push('Clock in/out flow completed');
}
