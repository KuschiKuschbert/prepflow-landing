/**
 * Helper to audit a single dish.
 * Orchestrates fetching dish data and calculating API/UI costs.
 */

import type { AuditResult } from '../types';
import { calculateAPICost } from './calculateAPICost';
import { calculateUICost } from './calculateUICost';
import { fetchDishData } from './fetchDishData';

/**
 * Audit a single dish and return the audit result.
 */
export async function auditDish(dish: { id: string; dish_name: string }): Promise<AuditResult> {
  const result: AuditResult = {
    dishId: dish.id,
    dishName: dish.dish_name,
    apiTotalCost: 0,
    uiTotalCost: 0,
    discrepancy: 0,
    discrepancyPercent: 0,
    recipeBreakdown: [],
    standaloneIngredients: [],
    issues: [],
  };

  try {
    // Fetch dish data
    const dishData = await fetchDishData(dish.id);
    if (!dishData) {
      result.issues.push('Failed to fetch dish data');
      return result;
    }

    // Calculate API total cost
    const apiTotalCost = await calculateAPICost(dishData, result);
    result.apiTotalCost = apiTotalCost;

    // Calculate UI total cost
    const uiTotalCost = await calculateUICost(dishData);
    result.uiTotalCost = uiTotalCost;

    // Calculate discrepancy
    result.discrepancy = Math.abs(apiTotalCost - uiTotalCost);
    result.discrepancyPercent = apiTotalCost > 0 ? (result.discrepancy / apiTotalCost) * 100 : 0;

    if (result.discrepancy > 0.01) {
      result.issues.push(
        `Cost mismatch: API=${apiTotalCost.toFixed(2)}, UI=${uiTotalCost.toFixed(2)}, Diff=${result.discrepancy.toFixed(2)}`,
      );
    }
  } catch (err) {
    result.issues.push(`Error auditing dish: ${err instanceof Error ? err.message : String(err)}`);
  }

  return result;
}
