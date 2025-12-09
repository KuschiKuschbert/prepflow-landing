/**
 * Shared utilities for CSV imports
 * Common parsing and validation helpers
 */

import { parseCSV, type ParseCSVResult } from '@/lib/csv/csv-utils';
import { logger } from '@/lib/logger';

/**
 * Normalize column names for flexible matching
 * Handles variations like "name" vs "Name" vs "NAME" vs "ingredient_name"
 */
export function normalizeColumnName(header: string): string {
  return header
    .toLowerCase()
    .trim()
    .replace(/[_\s-]+/g, '_')
    .replace(/^ingredient_/, '')
    .replace(/^recipe_/, '')
    .replace(/^supplier_/, '')
    .replace(/^compliance_/, '')
    .replace(/^temperature_/, '')
    .replace(/^order_/, '')
    .replace(/^par_/, '');
}

/**
 * Map CSV row to entity with flexible column matching
 */
export function mapCSVRowToEntity<T>(
  row: Record<string, any>,
  columnMap: Record<string, string | string[]>,
): Partial<T> {
  const entity: any = {};

  Object.entries(columnMap).forEach(([entityField, csvColumns]) => {
    const columns = Array.isArray(csvColumns) ? csvColumns : [csvColumns];
    const normalizedColumns = columns.map(normalizeColumnName);

    // Find matching column in CSV row
    for (const [csvHeader, value] of Object.entries(row)) {
      const normalizedHeader = normalizeColumnName(csvHeader);
      if (normalizedColumns.includes(normalizedHeader)) {
        entity[entityField] = value;
        break;
      }
    }
  });

  return entity as Partial<T>;
}

/**
 * Parse date string (handles various formats)
 */
export function parseDate(dateString: string | null | undefined): string | null {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  } catch {
    return null;
  }
}

/**
 * Parse number with fallback
 */
export function parseNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined || value === '') return defaultValue;
  const num =
    typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Parse boolean
 */
export function parseBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === 'yes' || lower === '1' || lower === 'y';
  }
  return Boolean(value);
}

/**
 * Format entity for preview display
 */
export function formatEntityPreview(entity: any, fields: string[]): string {
  return fields
    .map(field => {
      const value = entity[field];
      if (value === null || value === undefined || value === '') return null;
      return `${field}: ${value}`;
    })
    .filter(Boolean)
    .join(' | ');
}
