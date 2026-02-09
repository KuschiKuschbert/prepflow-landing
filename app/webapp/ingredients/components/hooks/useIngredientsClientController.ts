import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useIngredientFormState } from '../../hooks/useIngredientFormState';
import { useSelectionMode } from '../../hooks/useSelectionMode';
import { useIngredientDataSync } from './useIngredientDataSync';
import { useIngredientOperations } from './useIngredientOperations';
import { useIngredientsView } from './useIngredientsView';

import { ExistingIngredient as Ingredient } from '../types';
export type { Ingredient };

export function useIngredientsClientController() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    isSelectionMode,
    startLongPress,
    cancelLongPress,
    enterSelectionMode,
    exitSelectionMode,
  } = useSelectionMode();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());

  // View State (Filtering, Pagination, Sorting)
  const view = useIngredientsView();

  // Data & Sync
  const {
    availableUnits,
    suppliers,
    loading,
    isLoading,
    error,
    setError,
    refetchIngredients,
    total,
    totalPages,
  } = useIngredientDataSync(setIngredients, view.queryParams);

  // Form State
  const formState = useIngredientFormState();
  const { showAddForm, setShowAddForm, resetWizard } = formState;

  // Operations
  const operations = useIngredientOperations({
    ingredients,
    setIngredients,
    setError,
    setShowAddForm: formState.setShowAddForm,
    setWizardStep: formState.setWizardStep,
    setNewIngredient: formState.setNewIngredient,
    setEditingIngredient: formState.setEditingIngredient,
    setShowCSVImport: formState.setShowCSVImport,
    setCsvData: formState.setCsvData,
    setParsedIngredients: formState.setParsedIngredients,
    setSelectedIngredients,
    selectedIngredients,
    filteredIngredients: [], // Logic moved to server-side
    parsedIngredients: formState.parsedIngredients,
    setImporting: formState.setImporting,
    exitSelectionMode,
    isLoading,
    refetchIngredients,
  });

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    if (view.page > totalPages && totalPages > 0) view.setPage(1);
    if (isSelectionMode && selectedIngredients.size === 0) exitSelectionMode();
  }, [
    view.page,
    totalPages,
    isSelectionMode,
    selectedIngredients.size,
    exitSelectionMode,
    view.setPage,
  ]);

  // Check for action=new query parameter and open wizard
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new' && !showAddForm) {
      setShowAddForm(true);
      resetWizard();
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, showAddForm, setShowAddForm, resetWizard, router]);

  return {
    // State
    loading,
    isLoading,
    error,
    isHydrated,
    ingredients,
    // Selection
    isSelectionMode,
    selectedIngredients,
    startLongPress,
    cancelLongPress,
    enterSelectionMode,
    exitSelectionMode,
    ...view,
    ...formState,
    ...operations,
    // Data
    suppliers,
    availableUnits,
    refetchIngredients,
    // Override view-derived values with server data
    filteredTotal: total,
    totalPages,
    paginatedIngredients: ingredients, // Server returns already paginated items
  };
}
