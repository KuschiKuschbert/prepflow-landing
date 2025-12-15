/**
 * Print utility for suppliers
 * Formats supplier directory
 * Uses unified print template with Cyber Carrot branding
 */

import { printWithTemplate } from '@/lib/exports/print-template';
import type { Supplier } from '../types';

export interface PrintSuppliersOptions {
  suppliers: Supplier[];
  includeInactive?: boolean;
}

/**
 * Format suppliers for printing
 *
 * @param {PrintSuppliersOptions} options - Suppliers print options
 * @returns {void} Opens print dialog
 */
export function printSuppliers({
  suppliers,
  includeInactive = false,
}: PrintSuppliersOptions): void {
  const filteredSuppliers = includeInactive ? suppliers : suppliers.filter(s => s.is_active);

  const content = `
    <div style="max-width: 100%;">
      <!-- Summary Section -->
      <div style="margin-bottom: 32px; padding: 20px; background: rgba(42, 42, 42, 0.3); border-radius: 12px;">
        <h2 style="font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 16px;">
          Summary
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Total Suppliers</div>
            <div style="font-size: 28px; font-weight: 700; color: #29E7CD;">${filteredSuppliers.length}</div>
          </div>
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Active</div>
            <div style="font-size: 28px; font-weight: 700; color: #29E7CD;">${filteredSuppliers.filter(s => s.is_active).length}</div>
          </div>
        </div>
      </div>

      <!-- Suppliers Table -->
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
          ${filteredSuppliers
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
    </div>
  `;

  printWithTemplate({
    title: 'Supplier Directory',
    subtitle: 'Suppliers',
    content,
    totalItems: filteredSuppliers.length,
  });
}
