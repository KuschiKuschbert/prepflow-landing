/** Recipe and recipe-ingredient types */
export interface Recipe {
  id: string;
  recipe_name: string;
  description?: string;
  instructions?: string;
  yield: number;
  yield_unit: string;
  category?: string;
  created_at: string;
  updated_at: string;
  selling_price?: number;
  allergens?: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  dietary_confidence?: string;
  dietary_method?: string;
  image_url?: string | null;
  image_url_alternative?: string | null;
  image_url_modern?: string | null;
  image_url_minimalist?: string | null;
  plating_methods_images?: Record<string, string | null>;
  notes?: string;
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
  notes?: string;
  is_missing?: boolean;
}

export interface RecipeIngredientWithDetails extends RecipeIngredient {
  ingredients: {
    id: string;
    ingredient_name: string;
    cost_per_unit: number;
    cost_per_unit_incl_trim?: number;
    unit: string;
    trim_peel_waste_percentage?: number;
    yield_percentage?: number;
    supplier_name?: string;
    category?: string;
  };
}

export interface COGSCalculation {
  id?: string;
  recipeId?: string;
  recipe_id?: string;
  ingredientId: string;
  ingredient_id: string;
  ingredientName: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  cost_per_unit: number;
  totalCost: number;
  total_cost: number;
  wasteAdjustedCost: number;
  waste_adjusted_cost?: number;
  yieldAdjustedCost: number;
  yield_percentage?: number;
  supplier_name?: string;
  category?: string;
  isConsumable?: boolean;
}

export interface RecipePriceData {
  selling_price: number;
  gross_profit: number;
  gross_profit_margin: number;
  cost_per_serving: number;
  recommendedPrice: number;
  foodCostPercent: number;
  contributingMargin: number;
  contributingMarginPercent: number;
}

export type RecipeSortField =
  | 'name'
  | 'recommended_price'
  | 'profit_margin'
  | 'contributing_margin'
  | 'created';
