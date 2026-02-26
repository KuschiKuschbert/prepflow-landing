/**
 * Simulation wait utilities.
 * When SIM_FAST=true, reduces wait times for faster simulation runs.
 */
import type { Page } from '@playwright/test';

export const SIM_FAST = process.env.SIM_FAST === 'true';

/**
 * Returns wait duration in ms. When SIM_FAST, returns ~1/3 of input (min 100ms).
 */
export function getSimWait(ms: number): number {
  return SIM_FAST ? Math.max(100, Math.floor(ms / 3)) : ms;
}

/**
 * Resilient page.goto that catches timeouts and auth redirects.
 * Returns false if navigation failed or was redirected to auth.
 * Returns true if navigation succeeded.
 */
export async function safeGoto(page: Page, path: string): Promise<boolean> {
  try {
    await page.goto(path, { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  } catch {
    // Navigation timed out - check if we're at least at the right URL
    const currentUrl = page.url();
    if (!currentUrl.includes(path.split('?')[0].split('#')[0])) {
      return false;
    }
  }
  const url = page.url();
  if (url.includes('auth0.com') || url.includes('/api/auth/login')) {
    return false;
  }
  return true;
}
