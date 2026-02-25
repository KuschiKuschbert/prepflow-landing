/**
 * Create a plated dish with allergen flags toggled via the DishBuilder.
 * Flow: recipes?builder=true#dishes -> Dish type -> fill name/price ->
 *       link sub-recipe from Recipes tab -> toggle allergen flags -> Save Dish.
 * Resilient: continues even if allergen toggles are not visible.
 */
import type { Page } from '@playwright/test';
import { waitForFormSubmission } from '../../helpers/form-helpers';
import { getSimWait } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createDishWithAllergensFlow(
  page: Page,
  prefix: string,
  testSteps: string[] = [],
): Promise<void> {
  const dishName = `${prefix}_AllergenDish`;

  testSteps.push('Navigate to DishBuilder (Dishes tab)');
  await page.goto('/webapp/recipes?builder=true#dishes');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(getSimWait(4000));
  await collectPageErrors(page);

  testSteps.push('Select Dish type');
  const dishTypeButton = page.locator('button:has-text("Dish")').first();
  await dishTypeButton.waitFor({ state: 'visible', timeout: 25000 });
  await dishTypeButton.click();
  await page.waitForTimeout(getSimWait(800));

  testSteps.push('Fill dish name and selling price');
  const nameInput = page
    .locator('input#dish-name')
    .or(page.locator('input[placeholder*="Grilled Salmon"]'))
    .first();
  await nameInput.waitFor({ state: 'visible', timeout: 15000 });
  await nameInput.fill(dishName);
  await page.waitForTimeout(getSimWait(300));

  const priceInput = page.locator('input#dish-price').first();
  if (await priceInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await priceInput.fill('24.50');
    await page.waitForTimeout(getSimWait(300));
  }

  testSteps.push('Link sub-recipe from Recipes tab');
  const recipesTab = page.locator('button').filter({ hasText: /Recipes \(\d+\)/ });
  if (await recipesTab.isVisible({ timeout: 5000 }).catch(() => false)) {
    await recipesTab.click();
    await page.waitForTimeout(getSimWait(800));

    const firstRecipe = page
      .locator('button')
      .filter({ hasText: /\$|No price/ })
      .first();
    if (await firstRecipe.isVisible({ timeout: 5000 }).catch(() => false)) {
      await firstRecipe.click();
      await page.waitForTimeout(getSimWait(500));

      const addInModal = page.getByRole('button', { name: 'Add' });
      if (await addInModal.isVisible({ timeout: 3000 }).catch(() => false)) {
        await addInModal.click();
        await page.waitForTimeout(getSimWait(400));
      }
    }
  } else {
    testSteps.push('Recipes tab not available - adding ingredient instead');
    const ingredientsTab = page.locator('button').filter({ hasText: /Ingredients \(\d+\)/ });
    if (await ingredientsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await ingredientsTab.click();
      await page.waitForTimeout(getSimWait(600));
      const firstIngredient = page
        .locator('button')
        .filter({ hasText: /\$|No price/ })
        .first();
      if (await firstIngredient.isVisible({ timeout: 5000 }).catch(() => false)) {
        await firstIngredient.click();
        await page.waitForTimeout(getSimWait(500));
        const addInModal = page.getByRole('button', { name: 'Add' });
        if (await addInModal.isVisible({ timeout: 3000 }).catch(() => false)) {
          await addInModal.click();
          await page.waitForTimeout(getSimWait(400));
        }
      }
    }
  }

  testSteps.push('Toggle allergen flags (Gluten, Dairy)');
  const allergenLabels = ['Gluten', 'Dairy'];
  for (const allergen of allergenLabels) {
    const toggle = page
      .locator(`button:has-text("${allergen}"), label:has-text("${allergen}")`)
      .first();
    if (await toggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await toggle.click();
      await page.waitForTimeout(getSimWait(200));
      testSteps.push(`Toggled ${allergen} allergen flag`);
    }

    const checkbox = page
      .locator(`input[type="checkbox"][name*="${allergen.toLowerCase()}"]`)
      .first();
    if (await checkbox.isVisible({ timeout: 1000 }).catch(() => false)) {
      await checkbox.check();
      await page.waitForTimeout(getSimWait(200));
      testSteps.push(`Checked ${allergen} allergen checkbox`);
    }
  }

  testSteps.push('Save dish with allergens');
  const saveButton = page.getByRole('button', { name: /Save Dish|Save Recipe/i });
  await saveButton.waitFor({ state: 'visible', timeout: 25000 });
  await saveButton.click();
  await waitForFormSubmission(page);
  await collectPageErrors(page);

  testSteps.push('Dish with allergens created successfully');
}
