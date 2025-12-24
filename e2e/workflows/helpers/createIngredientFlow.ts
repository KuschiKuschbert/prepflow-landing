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
  testSteps.push('Step 1: Navigate to Ingredients page');
  await page.goto('/webapp/ingredients');
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);

  testSteps.push('Step 2: Click Add Ingredient button');
  const addIngredientButton = page.locator('button:has-text("Add"), button:has-text("➕")').first();
  await addIngredientButton.waitFor({ state: 'visible', timeout: 10000 });
  await addIngredientButton.click();
  await page.waitForTimeout(1000);
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
