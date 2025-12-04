'use client';

import React from 'react';
import { Recipe } from '../types';

interface BulkDeleteConfirmationModalProps {
  show: boolean;
  selectedRecipeIds: Set<string>;
  recipes: Recipe[];
  capitalizeRecipeName: (name: string) => string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BulkDeleteConfirmationModal({
  show,
  selectedRecipeIds,
  recipes,
  capitalizeRecipeName,
  onConfirm,
  onCancel,
}: BulkDeleteConfirmationModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-2xl">
        <div className="rounded-2xl bg-[#1f1f1f]/95">
          <div className="border-b border-[#2a2a2a] p-6">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#ef4444] to-[#dc2626]">
                <svg
                  className="h-6 w-6 text-white"
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
                <h3 className="text-xl font-bold text-white">Delete Multiple Recipes</h3>
                <p className="text-sm text-gray-400">This action cannot be undone</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="mb-6 text-gray-300">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-white">
                {selectedRecipeIds.size} recipe{selectedRecipeIds.size > 1 ? 's' : ''}
              </span>
              ? This will permanently remove all selected recipes and their ingredients from your
              Recipe Book.
            </p>
            <div className="mb-6 max-h-32 overflow-y-auto rounded-lg bg-[#0a0a0a] p-4">
              <h4 className="mb-2 text-sm font-medium text-white">Selected Recipes:</h4>
              <div className="space-y-1">
                {Array.from(selectedRecipeIds).map(recipeId => {
                  const recipe = recipes.find(r => r.id === recipeId);
                  return recipe ? (
                    <div key={recipeId} className="text-xs text-gray-400">
                      • {capitalizeRecipeName(recipe.recipe_name)}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-xl bg-[#2a2a2a] px-4 py-3 font-medium text-gray-300 transition-all duration-200 hover:bg-[#3a3a3a]"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-4 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 hover:shadow-xl"
              >
                Delete {selectedRecipeIds.size} Recipe{selectedRecipeIds.size > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
