/**
 * Generate allergen matrix HTML for menu print.
 */
import { AUSTRALIAN_ALLERGENS, consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { getAllergenIconSVG } from '../../allergenIconUtils';
import { escapeHtml } from './escapeHtml';
import type { MenuItem } from '../../../types';

const VALID_ALLERGEN_CODES = AUSTRALIAN_ALLERGENS.map(a => a.code);

export function generateAllergenMatrix(menuItems: MenuItem[]): string {
  let html = `
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
      allergens = consolidateAllergens(allergens).filter(code => VALID_ALLERGEN_CODES.includes(code));
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
  html += `</tbody></table></div>`;
  return html;
}
