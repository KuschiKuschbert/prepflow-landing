import { useEffect, useState } from 'react';
import { Dish, DishCostData, DishWithDetails, RecipeIngredientWithDetails } from '../types';

import { logger } from '@/lib/logger';
export function useDishPreviewModalData(dish: Dish) {
  const [dishDetails, setDishDetails] = useState<DishWithDetails | null>(null);
  const [costData, setCostData] = useState<DishCostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recipeIngredientsMap, setRecipeIngredientsMap] = useState<
    Record<string, RecipeIngredientWithDetails[]>
  >({});

  useEffect(() => {
    Promise.all([
      fetch(`/api/dishes/${dish.id}`).then(r => r.json()),
      fetch(`/api/dishes/${dish.id}/cost`).then(r => r.json()),
    ]).then(async ([dishData, costResponse]) => {
      if (dishData.success) {
        setDishDetails(dishData.dish);
        const recipes = dishData.dish.recipes || [];
        const ingredientsMap: Record<string, RecipeIngredientWithDetails[]> = {};
        for (const dishRecipe of recipes) {
          if (dishRecipe.recipe_id) {
            try {
              const response = await fetch(`/api/recipes/${dishRecipe.recipe_id}/ingredients`);
              const data = await response.json();
              // API returns { items: [...] } format
              if (data.items && Array.isArray(data.items)) {
                ingredientsMap[dishRecipe.recipe_id] = data.items;
                logger.dev('[useDishPreviewModalData] Loaded recipe ingredients', {
                  recipeId: dishRecipe.recipe_id,
                  ingredientCount: data.items.length,
                  ingredientNames: data.items.map(
                    (ri: any) => ri.ingredients?.ingredient_name || 'Unknown',
                  ),
                });
              } else {
                logger.warn('[useDishPreviewModalData] Recipe ingredients not in expected format', {
                  recipeId: dishRecipe.recipe_id,
                  responseKeys: Object.keys(data),
                  hasItems: !!data.items,
                  itemsIsArray: Array.isArray(data.items),
                });
              }
            } catch (err) {
              logger.error(`Failed to fetch ingredients for recipe ${dishRecipe.recipe_id}:`, err);
            }
          }
        }
        setRecipeIngredientsMap(ingredientsMap);
      }
      if (costResponse.success) setCostData(costResponse.cost);
      setLoading(false);
    });
  }, [dish.id]);

  return { dishDetails, costData, loading, recipeIngredientsMap };
}
