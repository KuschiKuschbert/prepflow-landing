import { logger } from '@/lib/logger';
import { useIngredientActions } from '../../hooks/useIngredientActions';
import { useIngredientBulkUpdate } from '../../hooks/useIngredientBulkUpdate';
import { useIngredientEditSave } from '../../hooks/useIngredientEditSave';
import { useAutoCategorization } from '../IngredientsClient/helpers/useAutoCategorization';
import { Ingredient } from './useIngredientsClientController';

interface UseIngredientOperationsProps {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setError: (error: string) => void;
  setShowAddForm: (show: boolean) => void;
  setWizardStep: (step: number) => void;
  setNewIngredient: (ingredient: Partial<Ingredient>) => void;
  setEditingIngredient: (ingredient: Ingredient | null) => void;
  setShowCSVImport: (show: boolean) => void;
  setCsvData: (data: string) => void;
  setParsedIngredients: (ingredients: Partial<Ingredient>[]) => void;
  setSelectedIngredients: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectedIngredients: Set<string>;
  filteredIngredients: Ingredient[];
  parsedIngredients: Partial<Ingredient>[];
  setImporting: (importing: boolean) => void;
  exitSelectionMode: () => void;
  isLoading: boolean;
  refetchIngredients: () => void;
}

export function useIngredientOperations({
  ingredients,
  setIngredients,
  setError,
  setShowAddForm,
  setWizardStep,
  setNewIngredient,
  setEditingIngredient,
  setShowCSVImport,
  setCsvData,
  setParsedIngredients,
  setSelectedIngredients,
  selectedIngredients,
  filteredIngredients,
  parsedIngredients,
  setImporting,
  exitSelectionMode,
  isLoading,
  refetchIngredients,
}: UseIngredientOperationsProps) {
  const {
    handleAddIngredient,
    handleDeleteIngredient,
    handleBulkDelete,
    exportToCSV,
    handleCSVImport: handleCSVImportAction,
    handleSelectIngredient,
    handleSelectAll,
  } = useIngredientActions({
    ingredients,
    setIngredients,
    setError,
    setShowAddForm,
    setWizardStep,
    setNewIngredient,
    setEditingIngredient,
    setShowCSVImport,
    setCsvData,
    setParsedIngredients,
    setSelectedIngredients,
    selectedIngredients,
    filteredIngredients,
  });

  const { handleBulkUpdate, handleBulkAutoCategorize, handleCategorizeAllUncategorized } =
    useIngredientBulkUpdate({
      ingredients,
      setIngredients,
      setSelectedIngredients,
      exitSelectionMode,
    });

  useAutoCategorization({
    ingredients,
    isLoading,
    handleCategorizeAllUncategorized,
    refetchIngredients,
  });

  const { handleSave: handleEditSave } = useIngredientEditSave({
    setIngredients,
    setEditingIngredient,
    setError,
  });

  const handleCSVImport = async () => {
    setImporting(true);
    try {
      await handleCSVImportAction(parsedIngredients);
    } catch (err) {
      logger.error('[IngredientsClient] Error importing CSV:', {
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setImporting(false);
    }
  };

  return {
    handleAddIngredient,
    handleDeleteIngredient,
    handleBulkDelete,
    exportToCSV,
    handleSelectIngredient,
    handleSelectAll,
    handleBulkUpdate,
    handleBulkAutoCategorize,
    handleCategorizeAllUncategorized,
    handleEditSave,
    handleCSVImport,
  };
}
