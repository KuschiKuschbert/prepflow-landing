import { useEffect, useState } from 'react';
import { Dish, DishCostData, DishWithDetails, RecipeIngredientWithDetails } from '../types';

import { logger } from '@/lib/logger';
export function useDishSidePanelData(isOpen: boolean, dish: Dish | null) {
  const [dishDetails, setDishDetails] = useState<DishWithDetails | null>(null);
  const [costData, setCostData] = useState<DishCostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recipeIngredientsMap, setRecipeIngredientsMap] = useState<
    Record<string, RecipeIngredientWithDetails[]>
  >({});

  useEffect(() => {
    if (!isOpen || !dish) {
      setDishDetails(null);
      setCostData(null);
      setLoading(true);
      setRecipeIngredientsMap({});
      return;
    }

    let cancelled = false;

    Promise.all([
      fetch(`/api/dishes/${dish.id}`).then(r => r.json()),
      fetch(`/api/dishes/${dish.id}/cost`).then(r => r.json()),
    ]).then(async ([dishData, costResponse]) => {
      // Don't update state if panel was closed during fetch
      if (cancelled) return;

      if (dishData.success) {
        setDishDetails(dishData.dish);
        const recipes = dishData.dish.recipes || [];
        const ingredientsMap: Record<string, RecipeIngredientWithDetails[]> = {};
        for (const dishRecipe of recipes) {
          if (dishRecipe.recipe_id) {
            try {
              const response = await fetch(`/api/recipes/${dishRecipe.recipe_id}/ingredients`);
              const data = await response.json();
              // Don't update state if panel was closed during fetch
              if (cancelled) return;
              // API returns { items: [...] } format
              if (data.items && Array.isArray(data.items)) {
                ingredientsMap[dishRecipe.recipe_id] = data.items;
                logger.dev('[useDishSidePanelData] Loaded recipe ingredients', {
                  recipeId: dishRecipe.recipe_id,
                  ingredientCount: data.items.length,
                  ingredientNames: data.items.map(
                    (ri: RecipeIngredientWithDetails) =>
                      ri.ingredients?.ingredient_name || 'Unknown',
                  ),
                });
              } else {
                logger.warn('[useDishSidePanelData] Recipe ingredients not in expected format', {
                  recipeId: dishRecipe.recipe_id,
                  responseKeys: Object.keys(data),
                  hasItems: !!data.items,
                  itemsIsArray: Array.isArray(data.items),
                });
              }
            } catch (err) {
              if (!cancelled) {
                logger.error(
                  `Failed to fetch ingredients for recipe ${dishRecipe.recipe_id}:`,
                  err,
                );
              }
            }
          }
        }
        if (!cancelled) {
          setRecipeIngredientsMap(ingredientsMap);
        }
      }
      if (!cancelled && costResponse.success) {
        setCostData(costResponse.cost);
      }
      if (!cancelled) {
        setLoading(false);
      }
    });

    // Cleanup: mark as cancelled if panel closes or dish changes
    return () => {
      cancelled = true;
    };
  }, [isOpen, dish?.id, dish]);

  return { dishDetails, costData, loading, recipeIngredientsMap };
}
