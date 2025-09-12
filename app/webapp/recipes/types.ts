export interface Recipe {
  id: string;
  name: string;
  yield: number;
  yield_unit: string;
  instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients: {
    id: string;
    ingredient_name: string;
    cost_per_unit: number;
    unit: string;
    trim_peel_waste_percentage: number;
    yield_percentage: number;
  };
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
}

export interface RecipePriceData {
  costPerServing: number;
  recommendedPrice: number;
  foodCostPercent: number;
}
