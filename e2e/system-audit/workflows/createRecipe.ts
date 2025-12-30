/**
 * Chef Workflow - Create Recipe/Dish.
 */
import { Page, expect } from '@playwright/test';
import { collectPageErrors } from '../../fixtures/global-error-listener';

/**
 * Chef Workflow - Create Recipe/Dish.
 */
export async function chefWorkflowCreateRecipe(
  page: Page,
  TEST_PREFIX: string,
  visitedPages: Set<string>,
): Promise<void> {
  await page.goto('/webapp/recipes');
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);
  visitedPages.add(page.url());

  const addButton = page
    .locator('button:has-text("New Recipe"), button:has-text("Add Recipe")')
    .first();
  await addButton.click();
  await page.waitForTimeout(500);

  const recipeName = `${TEST_PREFIX}_Pizza`;
  await page.fill('input[name="recipe_name"], input[placeholder*="Recipe Name"]', recipeName);
  await page.fill('input[name="yield"]', '4');

  const saveButton = page.locator('button:has-text("Save"), button:has-text("Add Recipe")').first();
  await saveButton.click();
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);

  await expect(page.locator(`text=${recipeName}`).first()).toBeVisible({ timeout: 10000 });

  await page.locator(`text=${recipeName}`).first().click();
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);

  const searchInput = page
    .locator('input[placeholder*="Search"], input[placeholder*="ingredient"]')
    .first();
  if ((await searchInput.count()) > 0) {
    await searchInput.fill(`${TEST_PREFIX}_Flour`);
    await page.waitForTimeout(500);

    const ingredientOption = page.locator(`text=${TEST_PREFIX}_Flour`).first();
    if ((await ingredientOption.count()) > 0) {
      await ingredientOption.click();
      await page.waitForTimeout(500);
    }
  }

  const saveRecipeButton = page.locator('button:has-text("Save")').first();
  if ((await saveRecipeButton.count()) > 0) {
    await saveRecipeButton.click();
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);
  }
}



