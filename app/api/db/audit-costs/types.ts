/**
 * Types for cost audit functionality.
 */

export interface AuditResult {
  dishId: string;
  dishName: string;
  apiTotalCost: number;
  uiTotalCost: number;
  discrepancy: number;
  discrepancyPercent: number;
  recipeBreakdown: Array<{
    recipeId: string;
    recipeName: string;
    recipeQuantity: number;
    recipeCost: number;
  }>;
  standaloneIngredients: Array<{
    ingredientName: string;
    quantity: number;
    unit: string;
    cost: number;
  }>;
  issues: string[];
}

export interface AuditSummary {
  totalDishes: number;
  dishesWithIssues: number;
  dishesWithDiscrepancies: number;
  avgDiscrepancy: string;
  maxDiscrepancy: string;
}
