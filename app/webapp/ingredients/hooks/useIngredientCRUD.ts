'use client';

import { useIngredientAdd } from './useIngredientAdd';
import { useIngredientDelete } from './useIngredientDelete';
import { useIngredientUpdate } from './useIngredientUpdate';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  supplier?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
}

interface UseIngredientCRUDProps {
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setError: (error: string) => void;
  setShowAddForm?: (show: boolean) => void;
  setWizardStep?: (step: number) => void;
  setNewIngredient?: (ingredient: Partial<Ingredient>) => void;
  setEditingIngredient?: (ingredient: Ingredient | null) => void;
}

export function useIngredientCRUD(props: UseIngredientCRUDProps) {
  const { handleAddIngredient } = useIngredientAdd(props);
  const { handleUpdateIngredient } = useIngredientUpdate(props);
  const { handleDeleteIngredient } = useIngredientDelete(props);

  return { handleAddIngredient, handleUpdateIngredient, handleDeleteIngredient };
}
