/**
 * Recipe Normalizer
 * Normalize recipe data to standard format
 */

import { ScrapedRecipe, RecipeIngredient } from './types';
import { normalizeIngredient } from './schema-validator';

/**
 * Normalize units to standard format
 */
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

/**
 * Normalize a unit to standard format
 */
export function normalizeUnit(unit?: string): string | undefined {
  if (!unit) return undefined;
  const lower = unit.toLowerCase().trim();
  return UNIT_MAPPINGS[lower] || lower;
}

/**
 * Normalize recipe ingredients
 */
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

/**
 * Extract dietary tags from recipe data
 */
export function extractDietaryTags(recipe: Partial<ScrapedRecipe>): string[] {
  const tags: string[] = [];

  // Check recipe name and description for keywords
  const text = `${recipe.recipe_name} ${recipe.description || ''}`.toLowerCase();
  const ingredientNames = (recipe.ingredients || [])
    .map(i => (typeof i === 'string' ? i : i.name))
    .join(' ')
    .toLowerCase();

  const allText = `${text} ${ingredientNames}`;

  // Vegetarian check (no meat, poultry, fish)
  if (
    !allText.match(
      /\b(beef|pork|chicken|turkey|duck|lamb|veal|fish|seafood|salmon|tuna|shrimp|crab|meat|poultry)\b/i,
    )
  ) {
    tags.push('vegetarian');
  }

  // Vegan check (no animal products)
  if (
    !allText.match(
      /\b(beef|pork|chicken|turkey|duck|lamb|veal|fish|seafood|salmon|tuna|shrimp|crab|meat|poultry|egg|eggs|milk|cheese|butter|cream|yogurt|honey)\b/i,
    )
  ) {
    tags.push('vegan');
  }

  // Gluten-free check
  if (!allText.match(/\b(wheat|flour|bread|pasta|noodles|barley|rye|gluten)\b/i)) {
    tags.push('gluten-free');
  }

  return tags;
}

/**
 * Normalize a recipe to standard format
 */
export function normalizeRecipe(recipe: Partial<ScrapedRecipe>): Partial<ScrapedRecipe> {
  const normalized: Partial<ScrapedRecipe> = {
    ...recipe,
    scraped_at: recipe.scraped_at || new Date().toISOString(),
  };

  // Normalize ingredients
  if (recipe.ingredients) {
    normalized.ingredients = normalizeRecipeIngredients(recipe.ingredients);
  }

  // Extract dietary tags if not provided
  if (!normalized.dietary_tags || normalized.dietary_tags.length === 0) {
    normalized.dietary_tags = extractDietaryTags(normalized);
  }

  // Normalize yield unit
  if (normalized.yield_unit) {
    const lower = normalized.yield_unit.toLowerCase();
    if (lower.includes('serving')) {
      normalized.yield_unit = 'servings';
    } else if (lower.includes('portion')) {
      normalized.yield_unit = 'portions';
    }
  }

  // Calculate total time if not provided
  if (
    !normalized.total_time_minutes &&
    (normalized.prep_time_minutes || normalized.cook_time_minutes)
  ) {
    normalized.total_time_minutes =
      (normalized.prep_time_minutes || 0) + (normalized.cook_time_minutes || 0);
  }

  return normalized;
}
