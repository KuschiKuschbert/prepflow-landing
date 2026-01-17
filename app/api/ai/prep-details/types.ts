import { Recipe, RecipeIngredientWithDetails } from '@/app/webapp/recipes/types';
import { z } from 'zod';

export const prepDetailsSchema = z
  .object({
    recipe: z.any(), // Recipe is complex, validate structure if needed
    ingredients: z.array(z.any()).min(1, 'ingredients array is required'),
    instructions: z.string().nullable().optional(),
    countryCode: z.string().optional(),
  })
  .refine(data => data.recipe !== undefined && data.recipe !== null, {
    message: 'recipe is required',
    path: ['recipe'],
  });

export interface ValidatedPrepDetailsRequest {
  recipe: Recipe;
  ingredients: RecipeIngredientWithDetails[];
  instructions?: string | null;
  countryCode?: string;
}
