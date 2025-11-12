'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useEffect, useState } from 'react';

// Components
import { COGSTable } from '../components/COGSTable';
import { DishForm } from '../components/DishForm';
import { IngredientManager } from '../components/IngredientManager';
import { PricingTool } from '../components/PricingTool';
import { SaveRecipeButton } from '../components/SaveRecipeButton';

// Hooks
import { useCOGSCalculations } from '../hooks/useCOGSCalculations';
import { useCOGSEffects } from '../hooks/useCOGSEffects';
import { useIngredientAddition } from '../hooks/useIngredientAddition';
import { useIngredientEditing } from '../hooks/useIngredientEditing';
import { useIngredientSearch } from '../hooks/useIngredientSearch';
import { usePricing } from '../hooks/usePricing';
import { useRecipeSaving } from '../hooks/useRecipeSaving';

// Components
import { COGSHeader } from '../components/COGSHeader';
import { SuccessMessage } from '../components/SuccessMessage';

// Types
import { DishFormData } from '../types';
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
    checkRecipeExists,
    setError,
  } = useCOGSCalculations();

  // Local state for dish form
  const [dishName, setDishName] = useState<string>('');
  const [dishPortions, setDishPortions] = useState<number>(1);

  // Pricing calculations
  const totalCOGS = calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);
  const costPerPortion = totalCOGS / (dishPortions || 1);

  const {
    targetGrossProfit,
    pricingStrategy,
    pricingCalculation,
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
    handleIngredientSelect,
    handleSearchChange,
    resetForm,
    setNewIngredient,
    setShowSuggestions,
  } = useIngredientSearch(ingredients);

  // Recipe saving functionality
  const {
    loading: saving,
    error: saveError,
    successMessage,
    saveAsRecipe,
    setError: setSaveError,
    setSuccessMessage,
  } = useRecipeSaving();

  // Additional local state
  const [dishNameLocked, setDishNameLocked] = useState(false);
  const [showAddIngredient, setShowAddIngredient] = useState(false);

  // Initialize data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // COGS effects hook
  const { recipeExists, checkingRecipe } = useCOGSEffects({
    checkRecipeExists,
    dishName,
    dishNameLocked,
    setSuccessMessage,
    setDishName,
    setDishPortions,
    setDishNameLocked,
    setShowSuggestions,
    loadCalculations,
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

  const handleToggleAddIngredient = () => {
    setShowAddIngredient(!showAddIngredient);
    // Lock dish name when starting to add ingredients
    if (!showAddIngredient && dishName.trim()) {
      setDishNameLocked(true);
    }
    // Unlock dish name when canceling add ingredient
    if (showAddIngredient) {
      setDishNameLocked(false);
    }
  };

  const handleAddIngredientWrapper = async (e: React.FormEvent) => {
    await handleAddIngredient(newIngredient, e);
  };

  const handleSaveAsRecipe = () => {
    saveAsRecipe(calculations, dishName, dishPortions);
    // Unlock dish name after successful save
    setDishNameLocked(false);
  };

  // Handle recipe selection from dropdown
  const handleRecipeSelect = (recipeId: string) => {
    setSelectedRecipe(recipeId);
    if (recipeId) {
      // Find the selected recipe and set dish name and portions
      const selectedRecipeData = recipes.find(r => r.id === recipeId);
      if (selectedRecipeData) {
        setDishName(selectedRecipeData.name);
        setDishPortions(selectedRecipeData.yield || 1);
      }
    } else {
      // Clear dish name when "Create new dish from scratch" is selected
      setDishName('');
      setDishPortions(1);
    }
  };

  // Prepare form data for DishForm
  const dishFormData: DishFormData = {
    dishName,
    dishPortions,
    dishNameLocked,
    recipeExists: recipeExists ?? false,
    checkingRecipe,
  };

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
      {(error || saveError) && (
        <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error || saveError}
        </div>
      )}

      {/* Success Message */}
      <SuccessMessage message={successMessage} onClose={() => setSuccessMessage(null)} />

      <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-2">
        {/* Left Column - Dish Creation */}
        <div>
          <DishForm
            formData={dishFormData}
            recipes={recipes}
            selectedRecipe={selectedRecipe}
            calculations={calculations}
            onDishNameChange={setDishName}
            onDishPortionsChange={setDishPortions}
            onRecipeSelect={handleRecipeSelect}
            onUpdateCalculation={updateCalculation}
            onRemoveCalculation={removeCalculation}
          />

          <IngredientManager
            showAddIngredient={showAddIngredient}
            ingredients={ingredients}
            ingredientSearch={ingredientSearch}
            showSuggestions={showSuggestions}
            filteredIngredients={filteredIngredients}
            selectedIngredient={selectedIngredient}
            newIngredient={newIngredient}
            onToggleAddIngredient={handleToggleAddIngredient}
            onSearchChange={handleSearchChange}
            onIngredientSelect={handleIngredientSelect}
            onQuantityChange={quantity => setNewIngredient({ ...newIngredient, quantity })}
            onUnitChange={unit => setNewIngredient({ ...newIngredient, unit })}
            onAddIngredient={handleAddIngredientWrapper}
          />
        </div>

        {/* Right Column - COGS Calculation */}
        <div className="rounded-lg bg-[#1f1f1f] p-4 shadow sm:p-6">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl">Cost Analysis</h2>

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
            onTargetGrossProfitChange={setTargetGrossProfit}
            onPricingStrategyChange={setPricingStrategy}
          />

          <SaveRecipeButton onSaveAsRecipe={handleSaveAsRecipe} />
        </div>
      </div>

      {recipes.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl text-gray-400">📊</div>
          <h3 className="mb-2 text-lg font-medium text-white">No recipes available</h3>
          <p className="mb-4 text-gray-500">Create some recipes first to calculate their COGS.</p>
          <a
            href="/webapp/recipes"
            className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-white transition-colors hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80"
          >
            Go to Recipes
          </a>
        </div>
      )}
    </>
  );
}
