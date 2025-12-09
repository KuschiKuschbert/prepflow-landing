/**
 * Export utilities for order lists
 * Supports CSV, PDF, HTML export formats
 */

import { exportToCSV } from '@/lib/csv/csv-utils';
import { generatePrintTemplate } from '@/lib/exports/print-template';
import type { OrderList } from './printOrderList';

const CSV_HEADERS = [
  'Order List Name',
  'Supplier',
  'Status',
  'Ingredient',
  'Category',
  'Quantity',
  'Unit',
  'Notes',
  'Created At',
];

/**
 * Map order list to CSV row format (flattened with items)
 *
 * @param {OrderList} orderList - Order list to map
 * @returns {Record<string, any>[]} CSV row objects (one per item)
 */
function mapOrderListToCSVRows(orderList: OrderList): Record<string, any>[] {
  if (!orderList.order_list_items || orderList.order_list_items.length === 0) {
    return [
      {
        'Order List Name': orderList.name,
        Supplier: orderList.suppliers.name,
        Status: orderList.status,
        Ingredient: '',
        Category: '',
        Quantity: '',
        Unit: '',
        Notes: orderList.notes || '',
        'Created At': new Date(orderList.created_at).toLocaleDateString('en-AU'),
      },
    ];
  }

  return orderList.order_list_items.map(item => ({
    'Order List Name': orderList.name,
    Supplier: orderList.suppliers.name,
    Status: orderList.status,
    Ingredient: item.ingredients.name,
    Category: item.ingredients.category || '',
    Quantity: item.quantity,
    Unit: item.unit,
    Notes: item.notes || '',
    'Created At': new Date(orderList.created_at).toLocaleDateString('en-AU'),
  }));
}

/**
 * Export order lists to CSV
 *
 * @param {OrderList[]} orderLists - Order lists to export
 */
export function exportOrderListsToCSV(orderLists: OrderList[]): void {
  if (!orderLists || orderLists.length === 0) {
    return;
  }

  const csvData = orderLists.flatMap(mapOrderListToCSVRows);
  const filename = `order-lists-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(csvData, CSV_HEADERS, filename);
}

/**
 * Format order list for HTML/PDF export
 *
 * @param {OrderList} orderList - Order list to format
 * @returns {string} HTML content
 */
function formatOrderListForExport(orderList: OrderList): string {
  return `
    <div style="margin-bottom: 32px; page-break-inside: avoid;">
      <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(42, 42, 42, 0.8);">
        ${orderList.name}
        <span style="font-size: 14px; font-weight: 400; color: rgba(255, 255, 255, 0.6); margin-left: 8px;">
          - ${orderList.suppliers.name} (${orderList.status})
        </span>
      </h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: rgba(42, 42, 42, 0.5);">
            <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Ingredient</th>
            <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Category</th>
            <th style="text-align: right; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Quantity</th>
            <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Notes</th>
          </tr>
        </thead>
        <tbody>
          ${orderList.order_list_items
            .sort((a, b) => a.ingredients.name.localeCompare(b.ingredients.name))
            .map(
              item => `
              <tr style="border-bottom: 1px solid rgba(42, 42, 42, 0.5);">
                <td style="padding: 10px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">${item.ingredients.name}</td>
                <td style="padding: 10px; color: rgba(255, 255, 255, 0.7);">${item.ingredients.category || 'N/A'}</td>
                <td style="text-align: right; padding: 10px; color: rgba(255, 255, 255, 0.9); font-weight: 600;">${item.quantity} ${item.unit}</td>
                <td style="padding: 10px; color: rgba(255, 255, 255, 0.7);">${item.notes || ''}</td>
              </tr>
            `,
            )
            .join('')}
        </tbody>
      </table>
      ${
        orderList.notes
          ? `
        <div style="margin-top: 12px; padding: 12px; background: rgba(42, 42, 42, 0.5); border-radius: 8px; border-left: 3px solid rgba(41, 231, 205, 0.5);">
          <div style="font-size: 13px; color: rgba(255, 255, 255, 0.8); white-space: pre-wrap;">${orderList.notes}</div>
        </div>
      `
          : ''
      }
    </div>
  `;
}

/**
 * Export order lists to HTML
 *
 * @param {OrderList[]} orderLists - Order lists to export
 */
export function exportOrderListsToHTML(orderLists: OrderList[]): void {
  if (!orderLists || orderLists.length === 0) {
    return;
  }

  const content = orderLists.map(formatOrderListForExport).join('');

  const html = generatePrintTemplate({
    title: 'Order Lists',
    subtitle: 'Purchase Orders',
    content,
    totalItems: orderLists.reduce((sum, list) => sum + list.order_list_items.length, 0),
  });

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `order-lists-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export order lists to PDF (via API)
 *
 * @param {OrderList[]} orderLists - Order lists to export
 */
export async function exportOrderListsToPDF(orderLists: OrderList[]): Promise<void> {
  if (!orderLists || orderLists.length === 0) {
    return;
  }

  const content = orderLists.map(formatOrderListForExport).join('');

  const response = await fetch('/api/export/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Order Lists',
      subtitle: 'Purchase Orders',
      content,
      totalItems: orderLists.reduce((sum, list) => sum + list.order_list_items.length, 0),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate PDF');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `order-lists-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
