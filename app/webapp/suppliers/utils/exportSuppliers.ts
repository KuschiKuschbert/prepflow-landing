/**
 * Export utilities for suppliers
 * Supports CSV, PDF, HTML export formats
 */

import { exportToCSV } from '@/lib/csv/csv-utils';
import { generatePrintTemplate } from '@/lib/exports/print-template';
import type { Supplier } from '../types';

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
function mapSupplierToCSVRow(supplier: Supplier): Record<string, any> {
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
 * Format suppliers for HTML/PDF export
 *
 * @param {Supplier[]} suppliers - Suppliers to format
 * @returns {string} HTML content
 */
function formatSuppliersForExport(suppliers: Supplier[]): string {
  return `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: rgba(42, 42, 42, 0.5);">
          <th style="text-align: left; padding: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Supplier</th>
          <th style="text-align: left; padding: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Contact</th>
          <th style="text-align: left; padding: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Phone</th>
          <th style="text-align: left; padding: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Email</th>
          <th style="text-align: center; padding: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Status</th>
        </tr>
      </thead>
      <tbody>
        ${suppliers
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(
            supplier => `
            <tr style="border-bottom: 1px solid rgba(42, 42, 42, 0.5);">
              <td style="padding: 12px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">
                ${supplier.name}
                ${supplier.minimum_order_amount ? `<div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 4px;">Min: $${supplier.minimum_order_amount.toFixed(2)}</div>` : ''}
              </td>
              <td style="padding: 12px; color: rgba(255, 255, 255, 0.8);">${supplier.contact_person || 'N/A'}</td>
              <td style="padding: 12px; color: rgba(255, 255, 255, 0.8);">${supplier.phone || 'N/A'}</td>
              <td style="padding: 12px; color: rgba(255, 255, 255, 0.8);">${supplier.email || 'N/A'}</td>
              <td style="text-align: center; padding: 12px;">
                <span style="color: ${supplier.is_active ? '#29E7CD' : '#D925C7'}; font-weight: 600;">
                  ${supplier.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
            ${
              supplier.address ||
              supplier.payment_terms ||
              supplier.delivery_schedule ||
              supplier.notes
                ? `
              <tr>
                <td colspan="5" style="padding: 8px 12px; padding-top: 0; color: rgba(255, 255, 255, 0.6); font-size: 13px;">
                  ${supplier.address ? `<div><strong>Address:</strong> ${supplier.address}</div>` : ''}
                  ${supplier.payment_terms ? `<div><strong>Payment Terms:</strong> ${supplier.payment_terms}</div>` : ''}
                  ${supplier.delivery_schedule ? `<div><strong>Delivery:</strong> ${supplier.delivery_schedule}</div>` : ''}
                  ${supplier.notes ? `<div style="margin-top: 4px; font-style: italic;">${supplier.notes}</div>` : ''}
                </td>
              </tr>
            `
                : ''
            }
          `,
          )
          .join('')}
      </tbody>
    </table>
  `;
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
