import { useCallback } from 'react';
import { Recipe } from '../types';

interface UseDishHandlersProps {
  showAddIngredient: boolean;
  dishName: string;
  recipes: Recipe[];
  recipeExists: boolean | null;
  selectedRecipe: string;
  loadExistingRecipeIngredients: (recipeId: string) => Promise<void>;
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
  recipeExists,
  selectedRecipe,
  loadExistingRecipeIngredients,
  setShowAddIngredient,
  setDishName,
  setDishPortions,
  setDishNameLocked,
  setSelectedRecipe,
}: UseDishHandlersProps) {
  const handleToggleAddIngredient = useCallback(async () => {
    const newShowAddIngredient = !showAddIngredient;
    setShowAddIngredient(newShowAddIngredient);

    if (!newShowAddIngredient && dishName.trim()) {
      setDishNameLocked(true);

      // If recipe exists and we're opening the add ingredient dialog, load the recipe
      if (recipeExists === true && selectedRecipe) {
        try {
          await loadExistingRecipeIngredients(selectedRecipe);
        } catch (err) {
          console.error('Failed to load existing recipe ingredients:', err);
        }
      }
    }

    if (newShowAddIngredient) {
      setDishNameLocked(false);
    }
  }, [
    showAddIngredient,
    dishName,
    recipeExists,
    selectedRecipe,
    loadExistingRecipeIngredients,
    setShowAddIngredient,
    setDishNameLocked,
  ]);

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
