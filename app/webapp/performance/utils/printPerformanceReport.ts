/**
 * Print utility for performance reports
 * Formats performance analysis
 * Uses unified print template with Cyber Carrot branding
 */

import { printWithTemplate } from '@/lib/exports/print-template';
import type { PerformanceItem, PerformanceMetadata } from '../types';

export interface PrintPerformanceReportOptions {
  performanceItems: PerformanceItem[];
  metadata?: PerformanceMetadata | null;
  performanceScore?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: {
    profitCategory?: string[];
    popularityCategory?: string[];
    menuItemClass?: string[];
  };
}

/**
 * Format performance report for printing
 *
 * @param {PrintPerformanceReportOptions} options - Performance report print options
 * @returns {void} Opens print dialog
 */
export function printPerformanceReport({
  performanceItems,
  metadata,
  performanceScore,
  dateRange,
  filters,
}: PrintPerformanceReportOptions): void {
  // Group items by classification
  const itemsByClass = performanceItems.reduce(
    (acc, item) => {
      if (!acc[item.menu_item_class]) {
        acc[item.menu_item_class] = [];
      }
      acc[item.menu_item_class].push(item);
      return acc;
    },
    {} as Record<string, PerformanceItem[]>,
  );

  const getClassColor = (className: string) => {
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
  };

  const content = `
    <div style="max-width: 100%;">
      <!-- Summary Section -->
      <div style="margin-bottom: 32px; padding: 20px; background: rgba(42, 42, 42, 0.3); border-radius: 12px;">
        <h2 style="font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 16px;">
          Performance Summary
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Total Items</div>
            <div style="font-size: 28px; font-weight: 700; color: #29E7CD;">${performanceItems.length}</div>
          </div>
          ${
            performanceScore !== undefined
              ? `
            <div>
              <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Performance Score</div>
              <div style="font-size: 28px; font-weight: 700; color: ${performanceScore >= 70 ? '#29E7CD' : performanceScore >= 50 ? '#FF6B00' : '#D925C7'};">${performanceScore}%</div>
            </div>
          `
              : ''
          }
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Chef's Kiss</div>
            <div style="font-size: 28px; font-weight: 700; color: #29E7CD;">${performanceItems.filter(i => i.menu_item_class === "Chef's Kiss").length}</div>
          </div>
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Burnt Toast</div>
            <div style="font-size: 28px; font-weight: 700; color: #D925C7;">${performanceItems.filter(i => i.menu_item_class === 'Burnt Toast').length}</div>
          </div>
        </div>
        ${
          dateRange
            ? `
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(42, 42, 42, 0.5);">
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7);">
              Date Range: ${dateRange.start.toLocaleDateString('en-AU')} - ${dateRange.end.toLocaleDateString('en-AU')}
            </div>
          </div>
        `
            : ''
        }
        ${
          metadata
            ? `
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(42, 42, 42, 0.5);">
            <div style="font-size: 13px; color: rgba(255, 255, 255, 0.6);">
              Methodology: ${metadata.methodology}
            </div>
          </div>
        `
            : ''
        }
      </div>

      <!-- Items by Classification -->
      ${Object.entries(itemsByClass)
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
        .join('')}
    </div>
  `;

  const subtitle = dateRange
    ? `Performance Report - ${dateRange.start.toLocaleDateString('en-AU')} to ${dateRange.end.toLocaleDateString('en-AU')}`
    : 'Performance Report';

  printWithTemplate({
    title: 'Performance Report',
    subtitle,
    content,
    totalItems: performanceItems.length,
    customMeta: metadata?.methodology ? `Methodology: ${metadata.methodology}` : undefined,
  });
}
