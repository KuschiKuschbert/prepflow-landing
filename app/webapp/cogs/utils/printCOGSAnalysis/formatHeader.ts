/**
 * Format header section for COGS analysis print
 */

import type { Recipe } from '../printCOGSAnalysis';

/**
 * Format recipe/dish header for print
 *
 * @param {Recipe | null} recipe - Recipe object or null
 * @param {number} dishPortions - Number of dish portions
 * @returns {string} HTML content for header
 */
export function formatCOGSHeader(recipe: Recipe | null, dishPortions: number): string {
  if (recipe) {
    return `
      <div style="margin-bottom: 32px; padding: 20px; background: rgba(42, 42, 42, 0.3); border-radius: 12px;">
        <h2 style="font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 8px;">
          ${recipe.recipe_name}
        </h2>
        <div style="font-size: 16px; color: rgba(255, 255, 255, 0.8);">
          Yield: ${recipe.yield} ${recipe.yield_unit}
        </div>
      </div>
    `;
  }

  return `
    <div style="margin-bottom: 32px; padding: 20px; background: rgba(42, 42, 42, 0.3); border-radius: 12px;">
      <h2 style="font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 8px;">
        Dish Cost Analysis
      </h2>
      <div style="font-size: 16px; color: rgba(255, 255, 255, 0.8);">
        Portions: ${dishPortions}
      </div>
    </div>
  `;
}
