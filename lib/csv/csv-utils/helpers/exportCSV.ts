import Papa from 'papaparse';
import { logger } from '@/lib/logger';

/**
 * Export data to CSV file with proper formatting
 *
 * @param {any[]} data - Data array to export
 * @param {string[]} headers - Column headers
 * @param {string} filename - Filename for download
 * @param {boolean} includeHeaders - Whether to include headers row (default: true)
 */
export function exportToCSV(
  data: any[],
  headers: string[],
  filename: string,
  includeHeaders = true,
): void {
  if (!data || data.length === 0) {
    logger.warn('[CSV Export] No data to export');
    return;
  }

  const csv = Papa.unparse(data, {
    columns: headers,
    header: includeHeaders,
    delimiter: ',',
    newline: '\n',
    quoteChar: '"',
    escapeChar: '"',
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Export data to CSV string (for server-side use)
 *
 * @param {any[]} data - Data array to export
 * @param {string[]} headers - Column headers
 * @param {boolean} includeHeaders - Whether to include headers row (default: true)
 * @returns {string} CSV string
 */
export function exportToCSVString(data: any[], headers: string[], includeHeaders = true): string {
  if (!data || data.length === 0) {
    return '';
  }

  return Papa.unparse(data, {
    columns: headers,
    header: includeHeaders,
    delimiter: ',',
    newline: '\n',
    quoteChar: '"',
    escapeChar: '"',
  });
}
