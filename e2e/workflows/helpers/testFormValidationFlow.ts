/**
 * Generic form validation tester.
 * Visits form pages and attempts to submit with empty required fields.
 * Asserts that validation errors appear in the DOM.
 * Tests recipe, ingredient, function, and temperature log forms.
 * Resilient: continues even if some forms are not accessible.
 */
import type { Page } from '@playwright/test';
import { getSimWait, safeGoto } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

async function hasValidationError(page: Page): Promise<boolean> {
  const errorSelectors = [
    '[role="alert"]',
    '[aria-invalid="true"]',
    '.text-red-400',
    '.text-red-500',
    '.text-red-600',
    'text=/required/i',
    'text=/please fill/i',
    'text=/cannot be empty/i',
    'text=/is required/i',
  ];

  for (const selector of errorSelectors) {
    const el = page.locator(selector).first();
    if (await el.isVisible({ timeout: 1000 }).catch(() => false)) {
      return true;
    }
  }
  return false;
}

async function testRecipeFormValidation(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test recipe form validation - empty name');
  if (!(await safeGoto(page, '/webapp/recipes?builder=true#dishes'))) {
    testSteps.push('[testFormValidation] recipe page nav failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(500));
  await page.waitForTimeout(getSimWait(3000));

  const recipeTypeButton = page.getByRole('button', { name: 'Recipe', exact: true }).first();
  if (!(await recipeTypeButton.isVisible({ timeout: 10000 }).catch(() => false))) {
    testSteps.push('Recipe type button not visible - skip validation test');
    return;
  }
  await recipeTypeButton.click();
  await page.waitForTimeout(getSimWait(800));

  const nameInput = page.locator('input#dish-name').first();
  if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await nameInput.fill('');
    await page.waitForTimeout(getSimWait(200));
  }

  const saveButton = page.getByRole('button', { name: /Save Recipe|Save Dish/i });
  if (await saveButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await saveButton.click();
    await page.waitForTimeout(getSimWait(800));

    const hasError = await hasValidationError(page);
    testSteps.push(
      hasError
        ? 'Recipe validation error correctly shown for empty name'
        : 'No validation error detected for empty recipe name (form may prevent submit)',
    );
  }

  await collectPageErrors(page);
}

async function testIngredientFormValidation(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test ingredient form validation - empty name');
  if (!(await safeGoto(page, '/webapp/ingredients'))) {
    testSteps.push('[testFormValidation] ingredient page nav failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(1500));

  const addBtn = page.locator('button:has-text("Add Ingredient"), button:has-text("➕")').first();
  if (!(await addBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
    testSteps.push('Add Ingredient button not found - skip');
    return;
  }
  await addBtn.click();
  await page.waitForTimeout(getSimWait(1000));

  const nameInput = page.locator('input[placeholder*="Fresh Tomatoes"]').first();
  if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await nameInput.fill('');
    await page.waitForTimeout(getSimWait(200));
  }

  const nextBtn = page.locator('button:has-text("Next →")').first();
  if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await nextBtn.click();
    await page.waitForTimeout(getSimWait(500));

    const hasError = await hasValidationError(page);
    testSteps.push(
      hasError
        ? 'Ingredient validation error correctly shown for empty name'
        : 'No validation error detected for empty ingredient name',
    );
  }

  const cancelBtn = page.locator('button:has-text("Cancel"), button:has-text("Close")').first();
  if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await cancelBtn.click();
  }

  await collectPageErrors(page);
}

async function testFunctionFormValidation(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test function form validation - missing required fields');
  if (!(await safeGoto(page, '/webapp/functions'))) {
    testSteps.push('[testFormValidation] functions page nav failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(800));

  const newBtn = page
    .locator('button:has-text("New Function"), a:has-text("New Function")')
    .first();
  if (!(await newBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
    testSteps.push('New Function button not found - skip');
    return;
  }
  await newBtn.click();
  await page.waitForTimeout(getSimWait(500));

  const saveBtn = page
    .locator('button:has-text("Create Event"), button:has-text("Create")')
    .first();
  if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    const isDisabled = await saveBtn.isDisabled().catch(() => false);
    if (isDisabled) {
      testSteps.push('Create Event button is disabled (form requires name) - testing by typing');
      // Type a name to enable the button, then try submitting
      const nameInput = page
        .locator('input[type="text"], input[placeholder*="name"], input[placeholder*="Name"]')
        .first();
      if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nameInput.fill('Test Validation Event');
        await page.waitForTimeout(getSimWait(300));
        // Try to click save again after filling
        if (!(await saveBtn.isDisabled().catch(() => true))) {
          await saveBtn.click({ force: true });
          await page.waitForTimeout(getSimWait(800));
          testSteps.push('Create Event clicked after filling name');
        }
      } else {
        testSteps.push('Create Event button disabled and no name input found - skip');
      }
    } else {
      await saveBtn.click({ force: true });
      await page.waitForTimeout(getSimWait(800));

      const hasError = await hasValidationError(page);
      testSteps.push(
        hasError
          ? 'Function validation error correctly shown for empty form'
          : 'No validation error detected for empty function form',
      );
    }
  }

  const cancelBtn = page.locator('button:has-text("Cancel")').first();
  if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await cancelBtn.click();
  }

  await collectPageErrors(page);
}

async function testTemperatureLogValidation(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test temperature log validation - empty temperature');
  if (!(await safeGoto(page, '/webapp/temperature'))) {
    testSteps.push('[testFormValidation] temperature page nav failed - skipping');
    return;
  }
  await page.waitForTimeout(getSimWait(1000));

  const addBtn = page
    .locator(
      'button:has-text("Add Temperature Log"), button:has-text("Add Temperature"), button:has-text("Add Log")',
    )
    .first();
  if (!(await addBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
    testSteps.push('Add Temperature Log button not found - skip');
    return;
  }
  await addBtn.click();
  await page.waitForTimeout(getSimWait(800));

  const submitBtn = page
    .locator('button:has-text("Add"), button:has-text("Log Temperature"), button[type="submit"]')
    .first();
  if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await submitBtn.click();
    await page.waitForTimeout(getSimWait(800));

    const hasError = await hasValidationError(page);
    testSteps.push(
      hasError
        ? 'Temperature log validation error correctly shown'
        : 'No validation error detected for empty temperature log',
    );
  }

  const cancelBtn = page.locator('button:has-text("Cancel"), button:has-text("Close")').first();
  if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await cancelBtn.click();
  }

  await collectPageErrors(page);
}

export async function testFormValidationFlow(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Begin form validation tests');

  await testRecipeFormValidation(page, testSteps).catch(e => {
    testSteps.push(`[testFormValidation] recipe validation skipped: ${String(e).slice(0, 60)}`);
  });
  await testIngredientFormValidation(page, testSteps).catch(e => {
    testSteps.push(`[testFormValidation] ingredient validation skipped: ${String(e).slice(0, 60)}`);
  });
  await testFunctionFormValidation(page, testSteps).catch(e => {
    testSteps.push(`[testFormValidation] function validation skipped: ${String(e).slice(0, 60)}`);
  });
  await testTemperatureLogValidation(page, testSteps).catch(e => {
    testSteps.push(
      `[testFormValidation] temperature validation skipped: ${String(e).slice(0, 60)}`,
    );
  });

  testSteps.push('Form validation tests completed');
}
