/**
 * Pattern matching functions for dish ingredient detection.
 * Main orchestrator file that exports all pattern matchers.
 */

export { createIngredientFinder } from './ingredient-finder';
export { matchBurgerPattern } from './patterns/burger';
export { matchSaladPattern } from './patterns/salad';
export { matchPastaPattern } from './patterns/pasta';
export { matchChickenPattern } from './patterns/chicken';
export { matchFishPattern } from './patterns/fish';
export { matchSoupPattern } from './patterns/soup';
export { matchPizzaPattern } from './patterns/pizza';
export { matchDefaultPattern } from './patterns/default';
export { matchCommonIngredients } from './patterns/common';
