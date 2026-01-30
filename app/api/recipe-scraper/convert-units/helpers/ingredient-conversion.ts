/**
 * Recipe ingredient conversion helpers
 */

import { normalizeIngredient } from '../../../../../scripts/recipe-scraper/parsers/schema-validator';
import { RecipeIngredient } from '../../../../../scripts/recipe-scraper/parsers/types';
import { convertToAustralianUnit } from './unit-conversion';

interface ConversionResult {
  ingredients: RecipeIngredient[];
  convertedCount: number;
}

/**
 * Convert recipe ingredients to Australian units
 * Parses original_text if quantity/unit are missing, then converts
 */
export function convertRecipeIngredients(ingredients: RecipeIngredient[]): ConversionResult {
  let convertedCount = 0;

  const converted = ingredients.map(ing => {
    // If ingredient already has quantity and unit, use them
    let quantity = ing.quantity;
    let unit = ing.unit;
    let parsedName = ing.name;

    // If missing quantity or unit, try to parse from original_text
    if ((!quantity || !unit) && ing.original_text) {
      const parsed = parseIngredientQuantity(ing.original_text);
      if (parsed) {
        quantity = parsed.quantity;
        unit = parsed.unit;
        parsedName = parsed.name || ing.name;
      } else {
        // Can't parse - skip this ingredient
        return ing;
      }
    }

    // If still no quantity or unit, skip
    if (!quantity || !unit) {
      return ing;
    }

    // Convert to Australian units
    const result = convertToAustralianUnit(quantity, unit);
    if (result.converted) {
      convertedCount++;
      // Update original_text with converted values
      const newOriginalText = `${result.quantity} ${result.unit} ${parsedName}`.trim();
      return {
        ...ing,
        quantity: result.quantity,
        unit: result.unit,
        name: parsedName || ing.name,
        original_text: newOriginalText || ing.original_text,
      };
    }

    // No conversion needed, but ensure quantity/unit are set
    return {
      ...ing,
      quantity: quantity,
      unit: unit,
    };
  });

  return { ingredients: converted, convertedCount };
}

function parseIngredientQuantity(
  originalText: string,
): { quantity: number; unit: string; name: string } | null {
  const parsed = normalizeIngredient(originalText);
  if (parsed.quantity && parsed.unit) {
    return {
      quantity: parsed.quantity,
      unit: parsed.unit,
      name: parsed.name || '',
    };
  }

  // Try alternative parsing: look for common patterns like "2 cups", "1/2 cup", etc.
  const text = originalText.toLowerCase();
  const fractionMatch = text.match(
    /^(\d+\/\d+|\d+\.\d+|\d+)\s*(cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons|oz|ounce|ounces|lb|pound|pounds|g|gram|grams|kg|kilogram|kilograms|ml|milliliter|milliliters|l|liter|liters|litre|litres)\s*(.+)$/i,
  );

  if (fractionMatch) {
    const qtyStr = fractionMatch[1];
    let quantity: number;
    // Parse fraction
    if (qtyStr.includes('/')) {
      const [num, den] = qtyStr.split('/').map(Number);
      quantity = num / den;
    } else {
      quantity = parseFloat(qtyStr);
    }
    const unit = fractionMatch[2].toLowerCase();
    const parsedName = fractionMatch[3].trim();
    return { quantity, unit, name: parsedName };
  }

  return null;
}
