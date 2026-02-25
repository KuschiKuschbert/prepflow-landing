/**
 * Test sort controls and view toggle buttons across modules.
 * Clicks sort dropdowns on ingredient/recipe/performance tables,
 * and toggles table/card view on equipment page.
 * Resilient: continues even if controls are not found.
 */
import type { Page } from '@playwright/test';
import { getSimWait, SIM_FAST } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

async function testSortOnPage(page: Page, route: string, testSteps: string[]): Promise<void> {
  await page.goto(route, { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(1000));

  const sortButtons = page.locator(
    'button:has-text("Sort"), button[aria-label*="Sort"], th[class*="cursor-pointer"]',
  );
  const count = await sortButtons.count();

  if (count === 0) {
    testSteps.push(`No sort controls found on ${route}`);
    await collectPageErrors(page);
    return;
  }

  const toClick = Math.min(count, 3);
  for (let i = 0; i < toClick; i++) {
    const btn = sortButtons.nth(i);
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(getSimWait(400));
      testSteps.push(`Clicked sort control ${i + 1} on ${route}`);

      const sortOption = page.locator('[role="option"], [role="menuitem"]').first();
      if (await sortOption.isVisible({ timeout: 1500 }).catch(() => false)) {
        await sortOption.click();
        await page.waitForTimeout(getSimWait(400));
      }
    }
  }

  await collectPageErrors(page);
}

async function testViewToggles(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test equipment view toggle');
  await page.goto('/webapp/temperature', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(800));

  const equipmentTab = page
    .locator('button:has-text("Equipment"), [role="tab"]:has-text("Equipment")')
    .first();
  if (await equipmentTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await equipmentTab.click();
    await page.waitForTimeout(getSimWait(600));
  }

  const viewToggles = page.locator(
    'button[aria-label*="Card view"], button[aria-label*="Table view"], button[aria-label*="Grid"], button[aria-label*="List"]',
  );
  const toggleCount = await viewToggles.count();

  if (toggleCount >= 2) {
    await viewToggles.nth(1).click();
    await page.waitForTimeout(getSimWait(400));
    testSteps.push('Toggled equipment view');

    await viewToggles.nth(0).click();
    await page.waitForTimeout(getSimWait(400));
    testSteps.push('Toggled equipment view back');
  } else {
    const toggleBtn = page.locator('button:has-text("View"), button[aria-label*="view"]').first();
    if (await toggleBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await toggleBtn.click();
      await page.waitForTimeout(getSimWait(400));
      testSteps.push('Clicked view toggle');
    }
  }

  await collectPageErrors(page);
}

export async function testSortAndViewTogglesFlow(
  page: Page,
  testSteps: string[] = [],
): Promise<void> {
  testSteps.push('Begin sort and view toggle tests');

  await testSortOnPage(page, '/webapp/ingredients', testSteps);
  await testSortOnPage(page, '/webapp/recipes', testSteps);
  await testSortOnPage(page, '/webapp/performance', testSteps);
  await testViewToggles(page, testSteps);

  testSteps.push('Sort and view toggle tests completed');
}
