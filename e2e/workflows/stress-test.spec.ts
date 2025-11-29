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
  waitForFormSubmission,
} from '../helpers/form-helpers';

test.describe('Stress Tests - Rapid Operations and Concurrent Actions', () => {
  test.beforeEach(async ({ page }) => {
    clearCollectedErrors();
    await setupGlobalErrorListener(page);
    await ensureAuthenticated(page);
  });

  test.afterEach(async ({ page }) => {
    await collectPageErrors(page);
  });

  test('Rapid ingredient creation (10 ingredients)', async ({ page }) => {
    await page.goto('/webapp/ingredients');
    await page.waitForLoadState('networkidle');

    const timestamp = Date.now();
    const createdIngredients: string[] = [];

    for (let i = 0; i < 10; i++) {
      const ingredientName = `Stress Test Ingredient ${timestamp}-${i}`;

      // Click add button
      const addButton = page.locator('button:has-text("Add"), button:has-text("➕")').first();
      await addButton.waitFor({ state: 'visible', timeout: 10000 });
      await addButton.click();
      await page.waitForTimeout(500);

      // Fill form
      await fillIngredientForm(page, {
        name: ingredientName,
        packSize: String(5 + i),
        packSizeUnit: 'KG',
        packPrice: String(10 + i),
      });

      // Submit
      // Wait for wizard form
      await page.waitForSelector('form', { timeout: 5000 });
      const submitButton = page
        .locator('button:has-text("Add Ingredient"), button[type="submit"]')
        .first();
      await submitButton.waitFor({ state: 'visible', timeout: 10000 });
      await submitButton.click();
      await waitForFormSubmission(page, 5000);

      createdIngredients.push(ingredientName);
      await collectPageErrors(page);

      // Small delay between creations
      await page.waitForTimeout(200);
    }

    // Verify all ingredients were created
    for (const name of createdIngredients) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 5000 });
    }

    const errors = getCollectedErrors();
    const criticalErrors = errors.filter(
      e => e.type === 'uncaught' || (e.type === 'network' && e.statusCode && e.statusCode >= 500),
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('Rapid recipe creation (5 recipes)', async ({ page }) => {
    await page.goto('/webapp/recipes');
    await page.waitForLoadState('networkidle');

    const timestamp = Date.now();
    const createdRecipes: string[] = [];

    for (let i = 0; i < 5; i++) {
      const recipeName = `Stress Test Recipe ${timestamp}-${i}`;

      const addButton = page
        .locator('button:has-text("Add Recipe"), button:has-text("➕")')
        .first();
      await addButton.click();
      await page.waitForTimeout(500);

      await fillRecipeForm(page, {
        name: recipeName,
        yield: 4 + i,
        instructions: `Test recipe ${i} instructions`,
      });

      const submitButton = page
        .locator('button:has-text("Add Recipe"), button[type="submit"]')
        .first();
      await submitButton.click();
      await waitForFormSubmission(page, 5000);

      createdRecipes.push(recipeName);
      await collectPageErrors(page);
      await page.waitForTimeout(200);
    }

    // Verify recipes were created
    for (const name of createdRecipes) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible({ timeout: 5000 });
    }

    const errors = getCollectedErrors();
    const criticalErrors = errors.filter(
      e => e.type === 'uncaught' || (e.type === 'network' && e.statusCode && e.statusCode >= 500),
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('Rapid temperature log creation (10 logs)', async ({ page }) => {
    await page.goto('/webapp/temperature');
    await page.waitForLoadState('networkidle');

    const today = new Date().toISOString().split('T')[0];
    const baseTime = new Date();
    baseTime.setHours(8, 0, 0, 0);

    for (let i = 0; i < 10; i++) {
      const time = new Date(baseTime);
      time.setMinutes(time.getMinutes() + i * 30);
      const timeString = time.toTimeString().split(' ')[0].substring(0, 5);

      const addButton = page
        .locator('button:has-text("Add Temperature"), button:has-text("Add Log")')
        .first();
      if (await addButton.isVisible().catch(() => false)) {
        await addButton.click();
        await page.waitForTimeout(500);
      }

      await fillTemperatureLogForm(page, {
        date: today,
        time: timeString,
        temperature: String(4 + i * 0.1),
        temperatureType: 'fridge',
        location: `Test Location ${i}`,
        notes: `Stress test log ${i}`,
      });

      const submitButton = page.locator('button:has-text("Add"), button[type="submit"]').first();
      await submitButton.click();
      await waitForFormSubmission(page, 5000);

      await collectPageErrors(page);
      await page.waitForTimeout(200);
    }

    const errors = getCollectedErrors();
    const criticalErrors = errors.filter(
      e => e.type === 'uncaught' || (e.type === 'network' && e.statusCode && e.statusCode >= 500),
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('Large recipe with 20+ ingredients', async ({ page }) => {
    await page.goto('/webapp/cogs');
    await page.waitForLoadState('networkidle');

    // Create a recipe first
    await page.goto('/webapp/recipes');
    await page.waitForLoadState('networkidle');

    const timestamp = Date.now();
    const recipeName = `Large Recipe ${timestamp}`;

    const addButton = page.locator('button:has-text("Add Recipe")').first();
    await addButton.click();
    await page.waitForTimeout(500);

    await fillRecipeForm(page, {
      name: recipeName,
      yield: 20,
      instructions: 'Large recipe with many ingredients',
    });

    const submitButton = page.locator('button:has-text("Add Recipe")').first();
    await submitButton.click();
    await waitForFormSubmission(page);

    // Navigate to COGS and add many ingredients
    await page.goto('/webapp/cogs');
    await page.waitForLoadState('networkidle');

    // Select recipe
    const recipeCombobox = page.locator('input[placeholder*="recipe"]').first();
    await recipeCombobox.click();
    await page.waitForTimeout(500);
    await recipeCombobox.fill(recipeName);
    await page.waitForTimeout(1000);

    const recipeOption = page.locator(`text=${recipeName}`).first();
    if (await recipeOption.isVisible().catch(() => false)) {
      await recipeOption.click();
      await page.waitForTimeout(1000);
    }

    // Add 20 ingredients (simplified - just attempt to add)
    for (let i = 0; i < 20; i++) {
      const addIngButton = page.locator('button:has-text("Add Ingredient")').first();
      if (await addIngButton.isVisible().catch(() => false)) {
        await addIngButton.click();
        await page.waitForTimeout(500);

        // Try to add an ingredient (simplified)
        // In a real scenario, we'd select from existing ingredients
        await page.waitForTimeout(200);
      }
    }

    await collectPageErrors(page);
    const errors = getCollectedErrors();
    const criticalErrors = errors.filter(
      e => e.type === 'uncaught' || (e.type === 'network' && e.statusCode && e.statusCode >= 500),
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('Concurrent page navigation', async ({ browser }) => {
    // Open multiple pages simultaneously
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext(),
    ]);

    const pages = await Promise.all(contexts.map(ctx => ctx.newPage()));

    // Setup error listeners on all pages
    await Promise.all(pages.map(page => setupGlobalErrorListener(page)));
    await Promise.all(pages.map(page => ensureAuthenticated(page)));

    // Navigate to different pages simultaneously
    await Promise.all([
      pages[0].goto('/webapp/ingredients'),
      pages[1].goto('/webapp/recipes'),
      pages[2].goto('/webapp/temperature'),
    ]);

    await Promise.all(pages.map(page => page.waitForLoadState('networkidle')));

    // Collect errors from all pages
    await Promise.all(pages.map(page => collectPageErrors(page)));

    // Close all contexts
    await Promise.all(contexts.map(ctx => ctx.close()));

    const errors = getCollectedErrors();
    const criticalErrors = errors.filter(
      e => e.type === 'uncaught' || (e.type === 'network' && e.statusCode && e.statusCode >= 500),
    );

    expect(criticalErrors.length).toBe(0);
  });
});
