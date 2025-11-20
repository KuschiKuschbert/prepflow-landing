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
import { IngredientManager } from '../../cogs/components/IngredientManager';
import { IngredientsList } from '../../cogs/components/IngredientsList';
import { COGSCalculation, Ingredient } from '../../cogs/types';
import { useRecipeEditIngredientLoading } from './hooks/useRecipeEditIngredientLoading';
import { useRecipeEditIngredientSave } from './hooks/useRecipeEditIngredientSave';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Icon } from '@/components/ui/Icon';
import { Package, ShoppingBag } from 'lucide-react';
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
  const [saving, setSaving] = useState(false);
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'consumables'>('ingredients');

  // Data fetching
  const {
    ingredients,
    loading: dataLoading,
    error: dataError,
    setError: setDataError,
    fetchData,
  } = useCOGSDataFetching();

  const { convertIngredientQuantity } = useIngredientConversion();

  // Ingredient loading
  const { calculations, setCalculations, loadingIngredients } = useRecipeEditIngredientLoading({
    recipe,
    ingredients,
    convertIngredientQuantity,
    showError,
  });

  // Separate calculations into ingredients and consumables
  const ingredientCalculations = useMemo(() => {
    return calculations.filter(calc => !calc.isConsumable);
  }, [calculations]);

  const consumableCalculations = useMemo(() => {
    return calculations.filter(calc => calc.isConsumable);
  }, [calculations]);

  // Filter ingredients to get consumables
  const consumables = useMemo(() => {
    return ingredients.filter(ing => ing.category === 'Consumables');
  }, [ingredients]);

  // Ingredient search
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

  // Consumables search hook
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
    resetForm: resetConsumableForm,
    setNewIngredient: setNewConsumable,
  } = useIngredientSearch(consumables);

  // Calculation logic
  const { updateCalculation } = useCOGSCalculationLogic({
    ingredients,
    setCalculations,
  });

  // Ingredient addition
  const updateCalculationWrapper = useCallback(
    (ingredientId: string, quantity: number) => {
      updateCalculation(ingredientId, quantity, ingredients, setCalculations);
    },
    [ingredients, updateCalculation, setCalculations],
  );

  const { handleAddIngredient } = useIngredientAddition({
    calculations,
    ingredients,
    selectedRecipe: recipe?.id || null,
    addCalculation: (calc: COGSCalculation) => {
      setCalculations(prev => [...prev, calc]);
    },
    updateCalculation: updateCalculationWrapper,
    resetForm,
    setSaveError: setDataError,
  });

  const handleAddIngredientWrapper = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAddIngredient(newIngredient, e);
  };

  const handleAddConsumableWrapper = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAddIngredient(newConsumable, e);
  };

  // Ingredient saving
  const { savingIngredients, handleSaveIngredients } = useRecipeEditIngredientSave({
    recipe,
    calculations,
    showError,
    showSuccess,
  });

  // Fetch data on mount
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, fetchData]);

  // Initialize edited values when recipe changes
  useEffect(() => {
    if (recipe) {
      setEditedName(recipe.recipe_name || '');
      setEditedYield(recipe.yield || 1);
      setEditedInstructions(recipe.instructions || '');
    }
  }, [recipe]);

  // Autosave integration
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

    setSaving(true);
    try {
      // Save recipe metadata
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
        const error = await response.json();
        showWarning(error.message || 'Failed to save recipe');
        setSaving(false);
        return;
      }

      // Save ingredients
      const ingredientsSaved = await handleSaveIngredients();
      if (!ingredientsSaved) {
        setSaving(false);
        return;
      }

      if (onRefresh) {
        await onRefresh();
      }
      onClose();
    } catch (err) {
      logger.error('Failed to save recipe:', err);
      showWarning('Failed to save recipe');
    } finally {
      setSaving(false);
    }
  }, [
    recipe,
    editedName,
    editedYield,
    editedInstructions,
    calculations,
    onClose,
    onRefresh,
    showWarning,
    showError,
    handleSaveIngredients,
  ]);

  if (!recipe) return null;

  const capitalizeRecipeName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <EditDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${capitalizeRecipeName(recipe.recipe_name)}`}
      maxWidth="xl"
      onSave={handleSave}
      saving={saving || savingIngredients || status === 'saving'}
      footer={
        <div className="flex items-center justify-between">
          <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-[#2a2a2a] px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:bg-[#3a3a3a]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={
                saving ||
                savingIngredients ||
                status === 'saving' ||
                !editedName.trim() ||
                (ingredientCalculations.length === 0 && consumableCalculations.length === 0)
              }
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#29E7CD]/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving || savingIngredients || status === 'saving'
                ? 'Saving...'
                : ingredientCalculations.length === 0 && consumableCalculations.length === 0
                  ? 'Add Ingredients to Save'
                  : 'Save'}
            </button>
          </div>
        </div>
      }
    >
      <div className="flex max-h-[calc(100vh-200px)] flex-col space-y-6 overflow-hidden">
        {/* Recipe Metadata Section */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Recipe Name *</label>
            <input
              type="text"
              required
              value={editedName}
              onChange={e => setEditedName(e.target.value)}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
              placeholder="e.g., Chicken Stir-fry"
              onBlur={async e => {
                const name = e.target.value.trim().toLowerCase();
                if (!name || name === recipe.recipe_name.toLowerCase()) return;
                try {
                  const res = await fetch(`/api/recipes/exists?name=${encodeURIComponent(name)}`, {
                    cache: 'no-store',
                  });
                  const json = await res.json();
                  if (json?.exists) {
                    showWarning('A recipe with this name already exists.');
                  }
                } catch {}
              }}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Yield Portions</label>
            <input
              type="number"
              min="1"
              value={editedYield}
              onChange={e => setEditedYield(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Instructions</label>
            <textarea
              value={editedInstructions}
              onChange={e => setEditedInstructions(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
              placeholder="Step-by-step cooking instructions..."
            />
          </div>
        </div>

        {/* Ingredients/Consumables Section */}
        <div className="flex flex-1 flex-col overflow-hidden border-t border-[#2a2a2a] pt-6">
          {/* Tabs for Ingredients/Consumables */}
          <div className="mb-4 flex gap-2 rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-2">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                activeTab === 'ingredients'
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon icon={Package} size="sm" aria-hidden={true} />
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('consumables')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                activeTab === 'consumables'
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon icon={ShoppingBag} size="sm" aria-hidden={true} />
              Consumables
            </button>
          </div>

          <h3 className="mb-4 text-lg font-semibold text-white">
            {activeTab === 'ingredients' ? 'Ingredients' : 'Consumables'}
          </h3>

          {dataError && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {dataError}
            </div>
          )}

          {dataLoading || loadingIngredients ? (
            <div className="space-y-3">
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
            </div>
          ) : (
            <>
              {/* Ingredients/Consumables List */}
              <div className="mb-4 flex-1 overflow-y-auto">
                {activeTab === 'ingredients' ? (
                  ingredientCalculations.length > 0 ? (
                    <IngredientsList
                      calculations={ingredientCalculations}
                      onUpdateCalculation={(ingredientId, newQuantity) => {
                        updateCalculation(ingredientId, newQuantity, ingredients, setCalculations);
                      }}
                      onRemoveCalculation={ingredientId => {
                        setCalculations(prev =>
                          prev.filter(calc => calc.ingredientId !== ingredientId),
                        );
                      }}
                    />
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/50 text-gray-400">
                      <p>No ingredients added yet</p>
                    </div>
                  )
                ) : consumableCalculations.length > 0 ? (
                  <IngredientsList
                    calculations={consumableCalculations}
                    onUpdateCalculation={(ingredientId, newQuantity) => {
                      updateCalculation(ingredientId, newQuantity, ingredients, setCalculations);
                    }}
                    onRemoveCalculation={ingredientId => {
                      setCalculations(prev =>
                        prev.filter(calc => calc.ingredientId !== ingredientId),
                      );
                    }}
                  />
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/50 text-gray-400">
                    <p>No consumables added yet</p>
                  </div>
                )}
              </div>

              {/* Add Ingredient/Consumable Section */}
              <div className="border-t border-[#2a2a2a] pt-4">
                {activeTab === 'ingredients' ? (
                  <IngredientManager
                    showAddIngredient={showAddIngredient}
                    ingredients={ingredients}
                    ingredientSearch={ingredientSearch}
                    showSuggestions={showSuggestions}
                    filteredIngredients={filteredIngredients}
                    selectedIngredient={selectedIngredient}
                    highlightedIndex={highlightedIndex}
                    newIngredient={newIngredient}
                    onToggleAddIngredient={() => setShowAddIngredient(!showAddIngredient)}
                    onSearchChange={handleSearchChange}
                    onIngredientSelect={handleIngredientSelect}
                    onKeyDown={e => handleKeyDown(e, filteredIngredients)}
                    onQuantityChange={quantity => setNewIngredient(prev => ({ ...prev, quantity }))}
                    onUnitChange={unit => setNewIngredient(prev => ({ ...prev, unit }))}
                    onAddIngredient={handleAddIngredientWrapper}
                  />
                ) : (
                  <IngredientManager
                    showAddIngredient={showAddIngredient}
                    ingredients={consumables}
                    ingredientSearch={consumableSearch}
                    showSuggestions={showConsumableSuggestions}
                    filteredIngredients={filteredConsumables}
                    selectedIngredient={selectedConsumable}
                    highlightedIndex={consumableHighlightedIndex}
                    newIngredient={newConsumable}
                    onToggleAddIngredient={() => setShowAddIngredient(!showAddIngredient)}
                    onSearchChange={handleConsumableSearchChange}
                    onIngredientSelect={handleConsumableSelect}
                    onKeyDown={e => handleConsumableKeyDown(e, filteredConsumables)}
                    onQuantityChange={quantity => setNewConsumable(prev => ({ ...prev, quantity }))}
                    onUnitChange={unit => setNewConsumable(prev => ({ ...prev, unit }))}
                    onAddIngredient={handleAddConsumableWrapper}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </EditDrawer>
  );
}
