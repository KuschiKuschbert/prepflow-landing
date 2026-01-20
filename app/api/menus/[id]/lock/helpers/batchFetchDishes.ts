/**
 * Batch Fetch Dishes Helper
 * Fetches dishes with nested ingredients and sub-recipes
 */

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { DishResult, mapDishToMenuItemData } from './mappers';
import { MenuItemData } from './types';

/**
 * Batch fetch all dishes with nested ingredients and sub-recipes
 */
export async function batchFetchDishes(
  supabase: SupabaseClient,
  dishIds: string[],
): Promise<Map<string, MenuItemData>> {
  if (dishIds.length === 0) {
    return new Map();
  }

  const { data: dishesData, error } = await supabase
    .from('dishes')
    .select(
      `
      id,
      dish_name,
      description,
      dish_ingredients (
        quantity,
        unit,
        ingredients (
          ingredient_name
        )
      ),
      dish_recipes (
        quantity,
        recipes (
          id,
          name,
          description,
          yield,
          yield_unit,
          instructions,
          recipe_ingredients (
            quantity,
            unit,
            ingredients (
              ingredient_name
            )
          )
        )
      )
    `,
    )
    .in('id', dishIds);

  if (error) {
    logger.error('Failed to batch fetch dishes:', error);
    return new Map();
  }

  const dishes = dishesData as unknown as DishResult[];
  const dishMap = new Map<string, MenuItemData>();

  for (const dish of dishes || []) {
    dishMap.set(dish.id, mapDishToMenuItemData(dish));
  }

  logger.dev(`Batch fetched ${dishMap.size} dishes`);
  return dishMap;
}
