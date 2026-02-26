/**
 * Create a staff member in the staff page.
 * Resilient: continues even if some steps fail.
 * Fills name, role, email, phone, and tests the certificate expiry date picker.
 */
import type { Page } from '@playwright/test';
import { getSimWait, safeGoto } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createStaffMemberFlow(
  page: Page,
  prefix: string,
  testSteps: string[] = [],
): Promise<void> {
  testSteps.push('Navigate to Staff page');
  if (!(await safeGoto(page, '/webapp/staff'))) { return; }
  await page.waitForTimeout(getSimWait(800));
  await collectPageErrors(page);

  const addBtn = page
    .locator(
      'button:has-text("Add Staff"), button:has-text("Add Employee"), button:has-text("Add")',
    )
    .first();
  if (!(await addBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
    testSteps.push('Add Staff button not found - skip');
    return;
  }
  await addBtn.click();
  await page.waitForTimeout(getSimWait(800));

  testSteps.push('Fill staff member form');

  const firstNameInput = page
    .locator(
      'input[name="first_name"], input[placeholder*="First"], input[placeholder*="first name"]',
    )
    .first();
  if (await firstNameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await firstNameInput.fill(`${prefix}Chef`);
    await page.waitForTimeout(getSimWait(200));
  }

  const lastNameInput = page
    .locator('input[name="last_name"], input[placeholder*="Last"], input[placeholder*="last name"]')
    .first();
  if (await lastNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await lastNameInput.fill(`${prefix}Smith`);
    await page.waitForTimeout(getSimWait(200));
  }

  const nameInput = page
    .locator('input[name="name"], input[placeholder*="Full name"], input[placeholder*="Name"]')
    .first();
  if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await nameInput.fill(`${prefix}Chef Smith`);
    await page.waitForTimeout(getSimWait(200));
  }

  const roleSelect = page.locator('select[name="role"], select[name="position"]').first();
  if (await roleSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
    const options = roleSelect.locator('option[value]:not([value=""])');
    const count = await options.count();
    if (count > 0) {
      const val = await options.first().getAttribute('value');
      if (val) await roleSelect.selectOption(val);
    }
  }

  const roleInput = page
    .locator('input[name="role"], input[placeholder*="Head Chef"], input[placeholder*="Role"]')
    .first();
  if (await roleInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await roleInput.fill('Head Chef');
    await page.waitForTimeout(getSimWait(200));
  }

  const emailInput = page
    .locator('input[name="email"], input[type="email"], input[placeholder*="email"]')
    .first();
  if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await emailInput.fill(`${prefix.toLowerCase()}chef@example.com`);
    await page.waitForTimeout(getSimWait(200));
  }

  const phoneInput = page
    .locator('input[name="phone"], input[type="tel"], input[placeholder*="phone"]')
    .first();
  if (await phoneInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await phoneInput.fill('0412345678');
    await page.waitForTimeout(getSimWait(200));
  }

  testSteps.push('Test certificate expiry date picker');
  const dateInput = page.locator('input[type="date"]').first();
  if (await dateInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    await dateInput.fill(futureDate.toISOString().split('T')[0]);
    await page.waitForTimeout(getSimWait(200));
  }

  testSteps.push('Submit staff member form');
  const saveBtn = page
    .locator(
      'button:has-text("Save"), button:has-text("Create"), button:has-text("Add Employee"), button[type="submit"]',
    )
    .first();
  if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await saveBtn.click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(getSimWait(800));
  }

  await collectPageErrors(page);
  testSteps.push('Staff member flow completed');
}
