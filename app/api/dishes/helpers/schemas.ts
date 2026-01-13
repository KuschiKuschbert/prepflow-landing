import { z } from 'zod';

export const dishRecipeSchema = z.object({
  recipe_id: z.string().min(1, 'Recipe ID is required'),
  quantity: z.number().positive().default(1),
});

export const dishIngredientSchema = z.object({
  ingredient_id: z.string().min(1, 'Ingredient ID is required'),
  quantity: z.union([z.number(), z.string()]).transform(val => Number(val)),
  unit: z.string().min(1, 'Unit is required'),
});

export const dishSchema = z.object({
  id: z.string().uuid(),
  dish_name: z.string().min(1, 'Dish name is required'),
  selling_price: z.number().positive('Selling price must be positive'),
  description: z.string().optional().nullable(),
  category: z.string().optional().default('Uncategorized'),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  allergens: z.array(z.string()).optional().default([]),
  is_vegetarian: z.boolean().optional().nullable().default(false),
  is_vegan: z.boolean().optional().nullable().default(false),
  dietary_confidence: z.string().optional().nullable(),
  dietary_method: z.string().optional().nullable(),
});

export const createDishSchema = dishSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    allergens: true,
    is_vegetarian: true,
    is_vegan: true,
    dietary_confidence: true,
    dietary_method: true,
  })
  .extend({
    recipes: z.array(dishRecipeSchema).optional(),
    ingredients: z.array(dishIngredientSchema).optional(),
  })
  .refine(
    data => {
      const hasRecipes = data.recipes && data.recipes.length > 0;
      const hasIngredients = data.ingredients && data.ingredients.length > 0;
      return hasRecipes || hasIngredients;
    },
    {
      message: 'Dish must contain at least one recipe or ingredient',
      path: ['recipes'],
    },
  );

export const updateDishSchema = dishSchema.partial();

export type Dish = z.infer<typeof dishSchema>;
export type CreateDishInput = z.infer<typeof createDishSchema>;
export type DishRecipeInput = z.infer<typeof dishRecipeSchema>;
export type DishIngredientInput = z.infer<typeof dishIngredientSchema>;
export type UpdateDishInput = z.infer<typeof updateDishSchema>;

export interface DishRelationRecipe {
  id: string;
  recipe_id: string;
  quantity?: number;
  recipes?: {
    id: number;
    recipe_name: string;
    name: string;
    description: string | null;
    yield: number;
    yield_unit: string;
    instructions: string | null;
  };
}

export interface DishRelationIngredient {
  id: string;
  dish_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients?: {
    id: string;
    ingredient_name: string;
    cost_per_unit: number;
    cost_per_unit_incl_trim: number;
    trim_peel_waste_percentage: number;
    yield_percentage: number;
    unit: string;
    supplier_name: string;
    category?: string | null;
    brand?: string | null;
    allergens?: string[];
    allergen_source?: any;
  };
}

export interface DishWithRelations extends Dish {
  recipes: DishRelationRecipe[];
  ingredients: DishRelationIngredient[];
}

export interface DishResponse {
  success: boolean;
  dish?: Dish | DishWithRelations;
  dishes?: Dish[];
  count?: number;
  page?: number;
  pageSize?: number;
  message?: string;
}
