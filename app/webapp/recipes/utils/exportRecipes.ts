/**
 * Export utilities for recipes
 * Supports CSV, PDF, HTML export formats
 */

import { exportToCSV } from '@/lib/csv/csv-utils';
import { exportHTMLReport, exportPDFReport } from '@/lib/exports/export-html';
import type { Recipe, RecipeIngredientWithDetails } from '../types';
import { formatRecipeForExport } from './helpers/formatRecipeForExport';

const CSV_HEADERS = [
  'Recipe Name',
  'Description',
  'Category',
  'Yield',
  'Yield Unit',
  'Selling Price',
  'Allergens',
  'Vegetarian',
  'Vegan',
  'Instructions',
  'Created At',
  'Updated At',
];

/**
 * Map recipe to CSV row format
 *
 * @param {Recipe} recipe - Recipe to map
 * @returns {Record<string, any>} CSV row object
 */
function mapRecipeToCSVRow(recipe: Recipe): Record<string, any> {
  return {
    'Recipe Name': recipe.recipe_name || '',
    Description: recipe.description || '',
    Category: recipe.category || '',
    Yield: recipe.yield || 0,
    'Yield Unit': recipe.yield_unit || '',
    'Selling Price': recipe.selling_price || 0,
    Allergens: recipe.allergens?.join(', ') || '',
    Vegetarian: recipe.is_vegetarian ? 'Yes' : 'No',
    Vegan: recipe.is_vegan ? 'Yes' : 'No',
    Instructions: recipe.instructions || '',
    'Created At': recipe.created_at ? new Date(recipe.created_at).toLocaleDateString('en-AU') : '',
    'Updated At': recipe.updated_at ? new Date(recipe.updated_at).toLocaleDateString('en-AU') : '',
  };
}

/**
 * Export recipes to CSV
 *
 * @param {Recipe[]} recipes - Recipes to export
 */
export function exportRecipesToCSV(recipes: Recipe[]): void {
  if (!recipes || recipes.length === 0) {
    return;
  }

  const csvData = recipes.map(mapRecipeToCSVRow);
  const filename = `recipes-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(csvData, CSV_HEADERS, filename);
}

/**
 * Export recipes to HTML
 *
 * @param {Recipe[]} recipes - Recipes to export
 * @param {Map<string, RecipeIngredientWithDetails[]>} ingredientsMap - Map of recipe ID to ingredients
 */
export function exportRecipesToHTML(
  recipes: Recipe[],
  ingredientsMap: Map<string, RecipeIngredientWithDetails[]>,
): void {
  if (!recipes || recipes.length === 0) {
    return;
  }

  const content = recipes
    .map(recipe => {
      const ingredients = ingredientsMap.get(recipe.id) || [];
      return formatRecipeForExport(recipe, ingredients);
    })
    .join('');

  exportHTMLReport({
    title: 'Recipes',
    subtitle: 'Recipe Collection',
    content,
    filename: `recipes-${new Date().toISOString().split('T')[0]}.html`,
    totalItems: recipes.length,
  });
}

/**
 * Export recipes to PDF (via API)
 *
 * @param {Recipe[]} recipes - Recipes to export
 * @param {Map<string, RecipeIngredientWithDetails[]>} ingredientsMap - Map of recipe ID to ingredients
 */
export async function exportRecipesToPDF(
  recipes: Recipe[],
  ingredientsMap: Map<string, RecipeIngredientWithDetails[]>,
): Promise<void> {
  if (!recipes || recipes.length === 0) {
    return;
  }

  const content = recipes
    .map(recipe => {
      const ingredients = ingredientsMap.get(recipe.id) || [];
      return formatRecipeForExport(recipe, ingredients);
    })
    .join('');

  await exportPDFReport({
    title: 'Recipes',
    subtitle: 'Recipe Collection',
    content,
    filename: `recipes-${new Date().toISOString().split('T')[0]}.pdf`,
    totalItems: recipes.length,
  });
}
