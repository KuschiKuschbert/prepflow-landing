/**
 * CSV export utilities for COGS analysis
 */

import { exportToCSV } from '@/lib/csv/csv-utils';
import type { COGSCalculation } from '../../types';

const CSV_HEADERS = [
  'Ingredient',
  'Quantity',
  'Unit',
  'Cost Per Unit',
  'Total Cost',
  'Waste Adjusted Cost',
  'Yield Adjusted Cost',
];

/**
 * Map COGS calculation to CSV row format
 *
 * @param {COGSCalculation} calc - COGS calculation to map
 * @returns {Record<string, any>} CSV row object
 */
function mapCOGSCalculationToCSVRow(calc: COGSCalculation): Record<string, unknown> {
  return {
    Ingredient: calc.ingredientName || '',
    Quantity: calc.quantity || 0,
    Unit: calc.unit || '',
    'Cost Per Unit': calc.costPerUnit || 0,
    'Total Cost': calc.totalCost || 0,
    'Waste Adjusted Cost': calc.wasteAdjustedCost || 0,
    'Yield Adjusted Cost': calc.yieldAdjustedCost || 0,
  };
}

/**
 * Export COGS analysis to CSV
 *
 * @param {COGSCalculation[]} calculations - COGS calculations to export
 * @param {number} totalCOGS - Total COGS
 * @param {number} costPerPortion - Cost per portion
 */
export function exportCOGSAnalysisToCSV(
  calculations: COGSCalculation[],
  totalCOGS: number,
  costPerPortion: number,
): void {
  if (!calculations || calculations.length === 0) {
    return;
  }

  const csvData = calculations.map(mapCOGSCalculationToCSVRow);
  // Add summary row
  csvData.push({
    Ingredient: 'TOTAL',
    Quantity: '',
    Unit: '',
    'Cost Per Unit': '',
    'Total Cost': totalCOGS,
    'Waste Adjusted Cost': totalCOGS,
    'Yield Adjusted Cost': totalCOGS,
  });
  csvData.push({
    Ingredient: 'Cost Per Portion',
    Quantity: '',
    Unit: '',
    'Cost Per Unit': '',
    'Total Cost': costPerPortion,
    'Waste Adjusted Cost': '',
    'Yield Adjusted Cost': '',
  });

  const filename = `cogs-analysis-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(csvData, CSV_HEADERS, filename);
}
