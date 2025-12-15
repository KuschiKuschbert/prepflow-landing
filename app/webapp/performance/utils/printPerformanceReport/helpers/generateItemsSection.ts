/**
 * Generate items by classification section HTML.
 */
import type { PerformanceItem } from '../../../types';

export function getClassColor(className: string): string {
  switch (className) {
    case "Chef's Kiss":
      return '#29E7CD';
    case 'Hidden Gem':
      return '#3B82F6';
    case 'Bargain Bucket':
      return '#FF6B00';
    case 'Burnt Toast':
      return '#D925C7';
    default:
      return 'rgba(255, 255, 255, 0.7)';
  }
}

export function generateItemsSection(itemsByClass: Record<string, PerformanceItem[]>): string {
  return Object.entries(itemsByClass)
    .map(
      ([className, classItems]) => `
      <div style="margin-bottom: 32px; page-break-inside: avoid;">
        <h3 style="font-size: 20px; font-weight: 600; color: ${getClassColor(className)}; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(42, 42, 42, 0.8);">
          ${className}
          <span style="font-size: 14px; font-weight: 400; color: rgba(255, 255, 255, 0.6); margin-left: 8px;">(${classItems.length})</span>
        </h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr style="background: rgba(42, 42, 42, 0.5);">
              <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Item</th>
              <th style="text-align: right; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Selling Price</th>
              <th style="text-align: right; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Cost</th>
              <th style="text-align: right; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Gross Profit</th>
              <th style="text-align: right; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Margin %</th>
              <th style="text-align: right; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Sold</th>
            </tr>
          </thead>
          <tbody>
            ${classItems
              .sort((a, b) => b.gross_profit - a.gross_profit)
              .map(
                item => `
                <tr style="border-bottom: 1px solid rgba(42, 42, 42, 0.5);">
                  <td style="padding: 10px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">${item.name}</td>
                  <td style="text-align: right; padding: 10px; color: rgba(255, 255, 255, 0.9);">$${item.selling_price.toFixed(2)}</td>
                  <td style="text-align: right; padding: 10px; color: rgba(255, 255, 255, 0.8);">$${item.cost_per_serving.toFixed(2)}</td>
                  <td style="text-align: right; padding: 10px; color: ${item.gross_profit >= 0 ? '#29E7CD' : '#D925C7'}; font-weight: 600;">$${item.gross_profit.toFixed(2)}</td>
                  <td style="text-align: right; padding: 10px; color: ${item.gross_profit_percentage >= 30 ? '#29E7CD' : item.gross_profit_percentage >= 20 ? '#FF6B00' : '#D925C7'}; font-weight: 600;">${item.gross_profit_percentage.toFixed(1)}%</td>
                  <td style="text-align: right; padding: 10px; color: rgba(255, 255, 255, 0.8);">${item.number_sold}</td>
                </tr>
              `,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `,
    )
    .join('');
}
