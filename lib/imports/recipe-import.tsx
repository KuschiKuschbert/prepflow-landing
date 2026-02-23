/**
 * Recipe CSV import configuration
 * Provides parsing, validation, and template generation for recipe imports
 */

import type { CSVImportConfig } from '@/lib/imports/types';
import { parseRecipesCSV } from './recipe-import/helpers/parseRecipesCSV';
import { validateRecipe } from './recipe-import/helpers/validateRecipe';
import { formatRecipePreview } from './recipe-import/helpers/formatRecipePreview';
import { generateRecipeTemplate } from './recipe-import/helpers/generateRecipeTemplate';

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

export { parseRecipesCSV, validateRecipe, formatRecipePreview, generateRecipeTemplate };

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
