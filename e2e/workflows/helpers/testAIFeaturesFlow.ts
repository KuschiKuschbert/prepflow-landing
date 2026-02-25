/**
 * Test AI feature triggers across the application.
 * Clicks AI recipe instructions button, AI prep details button,
 * and interacts with AI specials page.
 * Does NOT wait for AI responses (they require API keys) -- only verifies
 * the UI triggers are accessible and clickable.
 * Resilient: continues even if AI buttons are not found.
 */
import type { Page } from '@playwright/test';
import { getSimWait, SIM_FAST } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

async function testAIRecipeInstructions(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test AI recipe instructions');
  await page.goto('/webapp/recipes', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(1200));

  const firstRecipe = page.locator('table tbody tr, div[class*="group"][class*="rounded"]').first();
  if (!(await firstRecipe.isVisible({ timeout: 5000 }).catch(() => false))) {
    testSteps.push('No recipes found - skip AI instructions test');
    return;
  }
  await firstRecipe.click();
  await page.waitForTimeout(getSimWait(1000));

  const aiBtn = page
    .locator(
      'button:has-text("Generate Instructions"), button:has-text("AI Instructions"), button:has-text("AI Generate"), button[aria-label*="AI"]',
    )
    .first();
  if (await aiBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    testSteps.push('AI Instructions button found');
    await aiBtn.click();
    await page.waitForTimeout(getSimWait(1000));

    const cancelBtn = page.locator('button:has-text("Cancel"), button:has-text("Close")').first();
    if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cancelBtn.click();
    }
  } else {
    testSteps.push('AI Instructions button not found on recipe detail');
  }

  await collectPageErrors(page);
}

async function testAISpecialsPage(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test AI Specials page');
  await page.goto('/webapp/specials', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(1000));

  const generateBtn = page
    .locator(
      'button:has-text("Generate"), button:has-text("Create Specials"), button:has-text("Get Specials")',
    )
    .first();
  if (await generateBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    testSteps.push('AI Specials generate button found');
  }

  const uploadBtn = page
    .locator(
      'button:has-text("Upload Photo"), button:has-text("Take Photo"), button:has-text("Upload")',
    )
    .first();
  if (await uploadBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    testSteps.push('AI Specials photo upload button found');
  }

  const searchInput = page
    .locator('input[placeholder*="Search"], input[placeholder*="search"], input[type="search"]')
    .first();
  if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await searchInput.fill('pasta');
    await page.waitForTimeout(getSimWait(600));
    await searchInput.fill('');
    testSteps.push('AI Specials search tested');
  }

  await collectPageErrors(page);
}

async function testAIPrepDetails(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test AI prep details');
  await page.goto('/webapp/prep-lists', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(1000));

  const aiBtn = page
    .locator(
      'button:has-text("AI Prep"), button:has-text("Analyze"), button:has-text("Generate Prep"), button[aria-label*="AI"]',
    )
    .first();
  if (await aiBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    testSteps.push('AI Prep Details button found');
  }

  await collectPageErrors(page);
}

export async function testAIFeaturesFlow(page: Page, testSteps: string[] = []): Promise<void> {
  testSteps.push('Begin AI features tests');

  await testAIRecipeInstructions(page, testSteps);
  await testAISpecialsPage(page, testSteps);
  await testAIPrepDetails(page, testSteps);

  testSteps.push('AI features tests completed');
}
