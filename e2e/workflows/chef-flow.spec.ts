import { test, expect } from '@playwright/test';
import {
  setupGlobalErrorListener,
  collectPageErrors,
  getNonAllowlistedErrors,
  clearCollectedErrors,
} from '../fixtures/global-error-listener';
import { ensureAuthenticated } from '../fixtures/auth-helper';
import { createIngredientFlow } from './helpers/createIngredientFlow';
import { createRecipeFlow } from './helpers/createRecipeFlow';
import { addIngredientToRecipeFlow } from './helpers/addIngredientToRecipeFlow';
import { assignDishToMenuFlow } from './helpers/assignDishToMenuFlow';
import { createTemperatureLogFlow } from './helpers/createTemperatureLogFlow';
import { createEquipmentMaintenanceFlow } from './helpers/createEquipmentMaintenanceFlow';

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
    await createIngredientFlow(page, testIngredientName, testSteps);
    await expect(page.locator(`text=${testIngredientName}`).first()).toBeVisible({
      timeout: 10000,
    });

    // Test 2: Create Complex Recipe
    await createRecipeFlow(page, testRecipeName, testSteps);
    await expect(page.locator(`text=${testRecipeName}`).first()).toBeVisible({ timeout: 10000 });

    // Test 3: Add ingredients to recipe via COGS page
    await addIngredientToRecipeFlow(page, testRecipeName, testIngredientName, testSteps);

    // Test 4: Assign Dish to Menu (simplified - just navigate to menu builder)
    await assignDishToMenuFlow(page, testSteps);

    // Test 5: Create Temperature Log
    await createTemperatureLogFlow(page, testSteps);

    // Test 6: Create Equipment Maintenance Log
    await createEquipmentMaintenanceFlow(page, testSteps);

    // Final error collection
    await collectPageErrors(page);
    const nonAllowlistedErrors = getNonAllowlistedErrors();

    // Assertions
    testSteps.push('Step 32: Verifying test completion');

    // Log test steps for report
    console.log('Test Steps:', testSteps.join('\n'));

    if (nonAllowlistedErrors.length > 0) {
      console.error('Non-allowlisted console/network errors found:', nonAllowlistedErrors);
    }

    // Fail on any console.error, console.warn (non-allowlisted), uncaught, or network 5xx
    expect(nonAllowlistedErrors.length).toBe(0);
  });
});
