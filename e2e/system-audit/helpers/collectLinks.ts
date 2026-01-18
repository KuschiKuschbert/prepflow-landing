/**
 * Collect all links on current page.
 */
import { Page } from '@playwright/test';

/**
 * Collect all links on current page.
 */
export async function collectLinks(page: Page): Promise<string[]> {
  const links: string[] = [];

  try {
    const linkElements = await page.locator('a[href]').all();

    for (const link of linkElements) {
      try {
        const href = await link.getAttribute('href');
        if (
          href &&
          !href.startsWith('#') &&
          !href.startsWith('javascript:') &&
          !href.startsWith('mailto:') &&
          !href.startsWith('tel:')
        ) {
          // Convert relative URLs to absolute
          try {
            const absoluteUrl = new URL(href, page.url()).toString();
            // Only include links within our app domain
            if (absoluteUrl.includes(page.url().split('/').slice(0, 3).join('/'))) {
              links.push(absoluteUrl);
            }
          } catch (_urlErr) {
            // Invalid URL, skip
            continue;
          }
        }
      } catch (_err) {
        continue;
      }
    }
  } catch (_err) {
    // No links on page, continue
  }

  return links;
}
