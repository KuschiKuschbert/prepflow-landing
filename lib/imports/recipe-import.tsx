/**
 * Recipe CSV import configuration
 * Provides parsing, validation, and template generation for recipe imports
 */

import { parseCSV, type ParseCSVResult } from '@/lib/csv/csv-utils';
import { CSVImportConfig } from '@/components/ui/CSVImportModal';
import {
  normalizeColumnName,
  mapCSVRowToEntity,
  parseNumber,
  formatEntityPreview,
} from './import-utils';
import { logger } from '@/lib/logger';
import type { Recipe } from '@/app/webapp/recipes/types';

export interface RecipeImportRow {
  recipe_name: string;
  description?: string;
  instructions?: string;
  yield?: number;
  yield_unit?: string;
  category?: string;
  selling_price?: number;
  allergens?: string;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
}

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

    // Normalize values
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

/**
 * Validate recipe import row
 */
export function validateRecipe(
  row: RecipeImportRow,
  index: number,
): { valid: boolean; error?: string } {
  if (!row.recipe_name || row.recipe_name.trim().length === 0) {
    return { valid: false, error: 'Recipe name is required' };
  }

  if (row.yield !== undefined && (row.yield <= 0 || isNaN(row.yield))) {
    return { valid: false, error: 'Yield must be a positive number' };
  }

  if (row.selling_price !== undefined && (row.selling_price < 0 || isNaN(row.selling_price))) {
    return { valid: false, error: 'Selling price must be a non-negative number' };
  }

  return { valid: true };
}

/**
 * Format recipe for preview
 */
export function formatRecipePreview(recipe: RecipeImportRow, index: number): React.ReactNode {
  return (
    <div className="space-y-1">
      <div className="font-medium text-white">{recipe.recipe_name}</div>
      <div className="text-xs text-gray-400">
        {formatEntityPreview(recipe, [
          'description',
          'yield',
          'yield_unit',
          'category',
          'selling_price',
        ])}
      </div>
    </div>
  );
}

/**
 * Generate recipe CSV template
 */
export function generateRecipeTemplate(): string {
  const headers = [
    'recipe_name',
    'description',
    'instructions',
    'yield',
    'yield_unit',
    'category',
    'selling_price',
    'allergens',
    'is_vegetarian',
    'is_vegan',
  ];

  const exampleRow = [
    'Double Cheese Burger',
    'Classic burger with double cheese',
    '1. Cook patties\n2. Assemble burger\n3. Serve',
    '1',
    'serving',
    'Burgers',
    '15.50',
    'Dairy, Gluten',
    'false',
    'false',
  ];

  return [headers.join(','), exampleRow.join(',')].join('\n');
}

/**
 * Recipe import configuration
 */
export const recipeImportConfig: CSVImportConfig<RecipeImportRow> = {
  entityName: 'Recipe',
  entityNamePlural: 'recipes',
  expectedColumns: ['recipe_name', 'yield', 'yield_unit'],
  optionalColumns: [
    'description',
    'instructions',
    'category',
    'selling_price',
    'allergens',
    'is_vegetarian',
    'is_vegan',
  ],
  parseCSV: parseRecipesCSV,
  validateEntity: validateRecipe,
  formatEntityForPreview: formatRecipePreview,
  generateTemplate: generateRecipeTemplate,
  templateFilename: 'recipe-import-template.csv',
  instructions: [
    'First row should contain column headers',
    'Required columns: recipe_name (or name), yield, yield_unit (or unit)',
    'Optional columns: description, instructions, category, selling_price, allergens, is_vegetarian, is_vegan',
    'Yield and selling_price should be numbers',
    'is_vegetarian and is_vegan should be true/false or yes/no',
    'Allergens can be comma-separated (e.g., "Dairy, Gluten")',
  ],
};
