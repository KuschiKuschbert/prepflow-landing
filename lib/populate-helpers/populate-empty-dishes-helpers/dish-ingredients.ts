/**
 * Get default ingredients for dishes based on name patterns.
 */

import type { IngredientMatch } from './types';
import { createIngredientFinder } from './ingredient-finder';
import { matchBurgerPattern } from './patterns/burger';
import { matchChickenPattern } from './patterns/chicken';
import { matchCommonIngredients } from './patterns/common';
import { matchDefaultPattern } from './patterns/default';
import { matchFishPattern } from './patterns/fish';
import { matchPastaPattern } from './patterns/pasta';
import { matchPizzaPattern } from './patterns/pizza';
import { matchSaladPattern } from './patterns/salad';
import { matchSoupPattern } from './patterns/soup';

/**
 * Get default ingredients for a dish based on name patterns
 */
export function getDefaultIngredientsForDish(
  dishName: string,
  availableIngredients: Array<{ id: string; ingredient_name: string; unit: string }>,
): IngredientMatch[] {
  const dishNameLower = dishName.toLowerCase();
  const findIngredient = createIngredientFinder(availableIngredients);
  let matches: IngredientMatch[] = [];

  // Match patterns based on dish name
  if (dishNameLower.includes('burger')) {
    matches = matchBurgerPattern(findIngredient);
  } else if (dishNameLower.includes('salad')) {
    matches = matchSaladPattern(findIngredient);
  } else if (dishNameLower.includes('pasta')) {
    matches = matchPastaPattern(findIngredient);
  } else if (dishNameLower.includes('chicken')) {
    matches = matchChickenPattern(findIngredient);
  } else if (dishNameLower.includes('fish')) {
    matches = matchFishPattern(findIngredient);
  } else if (dishNameLower.includes('soup')) {
    matches = matchSoupPattern(findIngredient);
  } else if (dishNameLower.includes('pizza')) {
    matches = matchPizzaPattern(findIngredient);
  } else {
    matches = matchDefaultPattern(findIngredient);
  }

  // If no matches found, try to add at least 3 common ingredients
  if (matches.length === 0) {
    matches = matchCommonIngredients(findIngredient);
  }

  return matches;
}
