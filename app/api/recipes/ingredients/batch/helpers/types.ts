export interface BatchIngredientData {
  id: string;
  ingredient_name: string;
  unit?: string;
  cost_per_unit?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
}

export interface BatchRecipeIngredientRow {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients?: BatchIngredientData; // Can be undefined if join fails
}
