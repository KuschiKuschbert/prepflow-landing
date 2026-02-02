/**
 * HTML formatting utilities for COGS analysis export
 */

import type { COGSCalculation, PricingCalculation } from '@/lib/types/cogs';

/**
 * Format COGS analysis for HTML/PDF export
 *
 * @param {COGSCalculation[]} calculations - COGS calculations to format
 * @param {number} totalCOGS - Total COGS
 * @param {number} costPerPortion - Cost per portion
 * @param {PricingCalculation} pricingCalculation - Optional pricing calculation
 * @returns {string} HTML content
 */
export function formatCOGSAnalysisForExport(
  calculations: COGSCalculation[],
  totalCOGS: number,
  costPerPortion: number,
  pricingCalculation?: PricingCalculation,
): string {
  return `
    <div style="margin-bottom: 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: rgba(42, 42, 42, 0.5);">
            <th style="text-align: left; padding: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Ingredient</th>
            <th style="text-align: right; padding: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Quantity</th>
            <th style="text-align: right; padding: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Cost/Unit</th>
            <th style="text-align: right; padding: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Total Cost</th>
            <th style="text-align: right; padding: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Yield Adjusted</th>
          </tr>
        </thead>
        <tbody>
          ${calculations
            .map(
              calc => `
            <tr style="border-bottom: 1px solid rgba(42, 42, 42, 0.5);">
              <td style="padding: 12px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">${calc.ingredientName}</td>
              <td style="text-align: right; padding: 12px; color: rgba(255, 255, 255, 0.8);">${calc.quantity} ${calc.unit}</td>
              <td style="text-align: right; padding: 12px; color: rgba(255, 255, 255, 0.8);">$${calc.costPerUnit.toFixed(4)}</td>
              <td style="text-align: right; padding: 12px; color: rgba(255, 255, 255, 0.8);">$${calc.totalCost.toFixed(2)}</td>
              <td style="text-align: right; padding: 12px; color: rgba(255, 255, 255, 0.9); font-weight: 600;">$${calc.yieldAdjustedCost.toFixed(2)}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
        <tfoot>
          <tr style="background: rgba(42, 42, 42, 0.3); font-weight: 600;">
            <td style="padding: 12px; color: rgba(255, 255, 255, 0.9);" colspan="4">Total COGS:</td>
            <td style="text-align: right; padding: 12px; color: #29E7CD; font-size: 18px;">$${totalCOGS.toFixed(2)}</td>
          </tr>
          <tr style="background: rgba(42, 42, 42, 0.3);">
            <td style="padding: 12px; color: rgba(255, 255, 255, 0.9);" colspan="4">Cost per Portion:</td>
            <td style="text-align: right; padding: 12px; color: rgba(255, 255, 255, 0.9); font-size: 16px;">$${costPerPortion.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    ${
      pricingCalculation
        ? `
      <div style="margin-top: 32px; padding: 20px; background: rgba(42, 42, 42, 0.3); border-radius: 12px;">
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
      </div>
    `
        : ''
    }
  `;
}
