'use client';

import { useState, useEffect, useMemo } from 'react';
import { X, Edit, Trash2 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { Dish, DishWithDetails, DishCostData, RecipeIngredientWithDetails } from '../types';
import { convertToCOGSCalculations } from '../hooks/utils/recipeCalculationHelpers';
import { COGSTable } from '../../cogs/components/COGSTable';
import { COGSTableSummary } from '../../cogs/components/COGSTableSummary';
import { COGSCalculation } from '../../cogs/types';

interface DishPreviewModalProps {
  dish: Dish;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DishPreviewModal({
  dish,
  onClose,
  onEdit,
  onDelete,
}: DishPreviewModalProps) {
  const [dishDetails, setDishDetails] = useState<DishWithDetails | null>(null);
  const [costData, setCostData] = useState<DishCostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recipeIngredientsMap, setRecipeIngredientsMap] = useState<
    Record<string, RecipeIngredientWithDetails[]>
  >({});
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  // Fetch dish details and recipe ingredients
  useEffect(() => {
    Promise.all([
      fetch(`/api/dishes/${dish.id}`).then(r => r.json()),
      fetch(`/api/dishes/${dish.id}/cost`).then(r => r.json()),
    ]).then(async ([dishData, costResponse]) => {
      if (dishData.success) {
        setDishDetails(dishData.dish);
        // Fetch recipe ingredients for each recipe in the dish
        const recipes = dishData.dish.recipes || [];
        const ingredientsMap: Record<string, RecipeIngredientWithDetails[]> = {};
        for (const dishRecipe of recipes) {
          if (dishRecipe.recipe_id) {
            try {
              const response = await fetch(`/api/recipes/${dishRecipe.recipe_id}/ingredients`);
              const data = await response.json();
              if (data.success && data.ingredients) {
                ingredientsMap[dishRecipe.recipe_id] = data.ingredients;
              }
            } catch (err) {
              console.error(`Failed to fetch ingredients for recipe ${dishRecipe.recipe_id}:`, err);
            }
          }
        }
        setRecipeIngredientsMap(ingredientsMap);
      }
      if (costResponse.success) setCostData(costResponse.cost);
      setLoading(false);
    });
  }, [dish.id]);

  // Convert dish recipes and ingredients to COGS calculations
  const calculations: COGSCalculation[] = useMemo(() => {
    if (!dishDetails) return [];

    const allCalculations: COGSCalculation[] = [];

    // Process recipes
    const recipes = dishDetails.recipes || [];
    for (const dishRecipe of recipes) {
      const recipeId = dishRecipe.recipe_id;
      const recipeQuantity = typeof dishRecipe.quantity === 'number' ? dishRecipe.quantity : parseFloat(String(dishRecipe.quantity)) || 1;
      const recipeIngredients = recipeIngredientsMap[recipeId] || [];

      // Convert recipe ingredients to COGS calculations
      const recipeCOGS = convertToCOGSCalculations(recipeIngredients, recipeId);

      // Scale by recipe quantity and add to all calculations
      // Note: convertToCOGSCalculations returns recipes/types.ts COGSCalculation,
      // but we need cogs/types.ts COGSCalculation for COGSTable
      recipeCOGS.forEach(calc => {
        const scaledCalc: COGSCalculation = {
          recipeId: recipeId,
          ingredientId: calc.ingredientId || calc.ingredient_id || '',
          ingredientName: calc.ingredientName || calc.ingredient_name || '',
          quantity: calc.quantity * recipeQuantity,
          unit: calc.unit,
          costPerUnit: calc.cost_per_unit || 0,
          totalCost: (calc.total_cost || 0) * recipeQuantity,
          wasteAdjustedCost: calc.yieldAdjustedCost * recipeQuantity, // Approximate
          yieldAdjustedCost: calc.yieldAdjustedCost * recipeQuantity,
          // Legacy properties
          id: calc.id,
          ingredient_id: calc.ingredient_id,
          ingredient_name: calc.ingredient_name,
          cost_per_unit: calc.cost_per_unit,
          total_cost: (calc.total_cost || 0) * recipeQuantity,
          supplier_name: calc.supplier_name,
          category: calc.category,
        };
        allCalculations.push(scaledCalc);
      });
    }

    // Process standalone ingredients
    const ingredients = dishDetails.ingredients || [];
    for (const dishIngredient of ingredients) {
      const ingredient = dishIngredient.ingredients;
      if (!ingredient) continue;

      const quantity = typeof dishIngredient.quantity === 'number' ? dishIngredient.quantity : parseFloat(String(dishIngredient.quantity)) || 0;
      const costPerUnit =
        (ingredient as any).cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
      const totalCost = quantity * costPerUnit;

      // Apply waste and yield adjustments
      const wastePercent = (ingredient as any).trim_peel_waste_percentage || 0;
      const yieldPercent = (ingredient as any).yield_percentage || 100;

      let wasteAdjustedCost = totalCost;
      if (!(ingredient as any).cost_per_unit_incl_trim && wastePercent > 0) {
        wasteAdjustedCost = totalCost / (1 - wastePercent / 100);
      }

      const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);

      allCalculations.push({
        recipeId: dish.id,
        ingredientId: ingredient.id,
        ingredientName: ingredient.ingredient_name || 'Unknown',
        quantity: quantity,
        unit: dishIngredient.unit || 'g',
        costPerUnit: costPerUnit,
        totalCost: totalCost,
        wasteAdjustedCost: wasteAdjustedCost,
        yieldAdjustedCost: yieldAdjustedCost,
        // Legacy properties
        id: dishIngredient.id,
        ingredient_id: ingredient.id,
        ingredient_name: ingredient.ingredient_name || 'Unknown',
        cost_per_unit: costPerUnit,
        total_cost: totalCost,
        supplier_name: (ingredient as any).supplier_name,
        category: (ingredient as any).category,
      });
    }

    return allCalculations;
  }, [dishDetails, recipeIngredientsMap, dish.id]);

  // Calculate totals
  const totalCOGS = useMemo(() => {
    return calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);
  }, [calculations]);

  const costPerPortion = useMemo(() => {
    return totalCOGS; // Dishes typically have 1 portion
  }, [totalCOGS]);

  const handleEditIngredient = (ingredientId: string, currentQuantity: number) => {
    setEditingIngredient(ingredientId);
    setEditQuantity(currentQuantity);
  };

  const handleSaveEdit = () => {
    // In a full implementation, this would update the ingredient quantity via API
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  const handleCancelEdit = () => {
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  const handleRemoveIngredient = async (ingredientId: string) => {
    // In a full implementation, this would remove the ingredient from the dish via API
    console.log('Remove ingredient:', ingredientId);
  };

  const capitalizeDishName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Keyboard shortcuts and focus management
  useEffect(() => {
    if (!loading) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        } else if (e.key === 'e' && !e.ctrlKey && !e.metaKey && !e.altKey) {
          // Press E to edit (only if not in an input field)
          const target = e.target as HTMLElement;
          if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            onEdit();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [loading, onClose, onEdit]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#1f1f1f] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 border-b border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 id="dish-modal-title" className="mb-2 text-2xl font-bold text-white">
                {capitalizeDishName(dish.dish_name)}
              </h2>
              {dish.description && <p className="text-gray-400">{dish.description}</p>}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
                title="Edit dish (Press E)"
              >
                <Icon icon={Edit} size="sm" className="text-white" aria-hidden={true} />
                <span className="hidden sm:inline">Edit</span>
                <span className="hidden text-xs opacity-70 sm:inline">(E)</span>
              </button>
              <button
                onClick={onClose}
                className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                aria-label="Close dish modal"
                title="Close (Press ESC)"
              >
                <Icon icon={X} size="md" aria-hidden={true} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="py-12 text-center text-gray-400">Loading...</div>
          ) : (
            <>
              {/* Cost Information */}
              {costData && (
                <div className="mb-6 rounded-xl bg-[#2a2a2a]/30 p-4">
                  <h3 className="mb-4 text-lg font-semibold text-white">Cost Information</h3>
                  <div className="grid grid-cols-2 gap-4 desktop:grid-cols-4">
                    <div>
                      <div className="text-xs text-gray-400">Selling Price</div>
                      <div className="text-lg font-semibold text-white">
                        ${costData.selling_price.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Total Cost</div>
                      <div className="text-lg font-semibold text-white">
                        ${costData.total_cost.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Gross Profit</div>
                      <div className="text-lg font-semibold text-green-400">
                        ${costData.gross_profit.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Profit Margin</div>
                      <div
                        className={`text-lg font-semibold ${
                          costData.gross_profit_margin >= 30 ? 'text-green-400' : 'text-yellow-400'
                        }`}
                      >
                        {costData.gross_profit_margin.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recipes */}
              {dishDetails?.recipes && dishDetails.recipes.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-lg font-semibold text-white">Recipes</h3>
                  <div className="space-y-2">
                    {dishDetails.recipes.map((dr, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-[#2a2a2a]/30 p-3 text-sm text-gray-300"
                      >
                        <span className="font-medium text-white">
                          {dr.recipes?.name || 'Unknown Recipe'}
                        </span>
                        <span className="ml-2 text-gray-400">× {dr.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COGS Breakdown */}
              {calculations.length > 0 && (
                <div className="mb-6 rounded-lg bg-[#1f1f1f] p-4 shadow tablet:p-6">
                  <h3 className="mb-4 text-lg font-semibold text-white">COGS Breakdown</h3>
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
                    dishPortions={1}
                  />
                </div>
              )}

              {/* Recipes */}
              {dishDetails?.recipes && dishDetails.recipes.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-lg font-semibold text-white">Recipes</h3>
                  <div className="space-y-2">
                    {dishDetails.recipes.map((dr, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-[#2a2a2a]/30 p-3 text-sm text-gray-300"
                      >
                        <span className="font-medium text-white">
                          {dr.recipes?.name || 'Unknown Recipe'}
                        </span>
                        <span className="ml-2 text-gray-400">× {dr.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Standalone Ingredients */}
              {dishDetails?.ingredients && dishDetails.ingredients.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-lg font-semibold text-white">Standalone Ingredients</h3>
                  <div className="space-y-2">
                    {dishDetails.ingredients.map((di, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-[#2a2a2a]/30 p-3 text-sm text-gray-300"
                      >
                        <span className="font-medium text-white">
                          {di.ingredients?.ingredient_name || 'Unknown Ingredient'}
                        </span>
                        <span className="ml-2 text-gray-400">
                          {di.quantity} {di.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 border-t border-[#2a2a2a] pt-6">
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
                  title="Edit dish (Press E)"
                >
                  <Icon icon={Edit} size="sm" className="text-white" aria-hidden={true} />
                  <span>Edit</span>
                  <span className="text-xs opacity-70">(E)</span>
                </button>
                <button
                  onClick={onDelete}
                  className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/20"
                  title="Delete dish"
                >
                  <Icon icon={Trash2} size="sm" aria-hidden={true} />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
