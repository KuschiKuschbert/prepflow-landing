import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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

  const view = useIngredientsView();
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

  const formState = useIngredientFormState();
  const { showAddForm, setShowAddForm, resetWizard } = formState;

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
    filteredIngredients: [],
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

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new' && !showAddForm) {
      setShowAddForm(true);
      resetWizard();
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, showAddForm, setShowAddForm, resetWizard, router]);

  const processedStorageRef = useRef(false);
  useEffect(() => {
    const storageParam = searchParams.get('storage');
    if (storageParam && !processedStorageRef.current) {
      processedStorageRef.current = true;
      view.setStorageFilter(storageParam);
      router.replace('/webapp/ingredients', { scroll: false });
    }
  }, [searchParams, view.setStorageFilter, router]);

  return {
    loading,
    isLoading,
    error,
    isHydrated,
    ingredients,
    isSelectionMode,
    selectedIngredients,
    startLongPress,
    cancelLongPress,
    enterSelectionMode,
    exitSelectionMode,
    ...view,
    ...formState,
    ...operations,
    suppliers,
    availableUnits,
    refetchIngredients,
    filteredTotal: total,
    totalPages,
    paginatedIngredients: ingredients,
  };
}
