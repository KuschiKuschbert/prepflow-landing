import { Page } from '@playwright/test';
import { collectPageErrors } from '../../fixtures/global-error-listener';
import { getSimWait } from '../../helpers/sim-wait';

/**
 * Edit Customer Flow
 *
 * Navigates to the customers list, opens the first customer's edit page,
 * fills in form fields, and saves. Falls back gracefully if no customers exist.
 */
export async function editCustomerFlow(page: Page, testSteps: string[] = []): Promise<void> {
  testSteps.push('Navigate to customers list');

  // Navigate to customers list
  try {
    await page.goto('/webapp/customers', { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch {
    testSteps.push('[editCustomer] Navigation failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(1500));
  await collectPageErrors(page);

  // Click the first customer row / edit button
  const editBtn = page
    .locator(
      'a[href*="/webapp/customers/"], button:has-text("Edit"), ' +
        '[data-testid="customer-row"] a, tr:first-child a',
    )
    .first();

  const editVisible = await editBtn.isVisible({ timeout: 5000 }).catch(() => false);
  if (!editVisible) {
    testSteps.push('[editCustomer] No customers found - skipping');
    return;
  }

  await editBtn.click();
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 });
  await page.waitForTimeout(getSimWait(1500));
  await collectPageErrors(page);

  // Verify we're on an edit/detail page
  const onEditPage = page.url().includes('/customers/');
  if (!onEditPage) {
    testSteps.push('[editCustomer] Not on edit page - skipping');
    return;
  }

  testSteps.push('Fill customer edit form');

  // Fill first name
  const firstNameInput = page
    .locator('input[placeholder*="First"], input[name*="first_name"], input[id*="first"]')
    .first();
  if (await firstNameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await firstNameInput.fill('SimTest_Customer');
    await page.waitForTimeout(getSimWait(300));
  }

  // Fill last name
  const lastNameInput = page
    .locator('input[placeholder*="Last"], input[name*="last_name"], input[id*="last"]')
    .first();
  if (await lastNameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await lastNameInput.fill('TestSim');
    await page.waitForTimeout(getSimWait(300));
  }

  // Fill notes
  const notesInput = page
    .locator('textarea[name*="notes"], textarea[placeholder*="notes"], textarea[id*="notes"]')
    .first();
  if (await notesInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await notesInput.fill('Simulation test note');
    await page.waitForTimeout(getSimWait(300));
  }

  // Save
  const saveBtn = page
    .locator('button:has-text("Save"), button[type="submit"]:not([disabled])')
    .first();
  if (await saveBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await saveBtn.click();
    await page.waitForTimeout(getSimWait(2000));
    await collectPageErrors(page);
  }

  testSteps.push('[editCustomer] Completed');
}
