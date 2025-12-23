import { parseCSV, type ParseCSVResult } from '@/lib/csv/csv-utils';
import { normalizeColumnName, mapCSVRowToEntity, parseNumber } from '../../import-utils';
import type { RecipeImportRow } from '../../recipe-import';

/**
 * Parse recipes from CSV text
 */
export function parseRecipesCSV(csvText: string): ParseCSVResult<RecipeImportRow> {
  const result = parseCSV<Record<string, any>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: header => normalizeColumnName(header),
  });

  const recipes: RecipeImportRow[] = result.data.map(row => {
    const recipe = mapCSVRowToEntity<RecipeImportRow>(row, {
      recipe_name: ['name', 'recipe_name', 'recipe', 'title'],
      description: ['description', 'desc'],
      instructions: ['instructions', 'steps', 'method'],
      yield: ['yield', 'servings', 'serves', 'quantity'],
      yield_unit: ['yield_unit', 'unit', 'yield unit'],
      category: ['category', 'cat'],
      selling_price: ['selling_price', 'price', 'cost'],
      allergens: ['allergens', 'allergen'],
      is_vegetarian: ['is_vegetarian', 'vegetarian', 'veg'],
      is_vegan: ['is_vegan', 'vegan'],
    });

    return {
      recipe_name: String(recipe.recipe_name || '').trim(),
      description: recipe.description ? String(recipe.description).trim() : undefined,
      instructions: recipe.instructions ? String(recipe.instructions).trim() : undefined,
      yield: recipe.yield ? parseNumber(recipe.yield, 1) : undefined,
      yield_unit: recipe.yield_unit ? String(recipe.yield_unit).trim() : undefined,
      category: recipe.category ? String(recipe.category).trim() : undefined,
      selling_price: recipe.selling_price ? parseNumber(recipe.selling_price) : undefined,
      allergens: recipe.allergens ? String(recipe.allergens).trim() : undefined,
      is_vegetarian: recipe.is_vegetarian !== undefined ? Boolean(recipe.is_vegetarian) : undefined,
      is_vegan: recipe.is_vegan !== undefined ? Boolean(recipe.is_vegan) : undefined,
    };
  });

  return {
    ...result,
    data: recipes,
  };
}
