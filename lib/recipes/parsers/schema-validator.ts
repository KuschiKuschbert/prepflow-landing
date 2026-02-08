/**
 * Recipe Schema Validator (Migrated from scripts)
 */

import { z } from 'zod';

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

  const units = [
    'tablespoons',
    'tablespoon',
    'teaspoons',
    'teaspoon',
    'tbsp\\.?',
    'tsp\\.?',
    'ounces',
    'ounce',
    'oz\\.?',
    'pounds',
    'pound',
    'lbs\\.?',
    'lb\\.?',
    'kilograms',
    'kilogram',
    'kg\\.?',
    'grams',
    'gram',
    'g\\.?',
    'milliliters',
    'milliliter',
    'ml\\.?',
    'liters',
    'liter',
    'l\\.?',
    'cups',
    'cup',
    'c\\.?',
    'pieces',
    'piece',
    'pc\\.?',
    'cloves',
    'clove',
    'cans',
    'can',
    'packages',
    'package',
    'bunches',
    'bunch',
    'heads',
    'head',
    'slices',
    'slice',
    'pinches',
    'pinch',
    'dashes',
    'dash',
    'whole',
    'large',
    'medium',
    'small',
  ];

  const unicodeFractions: Record<string, number> = {
    '½': 0.5,
    '⅓': 1 / 3,
    '⅔': 2 / 3,
    '¼': 0.25,
    '¾': 0.75,
    '⅕': 0.2,
    '⅖': 0.4,
    '⅗': 0.6,
    '⅘': 0.8,
    '⅙': 1 / 6,
    '⅚': 5 / 6,
    '⅐': 1 / 7,
    '⅛': 0.125,
    '⅜': 0.375,
    '⅝': 0.625,
    '⅞': 0.875,
    '⅑': 1 / 9,
    '⅒': 0.1,
  };

  const unitPattern = units.join('|');
  const mixedPattern = new RegExp(
    `^(\\d+)\\s*([\\u00BC-\\u00BE\\u2150-\\u215E]|\\d+\\/\\d+)?\\s*(${unitPattern})\\s+(.+)$`,
    'i',
  );
  const fractionPattern = new RegExp(
    `^([\\u00BC-\\u00BE\\u2150-\\u215E]|\\d+\\/\\d+)\\s*(${unitPattern})\\s+(.+)$`,
    'i',
  );
  const numberUnitPattern = new RegExp(`^([\\d.]+)\\s*(${unitPattern})\\.?\\s+(.+)$`, 'i');
  const numberOnlyPattern = /^([\d.]+)\s+(.+)$/;

  let matched = false;
  let text = original;

  const notesInParens = text.match(/\(([^)]+)\)\s*$/);
  if (notesInParens) {
    result.notes = notesInParens[1].trim();
    text = text.replace(/\([^)]+\)\s*$/, '').trim();
  }

  let match = text.match(mixedPattern);
  if (match) {
    const whole = parseFloat(match[1]) || 0;
    let fraction = 0;
    if (match[2]) {
      if (unicodeFractions[match[2]]) {
        fraction = unicodeFractions[match[2]];
      } else if (match[2].includes('/')) {
        const [num, den] = match[2].split('/').map(Number);
        fraction = num / den;
      }
    }
    result.quantity = whole + fraction;
    result.unit = match[3].toLowerCase().replace(/\.$/, '');
    result.name = match[4].trim();
    matched = true;
  }

  if (!matched) {
    match = text.match(fractionPattern);
    if (match) {
      if (unicodeFractions[match[1]]) {
        result.quantity = unicodeFractions[match[1]];
      } else if (match[1].includes('/')) {
        const [num, den] = match[1].split('/').map(Number);
        result.quantity = num / den;
      }
      result.unit = match[2].toLowerCase().replace(/\.$/, '');
      result.name = match[3].trim();
      matched = true;
    }
  }

  if (!matched) {
    match = text.match(numberUnitPattern);
    if (match) {
      result.quantity = parseFloat(match[1]) || 1;
      result.unit = match[2].toLowerCase().replace(/\.$/, '');
      result.name = match[3].trim();
      matched = true;
    }
  }

  if (!matched) {
    match = text.match(numberOnlyPattern);
    if (match) {
      result.quantity = parseFloat(match[1]) || 1;
      result.name = match[2].trim();
      matched = true;
    }
  }

  if (!matched) result.name = text;

  const commaNote = result.name.match(/,\s*([^,]+)$/);
  if (commaNote && !result.notes) {
    result.notes = commaNote[1].trim();
    result.name = result.name.replace(/,\s*[^,]+$/, '').trim();
  }

  result.name = result.name
    .replace(/^,+\s*/, '')
    .replace(/,+\s*$/, '')
    .trim();
  if (!result.name) result.name = original;

  return result;
}
