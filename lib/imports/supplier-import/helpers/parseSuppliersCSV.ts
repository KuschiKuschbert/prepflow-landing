import { parseCSV, type ParseCSVResult } from '@/lib/csv/csv-utils';
import {
  normalizeColumnName,
  mapCSVRowToEntity,
  parseNumber,
  parseBoolean,
} from '../../import-utils';
import type { SupplierImportRow } from '../../supplier-import';

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
