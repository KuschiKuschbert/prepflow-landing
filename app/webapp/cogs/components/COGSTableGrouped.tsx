'use client';

import React from 'react';
import { DishWithDetails } from '@/lib/types/recipes';
import { useCOGSTableSort } from '../hooks/useCOGSTableSort';
import { COGSCalculation } from '@/lib/types/cogs';
import { COGSTableDesktop } from './COGSTableGrouped/components/COGSTableDesktop';
import { COGSTableMobile } from './COGSTableGrouped/components/COGSTableMobile';
import { useRecipeExpansion } from './COGSTableGrouped/hooks/useRecipeExpansion';
import { useRecipeGrouping } from './COGSTableGrouped/hooks/useRecipeGrouping';
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
    const { handleColumnSort, getSortIcon } = useCOGSTableSort({
      sortField,
      sortDirection,
      onSortChange: onSortChange || (() => {}),
    });

    const { recipeGroups, standaloneCalculations } = useRecipeGrouping({
      calculations,
      dishDetails,
    });

    const { expandedRecipes, toggleRecipe } = useRecipeExpansion(recipeGroups);

    if (calculations.length === 0) {
      return null;
    }

    return (
      <div className="space-y-4">
        <COGSTableMobile
          recipeGroups={recipeGroups}
          standaloneCalculations={standaloneCalculations}
          expandedRecipes={expandedRecipes}
          dishPortions={dishPortions}
          editingIngredient={editingIngredient}
          editQuantity={editQuantity}
          onToggleRecipe={toggleRecipe}
          onEditIngredient={onEditIngredient}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onRemoveIngredient={onRemoveIngredient}
          onEditQuantityChange={onEditQuantityChange}
        />

        <COGSTableDesktop
          recipeGroups={recipeGroups}
          standaloneCalculations={standaloneCalculations}
          expandedRecipes={expandedRecipes}
          dishPortions={dishPortions}
          editingIngredient={editingIngredient}
          editQuantity={editQuantity}
          onToggleRecipe={toggleRecipe}
          onSortChange={onSortChange}
          handleColumnSort={handleColumnSort}
          getSortIcon={getSortIcon}
          onEditIngredient={onEditIngredient}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onRemoveIngredient={onRemoveIngredient}
          onEditQuantityChange={onEditQuantityChange}
        />

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
