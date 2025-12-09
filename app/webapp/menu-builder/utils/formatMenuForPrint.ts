/**
 * Format menu for printing
 *
 * Generates HTML structure for printable menu with items, descriptions, prices, allergens, and allergen matrix
 */

import type { Menu, MenuItem } from '../types';
import { AUSTRALIAN_ALLERGENS, consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { getAllergenIconSVG } from './allergenIconUtils';

const VALID_ALLERGEN_CODES = AUSTRALIAN_ALLERGENS.map(a => a.code);

/**
 * Escape HTML special characters.
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML text
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Format menu for printing.
 *
 * Uses existing descriptions only - no AI generation (for instant printing).
 *
 * @param {Menu} menu - Menu object
 * @param {MenuItem[]} menuItems - Array of menu items (should include existing descriptions)
 * @returns {string} HTML string for printing
 */
export function formatMenuForPrint(
  menu: Menu,
  menuItems: MenuItem[],
  variant: 'default' | 'customer' = 'default',
): string {
  // Return content HTML only - template provides header, logo, background elements
  const variantClass = variant === 'customer' ? 'variant-customer' : '';
  let html = `<div class="menu-print ${variantClass}">`;

  // Group items by category
  const itemsByCategory = new Map<string, MenuItem[]>();
  menuItems.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!itemsByCategory.has(category)) {
      itemsByCategory.set(category, []);
    }
    itemsByCategory.get(category)!.push(item);
  });

  // Sort categories alphabetically
  const sortedCategories = Array.from(itemsByCategory.keys()).sort();

  // Format menu items by category
  sortedCategories.forEach(category => {
    const categoryItems = itemsByCategory.get(category)!;
    // Sort items by position
    categoryItems.sort((a, b) => a.position - b.position);

    html += `
      <div class="menu-category">
        <h2>${escapeHtml(category)}</h2>
    `;

    categoryItems.forEach(item => {
      const isDish = !!item.dish_id;
      const isRecipe = !!item.recipe_id;
      const itemName = isDish
        ? item.dishes?.dish_name || 'Unknown Dish'
        : item.recipes?.recipe_name || 'Unknown Recipe';

      // Get description - use existing description only (no AI generation for instant printing)
      const description = isDish ? item.dishes?.description : item.recipes?.description || '';

      // Get price
      const price =
        item.actual_selling_price ||
        (isDish ? item.dishes?.selling_price : item.recommended_selling_price) ||
        0;

      // Get allergens
      let allergens: string[] = [];
      if (item.allergens && Array.isArray(item.allergens)) {
        allergens = item.allergens;
      } else if (isDish && item.dishes?.allergens) {
        allergens = Array.isArray(item.dishes.allergens) ? item.dishes.allergens : [];
      } else if (isRecipe && item.recipes?.allergens) {
        allergens = Array.isArray(item.recipes.allergens) ? item.recipes.allergens : [];
      }

      // Consolidate and validate allergens
      allergens = consolidateAllergens(allergens).filter(code =>
        VALID_ALLERGEN_CODES.includes(code),
      );

      html += `
        <div class="menu-item">
          <div class="menu-item-header">
            <div class="menu-item-name">${escapeHtml(itemName)}</div>
            <div class="menu-item-price">$${price.toFixed(2)}</div>
          </div>
          ${description ? `<div class="menu-item-description">${escapeHtml(description)}</div>` : ''}
          ${
            allergens.length > 0
              ? `
            <div class="menu-item-allergens">
              ${allergens
                .map(
                  code =>
                    `<span class="allergen-icon" title="${AUSTRALIAN_ALLERGENS.find(a => a.code === code)?.displayName || code}">${getAllergenIconSVG(code)}</span>`,
                )
                .join('')}
            </div>
          `
              : ''
          }
        </div>
      `;
    });

    html += `</div>`;
  });

  // Allergen Matrix Page
  html += `
    <div class="allergen-matrix-page">
      <div class="allergen-matrix-header">
        <h2>Allergen Matrix</h2>
        <p>This matrix shows which allergens are present in each menu item.</p>
      </div>
      <table class="allergen-matrix-table">
        <thead>
          <tr>
            <th class="item-name">Item Name</th>
            ${AUSTRALIAN_ALLERGENS.map(
              allergen =>
                `<th title="${allergen.description}">${getAllergenIconSVG(allergen.code)}<br/>${escapeHtml(allergen.displayName)}</th>`,
            ).join('')}
            <th>Dietary</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Process items for allergen matrix
  if (menuItems.length === 0) {
    html += `
      <tr>
        <td colspan="${AUSTRALIAN_ALLERGENS.length + 2}" style="text-align: center; padding: 2rem; color: #666;">
          No items in this menu
        </td>
      </tr>
    `;
  } else {
    const matrixItems = menuItems.map(item => {
      const isDish = !!item.dish_id;
      const isRecipe = !!item.recipe_id;
      const itemName = isDish
        ? item.dishes?.dish_name || 'Unknown Dish'
        : item.recipes?.recipe_name || 'Unknown Recipe';

      let allergens: string[] = [];
      if (item.allergens && Array.isArray(item.allergens)) {
        allergens = item.allergens;
      } else if (isDish && item.dishes?.allergens) {
        allergens = Array.isArray(item.dishes.allergens) ? item.dishes.allergens : [];
      } else if (isRecipe && item.recipes?.allergens) {
        allergens = Array.isArray(item.recipes.allergens) ? item.recipes.allergens : [];
      }

      allergens = consolidateAllergens(allergens).filter(code =>
        VALID_ALLERGEN_CODES.includes(code),
      );

      const isVegetarian =
        item.is_vegetarian ?? (isDish ? item.dishes?.is_vegetarian : item.recipes?.is_vegetarian);
      const isVegan = item.is_vegan ?? (isDish ? item.dishes?.is_vegan : item.recipes?.is_vegan);

      return {
        name: itemName,
        allergens,
        isVegetarian: !!isVegetarian,
        isVegan: !!isVegan,
      };
    });

    // Sort matrix items by name
    matrixItems.sort((a, b) => a.name.localeCompare(b.name));

    matrixItems.forEach(item => {
      const dietaryInfo: string[] = [];
      if (item.isVegan) dietaryInfo.push('Vegan');
      else if (item.isVegetarian) dietaryInfo.push('Vegetarian');

      html += `
        <tr>
          <td class="item-name">${escapeHtml(item.name)}</td>
          ${AUSTRALIAN_ALLERGENS.map(allergen => {
            const containsAllergen = item.allergens.includes(allergen.code);
            return `<td class="${containsAllergen ? 'allergen-present' : 'allergen-absent'}">${containsAllergen ? '●' : '○'}</td>`;
          }).join('')}
          <td>${dietaryInfo.length > 0 ? escapeHtml(dietaryInfo.join(', ')) : '-'}</td>
        </tr>
      `;
    });
  }

  html += `
        </tbody>
      </table>
    </div>
  </div>
  `;

  return html;
}
