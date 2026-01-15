import { logger } from '@/lib/logger';
import { useEffect } from 'react';
import type { Ingredient, Recipe, RecipeIngredient } from '../../../cogs/types';
import type { DishBuilderState } from '../../types';

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
      fetch(`/api/recipes/${editingRecipe.id}/ingredients`, {
        cache: 'no-store',
      })
        .then(r => r.json())
        .then(data => {
          const recipeIngredients: RecipeIngredient[] = data.items || [];
          if (recipeIngredients.length > 0) {
            const recipeYield = editingRecipe.yield || 1;
            // Clear existing calculations first
            clearCalculations();
            // Add all ingredients from recipe
            recipeIngredients.forEach((ri: RecipeIngredient) => {
              const ingredientData = ingredients.find(ing => ing.id === ri.ingredient_id);
              if (ingredientData) {
                // Calculate single serve quantity
                const singleServeQuantity = ri.quantity / recipeYield;
                handleIngredientAdded(ingredientData, singleServeQuantity, ri.unit);
              }
            });
          }
        })
        .catch(err => {
          logger.error('Failed to load recipe ingredients:', err);
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
