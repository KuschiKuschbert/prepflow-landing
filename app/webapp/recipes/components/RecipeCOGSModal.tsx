'use client';

import { useEffect, useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { logger } from '../../lib/logger';
import {
  Recipe,
  RecipeIngredientWithDetails,
  COGSCalculation as RecipeCOGSCalculation,
} from '../types';
import { convertToCOGSCalculations } from '../hooks/utils/recipeCalculationHelpers';
import { COGSTable } from '../../cogs/components/COGSTable';
import { COGSTableSummary } from '../../cogs/components/COGSTableSummary';
import { PricingTool } from '../../cogs/components/PricingTool';
import { usePricing } from '../../cogs/hooks/usePricing';
import { COGSCalculation } from '../../cogs/types';

interface RecipeCOGSModalProps {
  isOpen: boolean;
  recipe: Recipe | null;
  onClose: () => void;
}

export function RecipeCOGSModal({ isOpen, recipe, onClose }: RecipeCOGSModalProps) {
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredientWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [dishPortions, setDishPortions] = useState<number>(1);

  // Convert recipe ingredients to COGS calculations
  const calculations: COGSCalculation[] = useMemo(() => {
    if (!recipe || recipeIngredients.length === 0) return [];
    const recipeCOGS = convertToCOGSCalculations(recipeIngredients, recipe.id);
    // Convert from recipes/types.ts COGSCalculation to cogs/types.ts COGSCalculation
    return recipeCOGS.map(
      (calc: RecipeCOGSCalculation): COGSCalculation => ({
        recipeId: recipe.id,
        ingredientId: calc.ingredientId || calc.ingredient_id || '',
        ingredientName: calc.ingredientName || calc.ingredient_name || '',
        quantity: calc.quantity,
        unit: calc.unit,
        costPerUnit: calc.cost_per_unit || 0,
        totalCost: calc.total_cost || 0,
        wasteAdjustedCost: calc.yieldAdjustedCost, // Approximate
        yieldAdjustedCost: calc.yieldAdjustedCost,
        // Legacy properties
        id: calc.id,
        ingredient_id: calc.ingredient_id,
        ingredient_name: calc.ingredient_name,
        cost_per_unit: calc.cost_per_unit,
        total_cost: calc.total_cost,
        supplier_name: calc.supplier_name,
        category: calc.category,
      }),
    );
  }, [recipe, recipeIngredients]);

  // Calculate totals
  const totalCOGS = useMemo(() => {
    return calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);
  }, [calculations]);

  const costPerPortion = useMemo(() => {
    if (dishPortions <= 0) return totalCOGS;
    return totalCOGS / dishPortions;
  }, [totalCOGS, dishPortions]);

  // Pricing hook
  const {
    targetGrossProfit,
    pricingStrategy,
    pricingCalculation,
    allStrategyPrices,
    setTargetGrossProfit,
    setPricingStrategy,
  } = usePricing(costPerPortion);

  // Set dish portions from recipe yield on load
  useEffect(() => {
    if (recipe) {
      setDishPortions(recipe.yield || 1);
    }
  }, [recipe]);

  // Fetch recipe ingredients when modal opens
  useEffect(() => {
    if (isOpen && recipe) {
      setLoading(true);
      setError(null);
      fetch(`/api/recipes/${recipe.id}/ingredients`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.ingredients) {
            setRecipeIngredients(data.ingredients);
          } else {
            setError(data.error || 'Failed to load recipe ingredients');
          }
        })
        .catch(err => {
          setError('Failed to load recipe ingredients');
          logger.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setRecipeIngredients([]);
      setError(null);
    }
  }, [isOpen, recipe]);

  if (!isOpen || !recipe) {
    return null;
  }

  const capitalizeRecipeName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleEditIngredient = (ingredientId: string, currentQuantity: number) => {
    setEditingIngredient(ingredientId);
    setEditQuantity(currentQuantity);
  };

  const handleSaveEdit = () => {
    // Update the ingredient quantity in the calculations
    // For now, we'll just close the edit mode
    // In a full implementation, this would update the recipe ingredient via API
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  const handleCancelEdit = () => {
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  const handleRemoveIngredient = async (ingredientId: string) => {
    // In a full implementation, this would remove the ingredient from the recipe via API
    // For now, we'll just filter it out locally
    setRecipeIngredients(prev => prev.filter(ri => ri.ingredient_id !== ingredientId));
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-[#1f1f1f] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 border-b border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-bold text-white">
                {capitalizeRecipeName(recipe.name)} - COGS Breakdown
              </h2>
              {recipe.description && <p className="text-gray-400">{recipe.description}</p>}
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                <span>
                  Yield: {recipe.yield} {recipe.yield_unit}
                </span>
                <div className="flex items-center gap-2">
                  <span>Portions:</span>
                  <input
                    type="number"
                    value={dishPortions}
                    onChange={e => setDishPortions(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-8 w-16 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-center text-sm font-medium text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    min="1"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
              aria-label="Close modal"
            >
              <Icon icon={X} size="md" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="py-12 text-center text-gray-400">Loading ingredients...</div>
          ) : error ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
              {error}
            </div>
          ) : calculations.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              No ingredients found for this recipe.
            </div>
          ) : (
            <>
              {/* COGS Table */}
              <div className="tablet:p-6 mb-6 rounded-lg bg-[#1f1f1f] p-4 shadow">
                <h3 className="tablet:text-xl mb-4 text-lg font-semibold">Cost Breakdown</h3>
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
              </div>

              {/* Pricing Tool */}
              {costPerPortion > 0 && (
                <div className="tablet:p-6 rounded-lg bg-[#1f1f1f] p-4 shadow">
                  <PricingTool
                    costPerPortion={costPerPortion}
                    targetGrossProfit={targetGrossProfit}
                    pricingStrategy={pricingStrategy}
                    pricingCalculation={pricingCalculation}
                    allStrategyPrices={allStrategyPrices}
                    onTargetGrossProfitChange={setTargetGrossProfit}
                    onPricingStrategyChange={setPricingStrategy}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
