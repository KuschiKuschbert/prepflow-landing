import { useCallback } from 'react';
import { Ingredient } from '@/lib/types/recipes';
import type { RecipeIngredient } from '@/lib/types/recipes';

interface UseRecipeDishEditorHandlersProps {
  handleAddIngredient: (
    ingredient: { ingredient_id: string; quantity: number; unit: string },
    e?: React.FormEvent,
  ) => Promise<void>;
  newIngredient: Partial<RecipeIngredient>;
  setNewIngredient: React.Dispatch<React.SetStateAction<Partial<RecipeIngredient>>>;
}

/**
 * Hook for managing ingredient-related handlers in RecipeDishEditor
 */
export function useRecipeDishEditorHandlers({
  handleAddIngredient,
  newIngredient,
  setNewIngredient: _setNewIngredient,
}: UseRecipeDishEditorHandlersProps) {
  const handleAddIngredientWrapper = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await handleAddIngredient(
        {
          ingredient_id: newIngredient.ingredient_id || '',
          quantity: newIngredient.quantity ?? 0,
          unit: newIngredient.unit || 'kg',
        },
        e,
      );
    },
    [handleAddIngredient, newIngredient],
  );

  const handleIngredientClick = useCallback(
    async (ingredient: Ingredient) => {
      const defaultQuantity = 1;
      const defaultUnit = ingredient.unit || 'kg';

      await handleAddIngredient(
        {
          ingredient_id: ingredient.id,
          quantity: defaultQuantity,
          unit: defaultUnit,
        },
        undefined,
      );
    },
    [handleAddIngredient],
  );

  return {
    handleAddIngredientWrapper,
    handleIngredientClick,
  };
}
