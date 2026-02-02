/**
 * Helper to paginate unified items.
 */

import type { UnifiedItem } from './combineItems';
import type { Dish, Recipe } from '@/lib/types/recipes';

/**
 * Paginate unified items and separate into dishes and recipes.
 */
export function paginateItems(
  allItems: UnifiedItem[],
  currentPage: number,
  itemsPerPage: number,
): {
  paginatedItems: UnifiedItem[];
  paginatedDishesList: (Dish & { itemType: 'dish' })[];
  paginatedRecipesList: (Recipe & { itemType: 'recipe' })[];
  totalPages: number;
} {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = allItems.slice(startIndex, endIndex);

  const paginatedDishesList = paginatedItems.filter(item => item.itemType === 'dish') as (Dish & {
    itemType: 'dish';
  })[];

  const paginatedRecipesList = paginatedItems.filter(
    item => item.itemType === 'recipe',
  ) as (Recipe & { itemType: 'recipe' })[];

  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  return {
    paginatedItems,
    paginatedDishesList,
    paginatedRecipesList,
    totalPages,
  };
}
