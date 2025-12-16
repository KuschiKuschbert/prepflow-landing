/**
 * Desktop table layout for COGS table.
 */

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { ChefHat, ChevronDown, ChevronUp } from 'lucide-react';
import { COGSTableHeader } from '../../COGSTableHeader';
import { COGSTableRow } from '../../COGSTableRow';
import type { COGSCalculation } from '../../../types';
import type { RecipeGroup } from '../types';

interface COGSTableDesktopProps {
  recipeGroups: RecipeGroup[];
  standaloneCalculations: COGSCalculation[];
  expandedRecipes: Set<string>;
  dishPortions: number;
  editingIngredient: string | null;
  editQuantity: number;
  onToggleRecipe: (recipeId: string) => void;
  onSortChange?: (
    field: 'ingredient_name' | 'quantity' | 'cost',
    direction: 'asc' | 'desc',
  ) => void;
  handleColumnSort: (field: 'ingredient_name' | 'quantity' | 'cost') => void;
  getSortIcon: (field: 'ingredient_name' | 'quantity' | 'cost') => React.ReactNode;
  onEditIngredient: (ingredientId: string, currentQuantity: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemoveIngredient: (ingredientId: string) => void | Promise<void>;
  onEditQuantityChange: (quantity: number) => void;
}

export function COGSTableDesktop({
  recipeGroups,
  standaloneCalculations,
  expandedRecipes,
  dishPortions,
  editingIngredient,
  editQuantity,
  onToggleRecipe,
  onSortChange,
  handleColumnSort,
  getSortIcon,
  onEditIngredient,
  onSaveEdit,
  onCancelEdit,
  onRemoveIngredient,
  onEditQuantityChange,
}: COGSTableDesktopProps) {
  return (
    <div className="large-desktop:block hidden overflow-x-auto">
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="min-w-full divide-y divide-[var(--muted)]">
          <COGSTableHeader
            onSortChange={onSortChange}
            handleColumnSort={handleColumnSort}
            getSortIcon={getSortIcon}
          />
          <tbody className="divide-y divide-[var(--muted)] bg-[var(--surface)]">
            {/* Recipe Groups */}
            {recipeGroups.map(group => {
              const isExpanded = expandedRecipes.has(group.recipeId);
              return (
                <React.Fragment key={group.recipeId}>
                  {/* Recipe Header Row */}
                  <tr className="bg-[var(--primary)]/5 transition-colors hover:bg-[var(--primary)]/10">
                    <td colSpan={4} className="px-6 py-3">
                      <button
                        onClick={() => onToggleRecipe(group.recipeId)}
                        className="flex w-full items-center justify-between text-left"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Icon
                              icon={ChefHat}
                              size="sm"
                              className="text-[var(--primary)]"
                              aria-hidden={true}
                            />
                            <span className="font-semibold text-[var(--foreground)]">
                              {group.recipeName} ({group.quantity}x)
                            </span>
                            <span className="text-sm text-[var(--foreground-muted)]">
                              Total: ${(group.totalCost / dishPortions).toFixed(2)}
                            </span>
                          </div>
                          <div className="ml-6 text-xs text-[var(--foreground-subtle)]">
                            Recipe yield: {group.yield} {group.yieldUnit} (ingredients shown per
                            portion)
                          </div>
                        </div>
                        <Icon
                          icon={isExpanded ? ChevronUp : ChevronDown}
                          size="sm"
                          className="text-[var(--primary)]"
                          aria-hidden={true}
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
              <tr className="bg-[var(--muted)]/30">
                <td colSpan={4} className="px-6 py-3">
                  <span className="text-sm font-semibold text-[var(--foreground)]">Standalone Ingredients</span>
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
  );
}
