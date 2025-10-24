// Recipe Types
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

export interface RecipeIngredientWithDetails extends RecipeIngredient {
  ingredients: {
    id: string;
    ingredient_name: string;
    cost_per_unit: number;
    unit: string;
    trim_peel_waste_percentage?: number;
    yield_percentage?: number;
    supplier_name?: string;
    category?: string;
  };
}

export interface COGSCalculation {
  id: string;
  ingredient_id: string;
  ingredientId: string;
  ingredient_name: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  cost_per_unit: number;
  total_cost: number;
  yieldAdjustedCost: number;
  supplier_name?: string;
  category?: string;
}

export interface RecipePriceData {
  selling_price: number;
  gross_profit: number;
  gross_profit_margin: number;
  cost_per_serving: number;
  recommendedPrice: number;
  foodCostPercent: number;
}
