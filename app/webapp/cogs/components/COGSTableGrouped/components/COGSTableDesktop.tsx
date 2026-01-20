'use client';

/**
 * Desktop table layout for COGS table.
 */

import React from 'react';
import type { COGSCalculation } from '../../../types';
import { COGSTableHeader } from '../../COGSTableHeader';
import { COGSTableRow } from '../../COGSTableRow';
import type { RecipeGroup } from '../types';
import { COGSRecipeGroupRow } from './COGSRecipeGroupRow';

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
            {recipeGroups.map(group => (
              <COGSRecipeGroupRow
                key={group.recipeId}
                group={group}
                isExpanded={expandedRecipes.has(group.recipeId)}
                dishPortions={dishPortions}
                editingIngredient={editingIngredient}
                editQuantity={editQuantity}
                onToggleRecipe={onToggleRecipe}
                onEditIngredient={onEditIngredient}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
                onRemoveIngredient={onRemoveIngredient}
                onEditQuantityChange={onEditQuantityChange}
              />
            ))}

            {/* Standalone Ingredients Header */}
            {standaloneCalculations.length > 0 && (
              <tr className="bg-[var(--muted)]/30">
                <td colSpan={4} className="px-6 py-3">
                  <span className="text-sm font-semibold text-[var(--foreground)]">
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
  );
}
