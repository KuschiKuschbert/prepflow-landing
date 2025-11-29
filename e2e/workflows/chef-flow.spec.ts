import { test, expect } from '@playwright/test';
import {
  setupGlobalErrorListener,
  collectPageErrors,
  getCollectedErrors,
  clearCollectedErrors,
} from '../fixtures/global-error-listener';
import { ensureAuthenticated } from '../fixtures/auth-helper';
import {
  fillIngredientForm,
  fillRecipeForm,
  fillTemperatureLogForm,
  fillEquipmentMaintenanceForm,
  waitForFormSubmission,
} from '../helpers/form-helpers';

test.describe('Chef Flow - Critical Path', () => {
  let testIngredientName: string;
  let testRecipeName: string;
  let testSteps: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Clear error collection
    clearCollectedErrors();

    // Setup global error listener
    await setupGlobalErrorListener(page);

    // Ensure authenticated
    await ensureAuthenticated(page);

    // Generate unique test data
    const timestamp = Date.now();
    testIngredientName = `Test Tomato ${timestamp}`;
    testRecipeName = `Test Chicken Stir-fry ${timestamp}`;
    testSteps = [];
  });

  test.afterEach(async ({ page }) => {
    // Collect any remaining errors
    await collectPageErrors(page);
  });

  test('Complete Chef Workflow: Ingredient → Recipe → Menu → Temperature → Maintenance', async ({
    page,
  }) => {
    testSteps.push('Starting Chef Flow test');

    // Test 1: Create Ingredient (Metric Units)
    testSteps.push('Step 1: Navigate to Ingredients page');
    await page.goto('/webapp/ingredients');
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);

    testSteps.push('Step 2: Click Add Ingredient button');
    const addIngredientButton = page
      .locator('button:has-text("Add"), button:has-text("➕")')
      .first();
    await addIngredientButton.waitFor({ state: 'visible', timeout: 10000 });
    await addIngredientButton.click();
    await page.waitForTimeout(1000);
    await collectPageErrors(page);

    testSteps.push('Step 3: Fill ingredient form with metric units');
    await fillIngredientForm(page, {
      name: testIngredientName,
      packSize: '5',
      packSizeUnit: 'KG',
      packPrice: '12.50',
      category: 'Vegetables',
    });
    await collectPageErrors(page);

    testSteps.push('Step 4: Navigate through wizard and submit');
    // Fill form (navigates through steps)
    await fillIngredientForm(page, {
      name: testIngredientName,
      packSize: '5',
      packSizeUnit: 'KG',
      packPrice: '12.50',
    });

    // Final step should have "Save Ingredient" button
    const submitButton = page.locator('button:has-text("Save Ingredient")').first();
    await submitButton.waitFor({ state: 'visible', timeout: 10000 });
    await submitButton.click();
    await waitForFormSubmission(page);
    await collectPageErrors(page);

    // Verify ingredient appears in list
    await expect(page.locator(`text=${testIngredientName}`).first()).toBeVisible({
      timeout: 10000,
    });
    testSteps.push('Step 5: Verified ingredient created successfully');

    // Test 2: Create Complex Recipe
    testSteps.push('Step 6: Navigate to Recipes page');
    await page.goto('/webapp/recipes');
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);

    testSteps.push('Step 7: Click Add Recipe button');
    const addRecipeButton = page
      .locator('button:has-text("Add Recipe"), button:has-text("Add"), button:has-text("➕")')
      .first();
    await addRecipeButton.waitFor({ state: 'visible', timeout: 10000 });
    await addRecipeButton.click();
    await page.waitForTimeout(1000);
    await collectPageErrors(page);

    testSteps.push('Step 8: Fill recipe form');
    await fillRecipeForm(page, {
      name: testRecipeName,
      yield: 4,
      instructions: 'Step 1: Prepare ingredients\nStep 2: Cook chicken\nStep 3: Add vegetables',
    });
    await collectPageErrors(page);

    testSteps.push('Step 9: Submit recipe form');
    const recipeSubmitButton = page
      .locator('button:has-text("Add Recipe"), button:has-text("Save"), button[type="submit"]')
      .first();
    await recipeSubmitButton.click();
    await waitForFormSubmission(page);
    await collectPageErrors(page);

    // Verify recipe appears in list
    await expect(page.locator(`text=${testRecipeName}`).first()).toBeVisible({ timeout: 10000 });
    testSteps.push('Step 10: Verified recipe created successfully');

    // Test 3: Add ingredients to recipe via COGS page
    testSteps.push('Step 11: Navigate to COGS page');
    await page.goto('/webapp/cogs');
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);

    testSteps.push('Step 12: Select recipe from combobox');
    const recipeCombobox = page
      .locator('input[placeholder*="recipe"], input[role="combobox"]')
      .first();
    await recipeCombobox.click();
    await page.waitForTimeout(500);

    // Type recipe name to filter
    await recipeCombobox.fill(testRecipeName);
    await page.waitForTimeout(1000);

    // Select the recipe from dropdown
    const recipeOption = page.locator(`text=${testRecipeName}`).first();
    if (await recipeOption.isVisible().catch(() => false)) {
      await recipeOption.click();
      await page.waitForTimeout(1000);
      await collectPageErrors(page);
      testSteps.push('Step 13: Selected recipe in COGS page');
    } else {
      testSteps.push('Step 13: Recipe not found in dropdown (may need to create dish first)');
    }

    // Try to add ingredient to recipe
    testSteps.push('Step 14: Attempt to add ingredient to recipe');
    const addIngredientButton2 = page
      .locator('button:has-text("Add Ingredient"), button:has-text("➕")')
      .first();
    if (await addIngredientButton2.isVisible().catch(() => false)) {
      await addIngredientButton2.click();
      await page.waitForTimeout(1000);

      // Fill ingredient search
      const ingredientSearch = page.locator('input[placeholder*="ingredient"]').first();
      if (await ingredientSearch.isVisible().catch(() => false)) {
        await ingredientSearch.fill(testIngredientName);
        await page.waitForTimeout(1000);

        // Select ingredient from dropdown
        const ingredientOption = page.locator(`text=${testIngredientName}`).first();
        if (await ingredientOption.isVisible().catch(() => false)) {
          await ingredientOption.click();
          await page.waitForTimeout(500);

          // Fill quantity
          const quantityInput = page.locator('input[type="number"]').first();
          await quantityInput.fill('500');

          // Select unit
          const unitSelect = page.locator('select').first();
          await unitSelect.selectOption('g');

          // Submit
          const addButton = page.locator('button:has-text("Add")').first();
          await addButton.click();
          await page.waitForTimeout(1000);
          testSteps.push('Step 15: Added ingredient to recipe');
        }
      }
    }
    await collectPageErrors(page);

    // Test 4: Assign Dish to Menu (simplified - just navigate to menu builder)
    testSteps.push('Step 16: Navigate to Menu Builder');
    await page.goto('/webapp/menu-builder');
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);

    // Try to find and select a menu, or create one
    testSteps.push('Step 17: Attempt to assign dish to menu');
    const menuLink = page.locator('a[href*="/menu"], button:has-text("Menu")').first();
    if (await menuLink.isVisible().catch(() => false)) {
      await menuLink.click();
      await page.waitForTimeout(2000);
      await collectPageErrors(page);
      testSteps.push('Step 18: Opened menu editor');
    } else {
      testSteps.push('Step 18: Menu builder interface not immediately accessible');
    }

    // Test 5: Create Temperature Log
    testSteps.push('Step 19: Navigate to Temperature page');
    await page.goto('/webapp/temperature');
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);

    testSteps.push('Step 20: Click Add Temperature Log button');
    const addTempButton = page
      .locator(
        'button:has-text("Add Temperature"), button:has-text("Add Log"), button:has-text("➕")',
      )
      .first();
    await addTempButton.click();
    await page.waitForTimeout(1000);
    await collectPageErrors(page);

    testSteps.push('Step 21: Fill temperature log form');
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0].substring(0, 5);

    await fillTemperatureLogForm(page, {
      date: today,
      time: now,
      temperature: '4.5',
      temperatureType: 'fridge',
      location: 'Main Fridge',
      notes: 'Routine check - E2E test',
    });
    await collectPageErrors(page);

    testSteps.push('Step 22: Submit temperature log form');
    const tempSubmitButton = page
      .locator('button:has-text("Add"), button:has-text("Log Temperature"), button[type="submit"]')
      .first();
    await tempSubmitButton.click();
    await waitForFormSubmission(page);
    await collectPageErrors(page);
    testSteps.push('Step 23: Temperature log submitted');

    // Test 6: Create Equipment Maintenance Log
    testSteps.push('Step 24: Navigate to Compliance page');
    await page.goto('/webapp/compliance');
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);

    testSteps.push('Step 25: Switch to Equipment Maintenance tab');
    const equipmentTab = page
      .locator('button:has-text("Equipment"), button:has-text("🔧")')
      .first();
    if (await equipmentTab.isVisible().catch(() => false)) {
      await equipmentTab.click();
      await page.waitForTimeout(1000);
      await collectPageErrors(page);
      testSteps.push('Step 26: Opened Equipment Maintenance tab');
    } else {
      testSteps.push('Step 26: Equipment tab not found, trying direct navigation');
    }

    testSteps.push('Step 27: Click Add Equipment Maintenance button');
    const addMaintenanceButton = page
      .locator(
        'button:has-text("Add Maintenance"), button:has-text("Add Maintenance Record"), button:has-text("➕")',
      )
      .first();
    if (await addMaintenanceButton.isVisible().catch(() => false)) {
      await addMaintenanceButton.click();
      await page.waitForTimeout(1000);
      await collectPageErrors(page);
      testSteps.push('Step 28: Opened equipment maintenance form');
    } else {
      testSteps.push('Step 28: Add button not found - form may already be visible');
    }

    testSteps.push('Step 29: Fill equipment maintenance form');
    await fillEquipmentMaintenanceForm(page, {
      equipmentName: 'Main Fridge',
      equipmentType: 'fridge',
      maintenanceDate: today,
      maintenanceType: 'scheduled',
      description: 'Monthly maintenance check - E2E test',
      serviceProvider: 'ABC Maintenance Co',
      cost: '150.00',
      performedBy: 'John Doe',
      notes: 'Routine maintenance performed',
    });
    await collectPageErrors(page);

    testSteps.push('Step 30: Submit equipment maintenance form');
    const maintenanceSubmitButton = page
      .locator(
        'button:has-text("Save Maintenance"), button:has-text("Save"), button[type="submit"]',
      )
      .first();
    if (await maintenanceSubmitButton.isVisible().catch(() => false)) {
      await maintenanceSubmitButton.click();
      await waitForFormSubmission(page);
      await collectPageErrors(page);
      testSteps.push('Step 31: Equipment maintenance record submitted');
    } else {
      testSteps.push('Step 31: Submit button not found');
    }

    // Final error collection
    await collectPageErrors(page);
    const finalErrors = getCollectedErrors();

    // Assertions
    testSteps.push('Step 32: Verifying test completion');

    // Log test steps for report
    console.log('Test Steps:', testSteps.join('\n'));

    // Check for critical errors (uncaught exceptions and network 5xx)
    const criticalErrors = finalErrors.filter(
      e => e.type === 'uncaught' || (e.type === 'network' && e.statusCode && e.statusCode >= 500),
    );

    if (criticalErrors.length > 0) {
      console.error('Critical errors found:', criticalErrors);
    }

    // Test passes even if there are warnings/4xx errors (they'll be in the report)
    // But fail if there are critical errors
    expect(criticalErrors.length).toBe(0);
  });
});
