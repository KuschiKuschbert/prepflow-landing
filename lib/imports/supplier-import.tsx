/**
 * Supplier CSV import configuration
 * Provides parsing, validation, and template generation for supplier imports
 */

import type { CSVImportConfig } from '@/lib/imports/types';
import { parseSuppliersCSV } from './supplier-import/helpers/parseSuppliersCSV';
import { validateSupplier } from './supplier-import/helpers/validateSupplier';
import { formatSupplierPreview } from './supplier-import/helpers/formatSupplierPreview';
import { generateSupplierTemplate } from './supplier-import/helpers/generateSupplierTemplate';

export interface SupplierImportRow {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  payment_terms?: string;
  delivery_schedule?: string;
  minimum_order_amount?: number;
  is_active?: boolean;
  notes?: string;
}

// Re-export helper functions for external use
export { parseSuppliersCSV, validateSupplier, formatSupplierPreview, generateSupplierTemplate };

/**
 * Supplier import configuration
 */
export const supplierImportConfig: CSVImportConfig<SupplierImportRow> = {
  entityName: 'Supplier',
  entityNamePlural: 'suppliers',
  expectedColumns: ['name'],
  optionalColumns: [
    'contact_person',
    'email',
    'phone',
    'address',
    'website',
    'payment_terms',
    'delivery_schedule',
    'minimum_order_amount',
    'is_active',
    'notes',
  ],
  parseCSV: parseSuppliersCSV,
  validateEntity: validateSupplier,
  formatEntityForPreview: formatSupplierPreview,
  generateTemplate: generateSupplierTemplate,
  templateFilename: 'supplier-import-template.csv',
  instructions: [
    'First row should contain column headers',
    'Required columns: name (or supplier_name)',
    'Optional columns: contact_person, email, phone, address, website, payment_terms, delivery_schedule, minimum_order_amount, is_active, notes',
    'Email must be in valid format (e.g., email@example.com)',
    'minimum_order_amount should be a number',
    'is_active should be true/false or yes/no',
  ],
};
