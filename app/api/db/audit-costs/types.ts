/**
 * Types for cost audit functionality.
 */

export interface IngredientData {
  id: string;
  ingredient_name: string;
  cost_per_unit: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  category?: string;
}

export interface RecipeData {
  id: string;
  recipe_name: string;
}

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
