/**
 * Helper function for creating a dish (vs recipe) in the chef workflow test.
 * Uses Builder flow: Dishes tab -> Builder -> Dish type -> name, selling price, ingredient -> Save Dish.
 */
import type { Page } from '@playwright/test';
import { waitForFormSubmission } from '../../helpers/form-helpers';
import { getSimWait } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

const DISH_NAME = 'Sim Test Dish';

export async function createDishFlow(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Navigate to Recipes page (Dishes tab)');
  await page.goto('/webapp/recipes#dishes');
  await page.waitForLoadState('load');
  await page.waitForTimeout(getSimWait(800));
  await collectPageErrors(page);

  testSteps.push('Open Builder view');
  const builderButton = page
    .locator('button:has-text("Builder"), button:has-text("Create your first item")')
    .first();
  await builderButton.waitFor({ state: 'visible', timeout: 15000 });
  await builderButton.click();
  await page.waitForTimeout(getSimWait(1500));

  testSteps.push('Select Dish type (not Recipe)');
  const dishTypeButton = page.locator('button:has-text("Dish")').first();
  await dishTypeButton.waitFor({ state: 'visible', timeout: 25000 });
  await dishTypeButton.click();
  await page.waitForTimeout(getSimWait(800));

  testSteps.push('Fill dish name and selling price');
  const nameInput = page
    .locator('input#dish-name')
    .or(page.locator('input[placeholder*="Grilled Salmon"]'))
    .or(page.locator('input[placeholder*="Chicken"]'))
    .first();
  await nameInput.waitFor({ state: 'visible', timeout: 20000 });
  await nameInput.fill(DISH_NAME);
  await page.waitForTimeout(getSimWait(300));

  const priceInput = page.locator('input#dish-price').first();
  await priceInput.waitFor({ state: 'visible', timeout: 5000 });
  await priceInput.fill('12.99');
  await page.waitForTimeout(getSimWait(300));

  testSteps.push('Add ingredient from Ingredients tab');
  const ingredientsTab = page.locator('button:has-text("Ingredients")').first();
  await ingredientsTab.waitFor({ state: 'visible', timeout: 5000 });
  await ingredientsTab.click();
  await page.waitForTimeout(getSimWait(600));

  const firstIngredient = page.locator('div.overflow-y-auto button').first();
  await firstIngredient.waitFor({ state: 'visible', timeout: 8000 });
  await firstIngredient.click();
  await page.waitForTimeout(getSimWait(500));

  const addModalButton = page.locator('button:has-text("Add")').first();
  if (await addModalButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await addModalButton.click();
    await page.waitForTimeout(getSimWait(500));
  }

  testSteps.push('Save dish');
  const saveButton = page.locator('button:has-text("Save Dish")').first();
  await saveButton.waitFor({ state: 'visible', timeout: 5000 });
  await saveButton.click();
  await waitForFormSubmission(page);
  await collectPageErrors(page);

  testSteps.push('Dish created successfully');
}
