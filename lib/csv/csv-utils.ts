/**
 * Unified CSV utilities using PapaParse for reliable CSV handling
 * Handles all edge cases: quotes, commas, newlines, special characters
 */

export { parseCSV } from './csv-utils/helpers/parseCSV';
export type { ParseCSVOptions, ParseCSVResult } from './csv-utils/types';

/**
 * Format a value for CSV export (properly escape quotes and commas)
 *
 * @param {any} value - Value to format
 * @returns {string} Formatted CSV value
 *
 * @example
 * ```typescript
 * formatCSVValue('Hello, World') // Returns: "Hello, World"
 * formatCSVValue('He said "hello"') // Returns: "He said ""hello"""
 * ```
 */
export function formatCSVValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export { exportToCSV, exportToCSVString } from './csv-utils/helpers/exportCSV';
export { validateCSVData } from './csv-utils/helpers/validateCSV';
