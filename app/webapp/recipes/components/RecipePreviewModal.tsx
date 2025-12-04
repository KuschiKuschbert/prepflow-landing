'use client';

import { useEffect, useRef } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../types';
import { RecipeIngredientsList } from './RecipeIngredientsList';
import { Icon } from '@/components/ui/Icon';
import { X, Edit, Share2, Printer, Loader2 } from 'lucide-react';

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
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Keyboard shortcuts and focus management
  useEffect(() => {
    if (!showPreview) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the modal
    modalRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus to previous element
      previousActiveElement.current?.focus();
    };
  }, [showPreview, onClose]);

  if (!showPreview || !selectedRecipe) return null;

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-preview-title"
    >
      <div className="animate-in zoom-in-95 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-2xl duration-200">
        <div
          ref={modalRef}
          className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-[#1f1f1f]/95 focus:outline-none"
          tabIndex={-1}
        >
          {/* Header */}
          <div className="border-b border-[#2a2a2a] p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <h2 id="recipe-preview-title" className="text-2xl font-bold text-white">
                    {capitalizeRecipeName(selectedRecipe.recipe_name)}
                  </h2>
                  <button
                    onClick={onClose}
                    className="ml-4 flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                    aria-label="Close recipe preview"
                  >
                    <Icon icon={X} size="md" aria-hidden={true} />
                  </button>
                </div>

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
                  <Icon icon={Edit} size="sm" className="text-white" aria-hidden={true} />
                  Edit Recipe
                </button>
                <button
                  onClick={onShareRecipe}
                  disabled={shareLoading}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#10B981] to-[#059669] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#10B981]/80 hover:to-[#059669]/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {shareLoading ? (
                    <>
                      <Icon
                        icon={Loader2}
                        size="sm"
                        className="animate-spin text-white"
                        aria-hidden={true}
                      />
                      <span>Sharing...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon={Share2} size="sm" className="text-white" aria-hidden={true} />
                      <span>Share Recipe</span>
                    </>
                  )}
                </button>
                <button
                  onClick={onPrint}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#D925C7] to-[#29E7CD] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#D925C7]/80 hover:to-[#29E7CD]/80"
                >
                  <Icon icon={Printer} size="sm" className="text-white" aria-hidden={true} />
                  Print
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
    </div>
  );
}
