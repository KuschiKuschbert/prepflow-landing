'use client';

import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
import { EditDrawer } from '@/components/ui/EditDrawer';
import { useEffect } from 'react';
import { useDishCostCalculation } from '../hooks/useDishCostCalculation';
import { useDishForm } from '../hooks/useDishForm';
import { Dish } from '../types';
import { DishBasicInfo } from './DishBasicInfo';
import DishFormPricing from './DishFormPricing';
import DishIngredientSelector from './DishIngredientSelector';
import DishRecipeSelector from './DishRecipeSelector';

interface DishEditDrawerProps {
  isOpen: boolean;
  dish: Dish | null;
  onClose: () => void;
  onSave: () => void;
}

export function DishEditDrawer({ isOpen, dish, onClose, onSave }: DishEditDrawerProps) {
  const {
    dishName,
    setDishName,
    description,
    setDescription,
    sellingPrice,
    setSellingPrice,
    recipes,
    ingredients,
    selectedRecipes,
    setSelectedRecipes,
    selectedIngredients,
    setSelectedIngredients,
    priceOverride,
    setPriceOverride,
    status,
    autosaveError,
    saveNow,
    handleSave,
  } = useDishForm({
    dish,
    isOpen,
    onSave,
    onClose,
  });

  // Calculate dish cost and recommended price
  const {
    totalCost,
    recommendedPrice,
    loading: costLoading,
  } = useDishCostCalculation(selectedRecipes, selectedIngredients, recipes, ingredients);

  useEffect(() => {
    if (
      !dish &&
      !priceOverride &&
      recommendedPrice > 0 &&
      (selectedRecipes.length > 0 || selectedIngredients.length > 0)
    ) {
      setSellingPrice(recommendedPrice.toFixed(2));
    }
  }, [recommendedPrice, priceOverride, dish, selectedRecipes.length, selectedIngredients.length]);

  return (
    <EditDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={dish ? `Edit ${dish.dish_name}` : 'Create Dish'}
      maxWidth="4xl"
      onSave={handleSave}
      saving={status === 'saving'}
      footer={
        <div className="flex items-center justify-between">
          <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl bg-[var(--muted)] px-4 py-2.5 font-semibold text-[var(--foreground)] transition-all duration-300 hover:bg-[var(--surface-variant)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={status === 'saving'}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2.5 font-semibold text-[var(--button-active-text)] transition-all duration-300 hover:shadow-[var(--primary)]/25 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'saving' ? 'Saving...' : dish ? 'Update Dish' : 'Create Dish'}
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={e => e.preventDefault()} className="space-y-6">
        <DishBasicInfo
          dishName={dishName}
          description={description}
          setDishName={setDishName}
          setDescription={setDescription}
        />

        <DishFormPricing
          totalCost={totalCost}
          recommendedPrice={recommendedPrice}
          sellingPrice={sellingPrice}
          costLoading={costLoading}
          priceOverride={priceOverride}
          onPriceChange={setSellingPrice}
          onPriceOverride={() => {
            setPriceOverride(true);
            setSellingPrice(recommendedPrice.toFixed(2));
          }}
          onUseAutoPrice={() => {
            setPriceOverride(false);
            setSellingPrice(recommendedPrice.toFixed(2));
          }}
        />

        {/* Recipes Section */}
        <DishRecipeSelector
          recipes={recipes}
          selectedRecipes={selectedRecipes}
          onRecipesChange={setSelectedRecipes}
        />

        {/* Ingredients Section */}
        <DishIngredientSelector
          ingredients={ingredients}
          selectedIngredients={selectedIngredients}
          onIngredientsChange={setSelectedIngredients}
        />
      </form>
    </EditDrawer>
  );
}
