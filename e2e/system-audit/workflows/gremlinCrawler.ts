/**
 * Gremlin Crawler - Scan and Visit All Links.
 */
import { Page } from '@playwright/test';
import { mkdirSync } from 'fs';
import { collectPageErrors } from '../../fixtures/global-error-listener';
import { collectLinks } from '../helpers/collectLinks';
import { fuzzFormInputs } from '../helpers/fuzzFormInputs';
import { checkBrokenImages } from '../helpers/checkBrokenImages';

/**
 * Gremlin Crawler - Scan and Visit All Links.
 */
export async function gremlinCrawler(
  page: Page,
  visitedPages: Set<string>,
  screenshots: string[],
): Promise<void> {
  const allLinks = new Set<string>();
  const baseUrl = page.url().split('/').slice(0, 3).join('/');
  const maxPagesToVisit = 50;
  let pagesVisited = 0;

  await page.goto('/webapp');
  await page.waitForLoadState('networkidle');
  await collectPageErrors(page);

  for (const url of Array.from(visitedPages).slice(0, 10)) {
    try {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await collectPageErrors(page);

      const links = await collectLinks(page);
      links.forEach(link => {
        if (link.startsWith(baseUrl) && !link.includes('#') && !link.includes('javascript:')) {
          allLinks.add(link);
        }
      });
    } catch (err) {
      continue;
    }
  }

  for (const link of Array.from(allLinks).slice(0, maxPagesToVisit)) {
    if (pagesVisited >= maxPagesToVisit) break;
    if (visitedPages.has(link)) continue;

    try {
      await page.goto(link);
      await page.waitForLoadState('networkidle');
      visitedPages.add(link);
      pagesVisited++;

      await collectPageErrors(page);
      await fuzzFormInputs(page);

      const brokenImages = await checkBrokenImages(page);
      if (brokenImages.length > 0) {
        console.warn(`Broken images found on ${link}:`, brokenImages);
      }

      const screenshotDir = 'test-results/screenshots';
      mkdirSync(screenshotDir, { recursive: true });
      const urlSlug = link.replace(/[^a-z0-9]/gi, '_').substring(0, 100);
      const screenshotPath = `${screenshotDir}/${urlSlug}_${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      screenshots.push(screenshotPath);

      await collectPageErrors(page);
      await page.waitForTimeout(100);
    } catch (err) {
      console.warn(`Failed to visit ${link}:`, err);
      continue;
    }
  }

  console.log(
    `Gremlin crawler visited ${pagesVisited} pages and collected ${allLinks.size} total links`,
  );
}




