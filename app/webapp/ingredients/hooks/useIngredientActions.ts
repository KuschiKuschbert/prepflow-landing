'use client';

import { useIngredientCRUD } from './useIngredientCRUD';
import { useIngredientBulkActions } from './useIngredientBulkActions';
import { useIngredientCSV } from './useIngredientCSV';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
  created_at?: string;
  updated_at?: string;
}

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
