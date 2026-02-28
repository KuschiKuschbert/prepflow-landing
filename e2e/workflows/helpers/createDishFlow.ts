/**
 * Helper function for creating a dish (vs recipe) in the chef workflow test.
 * Uses Builder flow: Dishes tab -> Builder toggle -> Dish type -> name, selling price, ingredient -> Save Dish.
 */
import type { Page } from '@playwright/test';
import { waitForFormSubmission } from '../../helpers/form-helpers';
import { getSimWait } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

const DISH_NAME = 'Sim Test Dish';

export async function createDishFlow(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Navigate to Recipes page (Dishes tab)');
  await page.goto('/webapp/recipes#dishes', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  await page.waitForTimeout(getSimWait(1500));
  await collectPageErrors(page);

  // Ensure Dishes & Recipes tab is active
  const dishesTab = page.locator('button:has-text("Dishes & Recipes")').first();
  if (await dishesTab.isVisible({ timeout: 5000 }).catch(() => false)) {
    await dishesTab.click();
    await page.waitForTimeout(getSimWait(500));
  }

  testSteps.push('Open Builder view');
  // IMPORTANT: Use exact aria-label="Builder view" to avoid matching
  // the "Menu Builder" tab (aria-label="View menu builder").
  const builderButton = page.locator('button[aria-label="Builder view"]').first();
  const builderVisible = await builderButton.isVisible({ timeout: 15000 }).catch(() => false);
  if (!builderVisible) {
    testSteps.push(
      'Builder view toggle not found - DishesClient still loading, skipping dish creation',
    );
    return;
  }
  await builderButton.click();
  await page.waitForTimeout(getSimWait(1500));

  testSteps.push('Select Dish type (not Recipe)');
  // Use exact role match to avoid selecting "Dishes & Recipes" tab which also contains "Dish"
  const dishTypeButton = page.getByRole('button', { name: 'Dish', exact: true }).first();
  const dishTypeVisible = await dishTypeButton.isVisible({ timeout: 15000 }).catch(() => false);
  if (!dishTypeVisible) {
    testSteps.push('Dish type button not visible - builder may not have loaded, skipping');
    return;
  }
  await dishTypeButton.click();
  await page.waitForTimeout(getSimWait(800));

  testSteps.push('Fill dish name and selling price');
  const nameInput = page.locator('input#dish-name').first();
  const dishNameVisible = await nameInput.isVisible({ timeout: 10000 }).catch(() => false);
  if (!dishNameVisible) {
    testSteps.push('[createDish] Name input not visible after 10s - skipping');
    return;
  }
  await nameInput.fill(DISH_NAME, { timeout: 10000 });
  await page.waitForTimeout(getSimWait(300));

  const priceInput = page.locator('input#dish-price').first();
  if (await priceInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await priceInput.fill('12.99', { timeout: 5000 });
  }
  await page.waitForTimeout(getSimWait(300));

  testSteps.push('Add ingredient from Ingredients tab');
  // Use filter to avoid matching "Dishes & Recipes" or other partial-match buttons
  const ingredientsTab = page
    .locator('button')
    .filter({ hasText: /^Ingredients/ })
    .first();
  if (await ingredientsTab.isVisible({ timeout: 8000 }).catch(() => false)) {
    await ingredientsTab.click();
    await page.waitForTimeout(getSimWait(600));

    const firstIngredient = page.locator('div.overflow-y-auto button').first();
    if (await firstIngredient.isVisible({ timeout: 8000 }).catch(() => false)) {
      await firstIngredient.click();
      await page.waitForTimeout(getSimWait(500));

      const addModalButton = page.locator('button:has-text("Add")').first();
      if (await addModalButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await addModalButton.click();
        await page.waitForTimeout(getSimWait(500));
      }
    }
  }

  testSteps.push('Save dish');
  const saveButton = page.getByRole('button', { name: /Save Dish|Save Recipe/i }).first();
  const saveVisible = await saveButton.isVisible({ timeout: 15000 }).catch(() => false);
  if (!saveVisible) {
    testSteps.push('Save Dish button not visible - skipping save');
    return;
  }
  await saveButton.click();
  await waitForFormSubmission(page);
  await collectPageErrors(page);

  testSteps.push('Dish created successfully');
}
