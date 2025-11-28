/**
 * Helper to sort and group cards for response.
 */

import type { GroupedSubRecipeCards, ItemOrder, RecipeCard, SubRecipeCard } from '../types';

/**
 * Sort main cards by category and position.
 */
export function sortMainCards(mainCards: (RecipeCard & { _order: ItemOrder })[]): RecipeCard[] {
  return mainCards
    .sort((a, b) => {
      const categoryCompare = a._order.category.localeCompare(b._order.category);
      if (categoryCompare !== 0) return categoryCompare;
      return a._order.position - b._order.position;
    })
    .map(({ _order, ...card }) => card); // Remove _order from final output
}

/**
 * Group sub-recipe cards by type.
 */
export function groupSubRecipeCards(subRecipeCards: SubRecipeCard[]): GroupedSubRecipeCards {
  const grouped: GroupedSubRecipeCards = {
    sauces: [],
    marinades: [],
    brines: [],
    slowCooked: [],
    other: [],
  };

  subRecipeCards.forEach(card => {
    const type = card.subRecipeType || 'other';
    if (type in grouped) {
      grouped[type as keyof GroupedSubRecipeCards].push(card);
    } else {
      grouped.other.push(card);
    }
  });

  return grouped;
}
