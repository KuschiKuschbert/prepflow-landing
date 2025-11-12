'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useEffect, useState } from 'react';

// Components
import { COGSTable } from '../components/COGSTable';
import { DishForm } from '../components/DishForm';
import { PricingTool } from '../components/PricingTool';
import { CreateRecipeModal } from '../components/CreateRecipeModal';

// Hooks
import { useCOGSCalculations } from '../hooks/useCOGSCalculations';
import { useCOGSEffects } from '../hooks/useCOGSEffects';
import { useDishHandlers } from '../hooks/useDishHandlers';
import { useIngredientAddition } from '../hooks/useIngredientAddition';
import { useIngredientEditing } from '../hooks/useIngredientEditing';
import { useIngredientSearch } from '../hooks/useIngredientSearch';
import { usePricing } from '../hooks/usePricing';
import { useRecipeCRUD } from '../hooks/useRecipeCRUD';
import { useRecipeHandlers } from '../hooks/useRecipeHandlers';
import { useCOGSAutosave } from '../hooks/useCOGSAutosave';

// Components
import { COGSHeader } from '../components/COGSHeader';
import { SuccessMessage } from '../components/SuccessMessage';

// Types
import { Recipe } from '../types';
import { startLoadingGate, stopLoadingGate } from '@/lib/loading-gate';

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
  const { autosaveStatus, ingredientsAutosaveError } = useCOGSAutosave({
    selectedRecipe,
    selectedRecipeData,
    dishPortions,
    calculations,
    onError: err => setSaveError(err),
  });

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

  // Load recipe data when selected
  useEffect(() => {
    if (selectedRecipe && selectedRecipeData) {
      setDishPortions(selectedRecipeData.yield || 1);
      loadExistingRecipeIngredients(selectedRecipe);
    }
  }, [selectedRecipe, selectedRecipeData, loadExistingRecipeIngredients]);

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
      setSelectedRecipe,
      setDishPortions,
      setShowCreateModal,
      createOrUpdateRecipe,
      fetchData,
      setSuccessMessage,
    });

  // Gate the arcade overlay while COGS data is loading
  useEffect(() => {
    if (loading) {
      startLoadingGate('cogs');
    } else {
      stopLoadingGate('cogs');
    }
    return () => {
      stopLoadingGate('cogs');
    };
  }, [loading]);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <>
      {/* Header */}
      <COGSHeader />

      {/* Error Display */}
      {(error || saveError || ingredientsAutosaveError) && (
        <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error || saveError || ingredientsAutosaveError}
        </div>
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
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl text-gray-400">📊</div>
              <h3 className="mb-2 text-lg font-medium text-white">Select a Recipe</h3>
              <p className="text-gray-500">
                Choose or create a recipe to see cost analysis and pricing calculations.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
