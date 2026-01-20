'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useEffect } from 'react';
import type { Recipe } from '../../cogs/types';
import { useDishBuilder } from '../hooks/useDishBuilder';
import CostAnalysisSection from './CostAnalysisSection';
import DishBuilderDragDrop from './DishBuilderDragDrop';
import DishDropZone from './DishDropZone';
import DishForm from './DishForm';
import { QuantityInputModal } from './QuantityInputModal';
import { useIngredientHandlers } from './hooks/useIngredientHandlers';
import { useRecipeExpansion } from './hooks/useRecipeExpansion';
import { useRecipeLoading } from './hooks/useRecipeLoading';
import { useDishSave } from './hooks/useSaveHandler';

interface DishBuilderClientProps {
  onSaveSuccess?: () => void;
  editingRecipe?: Recipe | null;
}

export default function DishBuilderClient({
  onSaveSuccess,
  editingRecipe,
}: DishBuilderClientProps) {
  const {
    ingredients,
    recipes,
    loading,
    error,
    setError,
    fetchData,
    dishState,
    setDishState,
    calculations,
    totalCOGS,
    costPerPortion,
    targetGrossProfit,
    pricingStrategy,
    pricingCalculation,
    allStrategyPrices,
    setTargetGrossProfit,
    setPricingStrategy,
    handleIngredientAdded,
    removeCalculation,
    editCalculation,
    clearCalculations,
    saveDish,
  } = useDishBuilder();

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Load recipe data when editing
  useRecipeLoading({
    editingRecipe,
    ingredients,
    setDishState,
    clearCalculations,
    handleIngredientAdded,
    setError,
  });

  // Recipe expansion handler
  const { expandingRecipe: _expandingRecipe, handleRecipeTap } = useRecipeExpansion({
    ingredients,
    handleIngredientAdded,
    setError,
  });

  // Ingredient handlers
  const {
    editingIngredient,
    editQuantity,
    setEditQuantity,
    showQuantityModal,
    selectedIngredient,
    handleIngredientTap,
    handleQuantityConfirm,
    handleQuantityCancel,
    handleEditIngredient,
    handleSaveEdit,
    handleCancelEdit,
    handleRemoveIngredient,
  } = useIngredientHandlers({
    calculations,
    handleIngredientAdded,
    editCalculation,
    removeCalculation,
  });

  // Save handler
  const { handleSave } = useDishSave({
    dishState,
    saveDish,
    setError,
    onSaveSuccess,
  });

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <>
      {/* Quantity Input Modal */}
      {selectedIngredient && (
        <QuantityInputModal
          isOpen={showQuantityModal}
          ingredientName={selectedIngredient.ingredient_name}
          unit={selectedIngredient.unit || 'kg'}
          defaultQuantity={1}
          onConfirm={handleQuantityConfirm}
          onCancel={handleQuantityCancel}
        />
      )}

      <div className="space-y-6">
        {error && (
          <div className="rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-4 text-[var(--color-error)]">
            {error}
          </div>
        )}

        <div className="large-desktop:grid-cols-2 grid grid-cols-1 gap-6">
          {/* Left Panel - Tap to Add */}
          <div>
            <DishBuilderDragDrop
              recipes={recipes}
              ingredients={ingredients}
              onRecipeTap={handleRecipeTap}
              onIngredientTap={handleIngredientTap}
              onConsumableTap={handleIngredientTap}
            />
          </div>

          {/* Right Panel - Dish Builder */}
          <DishDropZone hasIngredients={calculations.length > 0}>
            {/* Dish Form */}
            <DishForm
              dishState={dishState}
              setDishState={setDishState}
              recommendedPrice={pricingCalculation?.sellPriceInclGST || 0}
              ingredientCount={calculations.length}
              onSave={handleSave}
            />

            {/* Cost Analysis Section - Only show when ingredients are added */}
            {calculations.length > 0 && (
              <CostAnalysisSection
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
                targetGrossProfit={targetGrossProfit}
                pricingStrategy={pricingStrategy}
                pricingCalculation={pricingCalculation}
                allStrategyPrices={allStrategyPrices}
                onTargetGrossProfitChange={setTargetGrossProfit}
                onPricingStrategyChange={setPricingStrategy}
              />
            )}
          </DishDropZone>
        </div>
      </div>
    </>
  );
}
