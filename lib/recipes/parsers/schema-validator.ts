/**
 * Recipe Schema Validator (Migrated from scripts)
 */
import { z } from 'zod';
import { normalizeIngredient } from './schema-validator/normalizeIngredient';

export const RecipeIngredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  quantity: z.number().positive().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
  original_text: z.string().min(1, 'Original text is required'),
});

export const ScrapedRecipeSchema = z.object({
  id: z.string().min(1, 'Recipe ID is required'),
  source: z.string().min(1, 'Source is required'),
  source_url: z.string().url('Source URL must be valid'),
  recipe_name: z.string().min(1, 'Recipe name is required'),
  description: z.string().optional(),
  instructions: z.array(z.string().min(1)).min(1, 'At least one instruction is required'),
  ingredients: z.array(RecipeIngredientSchema).min(1, 'At least one ingredient is required'),
  yield: z.number().positive().optional(),
  yield_unit: z.string().optional(),
  prep_time_minutes: z.number().nonnegative().optional(),
  cook_time_minutes: z.number().nonnegative().optional(),
  total_time_minutes: z.number().nonnegative().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  category: z.string().optional(),
  cuisine: z.string().optional(),
  dietary_tags: z.array(z.string()).optional(),
  image_url: z.string().url().optional(),
  author: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  scraped_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
});

export type ScrapedRecipe = z.infer<typeof ScrapedRecipeSchema>;
export type RecipeIngredient = z.infer<typeof RecipeIngredientSchema>;

export function validateRecipe(recipe: unknown): {
  success: boolean;
  recipe?: ScrapedRecipe;
  error?: string;
} {
  try {
    const validated = ScrapedRecipeSchema.parse(recipe);
    return { success: true, recipe: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Validation failed: ${error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
      };
    }
    return { success: false, error: 'Unknown validation error' };
  }
}

export { normalizeIngredient };
