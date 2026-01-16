/**
 * Export utilities for suppliers
 * Supports CSV, PDF, HTML export formats
 */

import { exportToCSV } from '@/lib/csv/csv-utils';
import { generatePrintTemplate } from '@/lib/exports/print-template';
import type { Supplier } from '../types';
import { formatSuppliersForExport } from './helpers/formatSuppliersForExport';

const CSV_HEADERS = [
  'Name',
  'Contact Person',
  'Email',
  'Phone',
  'Address',
  'Website',
  'Payment Terms',
  'Delivery Schedule',
  'Minimum Order Amount',
  'Status',
  'Notes',
];

/**
 * Map supplier to CSV row format
 *
 * @param {Supplier} supplier - Supplier to map
 * @returns {Record<string, any>} CSV row object
 */
function mapSupplierToCSVRow(supplier: Supplier): Record<string, unknown> {
  return {
    Name: supplier.name || '',
    'Contact Person': supplier.contact_person || '',
    Email: supplier.email || '',
    Phone: supplier.phone || '',
    Address: supplier.address || '',
    Website: supplier.website || '',
    'Payment Terms': supplier.payment_terms || '',
    'Delivery Schedule': supplier.delivery_schedule || '',
    'Minimum Order Amount': supplier.minimum_order_amount || 0,
    Status: supplier.is_active ? 'Active' : 'Inactive',
    Notes: supplier.notes || '',
  };
}

/**
 * Export suppliers to CSV
 *
 * @param {Supplier[]} suppliers - Suppliers to export
 */
export function exportSuppliersToCSV(suppliers: Supplier[]): void {
  if (!suppliers || suppliers.length === 0) {
    return;
  }

  const csvData = suppliers.map(mapSupplierToCSVRow);
  const filename = `suppliers-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(csvData, CSV_HEADERS, filename);
}

/**
 * Export suppliers to HTML
 *
 * @param {Supplier[]} suppliers - Suppliers to export
 */
export function exportSuppliersToHTML(suppliers: Supplier[]): void {
  if (!suppliers || suppliers.length === 0) {
    return;
  }

  const content = formatSuppliersForExport(suppliers);

  const html = generatePrintTemplate({
    title: 'Supplier Directory',
    subtitle: 'Suppliers',
    content,
    totalItems: suppliers.length,
  });

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `suppliers-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export suppliers to PDF (via API)
 *
 * @param {Supplier[]} suppliers - Suppliers to export
 */
export async function exportSuppliersToPDF(suppliers: Supplier[]): Promise<void> {
  if (!suppliers || suppliers.length === 0) {
    return;
  }

  const content = formatSuppliersForExport(suppliers);

  const response = await fetch('/api/export/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Supplier Directory',
      subtitle: 'Suppliers',
      content,
      totalItems: suppliers.length,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate PDF');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `suppliers-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
