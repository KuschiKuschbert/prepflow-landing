/**
 * Print utility for order lists
 * Formats order list with items and quantities
 * Uses unified print template with Cyber Carrot branding
 */
import { printWithTemplate } from '@/lib/exports/print-template';
import { generateOrderHeader } from './printOrderList/helpers/generateOrderHeader';
import { generateOrderItemsTable } from './printOrderList/helpers/generateOrderItemsTable';
import { getStatusLabel } from './printOrderList/helpers/generateOrderHeader';

export interface OrderListItem {
  id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  notes?: string;
  ingredients: {
    id: string;
    name: string;
    unit: string;
    category: string;
  };
}

export interface OrderList {
  id: string;
  supplier_id: string;
  name: string;
  notes?: string;
  status: 'draft' | 'sent' | 'received' | 'cancelled';
  created_at: string;
  updated_at: string;
  suppliers: {
    id: string;
    name: string;
  };
  order_list_items: OrderListItem[];
}

export interface PrintOrderListOptions {
  orderList: OrderList;
}

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
