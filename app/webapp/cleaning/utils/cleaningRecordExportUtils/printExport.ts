/**
 * Print export utilities for cleaning records
 */

import { generatePrintTemplate } from '@/lib/exports/print-template';
import { logger } from '@/lib/logger';
import { getCleaningRecordPrintStyles } from '../cleaningRecordPrintStyles';
import {
  formatCleaningRecordsForPrint,
  type CleaningRecordExportData,
} from '../formatCleaningRecordsForPrint';
import { calculateTotalRecords } from './helpers';

/**
 * Print cleaning records using unified template
 *
 * @param {CleaningRecordExportData} data - Cleaning records data
 * @returns {void} Opens print dialog
 */
export function printCleaningRecords(data: CleaningRecordExportData): void {
  try {
    // Format cleaning records content as HTML
    const contentHtml = formatCleaningRecordsForPrint(data);

    // Get cleaning record-specific styles
    const cleaningRecordStyles = getCleaningRecordPrintStyles();

    // Build subtitle with date range if available
    let subtitle = 'Cleaning Records';
    if (data.dateRange) {
      subtitle = `Cleaning Records - ${data.dateRange.start} to ${data.dateRange.end}`;
    }

    // Count total records (flattened from tasks)
    const totalRecords = calculateTotalRecords(data.tasks, data.dateRange);

    // Generate full HTML using unified template
    const fullHtml = generatePrintTemplate({
      title: 'Cleaning Records',
      subtitle,
      content: `<style>${cleaningRecordStyles}</style>${contentHtml}`,
      totalItems: totalRecords,
      customMeta: data.dateRange
        ? `Date Range: ${data.dateRange.start} - ${data.dateRange.end}`
        : undefined,
    });

    // Open print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      logger.warn('[Cleaning Record Export] Failed to open print window - popup blocked?');
      return;
    }

    printWindow.document.write(fullHtml); // auditor:ignore
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  } catch (err) {
    logger.error('[Cleaning Record Export] Print error:', err);
    throw err;
  }
}
