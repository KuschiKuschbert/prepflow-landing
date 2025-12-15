/**
 * Generate order items table HTML.
 */
import type { OrderListItem } from '../../printOrderList';

export function generateOrderItemsTable(items: OrderListItem[]): string {
  return `
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
        ${items
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
  `;
}
