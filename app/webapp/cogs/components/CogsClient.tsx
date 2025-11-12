'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useEffect, useState } from 'react';

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
import { useRecipeCRUD } from '../hooks/useRecipeCRUD';
import { useRecipeHandlers } from '../hooks/useRecipeHandlers';
import { COGSEmptyState } from '../components/COGSEmptyState';
import { COGSErrorDisplay } from '../components/COGSErrorDisplay';
import { COGSHeader } from '../components/COGSHeader';
import { RecipeNotFoundWarning } from '../components/RecipeNotFoundWarning';
import { SuccessMessage } from '../components/SuccessMessage';
export default function CogsClient() {
  // Main COGS calculations hook
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

  // Local state
  const [dishPortions, setDishPortions] = useState<number>(1);
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Recipe CRUD operations
  const { createOrUpdateRecipe } = useRecipeCRUD({ setError: setSaveError });

  // Get selected recipe data
  const selectedRecipeData = recipes.find(r => r.id === selectedRecipe);

  // Autosave logic
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

  // Check if selected recipe exists in local recipes list
  const recipeExistsLocally = Boolean(selectedRecipeData);
  // Pricing calculations
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

  // Ingredient search functionality
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

  // Initialize data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // COGS effects hook (for recipe book editing)
  useCOGSEffects({
    setSuccessMessage,
    setDishPortions,
    setShowSuggestions,
    loadCalculations,
    setSelectedRecipe,
  });

  // Load recipe data when selected (but skip if we have manual changes)
  useEffect(() => {
    if (selectedRecipe && selectedRecipeData) {
      const timeSinceLastChange = Date.now() - (lastManualChangeTimeRef?.current || 0);
      if (hasManualIngredientsRef?.current || timeSinceLastChange < 3000) return;
      setDishPortions(selectedRecipeData.yield || 1);
      loadExistingRecipeIngredients(selectedRecipe);
    }
  }, [
    selectedRecipe,
    selectedRecipeData,
    loadExistingRecipeIngredients,
    hasManualIngredientsRef,
    lastManualChangeTimeRef,
  ]);

  // Dish handlers hook (simplified - only for toggle add ingredient)
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

  // Ingredient addition hook
  const { handleAddIngredient } = useIngredientAddition({
    calculations,
    ingredients,
    selectedRecipe,
    addCalculation,
    updateCalculation,
    resetForm,
    setSaveError,
  });

  // Ingredient editing hook
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
  // Recipe handlers
  const { handleRecipeSelect, handleCreateNewRecipe, handleCreateRecipe, handleFinishRecipe } =
    useRecipeHandlers({
      recipes,
      selectedRecipe,
      dishPortions,
      calculations,
      setSelectedRecipe,
      setDishPortions,
      setShowCreateModal,
      createOrUpdateRecipe,
      fetchData,
      setSuccessMessage,
      saveNow: saveNowAutosave,
      setSaveError,
    });

  // Gate the arcade overlay while COGS data is loading
  useCOGSLoadingGate(loading);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <>
      <COGSHeader />

      {/* Error Display */}
      <COGSErrorDisplay
        error={error}
        saveError={saveError}
        ingredientsAutosaveError={ingredientsAutosaveError}
      />

      {/* Recipe Not Found Warning */}
      {selectedRecipe && !recipeExistsLocally && (
        <RecipeNotFoundWarning
          onClearAndRefresh={() => {
            setSelectedRecipe('');
            fetchData();
          }}
        />
      )}

      {/* Success Message */}
      <SuccessMessage message={successMessage} onClose={() => setSuccessMessage(null)} />

      <CreateRecipeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRecipe={handleCreateRecipe}
        onSuccess={() => setShowCreateModal(false)}
      />

      <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-2">
        {/* Left Column - Recipe & Ingredients */}
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
            onDishPortionsChange={setDishPortions}
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

        {/* Right Column - COGS Calculation */}
        <div className="rounded-lg bg-[#1f1f1f] p-4 shadow sm:p-6">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl">Cost Analysis</h2>

          {selectedRecipe ? (
            <>
              <COGSTable
                calculations={calculations}
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
