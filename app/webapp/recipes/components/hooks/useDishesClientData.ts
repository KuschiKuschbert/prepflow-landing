import { Dish, DishCostData, Recipe } from '@/lib/types/recipes';
import { useCallback } from 'react';

import { logger } from '@/lib/logger';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface UseDishesClientDataProps {
  initialDishes?: Dish[];
  initialRecipes?: Recipe[];
}

export function useDishesClientData({
  initialDishes = [],
  initialRecipes = [],
}: UseDishesClientDataProps = {}) {
  // Query 1: Fetch Dishes via lightweight catalog (id, dish_name, category, selling_price, cost_price)
  const {
    data: dishes = [],
    isLoading: dishesLoading,
    error: dishesError,
    refetch: refetchDishes,
  } = useQuery({
    queryKey: ['dishes', 'catalog'],
    queryFn: async () => {
      const res = await fetch('/api/dishes/catalog', { cache: 'no-store' });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to fetch dishes');
      }
      const result = await res.json();
      return (result.dishes as Dish[]) || [];
    },
    initialData: initialDishes.length > 0 ? initialDishes : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Query 2: Fetch Recipes via lightweight catalog (id, recipe_name, category, selling_price, yield, yield_unit)
  const {
    data: recipes = [],
    isLoading: recipesLoading,
    error: recipesError,
    refetch: refetchRecipes,
  } = useQuery({
    queryKey: ['recipes', 'catalog'],
    queryFn: async () => {
      const res = await fetch('/api/recipes/catalog', { cache: 'no-store' });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to fetch recipes');
      }
      const result = await res.json();
      return (result.recipes as Recipe[]) || [];
    },
    initialData: initialRecipes.length > 0 ? initialRecipes : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Query 3: Fetch Dish Costs (Dependent on Dishes)
  const dishIds = useMemo(() => dishes.map(d => d.id), [dishes]);
  const { data: dishCosts = new Map<string, DishCostData>() } = useQuery({
    queryKey: ['dishCosts', dishIds],
    queryFn: async () => {
      if (dishIds.length === 0) return new Map<string, DishCostData>();
      try {
        const batchResponse = await fetch('/api/dishes/cost/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dishIds }),
        });

        const batchResult = await batchResponse.json();
        const costMap = new Map<string, DishCostData>();
        if (batchResult.success && batchResult.costs) {
          Object.entries(batchResult.costs).forEach(([dishId, cost]) => {
            costMap.set(dishId, cost as DishCostData);
          });
        }
        return costMap;
      } catch (err) {
        logger.error('Failed to fetch batch dish costs:', err);
        return new Map<string, DishCostData>();
      }
    },
    enabled: dishes.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loading = dishesLoading || recipesLoading;
  const error = dishesError || recipesError;

  const fetchItems = useCallback(async () => {
    await Promise.all([refetchDishes(), refetchRecipes()]);
  }, [refetchDishes, refetchRecipes]);

  return {
    dishes,
    recipes,
    loading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    dishCosts,
    setDishes: () => logger.warn('setDishes is deprecated in favor of React Query cache updates'), // Placeholder to satisfy interface if possible
    setRecipes: () => logger.warn('setRecipes is deprecated in favor of React Query cache updates'),
    setError: () => {}, // React Query handles errors
    fetchItems,
  };
}
