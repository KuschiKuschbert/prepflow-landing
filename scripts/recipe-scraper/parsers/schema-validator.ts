/**
 * Recipe Schema Validator
 * Zod schema for recipe validation and normalization
 */

import { z } from 'zod';

/**
 * Recipe Ingredient Schema
 */
export const RecipeIngredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  quantity: z.number().positive().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
  original_text: z.string().min(1, 'Original text is required'),
});

/**
 * Scraped Recipe Schema
 */
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

/**
 * Validate a scraped recipe against the schema
 */
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

/**
 * Normalize ingredient text to structured format
 * Attempts to parse "2 cups flour" into { quantity: 2, unit: "cups", name: "flour" }
 */
export function normalizeIngredient(ingredientText: string): {
  name: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  original_text: string;
} {
  const original = ingredientText.trim();
  const result: {
    name: string;
    quantity?: number;
    unit?: string;
    notes?: string;
    original_text: string;
  } = {
    name: '',
    original_text: original,
  };

  // Common units
  const units = [
    'cup',
    'cups',
    'tablespoon',
    'tablespoons',
    'tbsp',
    'teaspoon',
    'teaspoons',
    'tsp',
    'ounce',
    'ounces',
    'oz',
    'pound',
    'pounds',
    'lb',
    'gram',
    'grams',
    'g',
    'kilogram',
    'kilograms',
    'kg',
    'milliliter',
    'milliliters',
    'ml',
    'liter',
    'liters',
    'l',
    'piece',
    'pieces',
    'clove',
    'cloves',
    'can',
    'cans',
    'package',
    'packages',
    'bunch',
    'bunches',
    'head',
    'heads',
  ];

  // Try to extract quantity and unit
  const quantityMatch = original.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)\s*(.+)$/i);
  if (quantityMatch) {
    const quantityStr = quantityMatch[1];
    const rest = quantityMatch[2].trim();

    // Parse fraction or decimal
    if (quantityStr.includes('/')) {
      const [num, den] = quantityStr.split('/').map(Number);
      result.quantity = num / den;
    } else {
      result.quantity = parseFloat(quantityStr);
    }

    // Try to find unit
    const lowerRest = rest.toLowerCase();
    for (const unit of units) {
      if (lowerRest.startsWith(unit + ' ') || lowerRest.startsWith(unit + ',')) {
        result.unit = unit;
        result.name = rest.substring(unit.length).trim();
        break;
      }
    }

    // If no unit found, the rest is the name
    if (!result.name) {
      result.name = rest;
    }
  } else {
    // No quantity found, entire text is the name
    result.name = original;
  }

  // Extract notes (in parentheses or after comma)
  const notesMatch = result.name.match(/(?:\(([^)]+)\)|,\s*([^,]+))$/);
  if (notesMatch) {
    result.notes = (notesMatch[1] || notesMatch[2]).trim();
    result.name = result.name.replace(/(?:\([^)]+\)|,\s*[^,]+)$/, '').trim();
  }

  // Clean up name
  result.name = result.name.replace(/^,+\s*/, '').trim();

  return result;
}
