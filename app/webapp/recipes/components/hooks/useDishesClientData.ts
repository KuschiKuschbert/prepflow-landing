import { useCallback, useEffect, useState } from 'react';
import { Dish, DishCostData, Recipe } from '../../types';

import { logger } from '@/lib/logger';
export function useDishesClientData() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dishCosts, setDishCosts] = useState<Map<string, DishCostData>>(new Map());

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dishesResponse, recipesResponse] = await Promise.all([
        fetch('/api/dishes', { cache: 'no-store' }),
        fetch('/api/recipes', { cache: 'no-store' }),
      ]);

      const dishesResult = await dishesResponse.json();
      const recipesResult = await recipesResponse.json();

      if (!dishesResponse.ok) {
        setError(dishesResult.error || 'Failed to fetch dishes');
        setLoading(false);
        return;
      }

      if (!recipesResponse.ok) {
        setError(recipesResult.error || 'Failed to fetch recipes');
        setLoading(false);
        return;
      }

      const dishesList = dishesResult.dishes || [];
      const recipesList = recipesResult.recipes || [];

      setDishes(dishesList);
      setRecipes(recipesList);
      setLoading(false);

      // Fetch costs for all dishes using batch endpoint
      if (dishesList.length > 0) {
        try {
          const dishIds = dishesList.map((dish: Dish) => dish.id);
          const batchResponse = await fetch('/api/dishes/cost/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dishIds }),
          });

          const batchResult = await batchResponse.json();
          if (batchResult.success && batchResult.costs) {
            const costMap = new Map<string, DishCostData>();
            Object.entries(batchResult.costs).forEach(([dishId, cost]) => {
              costMap.set(dishId, cost as DishCostData);
            });
            setDishCosts(costMap);
          } else {
            logger.error('Failed to fetch batch dish costs:', batchResult.error);
          }
        } catch (err) {
          logger.error('Failed to fetch batch dish costs:', err);
          // Fallback: set empty map if batch fails
          setDishCosts(new Map());
        }
      } else {
        setDishCosts(new Map());
      }

      // Note: Recipe price calculation is handled by useDishesClientRecipePricing
      // based on visible/paginated recipes, not here
    } catch (err) {
      logger.error('[useDishesClientData.ts] Error in catch block:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });

      setError('Failed to fetch items');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    dishes,
    recipes,
    loading,
    error,
    dishCosts,
    setDishes,
    setRecipes,
    setError,
    fetchItems,
  };
}
