/**
 * Helpers for action registry - view page actions with optional print/export/import
 */
import type { Page } from '@playwright/test';
import {
  clickPrintIfAvailable,
  clickExportIfAvailable,
  openImportModalIfAvailable,
} from '../../workflows/helpers/printOrExportHelpers';
import { getSimWait, SIM_FAST } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';

export async function viewPage(
  page: Page,
  path: string,
  opts?: { print?: boolean; export?: boolean; import?: boolean; importLabel?: string },
): Promise<void> {
  try {
    await page.goto(path, { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  } catch {
    // Navigation timeout - page still partially loaded, continue
    if (!page.url().includes(path.split('?')[0].split('#')[0])) return;
  }
  if (page.url().includes('auth0.com') || page.url().includes('/api/auth/login')) return;
  await page.waitForTimeout(getSimWait(500));
  if (!SIM_FAST && opts) {
    if (opts.print) await clickPrintIfAvailable(page).catch(() => {});
    if (opts.export) await clickExportIfAvailable(page, 'csv').catch(() => {});
    if (opts.import)
      await openImportModalIfAvailable(page, opts.importLabel ?? 'Import', true).catch(() => {});
  }
  await collectPageErrors(page);
}

export async function viewPageSimple(page: Page, path: string): Promise<void> {
  try {
    await page.goto(path, { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
  } catch {
    // Navigation timeout - page still partially loaded, continue
    if (!page.url().includes(path.split('?')[0].split('#')[0])) return;
  }
  if (page.url().includes('auth0.com') || page.url().includes('/api/auth/login')) return;
  await page.waitForTimeout(getSimWait(500));
  await collectPageErrors(page);
}
