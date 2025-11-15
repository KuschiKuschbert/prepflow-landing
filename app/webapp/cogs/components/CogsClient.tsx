/**
 * @deprecated This component has been replaced by Dish Builder.
 *
 * The Dish Builder (app/webapp/dish-builder/components/DishBuilderClient.tsx) now provides
 * all COGS calculation functionality with a modern tap-to-add interface.
 *
 * The Calculator tab in Recipes page now renders DishBuilderClient instead of this component.
 *
 * This file is kept for reference only. Do not use in new code.
 */

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
import { useCOGSSorting } from '../hooks/useCOGSSorting';
import { useCOGSRecipeLoading } from '../hooks/useCOGSRecipeLoading';
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

  const { sortedCalculations, sortField, sortDirection, onSortChange } = useCOGSSorting(calculations);

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
  useCOGSRecipeLoading({
    selectedRecipe,
    recipes,
    hasManualIngredientsRef,
    lastManualChangeTimeRef,
    hasManualPortionsRef,
    lastPortionChangeTimeRef,
    loadExistingRecipeIngredients,
    handleDishPortionsFromRecipe,
  });
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
                onSortChange={onSortChange}
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
