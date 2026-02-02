import { useCallback, useEffect, useState } from 'react';
import { Dish, Recipe } from '@/lib/types/recipes';

interface UseDishesOptimisticUpdatesProps {
  dishes: Dish[];
  recipes: Recipe[];
  selectedItems: Set<string>;
  setDishes: (dishes: Dish[]) => void;
  setRecipes: (recipes: Recipe[]) => void;
}

export function useDishesOptimisticUpdates({
  dishes,
  recipes,
  selectedItems,
  setDishes,
  setRecipes,
}: UseDishesOptimisticUpdatesProps) {
  const [originalDishes, setOriginalDishes] = useState<Dish[]>([]);
  const [originalRecipes, setOriginalRecipes] = useState<Recipe[]>([]);
  const optimisticallyUpdateDishes = useCallback(
    (updater: (dishes: Dish[]) => Dish[]) => {
      setDishes(updater(dishes));
    },
    [dishes, setDishes],
  );
  const optimisticallyUpdateRecipes = useCallback(
    (updater: (recipes: Recipe[]) => Recipe[]) => {
      setRecipes(updater(recipes));
    },
    [recipes, setRecipes],
  );
  const rollbackDishes = useCallback(() => {
    if (originalDishes.length > 0) setDishes(originalDishes);
  }, [originalDishes, setDishes]);
  const rollbackRecipes = useCallback(() => {
    if (originalRecipes.length > 0) setRecipes(originalRecipes);
  }, [originalRecipes, setRecipes]);
  useEffect(() => {
    if (selectedItems.size > 0) {
      setOriginalDishes([...dishes]);
      setOriginalRecipes([...recipes]);
    }
  }, [selectedItems.size, dishes, recipes]);
  return {
    optimisticallyUpdateDishes,
    optimisticallyUpdateRecipes,
    rollbackDishes,
    rollbackRecipes,
  };
}
