/**
 * Helper functions for the console-error crawl spec.
 */

import type { Page } from '@playwright/test';
import { SKIP_PATTERNS } from './crawl-constants';

export function shouldSkip(url: string): boolean {
  return SKIP_PATTERNS.some(pattern => url.includes(pattern));
}

export function normalizeUrlToPath(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.pathname || url;
  } catch {
    return url;
  }
}

/**
 * Click through tab/section navigation to load all sections and capture errors.
 */
export async function interactWithSectionNav(
  page: Page,
  collectPageErrors: () => Promise<void>,
  selectors: Array<{ selector: string; name: string }>,
): Promise<void> {
  for (const { selector } of selectors) {
    try {
      const btn = page.locator(selector).first();
      if ((await btn.count()) > 0 && (await btn.isVisible())) {
        await btn.click();
        await page.waitForTimeout(500);
        await collectPageErrors();
      }
    } catch {
      // Section may not be present. Continue.
    }
  }
}

/**
 * Navigate through hash-based sections (Settings) and collect errors.
 */
export async function interactWithHashSections(
  page: Page,
  hashes: string[],
  collectPageErrors: () => Promise<void>,
): Promise<void> {
  const baseUrl = page.url().split('#')[0];
  for (const hash of hashes) {
    try {
      await page.goto(`${baseUrl}${hash}`);
      await page.waitForLoadState('networkidle', { timeout: 5000 });
      await page.waitForTimeout(500);
      await collectPageErrors();
    } catch {
      // Section may fail to load. Continue.
    }
  }
}
