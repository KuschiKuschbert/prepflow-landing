'use client';
import { COGSCalculation } from '@/app/webapp/cogs/types';
import { RecipeEditFooter } from '@/app/webapp/recipes/components/RecipeEditDrawer/components/RecipeEditFooter';
import { EditDrawer } from '@/components/ui/EditDrawer';
import { useNotification } from '@/contexts/NotificationContext';
import { useAutosave } from '@/hooks/useAutosave';
import { deriveAutosaveId } from '@/lib/autosave-id';
import { logger } from '@/lib/logger';
import { useCallback, useEffect, useState } from 'react';
import { Recipe } from '../types';
import { useRecipeEditIngredientSave } from './hooks/useRecipeEditIngredientSave';
import { useRecipeIngredientsState } from './RecipeEditDrawer/hooks/useRecipeIngredientsState';
import { RecipeIngredientsTab } from './RecipeIngredientsTab';
import { RecipeMetadataForm } from './RecipeMetadataForm';
interface RecipeEditDrawerProps {
  isOpen: boolean;
  recipe: Recipe | null;
  onClose: () => void;
  onRefresh?: () => Promise<void>;
}

export function RecipeEditDrawer({
  isOpen,
  recipe,
  onClose,
  onRefresh: _onRefresh,
}: RecipeEditDrawerProps) {
  const { showWarning, showError, showSuccess } = useNotification();
  const [editedName, setEditedName] = useState('');
  const [editedYield, setEditedYield] = useState(1);
  const [editedInstructions, setEditedInstructions] = useState('');

  const {
    activeTab,
    setActiveTab,
    showAddIngredient,
    setShowAddIngredient,
    ingredients,
    consumables,
    dataLoading,
    loadingIngredients,
    dataError,
    fetchData,
    calculations,
    setCalculations,
    ingredientCalculations,
    consumableCalculations,
    ingredientSearch,
    consumableSearch,
    handleAddIngredientWrapper,
    handleAddConsumableWrapper,
    updateCalculation,
  } = useRecipeIngredientsState(recipe);

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

  const capitalizeRecipeName = (name: string) =>
    name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

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
          ingredientSearch={ingredientSearch.ingredientSearch}
          showSuggestions={ingredientSearch.showSuggestions}
          filteredIngredients={ingredientSearch.filteredIngredients}
          selectedIngredient={ingredientSearch.selectedIngredient}
          highlightedIndex={ingredientSearch.highlightedIndex}
          newIngredient={{
            quantity: ingredientSearch.newIngredient.quantity || 0,
            unit: ingredientSearch.newIngredient.unit || 'kg',
          }}
          consumableSearch={consumableSearch.ingredientSearch}
          showConsumableSuggestions={consumableSearch.showSuggestions}
          filteredConsumables={consumableSearch.filteredIngredients}
          selectedConsumable={consumableSearch.selectedIngredient}
          consumableHighlightedIndex={consumableSearch.highlightedIndex}
          newConsumable={{
            quantity: consumableSearch.newIngredient.quantity || 0,
            unit: consumableSearch.newIngredient.unit || 'kg',
          }}
          onToggleAddIngredient={() => setShowAddIngredient(!showAddIngredient)}
          onSearchChange={ingredientSearch.handleSearchChange}
          onIngredientSelect={ingredientSearch.handleIngredientSelect}
          onKeyDown={(e, filtered) =>
            ingredientSearch.handleKeyDown(e as React.KeyboardEvent<HTMLInputElement>, filtered)
          }
          onQuantityChange={quantity =>
            ingredientSearch.setNewIngredient((prev: any) => ({ ...prev, quantity }))
          }
          onUnitChange={unit =>
            ingredientSearch.setNewIngredient((prev: any) => ({ ...prev, unit }))
          }
          onAddIngredient={handleAddIngredientWrapper}
          onConsumableSearchChange={consumableSearch.handleSearchChange}
          onConsumableSelect={consumableSearch.handleIngredientSelect}
          onConsumableKeyDown={(e, filtered) =>
            consumableSearch.handleKeyDown(e as React.KeyboardEvent<HTMLInputElement>, filtered)
          }
          onConsumableQuantityChange={quantity =>
            consumableSearch.setNewIngredient((prev: any) => ({ ...prev, quantity }))
          }
          onConsumableUnitChange={unit =>
            consumableSearch.setNewIngredient((prev: any) => ({ ...prev, unit }))
          }
          onAddConsumable={handleAddConsumableWrapper}
          onUpdateCalculation={(ingredientId, newQuantity) =>
            updateCalculation(ingredientId, newQuantity, ingredients, setCalculations)
          }
          onRemoveCalculation={ingredientId =>
            setCalculations(prev =>
              prev.filter((calc: COGSCalculation) => calc.ingredientId !== ingredientId),
            )
          }
          setCalculations={setCalculations}
        />
      </div>
    </EditDrawer>
  );
}
