/**
 * Format a single menu item for print.
 */
import { AUSTRALIAN_ALLERGENS, consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { getAllergenIconSVG } from '../../allergenIconUtils';
import { escapeHtml } from './escapeHtml';
import type { MenuItem } from '../../../types';

const VALID_ALLERGEN_CODES = AUSTRALIAN_ALLERGENS.map(a => a.code);

export function formatMenuItem(item: MenuItem): string {
  const isDish = !!item.dish_id;
  const isRecipe = !!item.recipe_id;
  const itemName = isDish
    ? item.dishes?.dish_name || 'Unknown Dish'
    : item.recipes?.recipe_name || 'Unknown Recipe';
  const description = isDish ? item.dishes?.description : item.recipes?.description || '';
  const price =
    item.actual_selling_price ||
    (isDish ? item.dishes?.selling_price : item.recommended_selling_price) ||
    0;
  let allergens: string[] = [];
  if (item.allergens && Array.isArray(item.allergens)) {
    allergens = item.allergens;
  } else if (isDish && item.dishes?.allergens) {
    allergens = Array.isArray(item.dishes.allergens) ? item.dishes.allergens : [];
  } else if (isRecipe && item.recipes?.allergens) {
    allergens = Array.isArray(item.recipes.allergens) ? item.recipes.allergens : [];
  }
  allergens = consolidateAllergens(allergens).filter(code => VALID_ALLERGEN_CODES.includes(code));
  return `
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
}
