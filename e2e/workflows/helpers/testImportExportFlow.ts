/**
 * Test import modals and export buttons across modules.
 * Opens CSV import modals (ingredients, suppliers, performance), and clicks
 * export/print buttons on various pages. Does not actually upload files or
 * download CSVs -- just verifies the UI elements are accessible and clickable.
 * Resilient: continues even if import/export buttons are not found.
 */
import type { Page } from '@playwright/test';
import { getSimWait, SIM_FAST } from '../../helpers/sim-wait';
import { collectPageErrors } from '../../fixtures/global-error-listener';
import {
  clickExportIfAvailable,
  clickPrintIfAvailable,
  openImportModalIfAvailable,
} from './printOrExportHelpers';

interface ExportTarget {
  route: string;
  hasExport: boolean;
  hasPrint: boolean;
  hasImport: boolean;
  importLabel?: string;
}

const EXPORT_TARGETS: ExportTarget[] = [
  {
    route: '/webapp/ingredients',
    hasExport: true,
    hasPrint: false,
    hasImport: true,
    importLabel: 'Import',
  },
  { route: '/webapp/suppliers', hasExport: true, hasPrint: false, hasImport: true },
  { route: '/webapp/recipes', hasExport: true, hasPrint: false, hasImport: false },
  { route: '/webapp/par-levels', hasExport: true, hasPrint: true, hasImport: false },
  { route: '/webapp/order-lists', hasExport: true, hasPrint: true, hasImport: false },
  { route: '/webapp/prep-lists', hasExport: true, hasPrint: true, hasImport: false },
  { route: '/webapp/temperature', hasExport: true, hasPrint: true, hasImport: false },
  { route: '/webapp/compliance', hasExport: true, hasPrint: true, hasImport: false },
  { route: '/webapp/cleaning', hasExport: true, hasPrint: true, hasImport: false },
  {
    route: '/webapp/performance',
    hasExport: true,
    hasPrint: false,
    hasImport: true,
    importLabel: 'Import Sales Data',
  },
  { route: '/webapp/cogs', hasExport: true, hasPrint: false, hasImport: false },
];

export async function testImportExportFlow(page: Page, testSteps: string[] = []): Promise<void> {
  testSteps.push(`Begin import/export sweep across ${EXPORT_TARGETS.length} modules`);

  for (const target of EXPORT_TARGETS) {
    try {
      await page.goto(target.route, { waitUntil: SIM_FAST ? 'domcontentloaded' : 'load' });
      await page.waitForTimeout(getSimWait(800));

      if (target.hasExport) {
        const exported = await clickExportIfAvailable(page, 'csv').catch(() => false);
        if (exported) testSteps.push(`Export CSV on ${target.route}`);
      }

      if (target.hasPrint) {
        const printed = await clickPrintIfAvailable(page).catch(() => false);
        if (printed) testSteps.push(`Print on ${target.route}`);
      }

      if (target.hasImport) {
        const imported = await openImportModalIfAvailable(
          page,
          target.importLabel ?? 'Import',
          true,
        ).catch(() => false);
        if (imported) testSteps.push(`Import modal opened on ${target.route}`);
      }

      await collectPageErrors(page);
    } catch {
      testSteps.push(`Failed import/export on ${target.route}`);
    }
  }

  testSteps.push('Import/export sweep completed');
}
