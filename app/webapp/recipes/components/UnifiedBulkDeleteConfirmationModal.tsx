'use client';

import { useMemo } from 'react';
import { Dish, Recipe } from '../types';

interface UnifiedBulkDeleteConfirmationModalProps {
  show: boolean;
  selectedItems: Set<string>;
  selectedItemTypes: Map<string, 'recipe' | 'dish'>;
  recipes: Recipe[];
  dishes: Dish[];
  capitalizeRecipeName: (name: string) => string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UnifiedBulkDeleteConfirmationModal({
  show,
  selectedItems,
  selectedItemTypes,
  recipes,
  dishes,
  capitalizeRecipeName,
  onConfirm,
  onCancel,
}: UnifiedBulkDeleteConfirmationModalProps) {
  const selectedRecipes = useMemo(
    () => Array.from(selectedItems).filter(id => selectedItemTypes.get(id) === 'recipe'),
    [selectedItems, selectedItemTypes],
  );
  const selectedDishes = useMemo(
    () => Array.from(selectedItems).filter(id => selectedItemTypes.get(id) === 'dish'),
    [selectedItems, selectedItemTypes],
  );

  if (!show) return null;

  const recipeCount = selectedRecipes.length;
  const dishCount = selectedDishes.length;
  const totalCount = selectedItems.size;

  let title = 'Delete Multiple Items';
  let description = "This action can't be undone";

  if (recipeCount > 0 && dishCount > 0) {
    title = `Delete ${recipeCount} Recipe${recipeCount > 1 ? 's' : ''} and ${dishCount} Dish${dishCount > 1 ? 'es' : ''}`;
    description = 'This will permanently remove all selected items from your Recipe Book.';
  } else if (recipeCount > 0) {
    title = `Delete ${recipeCount} Recipe${recipeCount > 1 ? 's' : ''}`;
    description =
      'This will permanently remove all selected recipes and their ingredients from your Recipe Book.';
  } else if (dishCount > 0) {
    title = `Delete ${dishCount} Dish${dishCount > 1 ? 'es' : ''}`;
    description = 'This will permanently remove all selected dishes from your Recipe Book.';
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl">
        <div className="rounded-2xl bg-[var(--surface)]/95">
          <div className="border-b border-[var(--border)] p-6">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-error)] to-[#dc2626]">
                <svg
                  className="h-6 w-6 text-[var(--button-active-text)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">{title}</h3>
                <p className="text-sm text-[var(--foreground-muted)]">{description}</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="mb-6 text-[var(--foreground-secondary)]">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-[var(--foreground)]">
                {totalCount} item{totalCount > 1 ? 's' : ''}
              </span>
              ?
            </p>
            <div className="mb-6 max-h-32 overflow-y-auto rounded-lg bg-[var(--background)] p-4">
              <h4 className="mb-2 text-sm font-medium text-[var(--foreground)]">Selected Items:</h4>
              <div className="space-y-1">
                {selectedRecipes.map(recipeId => {
                  const recipe = recipes.find(r => r.id === recipeId);
                  return recipe ? (
                    <div key={recipeId} className="text-xs text-[var(--foreground-muted)]">
                      • Recipe: {capitalizeRecipeName(recipe.recipe_name)}
                    </div>
                  ) : null;
                })}
                {selectedDishes.map(dishId => {
                  const dish = dishes.find(d => d.id === dishId);
                  return dish ? (
                    <div key={dishId} className="text-xs text-[var(--foreground-muted)]">
                      • Dish: {dish.dish_name}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-xl bg-[var(--muted)] px-4 py-3 font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:bg-[var(--surface-variant)]"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 rounded-xl bg-gradient-to-r from-[var(--color-error)] to-[#dc2626] px-4 py-3 font-medium text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:from-[var(--color-error)]/80 hover:to-[#dc2626]/80 hover:shadow-xl"
              >
                Delete {totalCount} Item{totalCount > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
