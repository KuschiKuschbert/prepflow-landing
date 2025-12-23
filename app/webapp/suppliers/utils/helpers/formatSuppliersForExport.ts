import type { Supplier } from '../../types';

/**
 * Format suppliers for HTML/PDF export
 *
 * @param {Supplier[]} suppliers - Suppliers to format
 * @returns {string} HTML content
 */
export function formatSuppliersForExport(suppliers: Supplier[]): string {
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
