import { useCallback, useEffect, useState } from 'react';
import { Dish, DishCostData, Recipe } from '../../types';

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

      // Fetch costs for all dishes
      const costPromises = dishesList.map(async (dish: Dish) => {
        try {
          const costResponse = await fetch(`/api/dishes/${dish.id}/cost`);
          const costResult = await costResponse.json();
          if (costResult.success && costResult.cost) {
            return { dishId: dish.id, cost: costResult.cost };
          }
        } catch (err) {
          console.error(`Failed to fetch cost for dish ${dish.id}:`, err);
        }
        return null;
      });

      const costMap = new Map<string, DishCostData>();
      (await Promise.all(costPromises)).forEach(c => {
        if (c) costMap.set(c.dishId, c.cost);
      });
      setDishCosts(costMap);

      // Note: Recipe price calculation is handled by useDishesClientRecipePricing
      // based on visible/paginated recipes, not here
    } catch (err) {
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
