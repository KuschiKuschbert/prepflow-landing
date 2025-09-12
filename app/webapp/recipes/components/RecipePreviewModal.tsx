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
  onUpdatePreviewYield: (yield: number) => void;
  capitalizeRecipeName: (name: string) => string;
  formatQuantity: (quantity: number, unit: string) => {
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
  formatQuantity
}: RecipePreviewModalProps) {
  if (!showPreview || !selectedRecipe) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1f1f1f] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{capitalizeRecipeName(selectedRecipe.name)}</h2>
              
              {/* Yield Adjustment Section */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Original Yield:</span>
                  <span className="text-white font-medium">{selectedRecipe.yield} {selectedRecipe.yield_unit}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Adjust for:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdatePreviewYield(Math.max(1, previewYield - 1))}
                      className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={previewYield}
                      onChange={(e) => onUpdatePreviewYield(Math.max(1, parseInt(e.target.value) || 1))}
                      className="bg-[#0a0a0a] border border-[#2a2a2a] text-white text-center w-16 h-8 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      min="1"
                    />
                    <button
                      onClick={() => onUpdatePreviewYield(previewYield + 1)}
                      className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-white font-medium">{selectedRecipe.yield_unit}</span>
                </div>
                
                {previewYield !== selectedRecipe.yield && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Scale:</span>
                    <span className={`text-sm font-medium ${previewYield > selectedRecipe.yield ? 'text-[#29E7CD]' : 'text-[#3B82F6]'}`}>
                      {previewYield > selectedRecipe.yield ? '+' : ''}{((previewYield / selectedRecipe.yield - 1) * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={onEditFromPreview}
                className="bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-all duration-200"
              >
                ✏️ Edit Recipe
              </button>
              <button
                onClick={onShareRecipe}
                disabled={shareLoading}
                className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-[#10B981]/80 hover:to-[#059669]/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {shareLoading ? '⏳ Sharing...' : '📤 Share Recipe'}
              </button>
              <button
                onClick={onPrint}
                className="bg-gradient-to-r from-[#D925C7] to-[#29E7CD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-[#D925C7]/80 hover:to-[#29E7CD]/80 transition-all duration-200"
              >
                🖨️ Print
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
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
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Ingredients
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({recipeIngredients.length} item{recipeIngredients.length !== 1 ? 's' : ''})
              </span>
            </h3>
            
            <div className="bg-[#0a0a0a] rounded-xl border border-[#2a2a2a]/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 px-4 py-3 border-b border-[#2a2a2a]/50">
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
                    <div key={ri.id} className="px-4 py-3 hover:bg-[#2a2a2a]/20 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Index */}
                        <div className="col-span-1 text-center">
                          <span className="text-sm text-gray-400 font-mono">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        
                        {/* Ingredient Name */}
                        <div className="col-span-8">
                          <div className="text-white font-medium">{ingredient.ingredient_name}</div>
                        </div>
                        
                        {/* Quantity */}
                        <div className="col-span-3 text-center">
                          <span className="text-white font-medium">
                            {(() => {
                              const formatted = formatQuantity(quantity, ri.unit);
                              const isConverted = formatted.unit !== ri.unit.toLowerCase();
                              
                              return (
                                <>
                                  {formatted.value} {formatted.unit}
                                  {isConverted && (
                                    <div className="text-xs text-gray-400 mt-1">
                                      ({formatted.original})
                                    </div>
                                  )}
                                  {previewYield !== selectedRecipe.yield && !isConverted && (
                                    <div className="text-xs text-gray-400 mt-1">
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
            <h3 className="text-lg font-semibold text-white mb-4">🤖 AI-Generated Cooking Method</h3>
            <div className="bg-[#0a0a0a] rounded-lg p-4">
              {generatingInstructions ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#29E7CD]"></div>
                  <span className="ml-3 text-gray-400">Generating cooking instructions...</span>
                </div>
              ) : (
                <div className="text-gray-300 whitespace-pre-wrap">
                  {aiInstructions}
                </div>
              )}
            </div>
          </div>

          {/* Manual Instructions (if available) */}
          {selectedRecipe.instructions && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">👨‍🍳 Manual Instructions</h3>
              <div className="bg-[#0a0a0a] rounded-lg p-4">
                <div className="text-gray-300 whitespace-pre-wrap">
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
