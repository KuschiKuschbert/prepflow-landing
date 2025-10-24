'use client';

import { useEffect, useState } from 'react';
import { convertUnit } from '@/lib/unit-conversion';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Components
import { DishForm } from './components/DishForm';
import { IngredientManager } from './components/IngredientManager';
import { COGSTable } from './components/COGSTable';
import { PricingTool } from './components/PricingTool';
import { SaveRecipeButton } from './components/SaveRecipeButton';

// Hooks
import { useCOGSCalculations } from './hooks/useCOGSCalculations';
import { usePricing } from './hooks/usePricing';
import { useIngredientSearch } from './hooks/useIngredientSearch';
import { useRecipeSaving } from './hooks/useRecipeSaving';

// Types
import { DishFormData } from './types';

function COGSPageContent() {
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
  const [recipeExists, setRecipeExists] = useState<boolean | null>(null);
  const [checkingRecipe, setCheckingRecipe] = useState(false);
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  // Initialize data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle editing data from recipe book
  useEffect(() => {
    const editingData = sessionStorage.getItem('editingRecipe');
    if (editingData) {
      try {
        const { recipe, recipeId, calculations, dishName, dishPortions, dishNameLocked } =
          JSON.parse(editingData);

        console.log('🔍 DEBUG: Loading from sessionStorage with recipeId:', {
          dishName,
          recipeId,
          calculationsCount: calculations.length,
        });

        setDishName(dishName);
        setDishPortions(dishPortions);
        setDishNameLocked(dishNameLocked);

        // Clear the session storage
        sessionStorage.removeItem('editingRecipe');

        // Show success message
        setSuccessMessage(`Recipe "${dishName}" loaded for editing!`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        console.log('Failed to parse editing data:', err);
      }
    }
  }, [setSuccessMessage]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest('.ingredient-search-container') &&
        !target.closest('.suggestions-dropdown')
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced recipe check (only for manual dish name entry, not when editing from recipe book)
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (dishName.trim() && !dishNameLocked) {
        console.log('🔍 DEBUG: Running recipe check for:', dishName);
        setCheckingRecipe(true);
        const exists = await checkRecipeExists(dishName);
        setRecipeExists(exists);
        setCheckingRecipe(false);
      } else if (!dishName.trim()) {
        setRecipeExists(null);
      } else {
        console.log(
          '🔍 DEBUG: Skipping recipe check - dish name locked (editing from recipe book)',
        );
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [dishName, dishNameLocked, checkRecipeExists]);

  // Handle editing ingredient quantity
  const handleEditIngredient = (ingredientId: string, currentQuantity: number) => {
    setEditingIngredient(ingredientId);
    setEditQuantity(currentQuantity);
  };

  // Save edited ingredient quantity
  const handleSaveEdit = () => {
    if (editingIngredient && editQuantity > 0) {
      updateCalculation(editingIngredient, editQuantity);
    }
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  // Remove ingredient from calculations
  const handleRemoveIngredient = (ingredientId: string) => {
    removeCalculation(ingredientId);
  };

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

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredient.ingredient_id || !newIngredient.quantity) {
      setSaveError('Please select an ingredient and enter a quantity');
      return;
    }

    try {
      // Check if ingredient already exists
      const existingIngredient = calculations.find(
        calc => calc.ingredientId === newIngredient.ingredient_id,
      );

      if (existingIngredient) {
        // Update existing ingredient quantity with automatic unit conversion
        const selectedIngredientData = ingredients.find(
          ing => ing.id === newIngredient.ingredient_id,
        );
        if (selectedIngredientData) {
          // Automatic unit conversion: convert user input to ingredient's base unit
          let convertedQuantity = newIngredient.quantity!;
          let convertedUnit = newIngredient.unit || 'kg';
          let conversionNote = '';

          // If user entered volume units but ingredient is measured by weight (or vice versa)
          const userUnit = (newIngredient.unit || 'kg').toLowerCase().trim();
          const ingredientUnit = (selectedIngredientData.unit || 'kg').toLowerCase().trim();

          // Volume units
          const volumeUnits = [
            'tsp',
            'teaspoon',
            'tbsp',
            'tablespoon',
            'cup',
            'cups',
            'ml',
            'milliliter',
            'l',
            'liter',
            'litre',
            'fl oz',
            'fluid ounce',
          ];
          // Weight units
          const weightUnits = [
            'g',
            'gm',
            'gram',
            'grams',
            'kg',
            'kilogram',
            'oz',
            'ounce',
            'lb',
            'pound',
            'mg',
            'milligram',
          ];

          const isUserVolume = volumeUnits.includes(userUnit);
          const isUserWeight = weightUnits.includes(userUnit);
          const isIngredientVolume = volumeUnits.includes(ingredientUnit);
          const isIngredientWeight = weightUnits.includes(ingredientUnit);

          // Convert if there's a mismatch between user input and ingredient base unit
          if ((isUserVolume && isIngredientWeight) || (isUserWeight && isIngredientVolume)) {
            const conversionResult = convertUnit(
              newIngredient.quantity!,
              newIngredient.unit || 'kg',
              selectedIngredientData.unit || 'kg',
            );
            convertedQuantity = newIngredient.quantity! * conversionResult.conversionFactor;
            convertedUnit = selectedIngredientData.unit || 'kg';
            conversionNote = ` (converted from ${newIngredient.quantity} ${newIngredient.unit || 'kg'})`;
          }

          // Update the calculation with new quantity
          const currentCalc = calculations.find(
            calc => calc.ingredientId === newIngredient.ingredient_id,
          );
          if (currentCalc) {
            const newQuantity = currentCalc.quantity + convertedQuantity;
            updateCalculation(newIngredient.ingredient_id!, newQuantity);
          }
        }
      } else {
        // Add new ingredient with automatic unit conversion
        const selectedIngredientData = ingredients.find(
          ing => ing.id === newIngredient.ingredient_id,
        );
        if (selectedIngredientData) {
          // Automatic unit conversion: convert user input to ingredient's base unit
          let convertedQuantity = newIngredient.quantity!;
          let convertedUnit = newIngredient.unit || 'kg';
          let conversionNote = '';

          // If user entered volume units but ingredient is measured by weight (or vice versa)
          const userUnit = (newIngredient.unit || 'kg').toLowerCase().trim();
          const ingredientUnit = (selectedIngredientData.unit || 'kg').toLowerCase().trim();

          // Volume units
          const volumeUnits = [
            'tsp',
            'teaspoon',
            'tbsp',
            'tablespoon',
            'cup',
            'cups',
            'ml',
            'milliliter',
            'l',
            'liter',
            'litre',
            'fl oz',
            'fluid ounce',
          ];
          // Weight units
          const weightUnits = [
            'g',
            'gm',
            'gram',
            'grams',
            'kg',
            'kilogram',
            'oz',
            'ounce',
            'lb',
            'pound',
            'mg',
            'milligram',
          ];

          const isUserVolume = volumeUnits.includes(userUnit);
          const isUserWeight = weightUnits.includes(userUnit);
          const isIngredientVolume = volumeUnits.includes(ingredientUnit);
          const isIngredientWeight = weightUnits.includes(ingredientUnit);

          // Convert if there's a mismatch between user input and ingredient base unit
          if ((isUserVolume && isIngredientWeight) || (isUserWeight && isIngredientVolume)) {
            const conversionResult = convertUnit(
              newIngredient.quantity!,
              newIngredient.unit || 'kg',
              selectedIngredientData.unit || 'kg',
            );
            convertedQuantity = newIngredient.quantity! * conversionResult.conversionFactor;
            convertedUnit = selectedIngredientData.unit || 'kg';
            conversionNote = ` (converted from ${newIngredient.quantity} ${newIngredient.unit || 'kg'})`;
          }

          // Create new calculation
          const baseCostPerUnit =
            selectedIngredientData.cost_per_unit_incl_trim ||
            selectedIngredientData.cost_per_unit ||
            0;
          const costPerUnit = baseCostPerUnit; // Simplified for now
          const totalCost = convertedQuantity * costPerUnit;

          // Apply waste and yield adjustments
          const wastePercent = selectedIngredientData.trim_peel_waste_percentage || 0;
          const yieldPercent = selectedIngredientData.yield_percentage || 100;
          const wasteAdjustedCost = totalCost * (1 + wastePercent / 100);
          const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);

          const newCalculation = {
            recipeId: selectedRecipe || 'temp',
            ingredientId: newIngredient.ingredient_id!,
            ingredientName: selectedIngredientData.ingredient_name + conversionNote,
            quantity: convertedQuantity,
            unit: convertedUnit,
            costPerUnit: costPerUnit,
            totalCost: totalCost,
            wasteAdjustedCost: wasteAdjustedCost,
            yieldAdjustedCost: yieldAdjustedCost,
          };

          addCalculation(newCalculation);
        }
      }

      // Reset form
      resetForm();
    } catch (err) {
      setSaveError('Failed to add ingredient');
    }
  };

  const handleSaveAsRecipe = () => {
    saveAsRecipe(calculations, dishName, dishPortions);
    // Unlock dish name after successful save
    setDishNameLocked(false);
  };

  // Prepare form data for DishForm
  const dishFormData: DishFormData = {
    dishName,
    dishPortions,
    dishNameLocked,
    recipeExists,
    checkingRecipe,
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">💰 COGS Calculator</h1>
          <p className="text-gray-400">
            Calculate Cost of Goods Sold and optimize your profit margins
          </p>
        </div>

        {/* Error Display */}
        {(error || saveError) && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error || saveError}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="animate-in slide-in-from-top-2 mb-6 scale-105 transform rounded-2xl border-2 border-green-400 bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-5 text-white shadow-2xl transition-all duration-300 duration-500 hover:scale-110">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-white">{successMessage}</p>
                <p className="mt-1 text-sm font-medium text-green-100">
                  🎉 Your recipe has been added to the Recipe Book and is ready to use!
                </p>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="flex-shrink-0 rounded-full p-2 text-white/80 transition-all duration-200 hover:bg-white/20 hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-2">
          {/* Left Column - Dish Creation */}
          <div>
            <DishForm
              formData={dishFormData}
              recipes={recipes}
              selectedRecipe={selectedRecipe}
              onDishNameChange={setDishName}
              onDishPortionsChange={setDishPortions}
              onRecipeSelect={setSelectedRecipe}
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
              onAddIngredient={handleAddIngredient}
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
      </div>
    </div>
  );
}

export default function COGSPage() {
  return (
    <ErrorBoundary>
      <COGSPageContent />
    </ErrorBoundary>
  );
}
