import { Page } from '@playwright/test';
import { collectPageErrors } from '../../fixtures/global-error-listener';
import { getSimWait } from '../../helpers/sim-wait';

/**
 * Create Kitchen Section Flow
 *
 * Navigates to /webapp/sections, creates a new kitchen section, then
 * attempts to assign an unassigned dish to it via the dropdown select.
 */
export async function createKitchenSectionFlow(
  page: Page,
  testSteps: string[] = [],
): Promise<void> {
  testSteps.push('Navigate to kitchen sections');

  try {
    await page.goto('/webapp/sections', { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch {
    testSteps.push('[createKitchenSection] Navigation failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(1500));
  await collectPageErrors(page);

  // Click "Add Section" button
  const addSectionBtn = page
    .locator(
      'button:has-text("Add Section"), button:has-text("New Section"), button:has-text("+ ")',
    )
    .first();
  const addBtnVisible = await addSectionBtn.isVisible({ timeout: 5000 }).catch(() => false);
  if (!addBtnVisible) {
    testSteps.push('[createKitchenSection] Add section button not found - skipping');
    return;
  }

  await addSectionBtn.click();
  await page.waitForTimeout(getSimWait(800));
  await collectPageErrors(page);

  testSteps.push('Fill kitchen section form');

  // Fill section name
  const nameInput = page
    .locator('input[placeholder*="section"], input[placeholder*="name"], input[name*="name"]')
    .first();
  if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await nameInput.fill('SimTest_Section');
    await page.waitForTimeout(getSimWait(300));
  }

  // Pick a color if color input is visible
  const colorInput = page.locator('input[type="color"]').first();
  if (await colorInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await colorInput.fill('#29E7CD');
    await page.waitForTimeout(getSimWait(200));
  }

  // Save the section
  const saveBtn = page
    .locator('button:has-text("Save"), button[type="submit"]:not([disabled])')
    .first();
  if (await saveBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await saveBtn.click();
    await page.waitForTimeout(getSimWait(2000));
    await collectPageErrors(page);
  } else {
    // Close modal if save button not found
    const closeBtn = page.locator('button[aria-label="Close"], button:has-text("Cancel")').first();
    if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await closeBtn.click();
      await page.waitForTimeout(getSimWait(500));
    }
    return;
  }

  // Attempt to assign an unassigned dish via the dropdown
  const assignSelect = page.locator('select:has(option:has-text("Assign to section"))').first();
  if (await assignSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
    // Get available options (section IDs)
    const options = await assignSelect.locator('option').all();
    if (options.length > 1) {
      // Select the second option (first is the placeholder)
      const optionValue = await options[1].getAttribute('value');
      if (optionValue) {
        await assignSelect.selectOption(optionValue);
        await page.waitForTimeout(getSimWait(1500));
        await collectPageErrors(page);
      }
    }
  }

  await collectPageErrors(page);
  testSteps.push('[createKitchenSection] Completed');
}
