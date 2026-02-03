import { z } from 'zod';

export const recipeSchema = z.object({
  id: z.number().int().positive(),
  recipe_name: z.string().min(1, 'Recipe name is required'),
  yield: z.number().positive().default(1),
  yield_unit: z.string().default('servings'),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  instructions: z.string().optional().nullable(),
  allergens: z.array(z.string()).optional().default([]),
  is_vegetarian: z.boolean().optional().default(false),
  is_vegan: z.boolean().optional().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const createRecipeSchema = recipeSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateRecipeSchema = createRecipeSchema.partial();

export type Recipe = z.infer<typeof recipeSchema>;
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;

export interface RecipeResponse {
  success: boolean;
  recipe?: Recipe | null;
  recipes?: Recipe[];
  count?: number;
  page?: number;
  pageSize?: number;
  isNew?: boolean;
}
