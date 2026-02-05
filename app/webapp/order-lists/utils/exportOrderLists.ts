/**
 * Export utilities for order lists
 * Supports CSV, PDF, HTML export formats
 */
import { exportToCSV } from '@/lib/csv/csv-utils';
import { generatePrintTemplate } from '@/lib/exports/print-template';
import { downloadFile } from './exportOrderLists/helpers/downloadFile';
import { formatOrderListForExport } from './exportOrderLists/helpers/formatOrderListForExport';
import { mapOrderListToCSVRows } from './exportOrderLists/helpers/mapOrderListToCSVRows';
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

export function exportOrderListsToCSV(orderLists: OrderList[]): void {
  if (!orderLists || orderLists.length === 0) return;
  const csvData = orderLists.flatMap(mapOrderListToCSVRows);
  exportToCSV(csvData, CSV_HEADERS, `order-lists-${new Date().toISOString().split('T')[0]}.csv`);
}

import { getSavedExportTheme } from '@/lib/exports/utils/themeUtils';

export function exportOrderListsToHTML(orderLists: OrderList[]): void {
  if (!orderLists || orderLists.length === 0) return;
  const content = orderLists.map(formatOrderListForExport).join('');
  const theme = getSavedExportTheme();
  const html = generatePrintTemplate({
    title: 'Order Lists',
    subtitle: 'Purchase Orders',
    content,
    totalItems: orderLists.reduce((sum, list) => sum + list.order_list_items.length, 0),
    variant: 'supplier',
    theme,
  });
  downloadFile(
    new Blob([html], { type: 'text/html' }),
    `order-lists-${new Date().toISOString().split('T')[0]}.html`,
  );
}

export async function exportOrderListsToPDF(orderLists: OrderList[]): Promise<void> {
  if (!orderLists || orderLists.length === 0) return;
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
  if (!response.ok) throw new Error('Failed to generate PDF');
  downloadFile(await response.blob(), `order-lists-${new Date().toISOString().split('T')[0]}.pdf`);
}
