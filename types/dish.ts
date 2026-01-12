export interface Dish {
  id: string;
  dish_name: string;
  description: string | null;
  selling_price: number;
  category: string | null;
  kitchen_section_id: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  recipes?: DishRecipe[];
  ingredients?: DishIngredient[];
}

export interface DishRecipe {
  id: string;
  dish_id: string;
  recipe_id: string;
  quantity?: number; // Depending on junction table
  unit?: string;
  // Joined recipe data
  recipe?: {
    id: string;
    recipe_name: string;
  };
}

export interface DishIngredient {
  id: string;
  dish_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  // Joined ingredient data
  ingredient?: {
    id: string;
    ingredient_name: string;
  };
}

export interface CreateDishInput {
  dish_name: string;
  description?: string | null;
  selling_price: number;
  category?: string;
  recipes?: Array<{
    recipe_id: string;
    // Add other junction fields if needed
  }>;
  ingredients?: Array<{
    ingredient_id: string;
    quantity: number;
    unit: string;
  }>;
}

export interface UpdateDishInput extends Partial<CreateDishInput> {
  id?: string;
}

export interface EnrichedDish extends Dish {
  allergens?: string[];
  is_vegetarian?: boolean | null;
  is_vegan?: boolean | null;
  dietary_confidence?: string | null;
  dietary_method?: string | null;
}
