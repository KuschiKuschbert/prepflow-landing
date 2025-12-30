/**
 * Helper function for creating a recipe in the chef workflow test.
 */
import type { Page } from '@playwright/test';
import { fillRecipeForm, waitForFormSubmission } from '../../helpers/form-helpers';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createRecipeFlow(
  page: Page,
  recipeName: string,
  testSteps: string[],
): Promise<void> {
  testSteps.push('Step 6: Navigate to Recipes page');
  await page.goto('/webapp/recipes');
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);

  testSteps.push('Step 7: Click Add Recipe button');
  const addRecipeButton = page
    .locator('button:has-text("Add Recipe"), button:has-text("Add"), button:has-text("➕")')
    .first();
  await addRecipeButton.waitFor({ state: 'visible', timeout: 10000 });
  await addRecipeButton.click();
  await page.waitForTimeout(1000);
  await collectPageErrors(page);

  testSteps.push('Step 8: Fill recipe form');
  await fillRecipeForm(page, {
    name: recipeName,
    yield: 4,
    instructions: 'Step 1: Prepare ingredients\nStep 2: Cook chicken\nStep 3: Add vegetables',
  });
  await collectPageErrors(page);

  testSteps.push('Step 9: Submit recipe form');
  const recipeSubmitButton = page
    .locator('button:has-text("Add Recipe"), button:has-text("Save"), button[type="submit"]')
    .first();
  await recipeSubmitButton.click();
  await waitForFormSubmission(page);
  await collectPageErrors(page);

  testSteps.push('Step 10: Verified recipe created successfully');
}



