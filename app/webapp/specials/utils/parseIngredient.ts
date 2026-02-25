/**
 * Parse AI ingredient (string or object) to RecipeIngredientWithDetails.
 * Extracted from utils.ts to stay under 150-line limit.
 */
import { parseIngredientString } from '@/lib/recipe-normalization/ingredient-parser';
import { convertToStandardUnit } from '@/lib/unit-conversion';
import type { RecipeIngredientWithDetails } from '@/lib/types/recipes';

export interface AIIngredient {
  name: string;
  original_text?: string;
  quantity?: number;
  unit?: string;
}

export function parseIngredient(
  ing: AIIngredient | string,
  index: number,
): RecipeIngredientWithDetails {
  let quantity = 1;
  let unit = 'pc';
  let name = '';

  if (typeof ing === 'string') {
    const parsed = parseIngredientString(ing);
    if (parsed) {
      quantity = parsed.quantity;
      unit = parsed.unit;
      name = parsed.name;
    } else {
      name = ing.trim();
    }
  } else {
    name = ing.name || 'Unknown ingredient';
    if (ing.quantity !== undefined && ing.quantity !== null) quantity = ing.quantity;
    if (ing.unit) unit = ing.unit;
    if (quantity === 1 && unit === 'pc' && ing.original_text) {
      const parsed = parseIngredientString(ing.original_text);
      if (parsed && (parsed.quantity !== 1 || parsed.unit !== 'pc')) {
        quantity = parsed.quantity;
        unit = parsed.unit;
      }
    }
  }

  const converted = convertToStandardUnit(quantity, unit, name);
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
    ingredients: { id, ingredient_name: name, cost_per_unit: 0, unit: converted.unit },
  };
}
