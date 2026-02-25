/**
 * Create a detailed recipe with metric measurements via the DishBuilder.
 * Extends the standard createRecipeFlow with:
 *  - More specific yield values and units (10 litres)
 *  - Adds multiple ingredients with metric quantities
 *  - Tests unit conversion inputs if visible
 * Uses DishBuilder flow: recipes?builder=true#dishes -> Recipe type -> fill fields -> save.
 */
import type { Page } from '@playwright/test';
import { waitForFormSubmission } from '../../helpers/form-helpers';
import { getSimWait } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function createDetailedRecipeFlow(
  page: Page,
  prefix: string,
  testSteps: string[] = [],
): Promise<void> {
  const recipeName = `${prefix}_DetailedRecipe`;

  testSteps.push('Navigate to Recipes page (DishBuilder view)');
  await page.goto('/webapp/recipes?builder=true#dishes');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(getSimWait(4000));
  await collectPageErrors(page);

  testSteps.push('Select Recipe type');
  const recipeTypeButton = page.getByRole('button', { name: 'Recipe', exact: true }).first();
  await recipeTypeButton.waitFor({ state: 'visible', timeout: 30000 });
  await recipeTypeButton.click();
  await page.waitForTimeout(getSimWait(800));

  testSteps.push('Fill recipe name');
  const nameInput = page.locator('input#dish-name').first();
  await nameInput.waitFor({ state: 'visible', timeout: 15000 });
  await nameInput.fill(recipeName);
  await page.waitForTimeout(getSimWait(300));

  testSteps.push('Fill yield with metric value (10)');
  const yieldInput = page.locator('input#recipe-yield').first();
  if (await yieldInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await yieldInput.fill('10');
    await page.waitForTimeout(getSimWait(200));
  }

  const yieldUnitSelect = page
    .locator('select#recipe-yield-unit, select[name*="yield_unit"]')
    .first();
  if (await yieldUnitSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
    await yieldUnitSelect.selectOption('litres').catch(async () => {
      await yieldUnitSelect.selectOption('L').catch(() => {});
    });
    await page.waitForTimeout(getSimWait(200));
  }

  testSteps.push('Switch to Ingredients tab and add multiple ingredients');
  const ingredientsTab = page.locator('button').filter({ hasText: /Ingredients \(\d+\)/ });
  await ingredientsTab.waitFor({ state: 'visible', timeout: 8000 });
  await ingredientsTab.click();
  await page.waitForTimeout(getSimWait(800));

  const ingredientButtons = page.locator('button').filter({ hasText: /\$|No price/ });
  const ingredientCount = await ingredientButtons.count();
  const toAdd = Math.min(ingredientCount, 3);

  for (let i = 0; i < toAdd; i++) {
    testSteps.push(`Add ingredient ${i + 1} of ${toAdd}`);
    const btn = ingredientButtons.nth(i);
    if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(getSimWait(500));

      const qtyInput = page
        .locator('input[type="number"], input[placeholder*="Qty"], input[placeholder*="quantity"]')
        .first();
      if (await qtyInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        const metricQty = i === 0 ? '5' : i === 1 ? '2.5' : '500';
        await qtyInput.fill(metricQty);
        await page.waitForTimeout(getSimWait(200));
      }

      const unitSelect = page.locator('select').last();
      if (await unitSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
        const metricUnit = i === 0 ? 'KG' : i === 1 ? 'L' : 'G';
        await unitSelect.selectOption(metricUnit).catch(() => {});
        await page.waitForTimeout(getSimWait(200));
      }

      const addInModal = page.getByRole('button', { name: 'Add' });
      if (await addInModal.isVisible({ timeout: 3000 }).catch(() => false)) {
        await addInModal.click();
        await page.waitForTimeout(getSimWait(400));
      }
    }
  }

  testSteps.push('Save detailed recipe');
  const saveButton = page.getByRole('button', { name: /Save Recipe|Save Dish/i });
  await saveButton.waitFor({ state: 'visible', timeout: 25000 });
  await saveButton.click();
  await waitForFormSubmission(page);
  await collectPageErrors(page);

  testSteps.push('Detailed recipe created successfully');
}
