/**
 * Helper function for creating a recipe in the chef workflow and simulation tests.
 * Uses DishBuilder flow: recipes?builder=true#dishes -> Recipe type -> name, yield -> add ingredient -> Save Recipe.
 */
import type { Page } from '@playwright/test';
import { waitForFormSubmission } from '../../helpers/form-helpers';
import { getSimWait } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createRecipeFlow(
  page: Page,
  recipeName: string,
  testSteps: string[],
): Promise<void> {
  testSteps.push('Navigate to Recipes page (DishBuilder view)');
  await page.goto('/webapp/recipes?builder=true#dishes');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(getSimWait(4000)); // Dishes tab + DishBuilderClient load + data fetch
  await collectPageErrors(page);

  testSteps.push('Select Recipe type');
  const recipeTypeButton = page.getByRole('button', { name: 'Recipe', exact: true }).first();
  await recipeTypeButton.waitFor({ state: 'visible', timeout: 30000 });
  await recipeTypeButton.click();
  await page.waitForTimeout(getSimWait(800));

  testSteps.push('Fill recipe name and yield');
  const nameInput = page.locator('input#dish-name').first();
  await nameInput.waitFor({ state: 'visible', timeout: 15000 });
  await nameInput.fill(recipeName);
  await page.waitForTimeout(getSimWait(300));

  const yieldInput = page.locator('input#recipe-yield').first();
  if (await yieldInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await yieldInput.fill('4');
  }
  await page.waitForTimeout(getSimWait(300));

  testSteps.push('Add ingredient from left panel');
  // DishBuilderDragDrop tabs: Recipes | Ingredients | Consumables
  const ingredientsTab = page.locator('button').filter({ hasText: /Ingredients \(\d+\)/ });
  await ingredientsTab.waitFor({ state: 'visible', timeout: 8000 });
  await ingredientsTab.click();
  await page.waitForTimeout(getSimWait(800));

  // Tap first ingredient (opens QuantityInputModal); ingredient buttons show "$X.XX/unit" or "No price/unit"
  const firstIngredientBtn = page
    .locator('button')
    .filter({ hasText: /\$|No price/ })
    .first();
  const hasIngredients = await firstIngredientBtn.isVisible({ timeout: 8000 }).catch(() => false);
  if (hasIngredients) {
    await firstIngredientBtn.click();
    await page.waitForTimeout(getSimWait(600));
    // QuantityInputModal "Add" button confirms and adds ingredient
    const addInModal = page.getByRole('button', { name: 'Add' });
    if (await addInModal.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addInModal.click();
      await page.waitForTimeout(getSimWait(600));
    }
  }
  await page.waitForTimeout(getSimWait(500));

  testSteps.push('Save recipe');
  const saveButton = page.getByRole('button', {
    name: /Save Recipe|Save Dish/i,
  });
  await saveButton.waitFor({ state: 'visible', timeout: 25000 });
  await saveButton.click();
  await waitForFormSubmission(page);
  await collectPageErrors(page);

  testSteps.push('Verified recipe created successfully');
}
