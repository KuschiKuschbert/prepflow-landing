/**
 * Crawl All Pages - Zero Console Errors
 *
 * Crawls all webapp pages by following navigation links and asserts no
 * console.error/console.warn on any page. More comprehensive than smoke test.
 *
 * - Visits landing + all discoverable webapp routes (via link following)
 * - No monkey testing (focused on console errors only)
 * - Fails on any non-allowlisted console/network errors
 */

import { test, expect } from '@playwright/test';
import {
  setupGlobalErrorListener,
  collectPageErrors,
  getNonAllowlistedErrors,
  clearCollectedErrors,
  captureErrorScreenshot,
} from './fixtures/global-error-listener';
import { ensureAuthenticated } from './fixtures/auth-helper';
import { generateCrawlReport } from './helpers/report-generator';
import {
  HASH_SEED_URLS,
  RECIPE_TAB_SELECTORS,
  SETTINGS_SECTION_HASHES,
  SQUARE_SECTION_SELECTORS,
  SETTLE_MS,
} from './helpers/crawl-constants';
import {
  shouldSkip,
  normalizeUrlToPath,
  interactWithSectionNav,
  interactWithHashSections,
} from './helpers/crawl-helpers';

test.describe('Crawl - Zero Console Errors on All Pages', () => {
  const visitedUrls = new Set<string>();
  const maxPages = 120;
  const maxDepth = 4;

  test.beforeEach(async ({ page }) => {
    clearCollectedErrors();
    await setupGlobalErrorListener(page);
  });

  test.afterEach(async ({ page }) => {
    await collectPageErrors(page);
  });

  test('Landing page - no console errors', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await collectPageErrors(page);

    const errors = getNonAllowlistedErrors();
    expect(errors.length).toBe(0);
  });

  test('Crawl all webapp pages - no console errors', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 min for full crawl
    await ensureAuthenticated(page);
    visitedUrls.clear();

    const pagesToVisit: Array<{ url: string; depth: number }> = [
      { url: '/webapp', depth: 0 },
      { url: '/webapp/ingredients', depth: 0 },
      { url: '/webapp/recipes', depth: 0 },
      { url: '/webapp/cogs', depth: 0 },
      { url: '/webapp/performance', depth: 0 },
      { url: '/webapp/menu-builder', depth: 0 },
      { url: '/webapp/dish-builder', depth: 0 },
      { url: '/webapp/temperature', depth: 0 },
      { url: '/webapp/cleaning', depth: 0 },
      { url: '/webapp/compliance', depth: 0 },
      { url: '/webapp/suppliers', depth: 0 },
      { url: '/webapp/par-levels', depth: 0 },
      { url: '/webapp/order-lists', depth: 0 },
      { url: '/webapp/prep-lists', depth: 0 },
      { url: '/webapp/sections', depth: 0 },
      { url: '/webapp/specials', depth: 0 },
      { url: '/webapp/guide', depth: 0 },
      { url: '/webapp/setup', depth: 0 },
      { url: '/webapp/settings', depth: 0 },
      { url: '/webapp/settings/billing', depth: 1 },
      { url: '/webapp/settings/backup', depth: 1 },
      { url: '/webapp/functions', depth: 0 },
      { url: '/webapp/customers', depth: 0 },
      { url: '/webapp/calendar', depth: 0 },
      { url: '/webapp/staff', depth: 0 },
      { url: '/webapp/roster', depth: 0 },
      { url: '/webapp/time-attendance', depth: 0 },
      { url: '/webapp/square', depth: 0 },
      { url: '/webapp/recipe-sharing', depth: 0 },
      ...HASH_SEED_URLS.map(url => ({ url, depth: 0 })),
    ];

    const crawlResults: Array<{ url: string; depth: number }> = [];
    const pagesWeScreenshotted = new Set<string>();
    const interactionRunForPath = new Set<string>();

    while (pagesToVisit.length > 0 && visitedUrls.size < maxPages) {
      const current = pagesToVisit.shift();
      if (!current || current.depth > maxDepth) continue;

      const fullUrl = current.url.startsWith('http')
        ? current.url
        : `http://localhost:3000${current.url}`;

      if (visitedUrls.has(fullUrl) || shouldSkip(current.url)) continue;
      visitedUrls.add(fullUrl);

      try {
        await page.goto(current.url);
        await page.waitForLoadState('networkidle', { timeout: 15000 });
        await collectPageErrors(page);

        const pathname = current.url.split('?')[0].split('#')[0];
        if (!interactionRunForPath.has(pathname)) {
          interactionRunForPath.add(pathname);
          if (pathname === '/webapp/recipes') {
            await interactWithSectionNav(page, () => collectPageErrors(page), RECIPE_TAB_SELECTORS);
          } else if (pathname === '/webapp/settings') {
            await interactWithHashSections(page, SETTINGS_SECTION_HASHES, () =>
              collectPageErrors(page),
            );
          } else if (pathname === '/webapp/square') {
            await interactWithSectionNav(
              page,
              () => collectPageErrors(page),
              SQUARE_SECTION_SELECTORS,
            );
          }
        }

        await page.waitForTimeout(SETTLE_MS);
        await collectPageErrors(page);

        const links = await page.locator('a[href^="/webapp"], a[href^="#"]').all();
        const currentPathname = new URL(page.url()).pathname;
        const linkUrls = await Promise.all(
          links.map(async link => {
            const href = await link.getAttribute('href').catch(() => '');
            if (!href) return '';
            const pathOrHash = href.split('?')[0];
            if (pathOrHash.startsWith('#')) {
              return `${currentPathname}${pathOrHash}`;
            }
            return pathOrHash;
          }),
        );

        for (const href of linkUrls) {
          if (!href) continue;
          const toEnqueue = href.startsWith('/') ? href : `/${href}`;
          const normalized = `http://localhost:3000${toEnqueue}`;
          if (!visitedUrls.has(normalized) && !shouldSkip(toEnqueue) && current.depth < maxDepth) {
            pagesToVisit.push({ url: toEnqueue, depth: current.depth + 1 });
          }
        }

        crawlResults.push({ url: current.url, depth: current.depth });

        const errorsSoFar = getNonAllowlistedErrors();
        const currentPath = normalizeUrlToPath(page.url());
        const errorsForThisPage = errorsSoFar.filter(
          e => normalizeUrlToPath(e.url) === currentPath || e.url.includes(current.url),
        );
        if (
          errorsForThisPage.length > 0 &&
          !pagesWeScreenshotted.has(currentPath) &&
          !pagesWeScreenshotted.has(current.url)
        ) {
          await captureErrorScreenshot(page, errorsForThisPage[0], 'test-failures');
          pagesWeScreenshotted.add(currentPath);
          pagesWeScreenshotted.add(current.url);
        }

        await page.waitForTimeout(SETTLE_MS);
      } catch (_error) {
        crawlResults.push({ url: current.url, depth: current.depth });
      }
    }

    const totalErrors = getNonAllowlistedErrors().length;
    const nonAllowlistedErrors = getNonAllowlistedErrors();

    generateCrawlReport(nonAllowlistedErrors, crawlResults, 'CRAWL_REPORT.md');

    console.log(`\n=== Crawl Console Errors - Results ===`);
    console.log(`Pages visited: ${crawlResults.length}`);
    console.log(`Non-allowlisted errors: ${totalErrors}`);
    console.log(`CRAWL_REPORT.md and CRAWL_REPORT.json generated`);
    if (totalErrors > 0) {
      console.error('Errors:', nonAllowlistedErrors);
    }

    expect(crawlResults.length).toBeGreaterThan(0);
    expect(totalErrors).toBe(0);
  });
});
