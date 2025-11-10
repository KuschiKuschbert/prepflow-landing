'use client';

import { Recipe, RecipeIngredientWithDetails } from '../types';
import { RecipeIngredientsList } from './RecipeIngredientsList';

interface RecipePreviewModalProps {
  showPreview: boolean;
  selectedRecipe: Recipe | null;
  recipeIngredients: RecipeIngredientWithDetails[];
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
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
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Recipe
              </button>
              <button
                onClick={onShareRecipe}
                disabled={shareLoading}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#10B981] to-[#059669] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#10B981]/80 hover:to-[#059669]/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {shareLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Sharing...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    <span>Share Recipe</span>
                  </>
                )}
              </button>
              <button
                onClick={onPrint}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#D925C7] to-[#29E7CD] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#D925C7]/80 hover:to-[#29E7CD]/80"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <svg
                className="h-6 w-6 text-[#29E7CD]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Ingredients
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({recipeIngredients.length} item{recipeIngredients.length !== 1 ? 's' : ''})
              </span>
            </h3>

            <RecipeIngredientsList
              recipeIngredients={recipeIngredients}
              selectedRecipe={selectedRecipe}
              previewYield={previewYield}
              formatQuantity={formatQuantity}
            />
          </div>

          {/* AI-Generated Cooking Instructions */}
          <div className="mb-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <svg
                className="h-5 w-5 text-[#29E7CD]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              AI-Generated Cooking Method
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
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <svg
                  className="h-5 w-5 text-[#29E7CD]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Manual Instructions
              </h3>
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
