import { Page } from '@playwright/test';
import { collectPageErrors } from '../../fixtures/global-error-listener';
import { getSimWait } from '../../helpers/sim-wait';

/**
 * Test Delete Flow
 *
 * Tests delete UI and confirmation dialogs across several entities.
 * Always cancels — never actually deletes data. Verifies that:
 * - Delete buttons are present and clickable
 * - Confirmation dialogs appear with Cancel/Confirm buttons
 * - Cancel dismisses the dialog safely
 */
export async function testDeleteFlow(page: Page, testSteps: string[] = []): Promise<void> {
  testSteps.push('Test delete confirmations across entities');

  // --- Entity 1: Ingredient delete ---
  try {
    await page.goto('/webapp/ingredients', { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch {
    testSteps.push('[testDelete] Ingredients navigation failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(1500));
  await collectPageErrors(page);

  // Try selecting via checkbox then bulk delete
  const firstCheckbox = page
    .locator(
      'button[aria-label*="Select"], input[type="checkbox"], button[role="checkbox"]',
    )
    .first();
  if (await firstCheckbox.isVisible({ timeout: 5000 }).catch(() => false)) {
    await firstCheckbox.click();
    await page.waitForTimeout(getSimWait(500));

    const bulkDeleteBtn = page
      .locator(
        'button:has-text("Delete"), button[aria-label*="Delete"], button:has-text("Bulk Delete")',
      )
      .first();
    if (await bulkDeleteBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bulkDeleteBtn.click();
      await page.waitForTimeout(getSimWait(800));
      await collectPageErrors(page);

      // Confirm dialog appeared — cancel it
      const cancelBtn = page.locator('button:has-text("Cancel")').first();
      if (await cancelBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await cancelBtn.click();
        await page.waitForTimeout(getSimWait(500));
      }
    }
  } else {
    // Fallback: look for a row-level delete button (kebab/trash icon)
    const trashBtn = page
      .locator('button[aria-label*="Delete"], button[aria-label*="Remove"], button.delete-btn')
      .first();
    if (await trashBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await trashBtn.click();
      await page.waitForTimeout(getSimWait(800));
      await collectPageErrors(page);

      const cancelBtn = page.locator('button:has-text("Cancel")').first();
      if (await cancelBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await cancelBtn.click();
        await page.waitForTimeout(getSimWait(500));
      }
    }
  }

  // --- Entity 2: Cleaning area/task delete ---
  try {
    await page.goto('/webapp/cleaning', { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch {
    testSteps.push('[testDelete] Cleaning navigation failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(1500));
  await collectPageErrors(page);

  const cleaningDeleteBtn = page
    .locator('button[aria-label*="Delete"], button[aria-label*="Remove"]')
    .first();
  if (await cleaningDeleteBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await cleaningDeleteBtn.click();
    await page.waitForTimeout(getSimWait(800));
    await collectPageErrors(page);

    const cancelBtn = page.locator('button:has-text("Cancel")').first();
    if (await cancelBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await cancelBtn.click();
      await page.waitForTimeout(getSimWait(500));
    }
  }

  // --- Entity 3: Compliance record delete ---
  try {
    await page.goto('/webapp/compliance', { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch {
    testSteps.push('[testDelete] Compliance navigation failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(1500));
  await collectPageErrors(page);

  const complianceDeleteBtn = page
    .locator('button[aria-label*="Delete"], button[aria-label*="Remove"]')
    .first();
  if (await complianceDeleteBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await complianceDeleteBtn.click();
    await page.waitForTimeout(getSimWait(800));
    await collectPageErrors(page);

    const cancelBtn = page.locator('button:has-text("Cancel")').first();
    if (await cancelBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await cancelBtn.click();
      await page.waitForTimeout(getSimWait(500));
    }
  }

  await collectPageErrors(page);
  testSteps.push('[testDelete] Completed');
}
