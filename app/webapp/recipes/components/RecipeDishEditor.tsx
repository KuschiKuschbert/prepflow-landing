'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { Recipe, Dish } from '../types';
import { useCOGSDataFetching } from '../../cogs/hooks/useCOGSDataFetching';
import { useCOGSCalculationLogic } from '../../cogs/hooks/useCOGSCalculationLogic';
import { useIngredientConversion } from '../../cogs/hooks/useIngredientConversion';
import { IngredientsList } from '../../cogs/components/IngredientsList';
import { IngredientManager } from '../../cogs/components/IngredientManager';
import { useIngredientAddition } from '../../cogs/hooks/useIngredientAddition';
import { useIngredientSearch } from '../../cogs/hooks/useIngredientSearch';
import { useNotification } from '@/contexts/NotificationContext';
import { Icon } from '@/components/ui/Icon';
import { Save } from 'lucide-react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useRecipeDishEditorData } from './hooks/useRecipeDishEditorData';
import { useRecipeDishIngredientLoading } from './hooks/useRecipeDishIngredientLoading';
import { useRecipeDishSave } from './hooks/useRecipeDishSave';
import { RecipeDishEditorHeader } from './RecipeDishEditor/Header';
import { RecipeDishSelector } from './RecipeDishEditor/RecipeDishSelector';
import { CostSummary } from './RecipeDishEditor/CostSummary';
import { logger } from '../../lib/logger';

interface RecipeDishEditorProps {
  item?: Recipe | Dish | null;
  itemType?: 'recipe' | 'dish';
  onClose: () => void;
  onSave: () => void;
}

export function RecipeDishEditor({ item, itemType, onClose, onSave }: RecipeDishEditorProps) {
  const { showError, showSuccess } = useNotification();
  const { allRecipes, allDishes, selectedItem, setSelectedItem, loading, allItems } =
    useRecipeDishEditorData(item, itemType);

  // Data fetching
  const {
    ingredients,
    recipes,
    loading: dataLoading,
    error: dataError,
    setError,
    fetchData,
  } = useCOGSDataFetching();

  // Calculation logic
  const { calculateCOGS, updateCalculation } = useCOGSCalculationLogic({
    ingredients,
    setCalculations,
  });

  const { convertIngredientQuantity } = useIngredientConversion();

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
    setShowSuggestions,
  } = useIngredientSearch(ingredients);

  const { calculations, setCalculations, loadingIngredients } = useRecipeDishIngredientLoading({
    selectedItem,
    ingredients,
    recipes,
    allRecipes,
    convertIngredientQuantity,
    showError,
  });
  const { saving, handleSave } = useRecipeDishSave({
    selectedItem,
    calculations,
    allRecipes,
    allDishes,
    onSave,
    showError,
    showSuccess,
  });

  // Wrapper for updateCalculation to match useIngredientAddition signature
  const updateCalculationWrapper = useCallback(
    (ingredientId: string, quantity: number) => {
      updateCalculation(ingredientId, quantity, ingredients, setCalculations);
    },
    [ingredients, updateCalculation],
  );

  // Ingredient addition
  const { handleAddIngredient } = useIngredientAddition({
    calculations,
    ingredients,
    selectedRecipe: selectedItem?.type === 'recipe' ? selectedItem.id : null,
    addCalculation: (calc: COGSCalculation) => {
      setCalculations(prev => [...prev, calc]);
    },
    updateCalculation: updateCalculationWrapper,
    resetForm,
    setSaveError: setError,
  });

  const handleAddIngredientWrapper = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAddIngredient(newIngredient, e);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [showAddIngredient, setShowAddIngredient] = useState(false);

  // Calculate totals
  const totalCOGS = useMemo(() => {
    return calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);
  }, [calculations]);

  const costPerPortion = useMemo(() => {
    if (!selectedItem) return 0;
    if (selectedItem.type === 'recipe') {
      const recipe = allRecipes.find(r => r.id === selectedItem.id);
      return totalCOGS / (recipe?.yield || 1);
    } else {
      return totalCOGS; // Dishes are single-serving
    }
  }, [totalCOGS, selectedItem, allRecipes]);

  const capitalizeName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Show loading only for initial data fetch, not for ingredient loading
  if (dataLoading || (loading && allItems.length === 0)) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="text" width="w-64" height="h-8" />
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RecipeDishEditorHeader onClose={onClose} />
      <div className="large-desktop:grid-cols-2 grid grid-cols-1 gap-6">
        <RecipeDishSelector
          allItems={allItems}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
          capitalizeName={capitalizeName}
        />

        {/* Right Column - Ingredient Editor */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          {!selectedItem ? (
            <div className="flex h-full min-h-[400px] items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="mb-2 text-lg">Select a recipe or dish</p>
                <p className="text-sm">Choose an item from the left to edit its ingredients</p>
              </div>
            </div>
          ) : loadingIngredients && calculations.length === 0 ? (
            // Only show skeleton if we have no calculations to display
            <div className="space-y-4">
              <LoadingSkeleton variant="text" width="w-48" height="h-6" />
              <LoadingSkeleton variant="card" />
            </div>
          ) : (
            <div
              className={`flex h-full flex-col transition-opacity duration-200 ${loadingIngredients ? 'opacity-60' : 'opacity-100'}`}
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {capitalizeName(selectedItem.name)}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {selectedItem.type === 'recipe' ? 'Recipe' : 'Dish'} Ingredients
                  </p>
                </div>
              </div>

              <CostSummary
                totalCOGS={totalCOGS}
                costPerPortion={costPerPortion}
                ingredientCount={calculations.length}
                itemType={selectedItem.type}
              />

              {/* Ingredients List */}
              <div className="mb-6 flex-1 overflow-y-auto">
                {calculations.length > 0 ? (
                  <IngredientsList
                    calculations={calculations}
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
                  <div className="flex h-32 items-center justify-center text-gray-400">
                    <p>No ingredients added yet</p>
                  </div>
                )}
              </div>

              {/* Add Ingredient Section */}
              <div className="border-t border-[#2a2a2a] pt-4">
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
              </div>

              {/* Save Button */}
              <div className="mt-4 border-t border-[#2a2a2a] pt-4">
                <button
                  onClick={() => {
                    logger.dev('Save button clicked:', {
                      selectedItem,
                      calculationsCount: calculations.length,
                      saving,
                    });
                    handleSave();
                  }}
                  disabled={saving || calculations.length === 0 || !selectedItem}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#29E7CD]/25 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={
                    saving
                      ? 'Saving changes...'
                      : calculations.length === 0
                        ? 'Add at least one ingredient to save'
                        : !selectedItem
                          ? 'Please select a recipe or dish'
                          : 'Save changes'
                  }
                >
                  <Icon icon={Save} size="sm" className="text-white" aria-hidden={true} />
                  <span>
                    {saving
                      ? 'Saving...'
                      : calculations.length === 0
                        ? 'Add Ingredients to Save'
                        : 'Save Changes'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {dataError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {dataError}
        </div>
      )}
    </div>
  );
}
