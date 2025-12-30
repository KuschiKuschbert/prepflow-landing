/**
 * Chef workflow test helpers.
 */
import { test, expect, Page } from '@playwright/test';
import { collectPageErrors } from '../../fixtures/global-error-listener';

/**
 * Chef Workflow - Login.
 */
export async function chefWorkflowLogin(page: Page, visitedPages: Set<string>): Promise<void> {
  await page.goto('/webapp');
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);
  visitedPages.add(page.url());
}

/**
 * Chef Workflow - Create Ingredient.
 */
export async function chefWorkflowCreateIngredient(
  page: Page,
  TEST_PREFIX: string,
  visitedPages: Set<string>,
): Promise<void> {
  await page.goto('/webapp/ingredients');
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);
  visitedPages.add(page.url());

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const addButton = page.locator('button:has-text("Add"):not(:has-text("Add Supplier"))').first();
  await addButton.waitFor({ state: 'visible', timeout: 15000 });
  await addButton.click();

  await page.waitForSelector(
    'h2:has-text("Add New Ingredient"), input[name="ingredient_name"], div:has-text("Add New Ingredient")',
    { state: 'visible', timeout: 15000 },
  );

  await page.waitForTimeout(500);
  const nameInput = page.locator('input[name="ingredient_name"]').first();
  await nameInput.waitFor({ state: 'visible', timeout: 10000 });

  const ingredientName = `${TEST_PREFIX}_Flour`;
  await nameInput.fill(ingredientName);

  const packSizeInput = page.locator('input[name="pack_size"]').first();
  if ((await packSizeInput.count()) > 0) {
    await packSizeInput.fill('5');
    const packUnitSelect = page.locator('select[name="pack_size_unit"]').first();
    if ((await packUnitSelect.count()) > 0) {
      await packUnitSelect.selectOption('kg');
    }
    const packPriceInput = page.locator('input[name="pack_price"]').first();
    if ((await packPriceInput.count()) > 0) {
      await packPriceInput.fill('12.50');
    }
  }

  const nextButton = page.locator('button:has-text("Next")').first();
  if ((await nextButton.count()) > 0 && (await nextButton.isEnabled())) {
    await nextButton.click();
    await page.waitForTimeout(1000);
  }

  const unitSelect = page.locator('select[name="unit"]').first();
  if ((await unitSelect.count()) > 0) {
    await unitSelect.selectOption('kg');
  }

  const finalSaveButton = page
    .locator('button:has-text("Save"), button:has-text("Add Ingredient")')
    .first();
  if ((await finalSaveButton.count()) > 0 && (await finalSaveButton.isVisible())) {
    await finalSaveButton.click();
  } else {
    for (let i = 0; i < 3; i++) {
      const nextBtn = page.locator('button:has-text("Next")').first();
      if ((await nextBtn.count()) > 0 && (await nextBtn.isEnabled())) {
        await nextBtn.click();
        await page.waitForTimeout(500);
      } else {
        break;
      }
    }
    const saveBtn = page.locator('button:has-text("Save")').first();
    if ((await saveBtn.count()) > 0) {
      await saveBtn.click();
    }
  }

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await collectPageErrors(page);

  await expect(page.locator(`text=${ingredientName}`).first()).toBeVisible({ timeout: 15000 });
}




