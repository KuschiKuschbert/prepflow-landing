import { useCallback } from 'react';
import { COGSCalculation } from '../../../../cogs/types';
import { Ingredient, RecipeIngredient } from '../../../../cogs/types';

interface UseRecipeEditHandlersProps {
  handleAddIngredient: (
    ingredient: { ingredient_id: string; quantity: number; unit: string },
    e?: React.FormEvent,
  ) => Promise<void>;
  newIngredient: Partial<RecipeIngredient>;
  newConsumable: Partial<RecipeIngredient>;
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
      if (!newIngredient.ingredient_id) return;
      await handleAddIngredient(
        {
          ingredient_id: newIngredient.ingredient_id,
          quantity: newIngredient.quantity ?? 0,
          unit: newIngredient.unit || 'kg',
        },
        e,
      );
    },
    [handleAddIngredient, newIngredient],
  );

  const handleAddConsumableWrapper = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newConsumable.ingredient_id) return;
      await handleAddIngredient(
        {
          ingredient_id: newConsumable.ingredient_id,
          quantity: newConsumable.quantity ?? 0,
          unit: newConsumable.unit || 'kg',
        },
        e,
      );
    },
    [handleAddIngredient, newConsumable],
  );

  return {
    handleAddIngredientWrapper,
    handleAddConsumableWrapper,
  };
}
