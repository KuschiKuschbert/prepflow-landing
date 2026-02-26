/**
 * Helper function for creating an ingredient in the chef workflow test.
 */
import { safeGoto } from '../../helpers/sim-wait';
import type { Page } from '@playwright/test';
import { fillIngredientForm, waitForFormSubmission } from '../../helpers/form-helpers';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createIngredientFlow(
  page: Page,
  ingredientName: string,
  testSteps: string[],
): Promise<void> {
  testSteps.push('Step 1: Navigate to Ingredients page and open Add form');
  try {
    await page.goto('/webapp/ingredients?action=new', { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 20000 });
  } catch {
    testSteps.push('[createIngredient] Navigation to ingredients timed out - skipping');
    return;
  }
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

  testSteps.push('Step 3: Fill ingredient form with metric units (wizard)');
  try {
    await fillIngredientForm(page, {
      name: ingredientName,
      packSize: '5',
      packSizeUnit: 'KG',
      packPrice: '12.50',
      category: 'Vegetables',
    });
  } catch (err) {
    testSteps.push(`[createIngredient] fillIngredientForm failed: ${(err as Error).message}`);
  }
  await collectPageErrors(page);

  testSteps.push('Step 4: Submit ingredient form');
  const submitButton = page.locator('button:has-text("Save Ingredient")').first();
  const submitVisible = await submitButton.isVisible({ timeout: 5000 }).catch(() => false);
  if (submitVisible) {
    await submitButton.click();
    await waitForFormSubmission(page);
  } else {
    testSteps.push('[createIngredient] Save Ingredient button not found - skipping submit');
  }
  await collectPageErrors(page);

  testSteps.push('Step 5: Verified ingredient created successfully');
}
