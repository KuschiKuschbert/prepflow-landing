/**
 * Helper functions for formatting order lists for print
 */

import type { OrderListIngredient } from './types';

/**
 * Format price in Australian currency
 *
 * @param {number} price - Price to format
 * @returns {string} Formatted price or '-'
 */
export function formatPrice(price?: number): string {
  if (price === undefined || price === null) return '-';
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(price);
}

/**
 * Format pack size with unit
 *
 * @param {string} packSize - Pack size
 * @param {string} packSizeUnit - Pack size unit
 * @returns {string} Formatted pack size
 */
export function formatPackSize(packSize?: string, packSizeUnit?: string): string {
  if (!packSize) return '-';
  const unit = packSizeUnit || '';
  return unit ? `${packSize} ${unit}` : packSize;
}

/**
 * Format par level with unit
 *
 * @param {number} parLevel - Par level
 * @param {string} unit - Unit
 * @returns {string} Formatted par level
 */
export function formatParLevel(parLevel?: number, unit?: string): string {
  if (parLevel === undefined || parLevel === null) return '-';
  return `${parLevel}${unit ? ` ${unit}` : ''}`;
}

/**
 * Calculate order totals
 *
 * @param {Record<string, OrderListIngredient[]>} groupedIngredients - Grouped ingredients
 * @returns {Object} Totals object with totalAmount and totalItems
 */
export function calculateOrderTotals(groupedIngredients: Record<string, OrderListIngredient[]>): {
  totalAmount: number;
  totalItems: number;
} {
  let totalAmount = 0;
  let totalItems = 0;
  Object.values(groupedIngredients).forEach(ingredients => {
    ingredients.forEach(ing => {
      if (ing.pack_price) {
        totalAmount += ing.pack_price;
      }
      totalItems += 1;
    });
  });
  return { totalAmount, totalItems };
}
