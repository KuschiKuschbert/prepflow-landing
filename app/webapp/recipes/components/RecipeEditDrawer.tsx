'use client';
import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
import { EditDrawer } from '@/components/ui/EditDrawer';
import { useAutosave } from '@/hooks/useAutosave';
import { deriveAutosaveId } from '@/lib/autosave-id';
import { useNotification } from '@/contexts/NotificationContext';
import { Recipe } from '../types';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { logger } from '@/lib/logger';
import { useCOGSDataFetching } from '../../cogs/hooks/useCOGSDataFetching';
import { useIngredientSearch } from '../../cogs/hooks/useIngredientSearch';
import { useIngredientAddition } from '../../cogs/hooks/useIngredientAddition';
import { useCOGSCalculationLogic } from '../../cogs/hooks/useCOGSCalculationLogic';
import { useIngredientConversion } from '../../cogs/hooks/useIngredientConversion';
import { COGSCalculation } from '../../cogs/types';
import { useRecipeEditIngredientLoading } from './hooks/useRecipeEditIngredientLoading';
import { useRecipeEditIngredientSave } from './hooks/useRecipeEditIngredientSave';
import { RecipeMetadataForm } from './RecipeMetadataForm';
import { RecipeIngredientsTab } from './RecipeIngredientsTab';
import { RecipeEditFooter } from '@/app/webapp/recipes/components/RecipeEditDrawer/components/RecipeEditFooter';
import { useRecipeEditHandlers } from '@/app/webapp/recipes/components/RecipeEditDrawer/hooks/useRecipeEditHandlers';
interface RecipeEditDrawerProps {
  isOpen: boolean;
  recipe: Recipe | null;
  onClose: () => void;
  onRefresh?: () => Promise<void>;
}

