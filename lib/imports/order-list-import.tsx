/**
 * Order list CSV import configuration
 * Provides parsing, validation, and template generation for order list imports
 */

import { parseCSV, type ParseCSVResult } from '@/lib/csv/csv-utils';
import { CSVImportConfig } from '@/components/ui/CSVImportModal';
import { normalizeColumnName, mapCSVRowToEntity, parseNumber } from './import-utils';

export interface OrderListItemImportRow {
  supplier_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  notes?: string;
}

/**
 * Parse order list items from CSV text
 */
export function parseOrderListItemsCSV(csvText: string): ParseCSVResult<OrderListItemImportRow> {
  const result = parseCSV<Record<string, any>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: header => normalizeColumnName(header),
  });

  const items: OrderListItemImportRow[] = result.data.map(row => {
    const item = mapCSVRowToEntity<OrderListItemImportRow>(row, {
      supplier_id: ['supplier_id', 'supplier', 'supplier id'],
      ingredient_id: ['ingredient_id', 'ingredient', 'ingredient id'],
      quantity: ['quantity', 'qty', 'amount'],
      unit: ['unit'],
      notes: ['notes', 'note'],
    });

    // Normalize values
    return {
      supplier_id: String(item.supplier_id || '').trim(),
      ingredient_id: String(item.ingredient_id || '').trim(),
      quantity: parseNumber(item.quantity, 0),
      unit: String(item.unit || '').trim(),
      notes: item.notes ? String(item.notes).trim() : undefined,
    };
  });

  return {
    ...result,
    data: items,
  };
}

/**
 * Validate order list item import row
 */
export function validateOrderListItem(
  row: OrderListItemImportRow,
  index: number,
): { valid: boolean; error?: string } {
  if (!row.supplier_id || row.supplier_id.trim().length === 0) {
    return { valid: false, error: 'Supplier ID is required' };
  }

  if (!row.ingredient_id || row.ingredient_id.trim().length === 0) {
    return { valid: false, error: 'Ingredient ID is required' };
  }

  if (row.quantity === undefined || isNaN(row.quantity) || row.quantity <= 0) {
    return { valid: false, error: 'Quantity must be a positive number' };
  }

  if (!row.unit || row.unit.trim().length === 0) {
    return { valid: false, error: 'Unit is required' };
  }

  return { valid: true };
}

/**
 * Format order list item for preview
 */
export function formatOrderListItemPreview(
  item: OrderListItemImportRow,
  index: number,
): React.ReactNode {
  return (
    <div className="space-y-1">
      <div className="font-medium text-white">
        Ingredient: {item.ingredient_id} | Supplier: {item.supplier_id}
      </div>
      <div className="text-xs text-gray-400">
        Quantity: {item.quantity} {item.unit} {item.notes ? `| Notes: ${item.notes}` : ''}
      </div>
    </div>
  );
}

/**
 * Generate order list item CSV template
 */
export function generateOrderListItemTemplate(): string {
  const headers = ['supplier_id', 'ingredient_id', 'quantity', 'unit', 'notes'];

  const exampleRow = ['supplier123', 'ingredient456', '10', 'kg', 'Fresh stock needed'];

  return [headers.join(','), exampleRow.join(',')].join('\n');
}

/**
 * Order list item import configuration
 */
export const orderListItemImportConfig: CSVImportConfig<OrderListItemImportRow> = {
  entityName: 'Order List Item',
  entityNamePlural: 'order list items',
  expectedColumns: ['supplier_id', 'ingredient_id', 'quantity', 'unit'],
  optionalColumns: ['notes'],
  parseCSV: parseOrderListItemsCSV,
  validateEntity: validateOrderListItem,
  formatEntityForPreview: formatOrderListItemPreview,
  generateTemplate: generateOrderListItemTemplate,
  templateFilename: 'order-list-item-import-template.csv',
  instructions: [
    'First row should contain column headers',
    'Required columns: supplier_id (or supplier), ingredient_id (or ingredient), quantity, unit',
    'Optional columns: notes',
    'Quantity must be a positive number',
    'Unit should match the ingredient unit (e.g., kg, g, L, mL)',
  ],
};
