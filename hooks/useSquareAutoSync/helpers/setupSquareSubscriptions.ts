import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface SetupSubscriptionsParams {
  debounceSync: (key: string, entityType: string, entityId: string, operation: string) => void;
  userId?: string;
}

/**
 * Set up Supabase real-time subscriptions for Square auto-sync
 */
export function setupSquareSubscriptions({
  debounceSync,
  userId,
}: SetupSubscriptionsParams): RealtimeChannel {
  logger.dev('[Square Auto-Sync Hook] Setting up subscriptions:', { userId });
  const channel = supabase
    .channel('square-auto-sync')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'employees' },
      payload => {
        const employeeId = (payload.new as { id?: string })?.id;
        if (employeeId) {
          logger.dev('[Square Auto-Sync Hook] Employee created:', { employeeId });
          debounceSync(`employee-${employeeId}`, 'employee', employeeId, 'create');
        }
      },
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'employees' },
      payload => {
        const employeeId = (payload.new as { id?: string })?.id;
        if (employeeId) {
          logger.dev('[Square Auto-Sync Hook] Employee updated:', { employeeId });
          debounceSync(`employee-${employeeId}`, 'employee', employeeId, 'update');
        }
      },
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'dishes' },
      payload => {
        const dishId = (payload.new as { id?: string })?.id;
        if (dishId) {
          logger.dev('[Square Auto-Sync Hook] Dish created:', { dishId });
          debounceSync(`dish-${dishId}`, 'dish', dishId, 'create');
        }
      },
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'dishes' },
      payload => {
        const dishId = (payload.new as { id?: string })?.id;
        if (dishId) {
          logger.dev('[Square Auto-Sync Hook] Dish updated:', { dishId });
          debounceSync(`dish-${dishId}`, 'dish', dishId, 'update');
        }
      },
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'recipes' },
      payload => {
        const recipeId = (payload.new as { id?: string })?.id;
        if (recipeId) {
          const oldCostFields = {
            yield: (payload.old as { yield?: number })?.yield,
            yield_unit: (payload.old as { yield_unit?: string })?.yield_unit,
          };
          const newCostFields = {
            yield: (payload.new as { yield?: number })?.yield,
            yield_unit: (payload.new as { yield_unit?: string })?.yield_unit,
          };
          if (
            oldCostFields.yield !== newCostFields.yield ||
            oldCostFields.yield_unit !== newCostFields.yield_unit
          ) {
            logger.dev('[Square Auto-Sync Hook] Recipe cost changed:', { recipeId });
            debounceSync(`recipe-cost-${recipeId}`, 'recipe', recipeId, 'update');
          }
        }
      },
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'ingredients',
        filter: 'cost_per_unit=neq.null',
      },
      payload => {
        const ingredientId = (payload.new as { id?: string })?.id;
        if (ingredientId) {
          const oldCost = (payload.old as { cost_per_unit?: number })?.cost_per_unit;
          const newCost = (payload.new as { cost_per_unit?: number })?.cost_per_unit;
          if (oldCost !== newCost) {
            logger.dev('[Square Auto-Sync Hook] Ingredient cost changed:', { ingredientId });
            debounceSync(`ingredient-cost-${ingredientId}`, 'ingredient', ingredientId, 'update');
          }
        }
      },
    )
    .subscribe();
  return channel;
}
