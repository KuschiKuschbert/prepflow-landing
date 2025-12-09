/**
 * Default variant formatting for order lists
 */

import { escapeHtml } from '@/lib/exports/template-utils';
import type { OrderListData } from './types';
import { formatPackSize, formatPrice, formatParLevel } from './helpers';

/**
 * Format order list as standard order list (default variant)
 *
 * @param {OrderListData} data - Order list data
 * @returns {string} HTML content for order list
 */
export function formatDefaultOrderList(data: OrderListData): string {
  const { groupedIngredients } = data;
  const groupKeys = Object.keys(groupedIngredients).sort();

  if (groupKeys.length === 0) {
    return `
      <div class="order-list-empty">
        <p>No ingredients found for this menu.</p>
      </div>
    `;
  }

  let html = '<div class="order-list-content">';

  groupKeys.forEach(groupKey => {
    const ingredients = groupedIngredients[groupKey];

    html += `
      <div class="order-list-group">
        <h3 class="order-list-group-header">${escapeHtml(groupKey)}</h3>
        <table class="order-list-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Brand</th>
              <th>Pack Size</th>
              <th>Price Per Pack</th>
              <th>Par Level</th>
            </tr>
          </thead>
          <tbody>
    `;

    ingredients.forEach(ingredient => {
      html += `
            <tr>
              <td class="ingredient-name">${escapeHtml(ingredient.ingredient_name)}</td>
              <td>${escapeHtml(ingredient.brand || '-')}</td>
              <td>${escapeHtml(formatPackSize(ingredient.pack_size, ingredient.pack_size_unit))}</td>
              <td>${formatPrice(ingredient.pack_price)}</td>
              <td>${escapeHtml(formatParLevel(ingredient.par_level, ingredient.par_unit))}</td>
            </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;
  });

  html += '</div>';

  return html;
}