export function RecipeEditDrawer({ isOpen, recipe, onClose, onRefresh }: RecipeEditDrawerProps) {
  const { showWarning, showError, showSuccess } = useNotification();
  const [editedName, setEditedName] = useState('');
  const [editedYield, setEditedYield] = useState(1);
  const [editedInstructions, setEditedInstructions] = useState('');
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'consumables'>('ingredients');
  const {
    ingredients,
    loading: dataLoading,
    error: dataError,
    setError: setDataError,
    fetchData,
  } = useCOGSDataFetching();
  const { convertIngredientQuantity } = useIngredientConversion();
  const { calculations, setCalculations, loadingIngredients } = useRecipeEditIngredientLoading({
    recipe,
    ingredients,
    convertIngredientQuantity,
    showError,
  });
  const ingredientCalculations = useMemo(
    () => calculations.filter(calc => !calc.isConsumable),
    [calculations],
  );
  const consumableCalculations = useMemo(
    () => calculations.filter(calc => calc.isConsumable),
    [calculations],
  );
  const consumables = useMemo(
    () => ingredients.filter(ing => ing.category === 'Consumables'),
    [ingredients],
  );
  const {
    ingredientSearch,
    showSuggestions,
    selectedIngredient,
    newIngredient,
    filteredIngredients,
    highlightedIndex,
    handleIngredientSelect,
    handleSearchChange,
    handleKeyDown,
    resetForm,
    setNewIngredient,
  } = useIngredientSearch(ingredients);
  const {
    ingredientSearch: consumableSearch,
    showSuggestions: showConsumableSuggestions,
    selectedIngredient: selectedConsumable,
    newIngredient: newConsumable,
    filteredIngredients: filteredConsumables,
    highlightedIndex: consumableHighlightedIndex,
    handleIngredientSelect: handleConsumableSelect,
    handleSearchChange: handleConsumableSearchChange,
    handleKeyDown: handleConsumableKeyDown,
    setNewIngredient: setNewConsumable,
  } = useIngredientSearch(consumables);
  const { updateCalculation } = useCOGSCalculationLogic({
    ingredients,
    setCalculations,
  });
  const updateCalculationWrapper = useCallback(
    (ingredientId: string, quantity: number) =>
      updateCalculation(ingredientId, quantity, ingredients, setCalculations),
    [ingredients, updateCalculation, setCalculations],
  );
  const addCalculationWithRollback = useCallback(
    (calc: COGSCalculation) => {
      setCalculations(prev => [...prev, calc]);
    },
    [setCalculations],
  );

  const { handleAddIngredient } = useIngredientAddition({
    calculations,
    ingredients,
    selectedRecipe: recipe?.id || null,
    addCalculation: addCalculationWithRollback,
    updateCalculation: updateCalculationWrapper,
    resetForm,
    setSaveError: setDataError,
  });
  const { handleAddIngredientWrapper, handleAddConsumableWrapper } = useRecipeEditHandlers({
    handleAddIngredient,
    newIngredient,
    newConsumable,
  });
  const { handleSaveIngredients } = useRecipeEditIngredientSave({
    recipe,
    calculations,
    showError,
    showSuccess,
  });
  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen, fetchData]);
  useEffect(() => {
    if (recipe) {
      setEditedName(recipe.recipe_name || '');
      setEditedYield(recipe.yield || 1);
      setEditedInstructions(recipe.instructions || '');
    }
  }, [recipe]);
  const entityId = deriveAutosaveId('recipes', recipe?.id, [editedName]);
  const canAutosave = Boolean(editedName && recipe);
  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'recipes',
    entityId: entityId,
    data: {
      id: recipe?.id,
      name: editedName,
      yield: editedYield,
      instructions: editedInstructions,
    },
    enabled: canAutosave && isOpen,
  });
  const handleSave = useCallback(async () => {
    if (!recipe || !editedName.trim()) return;
    if (calculations.length === 0) {
      showError('Recipe must contain at least one ingredient');
      return;
    }

    // Store original state for rollback
    const originalName = recipe.recipe_name || '';
    const originalYield = recipe.yield || 1;
    const originalInstructions = recipe.instructions || '';
    const originalCalculations = [...calculations];
    const rollback = () => {
      setEditedName(originalName);
      setEditedYield(originalYield);
      setEditedInstructions(originalInstructions);
      setCalculations(originalCalculations);
    };

    try {
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedName.trim(),
          yield: editedYield,
          instructions: editedInstructions,
        }),
      });

      if (!response.ok) {
        rollback();
        const error = await response.json();
        showWarning(error.message || 'Failed to save recipe');
        return;
      }
      const ingredientsSaved = await handleSaveIngredients();
      if (!ingredientsSaved) {
        rollback();
        return;
      }
      onClose();
    } catch (err) {
      rollback();
      logger.error('Failed to save recipe:', err);
      showWarning('Failed to save recipe');
    }
  }, [
    recipe,
    editedName,
    editedYield,
    editedInstructions,
    calculations,
    onClose,
    showWarning,
    showError,
    handleSaveIngredients,
    setCalculations,
  ]);
  if (!recipe) return null;
  const capitalizeRecipeName = (name: string) => name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  return (
    <EditDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${capitalizeRecipeName(recipe.recipe_name)}`}
      maxWidth="xl"
      onSave={handleSave}
      saving={status === 'saving'}
      footer={
        <RecipeEditFooter
          saving={status === 'saving'}
          autosaveStatus={status}
          autosaveError={autosaveError}
          editedName={editedName}
          ingredientCalculationsCount={ingredientCalculations.length}
          consumableCalculationsCount={consumableCalculations.length}
          onSave={handleSave}
          onClose={onClose}
          onRetryAutosave={saveNow}
        />
      }
    >
      <div className="flex max-h-[calc(100vh-200px)] flex-col space-y-6 overflow-hidden">
        <RecipeMetadataForm
          recipe={recipe}
          editedName={editedName}
          editedYield={editedYield}
          editedInstructions={editedInstructions}
          onNameChange={setEditedName}
          onYieldChange={setEditedYield}
          onInstructionsChange={setEditedInstructions}
        />
        <RecipeIngredientsTab
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ingredientCalculations={ingredientCalculations}
          consumableCalculations={consumableCalculations}
          ingredients={ingredients}
          consumables={consumables}
          dataLoading={dataLoading}
          loadingIngredients={loadingIngredients}
          dataError={dataError}
          showAddIngredient={showAddIngredient}
          ingredientSearch={ingredientSearch}
          showSuggestions={showSuggestions}
          filteredIngredients={filteredIngredients}
          selectedIngredient={selectedIngredient}
          highlightedIndex={highlightedIndex}
          newIngredient={{
            quantity: newIngredient.quantity || 0,
            unit: newIngredient.unit || 'kg',
          }}
          consumableSearch={consumableSearch}
          showConsumableSuggestions={showConsumableSuggestions}
          filteredConsumables={filteredConsumables}
          selectedConsumable={selectedConsumable}
          consumableHighlightedIndex={consumableHighlightedIndex}
          newConsumable={{
            quantity: newConsumable.quantity || 0,
            unit: newConsumable.unit || 'kg',
          }}
          onToggleAddIngredient={() => setShowAddIngredient(!showAddIngredient)}
          onSearchChange={handleSearchChange}
          onIngredientSelect={handleIngredientSelect}
          onKeyDown={(e, filtered) =>
            handleKeyDown(e as React.KeyboardEvent<HTMLInputElement>, filtered)
          }
          onQuantityChange={quantity => setNewIngredient(prev => ({ ...prev, quantity }))}
          onUnitChange={unit => setNewIngredient(prev => ({ ...prev, unit }))}
          onAddIngredient={handleAddIngredientWrapper}
          onConsumableSearchChange={handleConsumableSearchChange}
          onConsumableSelect={handleConsumableSelect}
          onConsumableKeyDown={(e, filtered) =>
            handleConsumableKeyDown(e as React.KeyboardEvent<HTMLInputElement>, filtered)
          }
          onConsumableQuantityChange={quantity => setNewConsumable(prev => ({ ...prev, quantity }))}
          onConsumableUnitChange={unit => setNewConsumable(prev => ({ ...prev, unit }))}
          onAddConsumable={handleAddConsumableWrapper}
          onUpdateCalculation={(ingredientId, newQuantity) =>
            updateCalculation(ingredientId, newQuantity, ingredients, setCalculations)
          }
          onRemoveCalculation={ingredientId =>
            setCalculations(prev => prev.filter(calc => calc.ingredientId !== ingredientId))
          }
          setCalculations={setCalculations}
        />
      </div>
    </EditDrawer>
  );
}