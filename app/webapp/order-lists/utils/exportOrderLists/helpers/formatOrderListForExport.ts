/**
 * Format order list for HTML/PDF export.
 */
import type { OrderList } from '../../printOrderList';

export function formatOrderListForExport(orderList: OrderList): string {
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
