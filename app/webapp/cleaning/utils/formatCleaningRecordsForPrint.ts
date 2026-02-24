/**
 * Format cleaning records data for print/export
 * Converts cleaning tasks with completions into HTML table format
 */

import { processCleaningRecords } from './formatCleaningRecordsForPrint/processRecords';
import {
  generateEmptyStateHTML,
  generateMetaHTML,
  generateTableHTML,
} from './formatCleaningRecordsForPrint/htmlGeneration';
import type { CleaningRecordExportData } from './cleaning-records-export-types';

export type { CleaningRecordExportData } from './cleaning-records-export-types';

/**
 * Format cleaning records data as HTML for print/export
 *
 * @param {CleaningRecordExportData} data - Cleaning records data
 * @returns {string} HTML content for cleaning records
 */
export function formatCleaningRecordsForPrint(data: CleaningRecordExportData): string {
  const records = processCleaningRecords(data);

  if (records.length === 0) {
    return generateEmptyStateHTML(data);
  }

  let html = '<div class="cleaning-records-content">';

  // Meta information
  html += generateMetaHTML(data, records.length);

  // Table
  html += generateTableHTML(records);

  html += '</div>';

  return html;
}
