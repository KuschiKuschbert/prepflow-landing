/**
 * Unified CSV utilities using PapaParse for reliable CSV handling
 * Handles all edge cases: quotes, commas, newlines, special characters
 */

import Papa from 'papaparse';
import { logger } from '@/lib/logger';

export interface ParseCSVOptions {
  header?: boolean;
  skipEmptyLines?: boolean;
  transformHeader?: (header: string) => string;
  transform?: (value: any, field: string) => any;
}

export interface ParseCSVResult<T = any> {
  data: T[];
  errors: Papa.ParseError[];
  meta: Papa.ParseMeta;
}

/**
 * Parse CSV text using PapaParse
 *
 * @param {string} csvText - CSV text to parse
 * @param {ParseCSVOptions} options - Parsing options
 * @returns {ParseCSVResult} Parsed data with errors and metadata
 *
 * @example
 * ```typescript
 * const result = parseCSV(csvText, { header: true });
 * if (result.errors.length > 0) {
 *   logger.error('Parse errors:', result.errors);
 * }
 * const data = result.data;
 * ```
 */
export function parseCSV<T = any>(
  csvText: string,
  options: ParseCSVOptions = {},
): ParseCSVResult<T> {
  const config: Papa.ParseConfig = {
    header: options.header ?? true,
    skipEmptyLines: options.skipEmptyLines ?? true,
    transformHeader: options.transformHeader,
    transform: options.transform,
    delimiter: ',',
    newline: '\n',
    quoteChar: '"',
    escapeChar: '"',
  };

  const result = Papa.parse<T>(csvText, config);

  // Handle errors gracefully
  if (result.errors.length > 0) {
    logger.warn('[CSV Parse] Parse errors:', result.errors);
  }

  return {
    data: result.data,
    errors: result.errors,
    meta: result.meta,
  };
}

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
export function formatCSVValue(value: any): string {
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

/**
 * Export data to CSV file with proper formatting
 *
 * @param {any[]} data - Data array to export
 * @param {string[]} headers - Column headers
 * @param {string} filename - Filename for download
 * @param {boolean} includeHeaders - Whether to include headers row (default: true)
 *
 * @example
 * ```typescript
 * exportToCSV(
 *   [{ name: 'John', age: 30 }],
 *   ['Name', 'Age'],
 *   'users.csv'
 * );
 * ```
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

  // Use PapaParse to generate CSV (handles all edge cases)
  const csv = Papa.unparse(data, {
    columns: headers,
    header: includeHeaders,
    delimiter: ',',
    newline: '\n',
    quoteChar: '"',
    escapeChar: '"',
  });

  // Create blob and download
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
 *
 * @example
 * ```typescript
 * const csvString = exportToCSVString(
 *   [{ name: 'John', age: 30 }],
 *   ['Name', 'Age']
 * );
 * ```
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

/**
 * Validate CSV data against a schema
 *
 * @param {any[]} data - Data to validate
 * @param {Record<string, (value: any) => boolean | string>} schema - Validation schema
 * @returns {{ valid: boolean; errors: Array<{ row: number; field: string; error: string }> }} Validation result
 *
 * @example
 * ```typescript
 * const schema = {
 *   name: (v) => typeof v === 'string' && v.length > 0 || 'Name is required',
 *   age: (v) => typeof v === 'number' && v > 0 || 'Age must be positive'
 * };
 * const result = validateCSVData(data, schema);
 * ```
 */
export function validateCSVData(
  data: any[],
  schema: Record<string, (value: any) => boolean | string>,
): { valid: boolean; errors: Array<{ row: number; field: string; error: string }> } {
  const errors: Array<{ row: number; field: string; error: string }> = [];

  data.forEach((row, index) => {
    Object.entries(schema).forEach(([field, validator]) => {
      const value = row[field];
      const result = validator(value);

      if (result !== true) {
        errors.push({
          row: index + 1, // 1-indexed for user display
          field,
          error: typeof result === 'string' ? result : `Invalid value for ${field}`,
        });
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
