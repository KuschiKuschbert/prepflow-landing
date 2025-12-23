import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { NON_VEGETARIAN_KEYWORDS, NON_VEGAN_KEYWORDS } from '../constants';

/**
 * Check if an ingredient is non-vegetarian
 */
export function isNonVegetarianIngredient(ingredientName: string, category?: string): boolean {
  const lowerName = ingredientName.toLowerCase();
  const lowerCategory = category?.toLowerCase() || '';

  // Check against keywords
  return NON_VEGETARIAN_KEYWORDS.some(
    keyword =>
      lowerName.includes(keyword.toLowerCase()) || lowerCategory.includes(keyword.toLowerCase()),
  );
}

/**
 * Check if an ingredient is non-vegan
 * Uses allergens array if available (milk, eggs)
 * Handles allergen consolidation and case-insensitive checking
 */
export function isNonVeganIngredient(ingredientName: string, allergens?: string[]): boolean {
  const lowerName = ingredientName.toLowerCase();

  // Check allergens first (most reliable)
  if (allergens && Array.isArray(allergens)) {
    // Consolidate allergens to handle old codes (e.g., 'dairy' → 'milk')
    const consolidated = consolidateAllergens(allergens);

    // Check for milk or eggs (case-insensitive, but codes should be lowercase)
    const lowerAllergens = consolidated.map(a => a.toLowerCase());
    if (lowerAllergens.includes('milk') || lowerAllergens.includes('eggs')) {
      return true;
    }
  }

  // Check against keywords
  return NON_VEGAN_KEYWORDS.some(keyword => lowerName.includes(keyword.toLowerCase()));
}

