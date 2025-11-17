'use client';

import { useIngredientAdd } from './useIngredientAdd';
import { useIngredientDelete } from './useIngredientDelete';
import { useIngredientUpdate } from './useIngredientUpdate';

interface UseIngredientCRUDProps<
  T extends { id: string; ingredient_name: string; cost_per_unit: number },
> {
  ingredients?: T[];
  setIngredients: React.Dispatch<React.SetStateAction<T[]>>;
  setError: (error: string) => void;
  setShowAddForm?: (show: boolean) => void;
  setWizardStep?: (step: number) => void;
  setNewIngredient?: (ingredient: Partial<T>) => void;
  setEditingIngredient?: (ingredient: T | null) => void;
}

export function useIngredientCRUD<
  T extends { id: string; ingredient_name: string; cost_per_unit: number },
>(props: UseIngredientCRUDProps<T>) {
  const { handleAddIngredient } = useIngredientAdd(props);
  const { handleUpdateIngredient } = useIngredientUpdate(props);
  const { handleDeleteIngredient: deleteFn } = useIngredientDelete(props);

  // Wrap delete function to pass current ingredients
  const handleDeleteIngredient = (id: string) => {
    if (!props.ingredients) {
      props.setError('Ingredients list not available');
      return;
    }
    return deleteFn(id, props.ingredients);
  };

  return { handleAddIngredient, handleUpdateIngredient, handleDeleteIngredient };
}
