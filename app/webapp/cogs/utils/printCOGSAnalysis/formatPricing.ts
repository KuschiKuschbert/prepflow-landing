/**
 * Format pricing analysis section for COGS analysis print
 */

import type { PricingCalculation } from '@/lib/types/cogs';

/**
 * Format pricing analysis section
 *
 * @param {PricingCalculation | undefined} pricingCalculation - Pricing calculation data
 * @param {string | undefined} pricingStrategy - Pricing strategy
 * @param {number | undefined} targetGrossProfit - Target gross profit percentage
 * @returns {string} HTML content for pricing analysis
 */
export function formatCOGSPricing(
  pricingCalculation?: PricingCalculation,
  pricingStrategy?: string,
  targetGrossProfit?: number,
): string {
  if (!pricingCalculation) {
    return '';
  }

  return `
    <div style="margin-bottom: 32px; padding: 20px; background: rgba(42, 42, 42, 0.3); border-radius: 12px;">
      <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 16px;">
        Pricing Analysis
      </h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div>
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Selling Price (ex GST)</div>
          <div style="font-size: 24px; font-weight: 700; color: #29E7CD;">$${pricingCalculation.sellPriceExclGST.toFixed(2)}</div>
        </div>
        <div>
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Selling Price (inc GST)</div>
          <div style="font-size: 24px; font-weight: 700; color: #29E7CD;">$${pricingCalculation.sellPriceInclGST.toFixed(2)}</div>
        </div>
        <div>
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Gross Profit</div>
          <div style="font-size: 24px; font-weight: 700; color: #29E7CD;">$${pricingCalculation.grossProfitDollar.toFixed(2)}</div>
        </div>
        <div>
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Gross Profit %</div>
          <div style="font-size: 24px; font-weight: 700; color: #29E7CD;">${pricingCalculation.actualGrossProfit.toFixed(1)}%</div>
        </div>
      </div>
      ${
        pricingStrategy
          ? `
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(42, 42, 42, 0.5);">
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7);">
            Strategy: <span style="color: rgba(255, 255, 255, 0.9); font-weight: 600;">${pricingStrategy}</span>
            ${targetGrossProfit !== undefined ? ` | Target: ${targetGrossProfit}%` : ''}
          </div>
        </div>
      `
          : ''
      }
    </div>
  `;
}
