/**
 * Print utilities for prep lists
 */

import { getPrintStyles } from './prepListPrintStyles';
import { formatPrepListForPrint } from './formatPrepList';
import { formatGeneratedPrepListForPrint } from './formatGeneratedPrepList';
import type { PrepList, SectionData } from '../types';

interface ExportOptions {
  sections?: string[];
  includeInstructions?: boolean;
}

export function printPrepList(prepList: PrepList): void {
  const html = formatPrepListForPrint(prepList);
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${prepList.name}</title>
        <style>
          ${getPrintStyles()}
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

export function printGeneratedPrepList(
  sections: SectionData[],
  menuName: string,
  options?: ExportOptions,
): void {
  const html = formatGeneratedPrepListForPrint(sections, menuName, options);
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${menuName} - Prep List</title>
        <style>
          ${getPrintStyles()}
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}
