'use client';

import { useEffect, useState } from 'react';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useDishBuilder } from '../hooks/useDishBuilder';
import DishBuilderDragDrop from './DishBuilderDragDrop';
import DishForm from './DishForm';
import DishDropZone from './DishDropZone';
import CostAnalysisSection from './CostAnalysisSection';
import { SuccessMessage } from '../../cogs/components/SuccessMessage';
import { QuantityInputModal } from './QuantityInputModal';
import { Ingredient, Recipe } from '../../cogs/types';

import { logger } from '@/lib/logger';
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

  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quantity modal state
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [expandingRecipe, setExpandingRecipe] = useState<Recipe | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Load recipe data when editing
  useEffect(() => {
    if (editingRecipe && ingredients.length > 0) {
      // Set recipe state
      setDishState({
        dishName: editingRecipe.name || '',
        description: editingRecipe.description || '',
        sellingPrice: 0, // Will be calculated
        itemType: 'recipe',
        yield: editingRecipe.yield || 1,
        yield_unit: editingRecipe.yield_unit || 'portion',
        instructions: editingRecipe.instructions || '',
      });

      // Load recipe ingredients
      fetch(`/api/recipes/${editingRecipe.id}/ingredients`, {
        cache: 'no-store',
      })
        .then(r => r.json())
        .then(data => {
          const recipeIngredients = data.items || [];
          if (recipeIngredients.length > 0) {
            const recipeYield = editingRecipe.yield || 1;
            // Clear existing calculations first
            clearCalculations();
            // Add all ingredients from recipe
            recipeIngredients.forEach((ri: any) => {
              const ingredientData = ingredients.find(ing => ing.id === ri.ingredient_id);
              if (ingredientData) {
                // Calculate single serve quantity
                const singleServeQuantity = ri.quantity / recipeYield;
                handleIngredientAdded(ingredientData, singleServeQuantity, ri.unit);
              }
            });
          }
        })
        .catch(err => {
          logger.error('Failed to load recipe ingredients:', err);
          setError('Failed to load recipe ingredients');
        });
    }
  }, [
    editingRecipe,
    ingredients,
    setDishState,
    clearCalculations,
    handleIngredientAdded,
    setError,
  ]);

  // Handle recipe tap - load whole recipe with all ingredients
  const handleRecipeTap = async (recipe: Recipe) => {
    try {
      setExpandingRecipe(recipe);
      const response = await fetch(`/api/recipes/${recipe.id}/ingredients`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to fetch recipe ingredients');
      }

      const result = await response.json();
      const recipeIngredients = result.items || [];

      if (recipeIngredients.length === 0) {
        setError('Recipe has no ingredients');
        setExpandingRecipe(null);
        return;
      }

      // Add all ingredients from recipe using single serve quantities
      // Divide recipe ingredient quantities by recipe yield to get per-serving amounts
      const recipeYield = recipe.yield || 1; // Default to 1 if yield is missing

      for (const ri of recipeIngredients) {
        const ingredientData = ingredients.find(ing => ing.id === ri.ingredient_id);
        if (ingredientData) {
          // Calculate single serve quantity
          const singleServeQuantity = ri.quantity / recipeYield;
          handleIngredientAdded(ingredientData, singleServeQuantity, ri.unit);
        }
      }

      setExpandingRecipe(null);
    } catch (err) {
      logger.error('Failed to expand recipe:', err);
      setError(err instanceof Error ? err.message : 'Failed to expand recipe');
      setExpandingRecipe(null);
    }
  };

  // Handle ingredient tap - show quantity modal
  const handleIngredientTap = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setShowQuantityModal(true);
  };

  // Handle quantity confirmation
  const handleQuantityConfirm = (quantity: number) => {
    if (!selectedIngredient) return;

    // Add ingredient with provided quantity and ingredient's unit
    handleIngredientAdded(selectedIngredient, quantity, selectedIngredient.unit || 'kg');
    setShowQuantityModal(false);
    setSelectedIngredient(null);
  };

  // Handle quantity modal cancel
  const handleQuantityCancel = () => {
    setShowQuantityModal(false);
    setSelectedIngredient(null);
  };

  // Edit ingredient handlers
  const handleEditIngredient = (ingredientId: string, currentQuantity: number) => {
    setEditingIngredient(ingredientId);
    setEditQuantity(currentQuantity);
  };

  const handleSaveEdit = () => {
    if (editingIngredient && editQuantity > 0) {
      const calculation = calculations.find(calc => calc.ingredientId === editingIngredient);
      const unit = calculation?.unit || 'kg';
      editCalculation(editingIngredient, editQuantity, unit);
      setEditingIngredient(null);
      setEditQuantity(0);
    }
  };

  const handleCancelEdit = () => {
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  const handleRemoveIngredient = async (ingredientId: string) => {
    removeCalculation(ingredientId);
  };

  // Save handler
  const handleSave = async () => {
    const result = await saveDish();
    if (result.success) {
      const itemType = dishState.itemType === 'dish' ? 'Dish' : 'Recipe';
      setSuccessMessage(`${itemType} "${dishState.dishName}" saved successfully!`);
      // Clear form after a delay and notify parent
      setTimeout(() => {
        setSuccessMessage(null);
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      }, 2000);
    }
  };

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
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <SuccessMessage message={successMessage} onClose={() => setSuccessMessage(null)} />

        <div className="large-desktop:grid-cols-2 grid grid-cols-1 gap-6">
          {/* Left Panel - Tap to Add */}
          <div>
            <DishBuilderDragDrop
              recipes={recipes}
              ingredients={ingredients}
              onRecipeTap={handleRecipeTap}
              onIngredientTap={handleIngredientTap}
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

            {/* Cost Analysis Section */}
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
          </DishDropZone>
        </div>
      </div>
    </>
  );
}
