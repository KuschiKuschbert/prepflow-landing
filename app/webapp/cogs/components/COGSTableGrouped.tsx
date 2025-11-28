'use client';

import { Icon } from '@/components/ui/Icon';
import { ChefHat, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DishWithDetails } from '../../recipes/types';
import { useCOGSTableSort } from '../hooks/useCOGSTableSort';
import { COGSCalculation } from '../types';
import { COGSTableHeader } from './COGSTableHeader';
import { COGSTableMobileCard } from './COGSTableMobileCard';
import { COGSTableRow } from './COGSTableRow';
import { COGSTableSummary } from './COGSTableSummary';

interface COGSTableGroupedProps {
  calculations: COGSCalculation[];
  dishDetails: DishWithDetails | null;
  editingIngredient: string | null;
  editQuantity: number;
  onEditIngredient: (ingredientId: string, currentQuantity: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemoveIngredient: (ingredientId: string) => void | Promise<void>;
  onEditQuantityChange: (quantity: number) => void;
  totalCOGS: number;
  costPerPortion: number;
  dishPortions: number;
  sortField?: 'ingredient_name' | 'quantity' | 'cost';
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (
    field: 'ingredient_name' | 'quantity' | 'cost',
    direction: 'asc' | 'desc',
  ) => void;
}

interface RecipeGroup {
  recipeId: string;
  recipeName: string;
  quantity: number;
  yield: number;
  yieldUnit: string;
  calculations: COGSCalculation[];
  totalCost: number;
}

export const COGSTableGrouped: React.FC<COGSTableGroupedProps> = React.memo(
  function COGSTableGrouped({
    calculations,
    dishDetails,
    editingIngredient,
    editQuantity,
    onEditIngredient,
    onSaveEdit,
    onCancelEdit,
    onRemoveIngredient,
    onEditQuantityChange,
    totalCOGS,
    costPerPortion,
    dishPortions,
    sortField = 'ingredient_name',
    sortDirection = 'asc',
    onSortChange,
  }) {
    const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());
    const { handleColumnSort, getSortIcon } = useCOGSTableSort({
      sortField,
      sortDirection,
      onSortChange: onSortChange || (() => {}),
    });

    // Group calculations by recipeId
    const { recipeGroups, standaloneCalculations } = useMemo(() => {
      const groups: Map<string, RecipeGroup> = new Map();
      const standalone: COGSCalculation[] = [];
      const dishId = dishDetails?.id;

      // Get recipe info from dishDetails
      const recipeInfoMap = new Map<
        string,
        { name: string; quantity: number; yield: number; yieldUnit: string }
      >();
      if (dishDetails?.recipes) {
        dishDetails.recipes.forEach(dr => {
          if (dr.recipe_id) {
            const recipeName =
              dr.recipes?.recipe_name || (dr.recipes as any)?.name || 'Unknown Recipe';
            const recipeYield = dr.recipes?.yield || 1;
            const recipeYieldUnit = dr.recipes?.yield_unit || 'servings';
            recipeInfoMap.set(dr.recipe_id, {
              name: recipeName,
              quantity: parseFloat(dr.quantity) || 1,
              yield: recipeYield,
              yieldUnit: recipeYieldUnit,
            });
          }
        });
      }

      calculations.forEach(calc => {
        // Standalone ingredients have recipeId === dishId or empty string (when dish is null)
        // Recipe ingredients have recipeId matching a recipe in recipeInfoMap
        if (
          !calc.recipeId ||
          calc.recipeId === '' ||
          calc.recipeId === dishId ||
          !recipeInfoMap.has(calc.recipeId)
        ) {
          standalone.push(calc);
        } else {
          // Recipe ingredient
          if (!groups.has(calc.recipeId)) {
            const recipeInfo = recipeInfoMap.get(calc.recipeId)!;
            groups.set(calc.recipeId, {
              recipeId: calc.recipeId,
              recipeName: recipeInfo.name,
              quantity: recipeInfo.quantity,
              yield: recipeInfo.yield,
              yieldUnit: recipeInfo.yieldUnit,
              calculations: [],
              totalCost: 0,
            });
          }
          const group = groups.get(calc.recipeId)!;
          group.calculations.push(calc);
          group.totalCost += calc.yieldAdjustedCost;
        }
      });

      return {
        recipeGroups: Array.from(groups.values()),
        standaloneCalculations: standalone,
      };
    }, [calculations, dishDetails]);

    const toggleRecipe = (recipeId: string) => {
      setExpandedRecipes(prev => {
        const next = new Set(prev);
        if (next.has(recipeId)) {
          next.delete(recipeId);
        } else {
          next.add(recipeId);
        }
        return next;
      });
    };

    // Expand all recipes by default
    React.useEffect(() => {
      if (recipeGroups.length > 0 && expandedRecipes.size === 0) {
        setExpandedRecipes(new Set(recipeGroups.map(g => g.recipeId)));
      }
    }, [recipeGroups.length]);

    if (calculations.length === 0) {
      return null;
    }

    return (
      <div className="space-y-4">
        {/* Mobile Card Layout */}
        <div className="large-desktop:hidden block">
          <div className="space-y-3">
            {/* Recipe Groups */}
            {recipeGroups.map(group => {
              const isExpanded = expandedRecipes.has(group.recipeId);
              return (
                <div key={group.recipeId} className="space-y-2">
                  {/* Recipe Header */}
                  <button
                    onClick={() => toggleRecipe(group.recipeId)}
                    className="flex w-full items-center justify-between rounded-lg border border-[#29E7CD]/20 bg-[#29E7CD]/5 p-3 transition-colors hover:bg-[#29E7CD]/10"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon={ChefHat}
                          size="sm"
                          className="text-[#29E7CD]"
                          aria-hidden="true"
                        />
                        <span className="font-semibold text-white">
                          {group.recipeName} ({group.quantity}x)
                        </span>
                        <span className="text-sm text-gray-400">
                          ${(group.totalCost / dishPortions).toFixed(2)}
                        </span>
                      </div>
                      <div className="ml-6 text-xs text-gray-500">
                        Recipe yield: {group.yield} {group.yieldUnit} (ingredients shown per
                        portion)
                      </div>
                    </div>
                    <Icon
                      icon={isExpanded ? ChevronUp : ChevronDown}
                      size="sm"
                      className="text-[#29E7CD]"
                      aria-hidden="true"
                    />
                  </button>

                  {/* Recipe Ingredients */}
                  {isExpanded && (
                    <div className="ml-4 space-y-2 border-l-2 border-[#29E7CD]/20 pl-4">
                      {group.calculations.map((calc, index) => (
                        <COGSTableMobileCard
                          key={`${calc.recipeId}-${calc.ingredientId || calc.id || index}`}
                          calc={calc}
                          index={index}
                          editingIngredient={editingIngredient}
                          editQuantity={editQuantity}
                          onEditIngredient={onEditIngredient}
                          onSaveEdit={onSaveEdit}
                          onCancelEdit={onCancelEdit}
                          onRemoveIngredient={onRemoveIngredient}
                          onEditQuantityChange={onEditQuantityChange}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Standalone Ingredients */}
            {standaloneCalculations.length > 0 && (
              <div className="space-y-2">
                <div className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
                  <h4 className="text-sm font-semibold text-white">Standalone Ingredients</h4>
                </div>
                {standaloneCalculations.map((calc, index) => (
                  <COGSTableMobileCard
                    key={`standalone-${calc.ingredientId || calc.id || index}`}
                    calc={calc}
                    index={index}
                    editingIngredient={editingIngredient}
                    editQuantity={editQuantity}
                    onEditIngredient={onEditIngredient}
                    onSaveEdit={onSaveEdit}
                    onCancelEdit={onCancelEdit}
                    onRemoveIngredient={onRemoveIngredient}
                    onEditQuantityChange={onEditQuantityChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="large-desktop:block hidden overflow-x-auto">
          <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
            <table className="min-w-full divide-y divide-[#2a2a2a]">
              <COGSTableHeader
                onSortChange={onSortChange}
                handleColumnSort={handleColumnSort}
                getSortIcon={getSortIcon}
              />
              <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
                {/* Recipe Groups */}
                {recipeGroups.map(group => {
                  const isExpanded = expandedRecipes.has(group.recipeId);
                  return (
                    <React.Fragment key={group.recipeId}>
                      {/* Recipe Header Row */}
                      <tr className="bg-[#29E7CD]/5 transition-colors hover:bg-[#29E7CD]/10">
                        <td colSpan={4} className="px-6 py-3">
                          <button
                            onClick={() => toggleRecipe(group.recipeId)}
                            className="flex w-full items-center justify-between text-left"
                          >
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <Icon
                                  icon={ChefHat}
                                  size="sm"
                                  className="text-[#29E7CD]"
                                  aria-hidden="true"
                                />
                                <span className="font-semibold text-white">
                                  {group.recipeName} ({group.quantity}x)
                                </span>
                                <span className="text-sm text-gray-400">
                                  Total: ${(group.totalCost / dishPortions).toFixed(2)}
                                </span>
                              </div>
                              <div className="ml-6 text-xs text-gray-500">
                                Recipe yield: {group.yield} {group.yieldUnit} (ingredients shown per
                                portion)
                              </div>
                            </div>
                            <Icon
                              icon={isExpanded ? ChevronUp : ChevronDown}
                              size="sm"
                              className="text-[#29E7CD]"
                              aria-hidden="true"
                            />
                          </button>
                        </td>
                      </tr>

                      {/* Recipe Ingredients */}
                      {isExpanded &&
                        group.calculations.map((calc, index) => (
                          <COGSTableRow
                            key={`${calc.recipeId}-${calc.ingredientId || calc.id || index}`}
                            calc={calc}
                            index={index}
                            editingIngredient={editingIngredient}
                            editQuantity={editQuantity}
                            onEditIngredient={onEditIngredient}
                            onSaveEdit={onSaveEdit}
                            onCancelEdit={onCancelEdit}
                            onRemoveIngredient={onRemoveIngredient}
                            onEditQuantityChange={onEditQuantityChange}
                          />
                        ))}
                    </React.Fragment>
                  );
                })}

                {/* Standalone Ingredients Header */}
                {standaloneCalculations.length > 0 && (
                  <tr className="bg-[#2a2a2a]/30">
                    <td colSpan={4} className="px-6 py-3">
                      <span className="text-sm font-semibold text-white">
                        Standalone Ingredients
                      </span>
                    </td>
                  </tr>
                )}

                {/* Standalone Ingredients */}
                {standaloneCalculations.map((calc, index) => (
                  <COGSTableRow
                    key={`standalone-${calc.ingredientId || calc.id || index}`}
                    calc={calc}
                    index={index}
                    editingIngredient={editingIngredient}
                    editQuantity={editQuantity}
                    onEditIngredient={onEditIngredient}
                    onSaveEdit={onSaveEdit}
                    onCancelEdit={onCancelEdit}
                    onRemoveIngredient={onRemoveIngredient}
                    onEditQuantityChange={onEditQuantityChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <COGSTableSummary
          totalCOGS={totalCOGS}
          costPerPortion={costPerPortion}
          dishPortions={dishPortions}
        />
      </div>
    );
  },
);

COGSTableGrouped.displayName = 'COGSTableGrouped';
