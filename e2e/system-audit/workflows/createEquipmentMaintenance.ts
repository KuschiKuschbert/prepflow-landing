/**
 * Chef Workflow - Equipment Maintenance Log.
 */
import { Page, expect } from '@playwright/test';
import { collectPageErrors } from '../../fixtures/global-error-listener';

/**
 * Chef Workflow - Equipment Maintenance Log.
 */
export async function chefWorkflowCreateEquipmentMaintenance(
  page: Page,
  TEST_PREFIX: string,
  visitedPages: Set<string>,
): Promise<void> {
  await page.goto('/webapp/compliance');
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);
  visitedPages.add(page.url());

  const maintenanceTab = page
    .locator('button:has-text("Equipment"), button:has-text("Maintenance")')
    .first();
  if ((await maintenanceTab.count()) > 0) {
    await maintenanceTab.click();
    await page.waitForTimeout(500);
    await collectPageErrors(page);
  }

  const addButton = page
    .locator(
      'button:has-text("Add Maintenance"), button:has-text("New Maintenance"), button:has-text("Add Record")',
    )
    .first();
  await addButton.click();
  await page.waitForTimeout(500);

  await page.fill('input[name="equipment_name"]', `${TEST_PREFIX}_Fridge`);
  await page.selectOption('select[name="equipment_type"]', 'fridge');

  const today = new Date().toISOString().split('T')[0];
  await page.fill('input[name="maintenance_date"][type="date"]', today);
  await page.selectOption('select[name="maintenance_type"]', 'scheduled');
  await page.fill('textarea[name="description"]', 'Test maintenance record');

  const submitButton = page.locator('button[type="submit"], button:has-text("Save")').first();
  await submitButton.click();
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);

  await expect(
    page
      .locator('text=Success')
      .or(page.locator(`text=${TEST_PREFIX}_Fridge`))
      .first(),
  ).toBeVisible({ timeout: 10000 });
}




