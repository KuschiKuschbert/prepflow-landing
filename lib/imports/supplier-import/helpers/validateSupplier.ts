import type { SupplierImportRow } from '../../supplier-import';

/**
 * Validate supplier import row
 */
export function validateSupplier(
  row: SupplierImportRow,
  _index: number,
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
