/**
 * Recipe Normalizer (Migrated from scripts)
 */

import { RecipeIngredient, ScrapedRecipe } from '../types';
import { normalizeIngredient } from './schema-validator';

const UNIT_MAPPINGS: Record<string, string> = {
  tbsp: 'tablespoon',
  tablespoons: 'tablespoon',
  tsp: 'teaspoon',
  teaspoons: 'teaspoon',
  oz: 'ounce',
  ounces: 'ounce',
  lb: 'pound',
  pounds: 'pound',
  g: 'gram',
  grams: 'gram',
  kg: 'kilogram',
  kilograms: 'kilogram',
  ml: 'milliliter',
  milliliters: 'milliliter',
  l: 'liter',
  liters: 'liter',
};

export function normalizeUnit(unit?: string): string | undefined {
  if (!unit) return undefined;
  const lower = unit.toLowerCase().trim();
  return UNIT_MAPPINGS[lower] || lower;
}

export function normalizeRecipeIngredients(
  ingredients: string[] | RecipeIngredient[],
): RecipeIngredient[] {
  return ingredients.map(ing => {
    if (typeof ing === 'string') {
      const normalized = normalizeIngredient(ing);
      return {
        ...normalized,
        unit: normalizeUnit(normalized.unit),
      };
    }
    return {
      ...ing,
      unit: normalizeUnit(ing.unit),
    };
  });
}

export function extractDietaryTags(recipe: Partial<ScrapedRecipe>): string[] {
  const tags: string[] = [];
  const text = `${recipe.recipe_name} ${recipe.description || ''}`.toLowerCase();
  const ingredientNames = (recipe.ingredients || [])
    .map(i => (typeof i === 'string' ? i : i.name))
    .join(' ')
    .toLowerCase();

  const allText = `${text} ${ingredientNames}`;

  if (
    !allText.match(
      /\b(beef|pork|chicken|turkey|duck|lamb|veal|fish|seafood|salmon|tuna|shrimp|crab|meat|poultry)\b/i,
    )
  ) {
    tags.push('vegetarian');
  }

  if (
    !allText.match(
      /\b(beef|pork|chicken|turkey|duck|lamb|veal|fish|seafood|salmon|tuna|shrimp|crab|meat|poultry|egg|eggs|milk|cheese|butter|cream|yogurt|honey)\b/i,
    )
  ) {
    tags.push('vegan');
  }

  if (!allText.match(/\b(wheat|flour|bread|pasta|noodles|barley|rye|gluten)\b/i)) {
    tags.push('gluten-free');
  }

  return tags;
}

export function normalizeRecipe(recipe: Partial<ScrapedRecipe>): Partial<ScrapedRecipe> {
  const normalized: Partial<ScrapedRecipe> = {
    ...recipe,
    scraped_at: recipe.scraped_at || new Date().toISOString(),
  };

  if (recipe.ingredients) {
    normalized.ingredients = normalizeRecipeIngredients(recipe.ingredients);
  }

  if (!normalized.dietary_tags || normalized.dietary_tags.length === 0) {
    normalized.dietary_tags = extractDietaryTags(normalized);
  }

  if (normalized.yield_unit) {
    const lower = normalized.yield_unit.toLowerCase();
    if (lower.includes('serving')) {
      normalized.yield_unit = 'servings';
    } else if (lower.includes('portion')) {
      normalized.yield_unit = 'portions';
    }
  }

  if (
    !normalized.total_time_minutes &&
    (normalized.prep_time_minutes || normalized.cook_time_minutes)
  ) {
    normalized.total_time_minutes =
      (normalized.prep_time_minutes || 0) + (normalized.cook_time_minutes || 0);
  }

  return normalized;
}
