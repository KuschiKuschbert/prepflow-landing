/**
 * CSV utility functions for performance data
 */

import { exportToCSV, parseCSV } from '@/lib/csv/csv-utils';
import {
  validateCSVData,
  transformCSVData,
  getPerformanceValidationSchema,
} from '@/lib/csv/validation';
import { logger } from '@/lib/logger';

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
 * Map performance item to CSV row format.
 *
 * @param {any} item - Performance item to map
 * @returns {Record<string, any>} CSV row object
 */
function mapPerformanceItemToCSVRow(item: any): Record<string, any> {
  return {
    Dish: item.name || '',
    'Number Sold': item.number_sold || 0,
    'Popularity %': item.popularity_percentage?.toFixed(2) || '0.00',
    'Total Revenue ex GST': ((item.selling_price * item.number_sold) / 1.1).toFixed(2),
    'Total Cost': (item.food_cost * item.number_sold).toFixed(2),
    'Total Profit ex GST': (item.gross_profit * item.number_sold).toFixed(2),
    'Gross Profit %': item.gross_profit_percentage?.toFixed(2) || '0.00',
    'Profit Cat': item.profit_category || '',
    'Popularity Cat': item.popularity_category || '',
    'Menu Item Class': item.menu_item_class || '',
  };
}

/**
 * Export performance data to CSV file using unified CSV utilities.
 *
 * @param {any[]} performanceItems - Performance items to export
 */
export function exportPerformanceDataToCSV(performanceItems: any[]): void {
  if (!performanceItems || performanceItems.length === 0) {
    logger.warn('[Performance CSV Export] No data to export');
    return;
  }

  const csvData = performanceItems.map(mapPerformanceItemToCSVRow);
  const filename = `performance-data-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(csvData, CSV_HEADERS, filename);
}

/**
 * Map CSV row to sales data object.
 *
 * @param {Record<string, any>} row - CSV row data
 * @returns {any} Sales data object
 */
function mapCSVRowToSalesData(row: Record<string, any>): any {
  // Normalize keys to lowercase for matching
  const normalizedRow: Record<string, any> = {};
  Object.keys(row).forEach(key => {
    normalizedRow[key.toLowerCase().trim()] = row[key];
  });

  // Flexible column matching
  let dishName = '';
  let numberSold = 0;
  let popularityPercentage = 0;

  Object.keys(normalizedRow).forEach(key => {
    const value = normalizedRow[key];
    if (key.includes('dish') || key.includes('name')) {
      dishName = String(value || '').trim();
    } else if (key.includes('sold') || key.includes('number')) {
      numberSold = parseInt(String(value), 10) || 0;
    } else if (key.includes('popularity')) {
      popularityPercentage = parseFloat(String(value)) || 0;
    }
  });

  return {
    dish_name: dishName,
    number_sold: numberSold,
    popularity_percentage: popularityPercentage,
  };
}

/**
 * Parse CSV sales data using PapaParse.
 *
 * @param {string} csvData - CSV text to parse
 * @returns {any[]} Parsed sales data
 * @throws {Error} If CSV parsing fails or validation fails
 */
export function parseCSVSalesData(csvData: string): any[] {
  if (!csvData || csvData.trim().length === 0) {
    throw new Error('CSV data is empty');
  }

  // Parse CSV using PapaParse
  const result = parseCSV<Record<string, any>>(csvData, {
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
  const validation = validateCSVData(transformed, schema);

  if (!validation.valid) {
    const errorMessages = validation.errors
      .map(err => `Row ${err.row}, ${err.field}: ${err.error}`)
      .join('; ');
    throw new Error(`Validation errors: ${errorMessages}`);
  }

  return transformed;
}
