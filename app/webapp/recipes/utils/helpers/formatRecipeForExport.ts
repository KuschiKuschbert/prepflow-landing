import type { Recipe, RecipeIngredientWithDetails } from '../../types';

/**
 * Format recipe for HTML/PDF export
 *
 * @param {Recipe} recipe - Recipe to format
 * @param {RecipeIngredientWithDetails[]} ingredients - Recipe ingredients
 * @returns {string} HTML content
 */
export function formatRecipeForExport(
  recipe: Recipe,
  ingredients: RecipeIngredientWithDetails[],
): string {
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

