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
      <div className="animate-in zoom-in-95 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl duration-200">
        <div
          ref={modalRef}
          className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-[var(--surface)]/95 focus:outline-none"
          tabIndex={-1}
        >
          {/* Header */}
          <div className="border-b border-[var(--border)] p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <h2 id="recipe-preview-title" className="text-2xl font-bold text-[var(--foreground)]">
                    {capitalizeRecipeName(selectedRecipe.recipe_name)}
                  </h2>
                  <button
                    onClick={onClose}
                    className="ml-4 flex-shrink-0 rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    aria-label="Close recipe preview"
                  >
                    <Icon icon={X} size="md" aria-hidden={true} />
                  </button>
                </div>

                {/* Yield Adjustment Section */}
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--foreground-muted)]">Original Yield:</span>
                    <span className="font-medium text-[var(--foreground)]">
                      {selectedRecipe.yield} {selectedRecipe.yield_unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--foreground-muted)]">Adjust for:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdatePreviewYield(Math.max(1, previewYield - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--muted)] text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-variant)]"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={previewYield}
                        onChange={e =>
                          onUpdatePreviewYield(Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="h-8 w-16 rounded-lg border border-[var(--border)] bg-[var(--background)] text-center text-sm font-medium text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
                        min="1"
                      />
                      <button
                        onClick={() => onUpdatePreviewYield(previewYield + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--muted)] text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-variant)]"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-medium text-[var(--foreground)]">{selectedRecipe.yield_unit}</span>
                  </div>

                  {previewYield !== selectedRecipe.yield && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--foreground-muted)]">Scale:</span>
                      <span
                        className={`text-sm font-medium ${previewYield > selectedRecipe.yield ? 'text-[var(--primary)]' : 'text-[var(--color-info)]'}`}
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
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--color-info)] px-4 py-2 text-sm font-medium text-[var(--button-active-text)] transition-all duration-200 hover:from-[var(--primary)]/80 hover:to-[var(--color-info)]/80"
                >
                  <Icon icon={Edit} size="sm" className="text-[var(--button-active-text)]" aria-hidden={true} />
                  Edit Recipe
                </button>
                <button
                  onClick={onShareRecipe}
                  disabled={shareLoading}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#10B981] to-[#059669] px-4 py-2 text-sm font-medium text-[var(--button-active-text)] transition-all duration-200 hover:from-[#10B981]/80 hover:to-[#059669]/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {shareLoading ? (
                    <>
                      <Icon
                        icon={Loader2}
                        size="sm"
                        className="animate-spin text-[var(--foreground)]"
                        aria-hidden={true}
                      />
                      <span>Sharing...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon={Share2} size="sm" className="text-[var(--foreground)]" aria-hidden={true} />
                      <span>Share Recipe</span>
                    </>
                  )}
                </button>
                <button
                  onClick={onPrint}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--button-active-text)] transition-all duration-200 hover:from-[var(--accent)]/80 hover:to-[var(--primary)]/80"
                >
                  <Icon icon={Printer} size="sm" className="text-[var(--button-active-text)]" aria-hidden={true} />
                  Print
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                <svg
                  className="h-6 w-6 text-[var(--primary)]"
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
                <span className="ml-2 text-sm font-normal text-[var(--foreground-muted)]">
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
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                <svg
                  className="h-5 w-5 text-[var(--primary)]"
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
              <div className="rounded-lg bg-[var(--background)] p-4">
                {generatingInstructions ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--primary)]"></div>
                    <span className="ml-3 text-[var(--foreground-muted)]">Generating cooking instructions...</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap text-[var(--foreground-secondary)]">{aiInstructions}</div>
                )}
              </div>
            </div>

            {/* Manual Instructions (if available) */}
            {selectedRecipe.instructions && (
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                  <svg
                    className="h-5 w-5 text-[var(--primary)]"
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
                <div className="rounded-lg bg-[var(--background)] p-4">
                  <div className="whitespace-pre-wrap text-[var(--foreground-secondary)]">
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
