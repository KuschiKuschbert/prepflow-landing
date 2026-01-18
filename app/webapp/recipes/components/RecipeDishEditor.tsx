'use client';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCOGSCalculationLogic } from '../../cogs/hooks/useCOGSCalculationLogic';
import { useCOGSDataFetching } from '../../cogs/hooks/useCOGSDataFetching';
import { useIngredientAddition } from '../../cogs/hooks/useIngredientAddition';
import { useIngredientConversion } from '../../cogs/hooks/useIngredientConversion';
import { useIngredientSearch } from '../../cogs/hooks/useIngredientSearch';
import { COGSCalculation } from '../../cogs/types';
import { Dish, Recipe } from '../types';
import { useRecipeDishEditorData } from './hooks/useRecipeDishEditorData';
import { useRecipeDishIngredientLoading } from './hooks/useRecipeDishIngredientLoading';
import { useRecipeDishSave } from './hooks/useRecipeDishSave';
import { EmptyState } from './RecipeDishEditor/components/EmptyState';
import { IngredientEditorPanel } from './RecipeDishEditor/components/IngredientEditorPanel';
import { CostSummary } from './RecipeDishEditor/CostSummary';
import { RecipeDishEditorHeader } from './RecipeDishEditor/Header';
import { useRecipeDishEditorHandlers } from './RecipeDishEditor/hooks/useRecipeDishEditorHandlers';
import { IngredientListPanel } from './RecipeDishEditor/IngredientListPanel';
import { RecipeDishSelector } from './RecipeDishEditor/RecipeDishSelector';

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
  const {
    ingredients,
    recipes,
    loading: dataLoading,
    error: dataError,
    setError,
    fetchData,
  } = useCOGSDataFetching();

  const { convertIngredientQuantity } = useIngredientConversion();
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
    setShowSuggestions: _setShowSuggestions,
  } = useIngredientSearch(ingredients);

  const { calculations, setCalculations, loadingIngredients } = useRecipeDishIngredientLoading({
    selectedItem,
    ingredients,
    recipes,
    allRecipes,
    convertIngredientQuantity,
    showError,
  });
  const { calculateCOGS: _calculateCOGS, updateCalculation } = useCOGSCalculationLogic({
    ingredients,
    setCalculations,
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
  const updateCalculationWrapper = useCallback(
    (ingredientId: string, quantity: number) => {
      updateCalculation(ingredientId, quantity, ingredients, setCalculations);
    },
    [ingredients, updateCalculation, setCalculations],
  );
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

  const { handleAddIngredientWrapper, handleIngredientClick } = useRecipeDishEditorHandlers({
    handleAddIngredient,
    newIngredient,
    setNewIngredient,
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    logger.dev('RecipeDishEditor: selectedItem changed', { selectedItem });
  }, [selectedItem]);

  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const ingredientCalculations = useMemo(
    () => calculations.filter(calc => !calc.isConsumable),
    [calculations],
  );
  const consumableCalculations = useMemo(
    () => calculations.filter(calc => calc.isConsumable),
    [calculations],
  );
  const totalCOGS = useMemo(
    () => calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0),
    [calculations],
  );

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
      <RecipeDishEditorHeader
        onClose={onClose}
        selectedItem={selectedItem}
        capitalizeName={capitalizeName}
      />
      <div className="large-desktop:grid-cols-2 grid grid-cols-1 gap-6">
        {selectedItem ? (
          <IngredientListPanel
            ingredients={ingredients}
            onIngredientClick={handleIngredientClick}
            onBack={() => setSelectedItem(null)}
            capitalizeName={capitalizeName}
          />
        ) : (
          <RecipeDishSelector
            allItems={allItems}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            capitalizeName={capitalizeName}
          />
        )}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          {!selectedItem ? (
            <EmptyState />
          ) : loadingIngredients && calculations.length === 0 ? (
            <div className="space-y-4">
              <LoadingSkeleton variant="text" width="w-48" height="h-6" />
              <LoadingSkeleton variant="card" />
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {capitalizeName(selectedItem.name)}
                  </h3>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    {selectedItem.type === 'recipe' ? 'Recipe' : 'Dish'} Ingredients & Consumables
                  </p>
                </div>
              </div>
              <CostSummary
                totalCOGS={totalCOGS}
                costPerPortion={costPerPortion}
                ingredientCount={ingredientCalculations.length}
                consumableCount={consumableCalculations.length}
                itemType={selectedItem.type}
              />
              <IngredientEditorPanel
                selectedItem={selectedItem}
                loadingIngredients={loadingIngredients}
                calculations={calculations}
                ingredientCalculations={ingredientCalculations}
                consumableCalculations={consumableCalculations}
                totalCOGS={totalCOGS}
                costPerPortion={costPerPortion}
                ingredients={ingredients}
                ingredientSearch={ingredientSearch}
                showSuggestions={showSuggestions}
                filteredIngredients={filteredIngredients}
                selectedIngredient={selectedIngredient}
                highlightedIndex={highlightedIndex}
                newIngredient={{
                  ingredient_id: newIngredient.ingredient_id,
                  quantity: newIngredient.quantity ?? 0,
                  unit: newIngredient.unit || 'kg',
                }}
                dataError={dataError}
                showAddIngredient={showAddIngredient}
                saving={saving}
                capitalizeName={capitalizeName}
                onToggleAddIngredient={() => {
                  setShowAddIngredient(!showAddIngredient);
                  setError('');
                }}
                onSearchChange={handleSearchChange}
                onIngredientSelect={handleIngredientSelect}
                onKeyDown={handleKeyDown}
                onQuantityChange={quantity => setNewIngredient(prev => ({ ...prev, quantity }))}
                onUnitChange={unit => setNewIngredient(prev => ({ ...prev, unit }))}
                onAddIngredient={handleAddIngredientWrapper}
                onUpdateCalculation={(ingredientId, newQuantity) => {
                  updateCalculation(ingredientId, newQuantity, ingredients, setCalculations);
                }}
                onRemoveCalculation={ingredientId => {
                  setCalculations(prev => prev.filter(calc => calc.ingredientId !== ingredientId));
                }}
                onSave={() => {
                  logger.dev('Save button clicked:', {
                    selectedItem,
                    calculationsCount: calculations.length,
                    saving,
                  });
                  handleSave();
                }}
              />
            </>
          )}
        </div>
      </div>

      {dataError && (
        <div className="rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-4 text-[var(--color-error)]">
          {dataError}
        </div>
      )}
    </div>
  );
}
