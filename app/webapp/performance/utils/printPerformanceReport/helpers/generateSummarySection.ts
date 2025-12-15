/**
 * Generate summary section HTML for performance report print.
 */
import type { PerformanceItem, PerformanceMetadata } from '../../../types';

interface GenerateSummarySectionParams {
  performanceItems: PerformanceItem[];
  dateRange?: { start: Date; end: Date } | null;
  metadata?: PerformanceMetadata | null;
  performanceScore?: number;
}

export function generateSummarySection({
  performanceItems,
  dateRange,
  metadata,
  performanceScore,
}: GenerateSummarySectionParams): string {
  return `
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
  `;
}
