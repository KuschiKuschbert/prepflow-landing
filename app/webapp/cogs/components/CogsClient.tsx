'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useEffect, useMemo, useState } from 'react';

// Components
import { COGSTable } from '../components/COGSTable';
import { CreateRecipeModal } from '../components/CreateRecipeModal';
import { DishForm } from '../components/DishForm';
import { PricingTool } from '../components/PricingTool';
import { useCOGSAutosave } from '../hooks/useCOGSAutosave';
import { useCOGSCalculations } from '../hooks/useCOGSCalculations';
import { useCOGSEffects } from '../hooks/useCOGSEffects';
import { useCOGSLoadingGate } from '../hooks/useCOGSLoadingGate';
import { useDishHandlers } from '../hooks/useDishHandlers';
import { useIngredientAddition } from '../hooks/useIngredientAddition';
import { useIngredientEditing } from '../hooks/useIngredientEditing';
import { useIngredientSearch } from '../hooks/useIngredientSearch';
import { usePricing } from '../hooks/usePricing';
import { usePortionHandling } from '../hooks/usePortionHandling';
import { useRecipeCRUD } from '../hooks/useRecipeCRUD';
import { useRecipeHandlers } from '../hooks/useRecipeHandlers';
import { COGSEmptyState } from '../components/COGSEmptyState';
import { COGSErrorDisplay } from '../components/COGSErrorDisplay';
import { COGSHeader } from '../components/COGSHeader';
import { RecipeNotFoundWarning } from '../components/RecipeNotFoundWarning';
import { SuccessMessage } from '../components/SuccessMessage';
export default function CogsClient() {
  const {
    ingredients,
    recipes,
    selectedRecipe,
    calculations,
    loading,
    error,
    fetchData,
    setSelectedRecipe,
    updateCalculation,
    removeCalculation,
    addCalculation,
    loadCalculations,
    loadExistingRecipeIngredients,
    setError,
    hasManualIngredientsRef,
    lastManualChangeTimeRef,
  } = useCOGSCalculations();

  const [dishPortions, setDishPortions] = useState<number>(1);
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'ingredient_name' | 'quantity' | 'cost'>('ingredient_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const {
    hasManualPortionsRef,
    lastPortionChangeTimeRef,
    handleDishPortionsChange,
    handleDishPortionsFromRecipe,
  } = usePortionHandling({ setDishPortions });

  const { createOrUpdateRecipe } = useRecipeCRUD({ setError: setSaveError });

  // Memoize selectedRecipeData to prevent unnecessary re-renders and effect triggers
  const selectedRecipeData = useMemo(
    () => recipes.find(r => r.id === selectedRecipe),
    [recipes, selectedRecipe],
  );

  const {
    autosaveStatus,
    ingredientsAutosaveError,
    saveNow: saveNowAutosave,
  } = useCOGSAutosave({
    selectedRecipe,
    selectedRecipeData,
    dishPortions,
    calculations,
    onError: err => setSaveError(err),
  });

  const recipeExistsLocally = Boolean(selectedRecipeData);

  // Sort calculations
  const sortedCalculations = useMemo(() => {
    const sorted = [...calculations];
    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'ingredient_name':
          aValue = a.ingredientName.toLowerCase();
          bValue = b.ingredientName.toLowerCase();
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'cost':
          aValue = a.yieldAdjustedCost;
          bValue = b.yieldAdjustedCost;
          break;
        default:
          aValue = a.ingredientName.toLowerCase();
          bValue = b.ingredientName.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    return sorted;
  }, [calculations, sortField, sortDirection]);

  const totalCOGS = calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);
  const costPerPortion = totalCOGS / (dishPortions || 1);

  const {
    targetGrossProfit,
    pricingStrategy,
    pricingCalculation,
    allStrategyPrices,
    setTargetGrossProfit,
    setPricingStrategy,
  } = usePricing(costPerPortion);

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useCOGSEffects({
    setSuccessMessage,
    setDishPortions,
    setShowSuggestions,
    loadCalculations,
    setSelectedRecipe,
  });
  useEffect(() => {
    // Only run when selectedRecipe ID changes, not when selectedRecipeData object reference changes
    if (!selectedRecipe) return;

    // Derive selectedRecipeData inside effect to avoid dependency on object reference
    const recipeData = recipes.find(r => r.id === selectedRecipe);
    if (!recipeData) return;

    if (hasManualIngredientsRef?.current) {
      console.log('[CogsClient] Skipping loadExistingRecipeIngredients - manual changes exist');
      return;
    }
    const timeSinceLastChange = Date.now() - (lastManualChangeTimeRef?.current || 0);
    if (timeSinceLastChange < 10000) {
      console.log('[CogsClient] Skipping loadExistingRecipeIngredients - recent change detected');
      return;
    }
    // Only reset portions if they haven't been manually changed
    if (!hasManualPortionsRef.current) {
      const timeSincePortionChange = Date.now() - (lastPortionChangeTimeRef.current || 0);
      if (timeSincePortionChange > 10000) {
        handleDishPortionsFromRecipe(recipeData.yield || 1);
      }
    }
    loadExistingRecipeIngredients(selectedRecipe);
  }, [
    selectedRecipe,
    recipes,
    loadExistingRecipeIngredients,
    hasManualIngredientsRef,
    lastManualChangeTimeRef,
    hasManualPortionsRef,
    lastPortionChangeTimeRef,
    handleDishPortionsFromRecipe,
  ]);
  const { handleToggleAddIngredient } = useDishHandlers({
    showAddIngredient,
    dishName: selectedRecipeData?.name || '',
    recipes,
    recipeExists: null,
    selectedRecipe,
    loadExistingRecipeIngredients,
    setShowAddIngredient,
    setDishName: () => {}, // Not used anymore
    setDishPortions,
    setDishNameLocked: () => {}, // Not used anymore
    setSelectedRecipe,
  });
  const { handleAddIngredient } = useIngredientAddition({
    calculations,
    ingredients,
    selectedRecipe,
    addCalculation,
    updateCalculation,
    resetForm,
    setSaveError,
  });

  const {
    editingIngredient,
    editQuantity,
    setEditQuantity,
    handleEditIngredient,
    handleSaveEdit,
    handleCancelEdit,
    handleRemoveIngredient,
  } = useIngredientEditing({
    updateCalculation,
    removeCalculation,
    saveNow: saveNowAutosave,
  });
  const handleAddIngredientWrapper = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAddIngredient(newIngredient, e);
  };
  const { handleRecipeSelect, handleCreateNewRecipe, handleCreateRecipe, handleFinishRecipe } =
    useRecipeHandlers({
      recipes,
      selectedRecipe,
      dishPortions,
      calculations,
      setSelectedRecipe,
      setDishPortions: handleDishPortionsFromRecipe,
      setShowCreateModal,
      createOrUpdateRecipe,
      fetchData,
      setSuccessMessage,
      saveNow: saveNowAutosave,
      setSaveError,
    });
  useCOGSLoadingGate(loading);
  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <>
      <COGSHeader />

      <COGSErrorDisplay
        error={error}
        saveError={saveError}
        ingredientsAutosaveError={ingredientsAutosaveError}
      />
      {selectedRecipe && !recipeExistsLocally && (
        <RecipeNotFoundWarning
          onClearAndRefresh={() => {
            setSelectedRecipe('');
            fetchData();
          }}
        />
      )}

      <SuccessMessage message={successMessage} onClose={() => setSuccessMessage(null)} />

      <CreateRecipeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRecipe={handleCreateRecipe}
        onSuccess={() => setShowCreateModal(false)}
      />

      <div className="grid grid-cols-1 gap-4 tablet:gap-8 large-desktop:grid-cols-2">
        <div>
          <DishForm
            recipes={recipes}
            selectedRecipe={selectedRecipe}
            calculations={calculations}
            dishPortions={dishPortions}
            showAddIngredient={showAddIngredient}
            ingredients={ingredients}
            ingredientSearch={ingredientSearch}
            showSuggestions={showSuggestions}
            filteredIngredients={filteredIngredients}
            selectedIngredient={selectedIngredient}
            highlightedIndex={highlightedIndex}
            newIngredient={newIngredient}
            autosaveStatus={autosaveStatus}
            onRecipeSelect={handleRecipeSelect}
            onCreateNewRecipe={handleCreateNewRecipe}
            onDishPortionsChange={handleDishPortionsChange}
            onUpdateCalculation={updateCalculation}
            onRemoveCalculation={removeCalculation}
            onToggleAddIngredient={handleToggleAddIngredient}
            onSearchChange={handleSearchChange}
            onIngredientSelect={handleIngredientSelect}
            onKeyDown={(e, filtered) => handleKeyDown(e, filtered)}
            onQuantityChange={q => setNewIngredient({ ...newIngredient, quantity: q })}
            onUnitChange={u => setNewIngredient({ ...newIngredient, unit: u })}
            onAddIngredient={handleAddIngredientWrapper}
            onFinishRecipe={handleFinishRecipe}
          />
        </div>

        <div className="rounded-lg bg-[#1f1f1f] p-4 shadow tablet:p-6">
          <h2 className="mb-4 text-lg font-semibold tablet:text-xl">Cost Analysis</h2>
          {selectedRecipe ? (
            <>
              <COGSTable
                calculations={sortedCalculations}
                editingIngredient={editingIngredient}
                editQuantity={editQuantity}
                onEditIngredient={handleEditIngredient}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onRemoveIngredient={handleRemoveIngredient}
                onEditQuantityChange={setEditQuantity}
                totalCOGS={totalCOGS}
                costPerPortion={costPerPortion}
                dishPortions={dishPortions}
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={(field, direction) => {
                  setSortField(field);
                  setSortDirection(direction);
                }}
              />

              <PricingTool
                costPerPortion={costPerPortion}
                targetGrossProfit={targetGrossProfit}
                pricingStrategy={pricingStrategy}
                pricingCalculation={pricingCalculation}
                allStrategyPrices={allStrategyPrices}
                onTargetGrossProfitChange={setTargetGrossProfit}
                onPricingStrategyChange={setPricingStrategy}
              />
            </>
          ) : (
            <COGSEmptyState />
          )}
        </div>
      </div>
    </>
  );
}
