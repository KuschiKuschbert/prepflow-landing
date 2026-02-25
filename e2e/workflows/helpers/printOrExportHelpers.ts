/**
 * Shared helpers for Print and Export interactions in persona simulation.
 * Use these to simulate chef workflows: print, export CSV/PDF/HTML.
 */
import type { Page } from '@playwright/test';

/**
 * Click Print button if visible and enabled.
 * Print opens browser dialog; we only verify the click succeeds.
 *
 * @param page - Playwright page
 * @returns true if clicked, false if not available
 */
export async function clickPrintIfAvailable(page: Page): Promise<boolean> {
  const printBtn = page.locator('button:has-text("Print")').first();
  if (!(await printBtn.isVisible().catch(() => false))) return false;
  if (await printBtn.isDisabled().catch(() => true)) return false;
  await printBtn.click().catch(() => {});
  return true;
}

/**
 * Click Export CSV button or Export dropdown.
 * Performance page has direct "Export CSV" button; others use Export dropdown (CSV/PDF/HTML).
 *
 * @param page - Playwright page
 * @param format - 'csv' | 'pdf' | 'html'
 * @returns true if exported, false if not available
 */
export async function clickExportIfAvailable(
  page: Page,
  format: 'csv' | 'pdf' | 'html' = 'csv',
): Promise<boolean> {
  if (format === 'csv') {
    const directCsv = page.locator('button:has-text("Export CSV")').first();
    if (await directCsv.isVisible().catch(() => false)) {
      if (await directCsv.isDisabled().catch(() => true)) return false;
      await directCsv.click().catch(() => {});
      return true;
    }
  }

  const exportBtn = page.locator('button[aria-label="Export"], button:has-text("Export")').first();
  if (!(await exportBtn.isVisible().catch(() => false))) return false;
  if (await exportBtn.isDisabled().catch(() => true)) return false;

  await exportBtn.click().catch(() => {});
  const formatLabel = format.toUpperCase();
  const option = page.locator(`button:has-text("${formatLabel}")`).first();
  if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
    await option.click().catch(() => {});
    return true;
  }
  return false;
}

/**
 * Open Import modal by clicking Import button, wait for modal, optionally close.
 *
 * @param page - Playwright page
 * @param triggerText - Button text to click (e.g. "Import", "Import CSV", "Import Sales Data")
 * @param closeAfter - If true, close modal after opening
 * @returns true if modal opened
 */
export async function openImportModalIfAvailable(
  page: Page,
  triggerText: string,
  closeAfter = true,
): Promise<boolean> {
  const importBtn = page.locator(`button:has-text("${triggerText}")`).first();
  if (!(await importBtn.isVisible().catch(() => false))) return false;
  await importBtn.click().catch(() => {});

  const modal = page.locator('[role="dialog"], .modal, [data-state="open"]').first();
  if (await modal.isVisible({ timeout: 5000 }).catch(() => false)) {
    if (closeAfter) {
      const closeBtn = page
        .locator('button:has-text("Cancel"), button:has-text("Close"), [aria-label="Close"]')
        .first();
      if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await closeBtn.click().catch(() => {});
      }
    }
    return true;
  }
  return false;
}
