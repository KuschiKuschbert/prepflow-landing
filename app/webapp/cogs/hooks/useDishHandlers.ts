import { useCallback } from 'react';
import { Recipe } from '../types';

interface UseDishHandlersProps {
  showAddIngredient: boolean;
  dishName: string;
  recipes: Recipe[];
  setShowAddIngredient: (show: boolean) => void;
  setDishName: (name: string) => void;
  setDishPortions: (portions: number) => void;
  setDishNameLocked: (locked: boolean) => void;
  setSelectedRecipe: (recipeId: string) => void;
}

export function useDishHandlers({
  showAddIngredient,
  dishName,
  recipes,
  setShowAddIngredient,
  setDishName,
  setDishPortions,
  setDishNameLocked,
  setSelectedRecipe,
}: UseDishHandlersProps) {
  const handleToggleAddIngredient = useCallback(() => {
    setShowAddIngredient(!showAddIngredient);
    if (!showAddIngredient && dishName.trim()) {
      setDishNameLocked(true);
    }
    if (showAddIngredient) {
      setDishNameLocked(false);
    }
  }, [showAddIngredient, dishName, setShowAddIngredient, setDishNameLocked]);

  const handleRecipeSelect = useCallback(
    (recipeId: string) => {
      setSelectedRecipe(recipeId);
      if (recipeId) {
        const selectedRecipeData = recipes.find(r => r.id === recipeId);
        if (selectedRecipeData) {
          setDishName(selectedRecipeData.name);
          setDishPortions(selectedRecipeData.yield || 1);
        }
      } else {
        setDishName('');
        setDishPortions(1);
      }
    },
    [recipes, setSelectedRecipe, setDishName, setDishPortions],
  );

  return {
    handleToggleAddIngredient,
    handleRecipeSelect,
  };
}
