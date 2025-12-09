/**
 * Formatting utilities for recipe card scaling
 */

import { convertToLargerUnit } from './unitConversion';

/**
 * Format scaled quantity for display
 *
 * @param {number} quantity - Scaled quantity
 * @param {string} unit - Unit of measurement
 * @returns {string} Formatted string
 */
export function formatScaledQuantity(quantity: number, unit: string): string {
  // Ensure we're working with a number
  const num = typeof quantity === 'number' ? quantity : parseFloat(String(quantity));

  // Convert to larger unit if appropriate (e.g., 1000 GM → 1 KG)
  const converted = convertToLargerUnit(num, unit);
  const displayQuantity = converted.quantity;
  const displayUnit = converted.unit;

  // Check if it's effectively a whole number (within floating point precision)
  const isWholeNumber = Math.abs(displayQuantity - Math.round(displayQuantity)) < 0.0001;

  if (isWholeNumber) {
    // For whole numbers, display directly without any decimal formatting
    const wholeNum = Math.round(displayQuantity);
    return `${wholeNum} ${displayUnit}`;
  }

  // For decimal numbers, round to reasonable precision based on quantity
  let rounded: number;
  if (displayQuantity < 1) {
    rounded = Math.round(displayQuantity * 1000) / 1000; // 3 decimal places for small quantities
  } else if (displayQuantity < 10) {
    rounded = Math.round(displayQuantity * 100) / 100; // 2 decimal places
  } else {
    rounded = Math.round(displayQuantity * 10) / 10; // 1 decimal place for larger quantities
  }

  // Remove trailing zeros from decimal portion only
  const formatted = rounded.toString().replace(/\.?0+$/, '');

  return `${formatted} ${displayUnit}`;
}

/**
 * Format yield for display
 *
 * @param {number} yieldNum - Yield number
 * @param {string} unit - Yield unit (e.g., 'servings', 'portions')
 * @returns {string} Formatted string
 */
export function formatYield(yieldNum: number, unit: string = 'servings'): string {
  if (yieldNum === 1) {
    return `1 ${unit.slice(0, -1)}`; // Remove 's' for singular
  }
  return `${yieldNum} ${unit}`;
}
