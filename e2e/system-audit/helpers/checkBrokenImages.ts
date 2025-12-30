/**
 * Check for broken images.
 */
import { Page } from '@playwright/test';

/**
 * Check for broken images.
 */
export async function checkBrokenImages(page: Page): Promise<string[]> {
  const brokenImages: string[] = [];

  try {
    const images = await page.locator('img').all();

    for (const img of images) {
      try {
        const naturalWidth = await img.evaluate(el => (el as HTMLImageElement).naturalWidth);
        const src = await img.getAttribute('src');

        if (naturalWidth === 0 && src) {
          brokenImages.push(src);
        }
      } catch (err) {
        // Image might not be loaded yet, continue
        continue;
      }
    }
  } catch (err) {
    // No images on page, continue
  }

  return brokenImages;
}


