import { escapeHtml } from '@/lib/exports/template-utils';
import type { Recipe, RecipeIngredientWithDetails } from '../../types';

interface RecipePrintData {
  recipe: Recipe;
  ingredients: RecipeIngredientWithDetails[];
  costBreakdown?: {
    totalCost: number;
    costPerUnit: number;
    sellingPrice?: number;
    grossProfit?: number;
    grossProfitPercent?: number;
  };
}

/**
 * Build ingredients table HTML
 */
function buildIngredientsTable(data: RecipePrintData): string {
  const { ingredients, costBreakdown } = data;
  let html = `
    <div class="recipe-section">
      <h2 class="recipe-section-title">Ingredients</h2>
      <table class="recipe-ingredients-table">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th class="text-right">Quantity</th>
            ${costBreakdown ? '<th class="text-right">Cost</th>' : ''}
          </tr>
        </thead>
        <tbody>
  `;

  ingredients.forEach(ing => {
    const ingredientName = ing.ingredients?.ingredient_name || 'Unknown';
    const quantity = ing.quantity || 0;
    const unit = ing.unit || '';
    const notes = ing.notes ? ` (${escapeHtml(ing.notes)})` : '';

    html += `
      <tr>
        <td>${escapeHtml(ingredientName)}${notes}</td>
        <td class="text-right">${escapeHtml(String(quantity))} ${escapeHtml(unit)}</td>
        ${
          costBreakdown
            ? `
          <td class="text-right">
            $${((quantity * (ing.ingredients?.cost_per_unit || 0)) / (ing.ingredients?.cost_per_unit_incl_trim || ing.ingredients?.cost_per_unit || 1)).toFixed(2)}
          </td>
        `
            : ''
        }
      </tr>
    `;
  });

  html += `
        </tbody>
  `;

  if (costBreakdown) {
    html += `<tfoot><tr class="recipe-total-row"><td colspan="2"><strong>Total Cost:</strong></td><td class="text-right"><strong>$${costBreakdown.totalCost.toFixed(2)}</strong></td></tr>`;
    if (costBreakdown.sellingPrice) {
      html += `<tr><td colspan="2">Selling Price:</td><td class="text-right">$${costBreakdown.sellingPrice.toFixed(2)}</td></tr>`;
      if (costBreakdown.grossProfit !== undefined) {
        html += `<tr><td colspan="2">Gross Profit:</td><td class="text-right recipe-profit ${costBreakdown.grossProfit >= 0 ? 'profit-positive' : 'profit-negative'}">$${costBreakdown.grossProfit.toFixed(2)} ${costBreakdown.grossProfitPercent !== undefined ? `(${costBreakdown.grossProfitPercent.toFixed(1)}%)` : ''}</td></tr>`;
      }
    }
    html += `</tfoot>`;
  }

  html += `
      </table>
    </div>
  `;

  return html;
}

/**
 * Build recipe header HTML
 */
function buildRecipeHeader(recipe: Recipe): string {
  return `
    <div class="recipe-header">
      <h1 class="recipe-title">${escapeHtml(recipe.recipe_name)}</h1>
      ${recipe.description ? `<p class="recipe-description">${escapeHtml(recipe.description)}</p>` : ''}
      <div class="recipe-meta">
        <div><strong>Yield:</strong> ${escapeHtml(String(recipe.yield))} ${escapeHtml(recipe.yield_unit || '')}</div>
        ${recipe.category ? `<div><strong>Category:</strong> ${escapeHtml(recipe.category)}</div>` : ''}
        ${recipe.allergens && recipe.allergens.length > 0 ? `<div><strong>Allergens:</strong> ${escapeHtml(recipe.allergens.join(', '))}</div>` : ''}
        ${recipe.is_vegetarian ? '<div><strong>Vegetarian</strong></div>' : ''}
        ${recipe.is_vegan ? '<div><strong>Vegan</strong></div>' : ''}
      </div>
    </div>
  `;
}

/**
 * Build recipe print HTML content
 */
export function buildRecipePrintHTML(data: RecipePrintData): string {
  const { recipe } = data;
  let html = '<div class="recipe-print-content">';
  html += buildRecipeHeader(recipe);
  html += buildIngredientsTable(data);
  if (recipe.instructions) {
    html += `
      <div class="recipe-section">
        <h2 class="recipe-section-title">Instructions</h2>
        <div class="recipe-instructions">
          ${escapeHtml(recipe.instructions).replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
  }
  if (recipe.notes) {
    html += `
      <div class="recipe-section">
        <h2 class="recipe-section-title">Notes</h2>
        <div class="recipe-notes">
          ${escapeHtml(recipe.notes).replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
  }
  html += '</div>';
  return html;
}
