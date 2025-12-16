import { test, expect } from '@playwright/test';
import {
  setupGlobalErrorListener,
  collectPageErrors,
  getCollectedErrors,
  clearCollectedErrors,
  captureErrorScreenshot,
} from '../fixtures/global-error-listener';
import { ensureAuthenticated } from '../fixtures/auth-helper';
import { runMonkeyTest } from '../helpers/monkey-test';

test.describe('Deep Crawl - Page Discovery and Monkey Testing', () => {
  const visitedUrls = new Set<string>();
  const maxPages = 50;
  const maxDepth = 3;

  test.beforeEach(async ({ page }) => {
    clearCollectedErrors();
    await setupGlobalErrorListener(page);
    await ensureAuthenticated(page);
    visitedUrls.clear();
  });

  test.afterEach(async ({ page }) => {
    await collectPageErrors(page);
  });

  test('Crawl all webapp pages and run monkey tests', async ({ page }) => {
    const pagesToVisit: Array<{ url: string; depth: number }> = [{ url: '/webapp', depth: 0 }];
    const crawlResults: Array<{
      url: string;
      depth: number;
      linksFound: number;
      monkeyTestResult?: any;
      errors: number;
    }> = [];

    while (pagesToVisit.length > 0 && visitedUrls.size < maxPages) {
      const current = pagesToVisit.shift();
      if (!current || current.depth > maxDepth) continue;

      const fullUrl = current.url.startsWith('http')
        ? current.url
        : `http://localhost:3000${current.url}`;

      // Skip if already visited
      if (visitedUrls.has(fullUrl)) continue;
      visitedUrls.add(fullUrl);

      try {
        // Navigate to page
        await page.goto(current.url);
        await page.waitForLoadState('networkidle', { timeout: 15000 });
        await collectPageErrors(page);

        // Find all internal links
        const links = await page.locator('a[href^="/webapp"]').all();
        const linkUrls = await Promise.all(
          links.map(async link => {
            const href = await link.getAttribute('href').catch(() => '');
            return href;
          }),
        );

        // Add new links to queue
        linkUrls.forEach(href => {
          if (
            href &&
            !visitedUrls.has(`http://localhost:3000${href}`) &&
            current.depth < maxDepth
          ) {
            pagesToVisit.push({ url: href, depth: current.depth + 1 });
          }
        });

        // Run limited monkey test on this page (5 interactions max per page)
        const monkeyResult = await runMonkeyTest(page, 5);

        // Collect errors for this page
        await collectPageErrors(page);
        const pageErrors = getCollectedErrors().filter(
          e => e.url === page.url() || page.url().includes(e.url),
        );

        crawlResults.push({
          url: current.url,
          depth: current.depth,
          linksFound: linkUrls.length,
          monkeyTestResult: monkeyResult,
          errors: pageErrors.length,
        });

        // Take screenshot if errors found
        if (pageErrors.length > 0) {
          await captureErrorScreenshot(page, pageErrors[0], 'test-failures');
        }

        // Small delay between pages
        await page.waitForTimeout(500);
      } catch (error: any) {
        console.error(`Error crawling ${current.url}:`, error.message);
        crawlResults.push({
          url: current.url,
          depth: current.depth,
          linksFound: 0,
          errors: 1,
        });
      }
    }

    // Log crawl results
    console.log(`\n=== Deep Crawl Results ===`);
    console.log(`Total pages visited: ${crawlResults.length}`);
    console.log(`Total links found: ${crawlResults.reduce((sum, r) => sum + r.linksFound, 0)}`);
    console.log(`Total errors: ${crawlResults.reduce((sum, r) => sum + r.errors, 0)}`);
    console.log(`\nPages with errors:`);
    crawlResults
      .filter(r => r.errors > 0)
      .forEach(r => {
        console.log(`  - ${r.url} (depth ${r.depth}): ${r.errors} error(s)`);
      });

    // Assert that we visited at least some pages
    expect(crawlResults.length).toBeGreaterThan(0);

    // Check for critical errors across all pages
    const allErrors = getCollectedErrors();
    const criticalErrors = allErrors.filter(
      e => e.type === 'uncaught' || (e.type === 'network' && e.statusCode && e.statusCode >= 500),
    );

    if (criticalErrors.length > 0) {
      console.error('Critical errors found during crawl:', criticalErrors);
    }

    // Test passes even with warnings/4xx (they'll be in report)
    // But fail if critical errors found
    expect(criticalErrors.length).toBe(0);
  });
});



