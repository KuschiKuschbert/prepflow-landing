import { Page } from '@playwright/test';
import { collectPageErrors } from '../../fixtures/global-error-listener';
import { getSimWait } from '../../helpers/sim-wait';

/**
 * Test Pagination Flow
 *
 * Visits pages with pagination controls and navigates to page 2 if available.
 * Verifies that page 2 loads without errors, then navigates back to page 1.
 */
async function testPaginationOnPage(page: Page, url: string): Promise<void> {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch {
    return;
  }
  await page.waitForTimeout(getSimWait(1500));
  await collectPageErrors(page);

  // Look for a "Next page" button in various common forms
  const nextPageBtn = page
    .locator(
      'button[aria-label*="Next"], button[aria-label*="next"], ' +
        'button:has-text("Next"), button:has-text("›"), button:has-text("→"), ' +
        '[data-testid="pagination-next"]',
    )
    .first();

  const nextVisible = await nextPageBtn.isVisible({ timeout: 3000 }).catch(() => false);
  if (!nextVisible) return;

  // Check it's not disabled
  const isDisabled = await nextPageBtn.isDisabled().catch(() => true);
  if (isDisabled) return;

  await nextPageBtn.click();
  await page.waitForTimeout(getSimWait(1500));
  await collectPageErrors(page);

  // Navigate back to page 1
  const prevPageBtn = page
    .locator(
      'button[aria-label*="Previous"], button[aria-label*="prev"], ' +
        'button:has-text("Previous"), button:has-text("‹"), button:has-text("←"), ' +
        '[data-testid="pagination-prev"]',
    )
    .first();

  if (await prevPageBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await prevPageBtn.click();
    await page.waitForTimeout(getSimWait(1000));
  }
}

export async function testPaginationFlow(page: Page, testSteps: string[] = []): Promise<void> {
  testSteps.push('Test pagination across list pages');

  const pagesToTest = [
    '/webapp/ingredients',
    '/webapp/recipes',
    '/webapp/compliance',
    '/webapp/customers',
  ];

  for (const url of pagesToTest) {
    await testPaginationOnPage(page, url);
  }

  // Temperature logs — navigate to the Logs tab first
  try {
    await page.goto('/webapp/temperature', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(getSimWait(1000));
    const logsTab = page.locator('button:has-text("Logs"), [role="tab"]:has-text("Logs")').first();
    if (await logsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await logsTab.click();
      await page.waitForTimeout(getSimWait(1000));
    }
    await testPaginationOnPage(page, page.url());
  } catch {
    // skip temperature pagination
  }

  await collectPageErrors(page);
  testSteps.push('[testPagination] Completed');
}
