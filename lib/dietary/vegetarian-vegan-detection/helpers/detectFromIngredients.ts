import { logger } from '@/lib/logger';
import { isNonVegetarianIngredient, isNonVeganIngredient } from './checkIngredients';

export interface Ingredient {
  ingredient_name: string;
  category?: string;
  allergens?: string[];
}

export interface DietaryDetectionResult {
  isVegetarian: boolean;
  isVegan: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason?: string;
  method: 'non-ai' | 'ai';
}

/**
 * Detect vegetarian/vegan suitability from ingredients (non-AI approach)
 * Also checks recipe/dish name for meat/fish keywords
 */
export function detectVegetarianVeganFromIngredients(
  ingredients: Ingredient[],
  recipeOrDishName?: string,
): DietaryDetectionResult {
  let hasNonVegetarian = false;
  let hasNonVegan = false;
  const reasons: string[] = [];

  // First, check the recipe/dish name for non-vegetarian keywords
  // This catches cases where ingredients might not have clear meat names
  if (recipeOrDishName) {
    const nameIsNonVeg = isNonVegetarianIngredient(recipeOrDishName);
    if (nameIsNonVeg) {
      hasNonVegetarian = true;
      reasons.push(`Recipe/dish name "${recipeOrDishName}" contains meat/fish keywords`);
    }
  }

  if (!ingredients || ingredients.length === 0) {
    // No ingredients - return based on name check or default to vegetarian/vegan
    return {
      isVegetarian: !hasNonVegetarian,
      isVegan: !hasNonVegan && !hasNonVegetarian,
      confidence: hasNonVegetarian ? 'high' : 'medium',
      reason: hasNonVegetarian ? reasons.join('; ') : 'No ingredients specified',
      method: 'non-ai',
    };
  }

  // Check ingredients for non-vegetarian/vegan items
  ingredients.forEach(ingredient => {
    const name = ingredient.ingredient_name || '';
    const category = ingredient.category || '';
    const allergens = ingredient.allergens || [];

    // Check for non-vegetarian ingredients
    const isNonVeg = isNonVegetarianIngredient(name, category);
    if (isNonVeg) {
      hasNonVegetarian = true;
      reasons.push(`${name} contains meat/fish`);
    }

    // Check for non-vegan ingredients
    const isNonVeganIng = isNonVeganIngredient(name, allergens);
    if (isNonVeganIng) {
      hasNonVegan = true;
      if (!hasNonVegetarian) {
        // Only add reason if it's not already non-vegetarian
        reasons.push(`${name} contains animal products`);
      }
    }
  });

  const isVegetarian = !hasNonVegetarian;
  const isVegan = !hasNonVegan && isVegetarian;

  // Log detection results for debugging
  logger.dev('[Dietary Detection] Detection result:', {
    recipeOrDishName,
    ingredientCount: ingredients.length,
    ingredientNames: ingredients.map(i => i.ingredient_name),
    hasNonVegetarian,
    hasNonVegan,
    isVegetarian,
    isVegan,
    reasons,
  });

  // Determine confidence based on ingredient clarity
  let confidence: 'high' | 'medium' | 'low' = 'high';
  if (reasons.length === 0 && ingredients.length > 0) {
    // No clear non-vegetarian/vegan ingredients found, but ingredients exist
    // Could be ambiguous ingredients
    confidence = 'medium';
  }

  return {
    isVegetarian,
    isVegan,
    confidence,
    reason: reasons.length > 0 ? reasons.join('; ') : undefined,
    method: 'non-ai',
  };
}

