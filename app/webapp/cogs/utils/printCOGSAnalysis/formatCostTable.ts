/**
 * Format cost breakdown table for COGS analysis print
 */

import type { COGSCalculation } from '../../types';

/**
 * Format cost breakdown table
 *
 * @param {COGSCalculation[]} calculations - COGS calculations
 * @param {number} totalCOGS - Total COGS
 * @param {number} costPerPortion - Cost per portion
 * @returns {string} HTML content for cost breakdown table
 */
export function formatCOGSCostTable(
  calculations: COGSCalculation[],
  totalCOGS: number,
  costPerPortion: number,
): string {
  return `
    <div style="margin-bottom: 32px;">
      <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid rgba(42, 42, 42, 0.8);">
        Cost Breakdown
      </h3>
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
  `;
}
