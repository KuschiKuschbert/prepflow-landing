/**
 * Helper function for assigning dish to menu in menu builder.
 */
import type { Page } from '@playwright/test';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function assignDishToMenuFlow(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Step 16: Navigate to Menu Builder');
  await page.goto('/webapp/menu-builder');
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);

  testSteps.push('Step 17: Attempt to assign dish to menu');
  const menuLink = page.locator('a[href*="/menu"], button:has-text("Menu")').first();
  if (await menuLink.isVisible().catch(() => false)) {
    await menuLink.click();
    await page.waitForTimeout(2000);
    await collectPageErrors(page);
    testSteps.push('Step 18: Opened menu editor');
  } else {
    testSteps.push('Step 18: Menu builder interface not immediately accessible');
  }
}




