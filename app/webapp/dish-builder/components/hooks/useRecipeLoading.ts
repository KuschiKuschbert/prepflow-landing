import { useEffect } from 'react';
import type { Ingredient, Recipe } from '../../../cogs/types';
import type { DishBuilderState } from '../../types';
import { fetchRecipeIngredients } from './helpers/fetchRecipeIngredients';

interface UseRecipeLoadingProps {
  editingRecipe: Recipe | null | undefined;
  ingredients: Ingredient[];
  setDishState: (state: DishBuilderState) => void;
  clearCalculations: () => void;
  handleIngredientAdded: (ingredient: Ingredient, quantity: number, unit: string) => void;
  setError: (error: string) => void;
}

export function useRecipeLoading({
  editingRecipe,
  ingredients,
  setDishState,
  clearCalculations,
  handleIngredientAdded,
  setError,
}: UseRecipeLoadingProps) {
  useEffect(() => {
    if (editingRecipe && ingredients.length > 0) {
      // Set recipe state
      setDishState({
        dishName: editingRecipe.recipe_name || '',
        description: editingRecipe.description || '',
        sellingPrice: 0, // Will be calculated
        itemType: 'recipe',
        yield: editingRecipe.yield || 1,
        yield_unit: editingRecipe.yield_unit || 'portion',
        instructions: editingRecipe.instructions || '',
      });

      // Load recipe ingredients
      fetchRecipeIngredients(editingRecipe.id)
        .then(recipeIngredients => {
          if (recipeIngredients.length > 0) {
            const recipeYield = editingRecipe.yield || 1;
            // Clear existing calculations first
            clearCalculations();
            // Add all ingredients from recipe
            recipeIngredients.forEach(ri => {
              const ingredientData = ingredients.find(ing => ing.id === ri.ingredient_id);
              if (ingredientData) {
                // Calculate single serve quantity
                const singleServeQuantity = ri.quantity / recipeYield;
                handleIngredientAdded(ingredientData, singleServeQuantity, ri.unit);
              }
            });
          }
        })
        .catch(() => {
          setError('Failed to load recipe ingredients');
        });
    }
  }, [
    editingRecipe,
    ingredients,
    setDishState,
    clearCalculations,
    handleIngredientAdded,
    setError,
  ]);
}
