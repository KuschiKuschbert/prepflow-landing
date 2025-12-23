/**
 * Rule-based ingredient category detection.
 * Uses keyword matching to quickly categorize ingredients without AI.
 */

import { CATEGORY_KEYWORDS } from './category-detection/constants';

/**
 * Standard food-based ingredient categories.
 */
export const STANDARD_CATEGORIES = [
  'Dairy',
  'Meat',
  'Poultry',
  'Fish',
  'Fruits',
  'Vegetables',
  'Fruit & Veg',
  'Grains',
  'Legumes',
  'Nuts & Seeds',
  'Herbs & Spices',
  'Oils & Fats',
  'Condiments & Sauces',
  'Beverages',
  'Frozen',
  'Consumables',
  'Other',
] as const;

export type IngredientCategory = (typeof STANDARD_CATEGORIES)[number];

/**
 * Detect ingredient category from name using rule-based keyword matching.
 *
 * @param {string} ingredientName - Ingredient name
 * @param {string} [brand] - Optional brand name
 * @returns {IngredientCategory | null} Detected category or null if no match
 */
export function detectCategoryFromName(
  ingredientName: string,
  brand?: string,
): IngredientCategory | null {
  const searchText = `${ingredientName} ${brand || ''}`.toLowerCase();

  // Check each category (order matters - more specific first)
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      return category as IngredientCategory;
    }
  }

  return null; // No match found
}

/**
 * Unified category detection that combines rule-based and AI approaches.
 * Tries rule-based first (fast, free), then falls back to AI if enabled.
 *
 * @param {string} ingredientName - Ingredient name
 * @param {string} [brand] - Optional brand name
 * @param {string} [storageLocation] - Optional storage location
 * @param {boolean} [useAI=true] - Whether to use AI fallback
 * @returns {Promise<{ category: IngredientCategory | null; method: 'rule' | 'ai' | 'none' }>} Detection result
 */
export async function autoDetectCategory(
  ingredientName: string,
  brand?: string,
  storageLocation?: string,
  useAI: boolean = true,
): Promise<{ category: IngredientCategory | null; method: 'rule' | 'ai' | 'none' }> {
  // Try rule-based first (fast, free)
  const ruleBasedCategory = detectCategoryFromName(ingredientName, brand);
  if (ruleBasedCategory) {
    return { category: ruleBasedCategory, method: 'rule' };
  }

  // Fallback to AI if enabled
  if (useAI) {
    const { detectCategoryWithAI } = await import('./ai-category-detection');
    const aiResult = await detectCategoryWithAI(ingredientName, brand, storageLocation);
    if (aiResult.category && aiResult.category !== 'Other') {
      return { category: aiResult.category, method: 'ai' };
    }
  }

  return { category: null, method: 'none' };
}
