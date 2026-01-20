export interface SelectedRecipe {
  recipe_id: string;
  quantity: number;
  recipe_name?: string;
}

export interface SelectedIngredient {
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredient_name?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  recipes?: T;
  items?: T;
  message?: string;
  error?: string;
}
