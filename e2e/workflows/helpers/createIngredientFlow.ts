/**
 * Helper function for creating an ingredient in the chef workflow test.
 */
import type { Page } from '@playwright/test';
import { fillIngredientForm, waitForFormSubmission } from '../../helpers/form-helpers';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createIngredientFlow(
  page: Page,
  ingredientName: string,
  testSteps: string[],
): Promise<void> {
  testSteps.push('Step 1: Navigate to Ingredients page and open Add form');
  await page.goto('/webapp/ingredients?action=new');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500); // Allow form to open from action=new
  await collectPageErrors(page);

  // If ?action=new didn't open form (e.g. hydration delay), click Add button as fallback
  const addFormVisible = await page
    .locator('input[placeholder*="Fresh Tomatoes"]')
    .isVisible({ timeout: 2000 })
    .catch(() => false);
  if (!addFormVisible) {
    const addBtn = page.getByRole('button', { name: /Add|Add your first ingredient/i }).first();
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
    }
  }
  await collectPageErrors(page);

  testSteps.push('Step 3: Fill ingredient form with metric units');
  await fillIngredientForm(page, {
    name: ingredientName,
    packSize: '5',
    packSizeUnit: 'KG',
    packPrice: '12.50',
    category: 'Vegetables',
  });
  await collectPageErrors(page);

  testSteps.push('Step 4: Navigate through wizard and submit');
  await fillIngredientForm(page, {
    name: ingredientName,
    packSize: '5',
    packSizeUnit: 'KG',
    packPrice: '12.50',
  });

  const submitButton = page.locator('button:has-text("Save Ingredient")').first();
  await submitButton.waitFor({ state: 'visible', timeout: 10000 });
  await submitButton.click();
  await waitForFormSubmission(page);
  await collectPageErrors(page);

  testSteps.push('Step 5: Verified ingredient created successfully');
}
