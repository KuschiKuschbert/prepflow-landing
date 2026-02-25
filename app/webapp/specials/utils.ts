import { logger } from '@/lib/logger';
import { Recipe as UnifiedRecipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';
import { parseIngredient } from './utils/parseIngredient';

import type { AIIngredient } from './utils/parseIngredient';
export type { AIIngredient } from './utils/parseIngredient';
export { parseIngredient };

export interface APIRecipe {
  id: string;
  name?: string;
  recipe_name?: string;
  image_url: string;
  ingredients: (AIIngredient | string)[];
  instructions?: string[];
  description?: string;
  meta?: {
    prep_time_minutes?: number;
    cook_time_minutes?: number;
  };
  matchCount?: number;
  stockMatchPercentage?: number;
  missingIngredients?: string[];
}

export function adaptAiToUnified(aiRecipe: APIRecipe): {
  recipe: UnifiedRecipe;
  ingredients: RecipeIngredientWithDetails[];
} {
  // Debug log to trace data

  logger.dev('[Specials] Adapting recipe:', {
    id: aiRecipe.id,
    name: aiRecipe.name,
    recipe_name: aiRecipe.recipe_name,
    ingredientsCount: aiRecipe.ingredients?.length,
    sampleIngredient: aiRecipe.ingredients?.[0],
  });

  const ingredients = (aiRecipe.ingredients || []).map((ing, idx) => {
    const parsed = parseIngredient(ing, idx);

    // Check if this ingredient was flagged as missing by the API
    let originalName = '';
    if (typeof ing === 'string') {
      originalName = ing;
    } else if (typeof ing === 'object' && ing !== null) {
      originalName = ing.name || '';
    }

    if (originalName && aiRecipe.missingIngredients?.includes(originalName)) {
      parsed.is_missing = true;
    }

    return parsed;
  });

  // Format Instructions
  let instructionsStr = '';
  if (Array.isArray(aiRecipe.instructions)) {
    instructionsStr = aiRecipe.instructions.join('\n\n');
  } else if (typeof aiRecipe.instructions === 'string') {
    instructionsStr = aiRecipe.instructions;
  }

  // Create Unified Recipe
  const unified: UnifiedRecipe = {
    id: aiRecipe.id,
    recipe_name: aiRecipe.name || aiRecipe.recipe_name || 'Untitled Recipe',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    yield: 4, // Default assumption for AI recipes
    yield_unit: 'portions',
    image_url: aiRecipe.image_url,
    // Fill required fields
    category: 'Specials',
    description:
      aiRecipe.description ||
      `Prep: ${aiRecipe.meta?.prep_time_minutes}m | Cook: ${aiRecipe.meta?.cook_time_minutes}m`,
    instructions: instructionsStr,
    notes: `Prep: ${aiRecipe.meta?.prep_time_minutes}m | Cook: ${aiRecipe.meta?.cook_time_minutes}m`,
  };

  return { recipe: unified, ingredients };
}
