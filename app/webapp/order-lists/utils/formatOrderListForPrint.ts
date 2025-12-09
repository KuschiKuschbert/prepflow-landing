/**
 * Format order list data for print/export
 * Converts order list ingredients into HTML table format
 */

import { formatDefaultOrderList } from './formatOrderListForPrint/defaultVariant';
import { formatSupplierOrderList } from './formatOrderListForPrint/supplierVariant';
import type { OrderListData } from './formatOrderListForPrint/types';

// Re-export types for backward compatibility
export type {
  OrderListIngredient,
  SupplierInfo,
  OrderListData,
} from './formatOrderListForPrint/types';

/**
 * Format order list data as HTML for print/export
 *
 * @param {OrderListData} data - Order list data
 * @param {string} variant - Template variant ('default' | 'supplier')
 * @returns {string} HTML content for order list
 */
export function formatOrderListForPrint(
  data: OrderListData,
  variant: 'default' | 'supplier' = 'default',
): string {
  // Supplier variant: Purchase order format
  if (variant === 'supplier') {
    return formatSupplierOrderList(data);
  }

  // Default variant: Standard order list format
  return formatDefaultOrderList(data);
}
