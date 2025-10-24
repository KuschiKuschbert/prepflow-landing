// COGS Types
export interface Recipe {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  yield: number;
  yield_unit: string;
  created_at: string;
  updated_at: string;
}

export interface COGSCalculation {
  recipeId: string;
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  wasteAdjustedCost: number;
  yieldAdjustedCost: number;
  // Legacy properties for compatibility
  id?: string;
  ingredient_id?: string;
  ingredient_name?: string;
  cost_per_unit?: number;
  total_cost?: number;
  supplier_name?: string;
  category?: string;
}

export interface PricingCalculation {
  sellPriceExclGST: number;
  sellPriceInclGST: number;
  grossProfitDollar: number;
  actualGrossProfit: number;
  contributingMargin: number;
  contributingMarginPercent: number;
  gstAmount: number;
}

export interface PricingStrategy {
  name: string;
  multiplier: number;
  description: string;
}

export interface Ingredient {
  id: string;
  ingredient_name: string;
  category?: string;
  unit?: string;
  cost_per_unit?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  supplier_name?: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
  cost_per_unit: number;
  total_cost: number;
  supplier_name?: string;
  category?: string;
}

export interface DishFormData {
  dishName: string;
  dishPortions: number;
  dishNameLocked: boolean;
  recipeExists: boolean;
  checkingRecipe: boolean;
}

export interface IngredientFormData {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
}

export interface COGSPageState {
  calculations: COGSCalculation[];
  totalCost: number;
  loading: boolean;
  error: string | null;
}
