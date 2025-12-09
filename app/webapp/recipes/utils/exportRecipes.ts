/**
 * Export utilities for recipes
 * Supports CSV, PDF, HTML export formats
 */

import { exportToCSV } from '@/lib/csv/csv-utils';
import { exportHTMLReport, exportPDFReport } from '@/lib/exports/export-html';
import type { Recipe, RecipeIngredientWithDetails } from '../types';

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
 * Format recipe for HTML/PDF export
 *
 * @param {Recipe} recipe - Recipe to format
 * @param {RecipeIngredientWithDetails[]} ingredients - Recipe ingredients
 * @returns {string} HTML content
 */
function formatRecipeForExport(recipe: Recipe, ingredients: RecipeIngredientWithDetails[]): string {
  return `
    <div style="margin-bottom: 32px; padding: 20px; background: rgba(42, 42, 42, 0.3); border-radius: 12px;">
      <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 12px;">
        ${recipe.recipe_name}
      </h3>
      ${recipe.description ? `<p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 12px;">${recipe.description}</p>` : ''}
      <div style="display: flex; gap: 16px; flex-wrap: wrap; font-size: 14px; color: rgba(255, 255, 255, 0.7);">
        <div><strong>Yield:</strong> ${recipe.yield} ${recipe.yield_unit}</div>
        ${recipe.category ? `<div><strong>Category:</strong> ${recipe.category}</div>` : ''}
        ${recipe.selling_price ? `<div><strong>Price:</strong> $${recipe.selling_price.toFixed(2)}</div>` : ''}
      </div>
      ${
        ingredients.length > 0
          ? `
        <div style="margin-top: 16px;">
          <h4 style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 8px;">Ingredients</h4>
          <ul style="list-style: none; padding: 0;">
            ${ingredients
              .map(
                ing => `
              <li style="padding: 4px 0; color: rgba(255, 255, 255, 0.8);">
                ${ing.quantity} ${ing.unit} ${ing.ingredients.ingredient_name}
              </li>
            `,
              )
              .join('')}
          </ul>
        </div>
      `
          : ''
      }
      ${
        recipe.instructions
          ? `
        <div style="margin-top: 16px;">
          <h4 style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 8px;">Instructions</h4>
          <div style="white-space: pre-wrap; color: rgba(255, 255, 255, 0.8);">${recipe.instructions}</div>
        </div>
      `
          : ''
      }
    </div>
  `;
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
