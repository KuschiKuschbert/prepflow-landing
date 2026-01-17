/**
 * CSV utility functions for performance data
 */
import { exportToCSV, parseCSV } from '@/lib/csv/csv-utils';
import {
    getPerformanceValidationSchema,
    transformCSVData,
    validateCSVData,
} from '@/lib/csv/validation';
import { logger } from '@/lib/logger';
import { PerformanceItem } from '../types';
import { mapCSVRowToSalesData, SalesData } from './csv-utils/helpers/mapCSVRowToSalesData';
import { mapPerformanceItemToCSVRow } from './csv-utils/helpers/mapPerformanceItemToCSVRow';

const CSV_HEADERS = [
  'Dish',
  'Number Sold',
  'Popularity %',
  'Total Revenue ex GST',
  'Total Cost',
  'Total Profit ex GST',
  'Gross Profit %',
  'Profit Cat',
  'Popularity Cat',
  'Menu Item Class',
];

/**
 * Export performance data to CSV file using unified CSV utilities.
 *
 * @param {any[]} performanceItems - Performance items to export
 */
export function exportPerformanceDataToCSV(performanceItems: PerformanceItem[]): void {
  if (!performanceItems || performanceItems.length === 0) {
    logger.warn('[Performance CSV Export] No data to export');
    return;
  }

  const csvData = performanceItems.map(mapPerformanceItemToCSVRow);
  const filename = `performance-data-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(csvData, CSV_HEADERS, filename);
}

/**
 * Parse CSV sales data using PapaParse.
 *
 * @param {string} csvData - CSV text to parse
 * @returns {any[]} Parsed sales data
 * @throws {Error} If CSV parsing fails or validation fails
 */
export function parseCSVSalesData(csvData: string): SalesData[] {
  if (!csvData || csvData.trim().length === 0) {
    throw new Error('CSV data is empty');
  }

  // Parse CSV using PapaParse
  const result = parseCSV<Record<string, unknown>>(csvData, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
  });

  // Check for parse errors
  if (result.errors.length > 0) {
    const errorMessages = result.errors.map(err => `Row ${err.row}: ${err.message}`).join(', ');
    throw new Error(`CSV parsing errors: ${errorMessages}`);
  }

  if (result.data.length === 0) {
    throw new Error('CSV file appears to be empty or has no valid data rows');
  }

  // Map CSV rows to sales data
  const salesData = result.data
    .map(row => mapCSVRowToSalesData(row))
    .filter(item => item.dish_name);

  if (salesData.length === 0) {
    throw new Error('No valid sales data found in CSV file');
  }

  // Validate and transform data
  const schema = getPerformanceValidationSchema();
  const transformed = transformCSVData(salesData, schema);
  const validation = validateCSVData(transformed as unknown as Record<string, unknown>[], schema);

  if (!validation.valid) {
    const errorMessages = validation.errors
      .map(err => `Row ${err.row}, ${err.field}: ${err.error}`)
      .join('; ');
    throw new Error(`Validation errors: ${errorMessages}`);
  }

  return transformed;
}
