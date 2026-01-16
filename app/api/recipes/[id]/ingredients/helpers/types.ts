export interface IngredientRow {
  id: string;
  ingredient_name: string;
  name?: string; // Legacy field
  cost_per_unit: number | null;
  cost_per_unit_incl_trim: number | null;
  unit: string | null;
  trim_peel_waste_percentage: number | null;
  yield_percentage: number | null;
  category: string | null;
}

export interface RecipeIngredientRow {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients?: IngredientRow;
}

export interface NormalizedRecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients: {
    id: string;
    ingredient_name: string;
    cost_per_unit: number | null;
    cost_per_unit_incl_trim: number | null;
    unit: string | null;
    trim_peel_waste_percentage: number | null;
    yield_percentage: number | null;
    category: string | null;
  };
}

export interface SaveRecipeIngredientInput {
  ingredient_id: string;
  quantity: number;
  unit: string;
}
