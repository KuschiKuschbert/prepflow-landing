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
  // Wait for loading to finish and wizard to open (action=new useEffect + hydration)
  await page.waitForTimeout(4000);
  await collectPageErrors(page);

  // Ingredient name input: "e.g., Fresh Tomatoes" or "e.g., Tomatoes" (wizard step 1)
  const nameInputSelector =
    'input[placeholder*="Fresh Tomatoes"], input[placeholder*="Tomatoes"], input[placeholder*="ingredient name" i]';
  let addFormVisible = await page
    .locator(nameInputSelector)
    .first()
    .isVisible({ timeout: 8000 })
    .catch(() => false);
  if (!addFormVisible) {
    const addBtn = page
      .locator(
        'button:has-text("Add"), button:has-text("Add your first ingredient"), button:has-text("Add ingredient")',
      )
      .first();
    if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(3000);
      addFormVisible = await page
        .locator(nameInputSelector)
        .first()
        .isVisible({ timeout: 8000 })
        .catch(() => false);
    }
  }
  if (!addFormVisible) {
    throw new Error('Ingredient add form did not open - check ?action=new or Add button');
  }
  await collectPageErrors(page);

  testSteps.push('Step 3: Fill ingredient form with metric units');
  await fillIngredientForm(page, {
    name: ingredientName,
    packSize: '500',
    packSizeUnit: 'g',
    packPrice: '12.50',
    category: 'Vegetables',
  });
  await collectPageErrors(page);

  testSteps.push('Step 4: Navigate through wizard and submit');
  await fillIngredientForm(page, {
    name: ingredientName,
    packSize: '500',
    packSizeUnit: 'g',
    packPrice: '12.50',
  });

  const submitButton = page.locator('button:has-text("Save Ingredient")').first();
  await submitButton.waitFor({ state: 'visible', timeout: 10000 });
  await submitButton.click();
  await waitForFormSubmission(page);
  await collectPageErrors(page);

  testSteps.push('Step 5: Verified ingredient created successfully');
}
