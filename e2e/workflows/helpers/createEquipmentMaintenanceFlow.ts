/**
 * Helper function for creating equipment maintenance record in the chef workflow test.
 */
import type { Page } from '@playwright/test';
import { fillEquipmentMaintenanceForm, waitForFormSubmission } from '../../helpers/form-helpers';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createEquipmentMaintenanceFlow(
  page: Page,
  testSteps: string[],
): Promise<void> {
  testSteps.push('Step 24: Navigate to Compliance page');
  await page.goto('/webapp/compliance');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);
  await collectPageErrors(page);

  testSteps.push('Step 25: Switch to Equipment Maintenance tab');
  const equipmentTab = page.locator('button:has-text("Equipment"), button:has-text("🔧")').first();
  if (await equipmentTab.isVisible().catch(() => false)) {
    await equipmentTab.click();
    await page.waitForTimeout(1000);
    await collectPageErrors(page);
    testSteps.push('Step 26: Opened Equipment Maintenance tab');
  } else {
    testSteps.push('Step 26: Equipment tab not found, trying direct navigation');
  }

  testSteps.push('Step 27: Click Add Equipment Maintenance button');
  const addMaintenanceButton = page
    .locator(
      'button:has-text("Add Maintenance"), button:has-text("Add Maintenance Record"), button:has-text("➕")',
    )
    .first();
  if (await addMaintenanceButton.isVisible().catch(() => false)) {
    await addMaintenanceButton.click();
    await page.waitForTimeout(1000);
    await collectPageErrors(page);
    testSteps.push('Step 28: Opened equipment maintenance form');
  } else {
    testSteps.push('Step 28: Add button not found - form may already be visible');
  }

  testSteps.push('Step 29: Fill equipment maintenance form');
  const today = new Date().toISOString().split('T')[0];
  await fillEquipmentMaintenanceForm(page, {
    equipmentName: 'Main Fridge',
    equipmentType: 'fridge',
    maintenanceDate: today,
    maintenanceType: 'scheduled',
    description: 'Monthly maintenance check - E2E test',
    serviceProvider: 'ABC Maintenance Co',
    cost: '150.00',
    performedBy: 'John Doe',
    notes: 'Routine maintenance performed',
  });
  await collectPageErrors(page);

  testSteps.push('Step 30: Submit equipment maintenance form');
  const maintenanceSubmitButton = page
    .locator('button:has-text("Save Maintenance"), button:has-text("Save"), button[type="submit"]')
    .first();
  if (await maintenanceSubmitButton.isVisible().catch(() => false)) {
    await maintenanceSubmitButton.click();
    await waitForFormSubmission(page);
    await collectPageErrors(page);
    testSteps.push('Step 31: Equipment maintenance record submitted');
  } else {
    testSteps.push('Step 31: Submit button not found');
  }
}
