/**
 * CSV import types shared between lib/imports and components.
 * Components (CSVImportModal) import from here - single source of truth.
 */

import type { ParseCSVResult } from '@/lib/csv/csv-utils';

export interface CSVImportConfig<T = unknown> {
  /** Entity type name (e.g., "Ingredients", "Recipes") */
  entityName: string;
  /** Entity name plural (e.g., "ingredients", "recipes") */
  entityNamePlural: string;
  /** CSV column headers expected */
  expectedColumns: string[];
  /** Optional columns that may be present */
  optionalColumns?: string[];
  /** Parse CSV text into entity objects */
  parseCSV: (csvText: string) => ParseCSVResult<T>;
  /** Validate parsed entity */
  validateEntity?: (entity: T, index: number) => { valid: boolean; error?: string };
  /** Format entity for preview display */
  formatEntityForPreview: (entity: T, index: number) => React.ReactNode;
  /** Generate template CSV content */
  generateTemplate: () => string;
  /** Template filename */
  templateFilename: string;
  /** Instructions for CSV format */
  instructions: string[];
}
