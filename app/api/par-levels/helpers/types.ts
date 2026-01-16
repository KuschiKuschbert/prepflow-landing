export interface ParLevelInput {
  ingredient_id?: string;
  ingredientId?: string;
  par_level?: string | number | null;
  parLevel?: string | number | null;
  reorder_point?: string | number | null;
  reorderPoint?: string | number | null;
  unit?: string | null;
}

export interface IngredientRecord {
  id: string;
  ingredient_name: string;
  unit?: string;
  category?: string;
}

export interface ParLevelRecord {
  id: string;
  ingredient_id: string;
  par_level: number;
  reorder_point?: number;
  unit?: string;
  created_at?: string;
  updated_at?: string;
  ingredients?: IngredientRecord | null;
}
