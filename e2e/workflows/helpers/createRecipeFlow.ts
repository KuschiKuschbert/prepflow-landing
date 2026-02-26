/**
 * Helper function for creating a recipe in the chef workflow and simulation tests.
 * Uses DishBuilder flow: recipes#dishes -> Builder toggle -> Recipe type -> name, yield -> add ingredient -> Save Recipe.
 */
import type { Page } from '@playwright/test';
import { waitForFormSubmission } from '../../helpers/form-helpers';
import { getSimWait, safeGoto } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createRecipeFlow(
  page: Page,
  recipeName: string,
  testSteps: string[],
): Promise<void> {
  testSteps.push('Navigate to Recipes page (Dishes tab)');
  if (!(await safeGoto(page, '/webapp/recipes#dishes'))) {
    testSteps.push('[createRecipe] navigation failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(2000)); // Allow React hydration + hash useEffect to run
  await collectPageErrors(page);

  // Ensure we're on the Dishes & Recipes tab
  testSteps.push('Ensure Dishes & Recipes tab is active');
  const dishesTab = page.locator('button:has-text("Dishes & Recipes")').first();
  if (await dishesTab.isVisible({ timeout: 5000 }).catch(() => false)) {
    await dishesTab.click();
    await page.waitForTimeout(getSimWait(500));
  }

  // Wait for DishesClient to load (it's dynamically imported)
  testSteps.push('Wait for DishesClient to load');
  await page.waitForTimeout(getSimWait(1500));

  // Click the Builder toggle to enter builder mode.
  // IMPORTANT: Use exact aria-label="Builder view" to avoid matching
  // the "Menu Builder" tab (aria-label="View menu builder").
  testSteps.push('Click Builder mode toggle');
  const builderToggle = page.locator('button[aria-label="Builder view"]').first();
  const builderToggleVisible = await builderToggle.isVisible({ timeout: 15000 }).catch(() => false);
  if (builderToggleVisible) {
    await builderToggle.click();
    await page.waitForTimeout(getSimWait(1000));
  } else {
    testSteps.push(
      'Builder view toggle not found within 15s - DishesClient still loading, skipping recipe creation',
    );
    return;
  }

  await collectPageErrors(page);

  testSteps.push('Select Recipe type');
  // Wait for DishForm to render in builder mode
  const recipeTypeButton = page.getByRole('button', { name: 'Recipe', exact: true }).first();
  const recipeTypeVisible = await recipeTypeButton.isVisible({ timeout: 20000 }).catch(() => false);
  if (!recipeTypeVisible) {
    testSteps.push(
      'Recipe type button not visible after 20s - builder may not have loaded, skipping',
    );
    return;
  }
  await recipeTypeButton.click();
  await page.waitForTimeout(getSimWait(800));

  testSteps.push('Fill recipe name and yield');
  const nameInput = page.locator('input#dish-name').first();
  const nameVisible = await nameInput.isVisible({ timeout: 10000 }).catch(() => false);
  if (!nameVisible) {
    testSteps.push('[createRecipe] Name input not visible after 10s - skipping');
    return;
  }
  await nameInput.fill(recipeName, { timeout: 10000 });
  await page.waitForTimeout(getSimWait(300));

  const yieldInput = page.locator('input#recipe-yield').first();
  if (await yieldInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await yieldInput.fill('4', { timeout: 5000 });
  }
  await page.waitForTimeout(getSimWait(300));

  testSteps.push('Add ingredient from left panel');
  const ingredientsTab = page.locator('button').filter({ hasText: /Ingredients \(\d+\)/ });
  const ingTabVisible = await ingredientsTab.isVisible({ timeout: 8000 }).catch(() => false);
  if (ingTabVisible) {
    await ingredientsTab.click();
    await page.waitForTimeout(getSimWait(800));

    // Tap first ingredient (opens QuantityInputModal)
    const firstIngredientBtn = page
      .locator('button')
      .filter({ hasText: /\$|No price/ })
      .first();
    const hasIngredients = await firstIngredientBtn.isVisible({ timeout: 8000 }).catch(() => false);
    if (hasIngredients) {
      await firstIngredientBtn.click();
      await page.waitForTimeout(getSimWait(600));
      const addInModal = page.getByRole('button', { name: 'Add' });
      if (await addInModal.isVisible({ timeout: 5000 }).catch(() => false)) {
        await addInModal.click();
        await page.waitForTimeout(getSimWait(600));
      }
    }
  }
  await page.waitForTimeout(getSimWait(500));

  testSteps.push('Save recipe');
  // Dismiss any blocking overlay/modal before saving
  const overlay = page.locator('.fixed.inset-0').first();
  if (await overlay.isVisible({ timeout: 1000 }).catch(() => false)) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(getSimWait(400));
  }
  const saveButton = page.getByRole('button', {
    name: /Save Recipe|Save Dish/i,
  });
  const saveVisible = await saveButton.isVisible({ timeout: 25000 }).catch(() => false);
  if (!saveVisible) {
    testSteps.push('[createRecipe] Save Recipe/Dish button not visible after 25s - skipping save');
    return;
  }
  await saveButton.click({ force: true });
  await waitForFormSubmission(page);
  await collectPageErrors(page);

  testSteps.push('Verified recipe created successfully');
}
