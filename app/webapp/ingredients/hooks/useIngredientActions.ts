'use client';

import { useIngredientBulkActions } from './useIngredientBulkActions';
import { useIngredientCRUD } from './useIngredientCRUD';
import { useIngredientCSV } from './useIngredientCSV';

import { ExistingIngredient as Ingredient } from '../components/types';

interface UseIngredientActionsProps {
  ingredients?: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setError: (error: string) => void;
  setShowAddForm?: (show: boolean) => void;
  setWizardStep?: (step: number) => void;
  setNewIngredient?: (ingredient: Partial<Ingredient>) => void;
  setEditingIngredient?: (ingredient: Ingredient | null) => void;
  setShowCSVImport?: (show: boolean) => void;
  setCsvData?: (data: string) => void;
  setParsedIngredients?: (ingredients: Partial<Ingredient>[]) => void;
  setSelectedIngredients?: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectedIngredients?: Set<string>;
  filteredIngredients?: Ingredient[];
}

/**
 * Main orchestrator hook for ingredient actions
 * Delegates to specialized hooks to meet file size limits
 */
export function useIngredientActions(props: UseIngredientActionsProps) {
  const { handleAddIngredient, handleUpdateIngredient, handleDeleteIngredient } =
    useIngredientCRUD(props);

  const { handleBulkDelete, handleSelectIngredient, handleSelectAll } =
    useIngredientBulkActions(props);

  const { exportToCSV, handleCSVImport } = useIngredientCSV(props);

  return {
    handleAddIngredient,
    handleUpdateIngredient,
    handleDeleteIngredient,
    handleBulkDelete,
    exportToCSV,
    handleCSVImport,
    handleSelectIngredient,
    handleSelectAll,
  };
}
