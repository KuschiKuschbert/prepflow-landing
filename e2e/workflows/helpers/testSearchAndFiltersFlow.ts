/**
 * Test search bars, filter dropdowns, and the global Cmd+K search modal.
 * Covers: global search modal, ingredient search/filter/sort, recipe search,
 * customer search, function search.
 * Resilient: continues even if search elements are not found.
 */
import type { Page } from '@playwright/test';
import { getSimWait, SIM_FAST } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

async function testGlobalSearch(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test global search modal (Cmd+K)');
  await page.goto('/webapp', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(800));

  await page.keyboard.press('Meta+k');
  await page.waitForTimeout(getSimWait(500));

  const searchModal = page.locator('[role="dialog"], [data-state="open"]').first();
  if (await searchModal.isVisible({ timeout: 3000 }).catch(() => false)) {
    const searchInput = searchModal.locator('input[type="text"], input[type="search"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('chicken');
      await page.waitForTimeout(getSimWait(600));
      testSteps.push('Global search: typed "chicken"');

      await searchInput.fill('');
      await page.waitForTimeout(getSimWait(300));
    }

    await page.keyboard.press('Escape');
    await page.waitForTimeout(getSimWait(300));
    testSteps.push('Global search modal closed');
  } else {
    testSteps.push('Global search modal not found - skip');
  }
  await collectPageErrors(page);
}

async function testPageSearch(
  page: Page,
  route: string,
  searchTerm: string,
  testSteps: string[],
): Promise<void> {
  await page.goto(route, { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(800));

  const searchInput = page
    .locator(
      'input[type="search"], input[placeholder*="Search"], input[placeholder*="search"], input[placeholder*="Filter"]',
    )
    .first();

  if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await searchInput.fill(searchTerm);
    await page.waitForTimeout(getSimWait(600));
    testSteps.push(`Search on ${route}: typed "${searchTerm}"`);

    await searchInput.fill('');
    await page.waitForTimeout(getSimWait(300));
  } else {
    testSteps.push(`No search input found on ${route}`);
  }
  await collectPageErrors(page);
}

async function testFilterDropdowns(page: Page, testSteps: string[]): Promise<void> {
  testSteps.push('Test ingredient filter dropdowns');
  await page.goto('/webapp/ingredients', { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  await page.waitForTimeout(getSimWait(1000));

  const filterButtons = page.locator(
    'button:has-text("Filter"), button:has-text("Sort"), button[aria-label*="Filter"], button[aria-label*="Sort"]',
  );
  const filterCount = await filterButtons.count();
  const toClick = Math.min(filterCount, 3);

  for (let i = 0; i < toClick; i++) {
    const btn = filterButtons.nth(i);
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(getSimWait(400));
      testSteps.push(`Opened filter/sort dropdown ${i + 1}`);

      const option = page
        .locator('[role="option"], [role="menuitem"], button')
        .filter({ hasText: /Name|Cost|Supplier|A-Z|Date/i })
        .first();
      if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
        await option.click();
        await page.waitForTimeout(getSimWait(400));
        testSteps.push('Selected a filter/sort option');
      } else {
        await page.keyboard.press('Escape');
      }
    }
  }
  await collectPageErrors(page);
}

export async function testSearchAndFiltersFlow(
  page: Page,
  testSteps: string[] = [],
): Promise<void> {
  testSteps.push('Begin search and filter tests');

  await testGlobalSearch(page, testSteps);
  await testPageSearch(page, '/webapp/ingredients', 'flour', testSteps);
  await testPageSearch(page, '/webapp/recipes', 'chicken', testSteps);
  await testPageSearch(page, '/webapp/customers', 'test', testSteps);
  await testPageSearch(page, '/webapp/functions', 'dinner', testSteps);
  await testFilterDropdowns(page, testSteps);

  testSteps.push('Search and filter tests completed');
}
