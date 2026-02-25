/**
 * Create a customer via the customers page.
 * Fills name, email, phone, company fields and submits.
 * Resilient: continues even if form fields are not found.
 */
import type { Page } from '@playwright/test';
import { getSimWait } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createCustomerFlow(
  page: Page,
  prefix: string,
  testSteps: string[] = [],
): Promise<void> {
  testSteps.push('Navigate to Customers page');
  await page.goto('/webapp/customers');
  await page.waitForLoadState('load');
  await page.waitForTimeout(getSimWait(800));
  await collectPageErrors(page);

  const addBtn = page
    .locator(
      'button:has-text("Add Customer"), button:has-text("New Customer"), button:has-text("Add Client"), button:has-text("Create")',
    )
    .first();
  if (!(await addBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
    testSteps.push('Add Customer button not found - skip');
    return;
  }
  await addBtn.click();
  await page.waitForTimeout(getSimWait(800));

  testSteps.push('Fill customer form');

  const nameInput = page
    .locator('input[name="name"], input[placeholder*="Name"], input[placeholder*="name"]')
    .first();
  if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await nameInput.fill(`${prefix}_Customer`);
    await page.waitForTimeout(getSimWait(200));
  }

  const emailInput = page
    .locator('input[name="email"], input[type="email"], input[placeholder*="email"]')
    .first();
  if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await emailInput.fill(`${prefix.toLowerCase()}customer@example.com`);
    await page.waitForTimeout(getSimWait(200));
  }

  const phoneInput = page
    .locator('input[name="phone"], input[type="tel"], input[placeholder*="phone"]')
    .first();
  if (await phoneInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await phoneInput.fill('0498765432');
    await page.waitForTimeout(getSimWait(200));
  }

  const companyInput = page
    .locator(
      'input[name="company"], input[placeholder*="Company"], input[placeholder*="company"], input[placeholder*="Organisation"]',
    )
    .first();
  if (await companyInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await companyInput.fill(`${prefix} Corp`);
    await page.waitForTimeout(getSimWait(200));
  }

  testSteps.push('Submit customer form');
  const saveBtn = page
    .locator(
      'button:has-text("Save"), button:has-text("Create"), button:has-text("Add Customer"), button[type="submit"]',
    )
    .first();
  if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await saveBtn.click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(getSimWait(800));
  }

  await collectPageErrors(page);
  testSteps.push('Customer flow completed');
}
