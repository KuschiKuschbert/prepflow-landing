/**
 * Helper function for adding an ingredient to a recipe in COGS page.
 */
import { safeGoto } from '../../helpers/sim-wait';
import type { Page } from '@playwright/test';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function addIngredientToRecipeFlow(
  page: Page,
  recipeName: string,
  ingredientName: string,
  testSteps: string[],
): Promise<void> {
  testSteps.push('Step 11: Navigate to COGS page');
  if (!(await safeGoto(page, '/webapp/cogs'))) {
    return;
  }
  await page.waitForTimeout(1500);
  await collectPageErrors(page);

  testSteps.push('Step 12: Select recipe from combobox');
  const recipeCombobox = page
    .locator('input[placeholder*="recipe"], input[role="combobox"]')
    .first();
  await recipeCombobox.click();
  await page.waitForTimeout(500);

  await recipeCombobox.fill(recipeName);
  await page.waitForTimeout(1000);

  const recipeOption = page.locator(`text=${recipeName}`).first();
  if (await recipeOption.isVisible().catch(() => false)) {
    await recipeOption.click();
    await page.waitForTimeout(1000);
    await collectPageErrors(page);
    testSteps.push('Step 13: Selected recipe in COGS page');
  } else {
    testSteps.push('Step 13: Recipe not found in dropdown (may need to create dish first)');
  }

  testSteps.push('Step 14: Attempt to add ingredient to recipe');
  const addIngredientButton2 = page
    .locator('button:has-text("Add Ingredient"), button:has-text("➕")')
    .first();
  if (await addIngredientButton2.isVisible().catch(() => false)) {
    await addIngredientButton2.click();
    await page.waitForTimeout(1000);

    const ingredientSearch = page.locator('input[placeholder*="ingredient"]').first();
    if (await ingredientSearch.isVisible().catch(() => false)) {
      await ingredientSearch.fill(ingredientName);
      await page.waitForTimeout(1000);

      const ingredientOption = page.locator(`text=${ingredientName}`).first();
      if (await ingredientOption.isVisible().catch(() => false)) {
        await ingredientOption.click();
        await page.waitForTimeout(500);

        const quantityInput = page.locator('input[type="number"]').first();
        await quantityInput.fill('500');

        const unitSelect = page.locator('select').first();
        await unitSelect.selectOption('g');

        const addButton = page.locator('button:has-text("Add")').first();
        await addButton.click();
        await page.waitForTimeout(1000);
        testSteps.push('Step 15: Added ingredient to recipe');
      }
    }
  }
  await collectPageErrors(page);
}
