'use client';

import React from 'react';
import Image from 'next/image';
import { Recipe, RecipeIngredient } from '../types';

interface RecipePreviewModalProps {
  showPreview: boolean;
  selectedRecipe: Recipe | null;
  recipeIngredients: RecipeIngredient[];
  aiInstructions: string;
  generatingInstructions: boolean;
  previewYield: number;
  shareLoading: boolean;
  onClose: () => void;
  onEditFromPreview: () => void;
  onShareRecipe: () => void;
  onPrint: () => void;
  onUpdatePreviewYield: (newYield: number) => void;
  capitalizeRecipeName: (name: string) => string;
  formatQuantity: (
    quantity: number,
    unit: string,
  ) => {
    value: string;
    unit: string;
    original: string;
  };
}

export default function RecipePreviewModal({
  showPreview,
  selectedRecipe,
  recipeIngredients,
  aiInstructions,
  generatingInstructions,
  previewYield,
  shareLoading,
  onClose,
  onEditFromPreview,
  onShareRecipe,
  onPrint,
  onUpdatePreviewYield,
  capitalizeRecipeName,
  formatQuantity,
}: RecipePreviewModalProps) {
  if (!showPreview || !selectedRecipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#1f1f1f] shadow-2xl">
        {/* Header */}
        <div className="border-b border-[#2a2a2a] p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-bold text-white">
                {capitalizeRecipeName(selectedRecipe.name)}
              </h2>

              {/* Yield Adjustment Section */}
              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Original Yield:</span>
                  <span className="font-medium text-white">
                    {selectedRecipe.yield} {selectedRecipe.yield_unit}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Adjust for:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdatePreviewYield(Math.max(1, previewYield - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2a2a2a] text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={previewYield}
                      onChange={e =>
                        onUpdatePreviewYield(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="h-8 w-16 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-center text-sm font-medium text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      min="1"
                    />
                    <button
                      onClick={() => onUpdatePreviewYield(previewYield + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2a2a2a] text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-medium text-white">{selectedRecipe.yield_unit}</span>
                </div>

                {previewYield !== selectedRecipe.yield && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Scale:</span>
                    <span
                      className={`text-sm font-medium ${previewYield > selectedRecipe.yield ? 'text-[#29E7CD]' : 'text-[#3B82F6]'}`}
                    >
                      {previewYield > selectedRecipe.yield ? '+' : ''}
                      {((previewYield / selectedRecipe.yield - 1) * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onEditFromPreview}
                className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
              >
                ✏️ Edit Recipe
              </button>
              <button
                onClick={onShareRecipe}
                disabled={shareLoading}
                className="rounded-lg bg-gradient-to-r from-[#10B981] to-[#059669] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#10B981]/80 hover:to-[#059669]/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {shareLoading ? '⏳ Sharing...' : '📤 Share Recipe'}
              </button>
              <button
                onClick={onPrint}
                className="rounded-lg bg-gradient-to-r from-[#D925C7] to-[#29E7CD] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#D925C7]/80 hover:to-[#29E7CD]/80"
              >
                🖨️ Print
              </button>
              <button
                onClick={onClose}
                className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="text-2xl">📋</span>
              Ingredients
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({recipeIngredients.length} item{recipeIngredients.length !== 1 ? 's' : ''})
              </span>
            </h3>

            <div className="overflow-hidden rounded-xl border border-[#2a2a2a]/50 bg-[#0a0a0a]">
              {/* Header */}
              <div className="border-b border-[#2a2a2a]/50 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 px-4 py-3">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-300">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-8">Ingredient</div>
                  <div className="col-span-3 text-center">Quantity</div>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="divide-y divide-[#2a2a2a]/30">
                {recipeIngredients.map((ri, index) => {
                  const ingredient = ri.ingredients;
                  const quantity = ri.quantity;

                  return (
                    <div key={ri.id} className="px-4 py-3 transition-colors hover:bg-[#2a2a2a]/20">
                      <div className="grid grid-cols-12 items-center gap-4">
                        {/* Index */}
                        <div className="col-span-1 text-center">
                          <span className="font-mono text-sm text-gray-400">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Ingredient Name */}
                        <div className="col-span-8">
                          <div className="font-medium text-white">{ingredient.ingredient_name}</div>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-3 text-center">
                          <span className="font-medium text-white">
                            {(() => {
                              const formatted = formatQuantity(quantity, ri.unit);
                              const isConverted = formatted.unit !== ri.unit.toLowerCase();

                              return (
                                <>
                                  {formatted.value} {formatted.unit}
                                  {isConverted && (
                                    <div className="mt-1 text-xs text-gray-400">
                                      ({formatted.original})
                                    </div>
                                  )}
                                  {previewYield !== selectedRecipe.yield && !isConverted && (
                                    <div className="mt-1 text-xs text-gray-400">
                                      (orig: {quantity} {ri.unit})
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI-Generated Cooking Instructions */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              🤖 AI-Generated Cooking Method
            </h3>
            <div className="rounded-lg bg-[#0a0a0a] p-4">
              {generatingInstructions ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#29E7CD]"></div>
                  <span className="ml-3 text-gray-400">Generating cooking instructions...</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-gray-300">{aiInstructions}</div>
              )}
            </div>
          </div>

          {/* Manual Instructions (if available) */}
          {selectedRecipe.instructions && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">👨‍🍳 Manual Instructions</h3>
              <div className="rounded-lg bg-[#0a0a0a] p-4">
                <div className="whitespace-pre-wrap text-gray-300">
                  {selectedRecipe.instructions}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
