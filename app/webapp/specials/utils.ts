import { parseIngredientString } from '@/lib/recipe-normalization/ingredient-parser';
import { convertToStandardUnit } from '@/lib/unit-conversion';
import { RecipeIngredientWithDetails, Recipe as UnifiedRecipe } from '../recipes/types';

export interface AIIngredient {
  name: string;
  original_text?: string;
  quantity?: number;
  unit?: string;
}

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

// Ingredient parser with metric conversion - handles structured ingredient objects or strings
export function parseIngredient(
  ing: AIIngredient | string,
  index: number,
): RecipeIngredientWithDetails {
  let quantity = 1;
  let unit = 'pc';
  let name = '';

  // Handle string ingredients
  if (typeof ing === 'string') {
    const parsed = parseIngredientString(ing);
    if (parsed) {
      quantity = parsed.quantity;
      unit = parsed.unit;
      name = parsed.name;
    } else {
      // Fallback if parsing failed
      name = ing.trim();
    }
  } else {
    // Handle object ingredients
    name = ing.name || 'Unknown ingredient';

    // If we have quantity and unit from the object, use them
    if (ing.quantity !== undefined && ing.quantity !== null) {
      quantity = ing.quantity;
    }
    if (ing.unit) {
      unit = ing.unit;
    }

    // If quantity is still 1 and unit is 'pc', try parsing original_text
    if (quantity === 1 && unit === 'pc' && ing.original_text) {
      const parsed = parseIngredientString(ing.original_text);
      if (parsed && (parsed.quantity !== 1 || parsed.unit !== 'pc')) {
        quantity = parsed.quantity;
        unit = parsed.unit;
        // Prefer the structured name over parsed name
        // name stays as ing.name
      }
    }
  }

  // Convert to metric using existing library
  const converted = convertToStandardUnit(quantity, unit, name);

  // Generate stable unique ID with index to avoid duplicates
  const id = `ing-${index}-${btoa(encodeURIComponent(name.slice(0, 20))).substring(0, 8)}`;

  return {
    id,
    recipe_id: 'ai-recipe',
    ingredient_id: id,
    ingredient_name: name,
    quantity: converted.value,
    unit: converted.unit,
    cost_per_unit: 0,
    total_cost: 0,
    ingredients: {
      id,
      ingredient_name: name,
      cost_per_unit: 0,
      unit: converted.unit,
    },
  };
}

export function adaptAiToUnified(aiRecipe: APIRecipe): {
  recipe: UnifiedRecipe;
  ingredients: RecipeIngredientWithDetails[];
} {
  // Debug log to trace data
  // eslint-disable-next-line no-console
  console.log('[Specials] Adapting recipe:', {
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
