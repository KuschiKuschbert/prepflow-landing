export interface ParLevel {
  id: string;
  ingredient_id: string;
  par_level: number;
  reorder_point: number;
  unit: string;
  created_at: string;
  updated_at: string;
  ingredients: {
    id: string;
    ingredient_name: string;
    unit?: string;
    category?: string;
  };
}

export interface Ingredient {
  id: string;
  ingredient_name: string;
  unit?: string;
  category?: string;
}
