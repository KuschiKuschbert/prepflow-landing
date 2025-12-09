/**
 * Supplier CSV import configuration
 * Provides parsing, validation, and template generation for supplier imports
 */

import { parseCSV, type ParseCSVResult } from '@/lib/csv/csv-utils';
import { CSVImportConfig } from '@/components/ui/CSVImportModal';
import {
  normalizeColumnName,
  mapCSVRowToEntity,
  parseNumber,
  parseBoolean,
  formatEntityPreview,
} from './import-utils';

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

/**
 * Parse suppliers from CSV text
 */
export function parseSuppliersCSV(csvText: string): ParseCSVResult<SupplierImportRow> {
  const result = parseCSV<Record<string, any>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: header => normalizeColumnName(header),
  });

  const suppliers: SupplierImportRow[] = result.data.map(row => {
    const supplier = mapCSVRowToEntity<SupplierImportRow>(row, {
      name: ['name', 'supplier_name', 'supplier name'],
      contact_person: ['contact_person', 'contact', 'contact person'],
      email: ['email'],
      phone: ['phone', 'telephone'],
      address: ['address'],
      website: ['website', 'url'],
      payment_terms: ['payment_terms', 'payment terms', 'terms'],
      delivery_schedule: ['delivery_schedule', 'delivery schedule', 'schedule'],
      minimum_order_amount: ['minimum_order_amount', 'minimum order', 'min order'],
      is_active: ['is_active', 'active', 'is active'],
      notes: ['notes', 'note'],
    });

    // Normalize values
    return {
      name: String(supplier.name || '').trim(),
      contact_person: supplier.contact_person ? String(supplier.contact_person).trim() : undefined,
      email: supplier.email ? String(supplier.email).trim() : undefined,
      phone: supplier.phone ? String(supplier.phone).trim() : undefined,
      address: supplier.address ? String(supplier.address).trim() : undefined,
      website: supplier.website ? String(supplier.website).trim() : undefined,
      payment_terms: supplier.payment_terms ? String(supplier.payment_terms).trim() : undefined,
      delivery_schedule: supplier.delivery_schedule
        ? String(supplier.delivery_schedule).trim()
        : undefined,
      minimum_order_amount: supplier.minimum_order_amount
        ? parseNumber(supplier.minimum_order_amount)
        : undefined,
      is_active: supplier.is_active !== undefined ? parseBoolean(supplier.is_active) : undefined,
      notes: supplier.notes ? String(supplier.notes).trim() : undefined,
    };
  });

  return {
    ...result,
    data: suppliers,
  };
}

/**
 * Validate supplier import row
 */
export function validateSupplier(
  row: SupplierImportRow,
  index: number,
): { valid: boolean; error?: string } {
  if (!row.name || row.name.trim().length === 0) {
    return { valid: false, error: 'Supplier name is required' };
  }

  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  if (
    row.minimum_order_amount !== undefined &&
    (row.minimum_order_amount < 0 || isNaN(row.minimum_order_amount))
  ) {
    return { valid: false, error: 'Minimum order amount must be a non-negative number' };
  }

  return { valid: true };
}

/**
 * Format supplier for preview
 */
export function formatSupplierPreview(supplier: SupplierImportRow, index: number): React.ReactNode {
  return (
    <div className="space-y-1">
      <div className="font-medium text-white">{supplier.name}</div>
      <div className="text-xs text-gray-400">
        {formatEntityPreview(supplier, ['contact_person', 'email', 'phone', 'address', 'website'])}
      </div>
    </div>
  );
}

/**
 * Generate supplier CSV template
 */
export function generateSupplierTemplate(): string {
  const headers = [
    'name',
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
  ];

  const exampleRow = [
    'Fresh Produce Co',
    'John Smith',
    'john@freshproduce.com',
    '0412 345 678',
    '123 Main St, Brisbane QLD 4000',
    'https://freshproduce.com',
    'Net 30',
    'Monday, Wednesday, Friday',
    '100',
    'true',
    'Preferred supplier for vegetables',
  ];

  return [headers.join(','), exampleRow.join(',')].join('\n');
}

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
