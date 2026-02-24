/**
 * Helper function for creating a recipe in the chef workflow and simulation tests.
 * Uses the Builder flow: Dishes tab -> Builder view -> Recipe type -> name, yield, ingredient -> Save.
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
  testSteps.push('Navigate to Recipes page (Dishes tab, Builder view)');
  await page.goto('/webapp/recipes?builder=true#dishes');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(getSimWait(2000)); // Dishes tab + DishBuilderClient load
  await collectPageErrors(page);

  // Ensure we're on Dishes tab (hash #dishes)
  const dishesTab = page.getByRole('button', { name: /View dishes|Dishes|Recipes/i });
  if (await dishesTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await dishesTab.click();
    await page.waitForTimeout(getSimWait(1000));
  }
  await page.waitForTimeout(getSimWait(3000)); // DishBuilderClient loads data

  testSteps.push('Wait for DishBuilder and select Recipe type');
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

  testSteps.push('Add ingredient from left panel (Ingredients tab)');
  const ingredientsTab = page.locator('button:has-text("Ingredients")').first();
  await ingredientsTab.waitFor({ state: 'visible', timeout: 8000 });
  await ingredientsTab.click();
  await page.waitForTimeout(getSimWait(600));

  // DishBuilderDragDrop: tap first ingredient to add (enables Save Recipe button)
  const firstIngredientBtn = page.locator('[class*="overflow-y-auto"] button').first();
  const hasIngredients = await firstIngredientBtn.isVisible({ timeout: 5000 }).catch(() => false);
  if (hasIngredients) {
    await firstIngredientBtn.click();
    await page.waitForTimeout(getSimWait(600));
    // QuantityInputModal opens - click Add to confirm (default qty 1)
    const addIngredientBtn = page.getByRole('button', { name: 'Add' });
    if (await addIngredientBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addIngredientBtn.click();
      await page.waitForTimeout(getSimWait(500));
    }
  }
  await page.waitForTimeout(getSimWait(500));

  testSteps.push('Save recipe');
  const saveButton = page.getByRole('button', { name: /Save Recipe|Save Dish/i });
  await saveButton.waitFor({ state: 'visible', timeout: 20000 });
  await saveButton.click();
  await waitForFormSubmission(page);
  await collectPageErrors(page);

  testSteps.push('Verified recipe created successfully');
}
