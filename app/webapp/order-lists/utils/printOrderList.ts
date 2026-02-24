/**
 * Print utility for order lists
 * Formats order list with items and quantities
 * Uses unified print template with Cyber Carrot branding
 */
import { printWithTemplate } from '@/lib/exports/print-template';
import { generateOrderHeader, getStatusLabel } from './printOrderList/helpers/generateOrderHeader';
import { generateOrderItemsTable } from './printOrderList/helpers/generateOrderItemsTable';
import type { PrintOrderListOptions } from './printOrderList-types';

export type { OrderList, OrderListItem, PrintOrderListOptions } from './printOrderList-types';

/**
 * Format order list for printing
 *
 * @param {PrintOrderListOptions} options - Order list print options
 * @returns {void} Opens print dialog
 */
export function printOrderList({ orderList }: PrintOrderListOptions): void {
  const content = `
    <div style="max-width: 100%;">
      ${generateOrderHeader(orderList)}
      ${generateOrderItemsTable(orderList.order_list_items)}
    </div>
  `;

  const createdDate = new Date(orderList.created_at).toLocaleDateString('en-AU');
  printWithTemplate({
    title: orderList.name,
    subtitle: `Order List - ${orderList.suppliers.name}`,
    content,
    totalItems: orderList.order_list_items.length,
    customMeta: `Status: ${getStatusLabel(orderList.status)} | Created: ${createdDate}`,
  });
}
