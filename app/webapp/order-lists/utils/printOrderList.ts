/**
 * Print utility for order lists
 * Formats order list with items and quantities
 * Uses unified print template with Cyber Carrot branding
 */

import { printWithTemplate } from '@/lib/exports/print-template';

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return '#29E7CD';
      case 'received':
        return '#10B981';
      case 'cancelled':
        return '#D925C7';
      case 'draft':
      default:
        return '#FF6B00';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Sent';
      case 'received':
        return 'Received';
      case 'cancelled':
        return 'Cancelled';
      case 'draft':
      default:
        return 'Draft';
    }
  };

  const content = `
    <div style="max-width: 100%;">
      <!-- Order List Header -->
      <div style="margin-bottom: 32px; padding: 20px; background: rgba(42, 42, 42, 0.3); border-radius: 12px;">
        <h2 style="font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 16px;">
          ${orderList.name}
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Supplier</div>
            <div style="font-size: 18px; font-weight: 600; color: rgba(255, 255, 255, 0.9);">${orderList.suppliers.name}</div>
          </div>
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Status</div>
            <div style="font-size: 18px; font-weight: 600; color: ${getStatusColor(orderList.status)};">
              ${getStatusLabel(orderList.status)}
            </div>
          </div>
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Created</div>
            <div style="font-size: 16px; font-weight: 500; color: rgba(255, 255, 255, 0.8);">
              ${new Date(orderList.created_at).toLocaleDateString('en-AU')}
            </div>
          </div>
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Total Items</div>
            <div style="font-size: 28px; font-weight: 700; color: #29E7CD;">${orderList.order_list_items.length}</div>
          </div>
        </div>
        ${
          orderList.notes
            ? `
          <div style="margin-top: 16px; padding: 12px; background: rgba(42, 42, 42, 0.5); border-radius: 8px; border-left: 3px solid rgba(41, 231, 205, 0.5);">
            <div style="font-size: 13px; color: rgba(255, 255, 255, 0.8); white-space: pre-wrap;">${orderList.notes}</div>
          </div>
        `
            : ''
        }
      </div>

      <!-- Order Items Table -->
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: rgba(42, 42, 42, 0.5);">
            <th style="text-align: left; padding: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Ingredient</th>
            <th style="text-align: left; padding: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Category</th>
            <th style="text-align: right; padding: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Quantity</th>
            <th style="text-align: left; padding: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Notes</th>
          </tr>
        </thead>
        <tbody>
          ${orderList.order_list_items
            .sort((a, b) => a.ingredients.name.localeCompare(b.ingredients.name))
            .map(
              item => `
              <tr style="border-bottom: 1px solid rgba(42, 42, 42, 0.5);">
                <td style="padding: 12px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">${item.ingredients.name}</td>
                <td style="padding: 12px; color: rgba(255, 255, 255, 0.7);">${item.ingredients.category || 'N/A'}</td>
                <td style="text-align: right; padding: 12px; color: rgba(255, 255, 255, 0.9); font-weight: 600;">${item.quantity} ${item.unit}</td>
                <td style="padding: 12px; color: rgba(255, 255, 255, 0.7);">${item.notes || ''}</td>
              </tr>
            `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;

  printWithTemplate({
    title: orderList.name,
    subtitle: `Order List - ${orderList.suppliers.name}`,
    content,
    totalItems: orderList.order_list_items.length,
    customMeta: `Status: ${getStatusLabel(orderList.status)} | Created: ${new Date(orderList.created_at).toLocaleDateString('en-AU')}`,
  });
}




