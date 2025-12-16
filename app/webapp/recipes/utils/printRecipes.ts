/**
 * Print utility for recipes list
 * Uses unified print template with Cyber Carrot branding
 */

import { printWithTemplate } from '@/lib/exports/print-template';
import type { Recipe, RecipeIngredientWithDetails } from '../types';

/**
 * Format recipe for print display
 *
 * @param {Recipe} recipe - Recipe to format
 * @param {RecipeIngredientWithDetails[]} ingredients - Recipe ingredients
 * @returns {string} HTML content
 */
function formatRecipeForPrint(recipe: Recipe, ingredients: RecipeIngredientWithDetails[]): string {
  return `
    <div style="margin-bottom: 32px; padding: 20px; background: rgba(42, 42, 42, 0.3); border-radius: 12px; border: 1px solid rgba(41, 231, 205, 0.2);">
      <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 12px; border-bottom: 2px solid rgba(41, 231, 205, 0.3); padding-bottom: 8px;">
        ${recipe.recipe_name}
      </h3>
      ${recipe.description ? `<p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 12px;">${recipe.description}</p>` : ''}
      <div style="display: flex; gap: 16px; flex-wrap: wrap; font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 12px;">
        <div><strong>Yield:</strong> ${recipe.yield} ${recipe.yield_unit}</div>
        ${recipe.category ? `<div><strong>Category:</strong> ${recipe.category}</div>` : ''}
        ${recipe.selling_price ? `<div><strong>Price:</strong> $${recipe.selling_price.toFixed(2)}</div>` : ''}
        ${recipe.is_vegetarian ? `<div><strong>Vegetarian:</strong> Yes</div>` : ''}
        ${recipe.is_vegan ? `<div><strong>Vegan:</strong> Yes</div>` : ''}
      </div>
      ${
        recipe.allergens && recipe.allergens.length > 0
          ? `
        <div style="margin-bottom: 12px;">
          <strong style="color: rgba(255, 255, 255, 0.9);">Allergens:</strong>
          <span style="color: rgba(255, 255, 255, 0.7);"> ${recipe.allergens.join(', ')}</span>
        </div>
      `
          : ''
      }
      ${
        ingredients.length > 0
          ? `
        <div style="margin-top: 16px;">
          <h4 style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 8px; border-bottom: 1px solid rgba(41, 231, 205, 0.2); padding-bottom: 4px;">Ingredients</h4>
          <ul style="list-style: none; padding: 0;">
            ${ingredients
              .map(
                ing => `
              <li style="padding: 4px 0; color: rgba(255, 255, 255, 0.8); border-left: 3px solid rgba(41, 231, 205, 0.3); padding-left: 12px; margin-bottom: 4px;">
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
          <h4 style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 8px; border-bottom: 1px solid rgba(41, 231, 205, 0.2); padding-bottom: 4px;">Instructions</h4>
          <div style="white-space: pre-wrap; color: rgba(255, 255, 255, 0.8); line-height: 1.6;">${recipe.instructions}</div>
        </div>
      `
          : ''
      }
    </div>
  `;
}

export interface PrintRecipesOptions {
  recipes: Recipe[];
  ingredientsMap: Map<string, RecipeIngredientWithDetails[]>;
  title?: string;
  subtitle?: string;
}

/**
 * Print recipes list
 * Opens print dialog with formatted recipes
 *
 * @param {PrintRecipesOptions} options - Print options
 */
export function printRecipes({
  recipes,
  ingredientsMap,
  title = 'Recipes',
  subtitle = 'Recipe Collection',
}: PrintRecipesOptions): void {
  if (!recipes || recipes.length === 0) {
    return;
  }

  const content = recipes
    .map(recipe => {
      const ingredients = ingredientsMap.get(recipe.id) || [];
      return formatRecipeForPrint(recipe, ingredients);
    })
    .join('');

  printWithTemplate({
    title,
    subtitle,
    content,
    totalItems: recipes.length,
    customMeta: `Generated: ${new Date().toLocaleDateString('en-AU')}`,
  });
}



