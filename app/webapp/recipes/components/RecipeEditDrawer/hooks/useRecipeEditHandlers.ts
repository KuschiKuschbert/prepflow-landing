import { useCallback } from 'react';
import { COGSCalculation } from '../../../../cogs/types';
import { Ingredient } from '../../../../cogs/types';

interface UseRecipeEditHandlersProps {
  handleAddIngredient: (
    ingredient: { ingredient_id: string; quantity: number; unit: string },
    e?: React.FormEvent,
  ) => Promise<void>;
  newIngredient: { ingredient_id?: string; quantity: number; unit: string };
  newConsumable: { ingredient_id?: string; quantity: number; unit: string };
}

/**
 * Hook for managing ingredient addition handlers in RecipeEditDrawer
 */
export function useRecipeEditHandlers({
  handleAddIngredient,
  newIngredient,
  newConsumable,
}: UseRecipeEditHandlersProps) {
  const handleAddIngredientWrapper = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await handleAddIngredient(newIngredient, e);
    },
    [handleAddIngredient, newIngredient],
  );

  const handleAddConsumableWrapper = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await handleAddIngredient(newConsumable, e);
    },
    [handleAddIngredient, newConsumable],
  );

  return {
    handleAddIngredientWrapper,
    handleAddConsumableWrapper,
  };
}
