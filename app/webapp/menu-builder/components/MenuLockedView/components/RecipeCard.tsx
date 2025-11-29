/**
 * Recipe Card Component
 * Displays a single recipe card with ingredients, method, and notes
 * Expanded cards are displayed as centered modal overlays
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatScaledQuantity, scaleIngredients } from '../../../utils/recipeCardScaling';
import { PrepQuantityInput } from './PrepQuantityInput';

interface RecipeCardProps {
  id: string;
  title: string;
  baseYield: number;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  methodSteps: string[];
  notes: string[];
  isExpanded?: boolean;
  onClick?: () => void;
  usedByMenuItems?: Array<{
    menuItemId: string;
    menuItemName: string;
    quantity: number;
  }>; // Cross-reference for sub-recipe cards
}

export function RecipeCard({
  id,
  title,
  baseYield,
  ingredients,
  methodSteps,
  notes,
  isExpanded = false,
  onClick,
  usedByMenuItems,
}: RecipeCardProps) {
  const isSubRecipe = !!usedByMenuItems && usedByMenuItems.length > 0;
  const [prepQuantity, setPrepQuantity] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const scaledIngredients = scaleIngredients(ingredients, prepQuantity, baseYield);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isExpanded) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // Focus the close button when modal opens (after a brief delay for animation)
      const focusTimeout = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 150);

      // Scroll modal to top if needed
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }

      return () => {
        clearTimeout(focusTimeout);
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isExpanded]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger expansion if clicking on prep quantity input
    const target = e.target as HTMLElement;
    if (target.closest('[data-prep-input]')) {
      return;
    }
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    } else if (e.key === 'Escape' && isExpanded) {
      e.preventDefault();
      onClick?.(); // Close the expanded card
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClick?.();
    }
  };

  const handleBackdropKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <>
      {/* Compact Card - Always visible in grid */}
      <div
        className={`relative rounded-2xl border shadow-lg transition-all duration-300 ease-in-out ${
          isSubRecipe
            ? 'cursor-pointer border-[#D925C7]/30 bg-[#1f1f1f] hover:border-[#D925C7]/50'
            : 'cursor-pointer border-[#2a2a2a] bg-[#1f1f1f] hover:border-[#29E7CD]/50'
        }`}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`Expand recipe card for ${title}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold text-white">{title}</h3>
              {isSubRecipe && usedByMenuItems && usedByMenuItems.length > 0 && (
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  Used by {usedByMenuItems.length}{' '}
                  {usedByMenuItems.length === 1 ? 'dish' : 'dishes'}
                </p>
              )}
            </div>
            <p className="ml-2 shrink-0 text-xs text-gray-500">Click</p>
          </div>
        </div>
      </div>

      {/* Expanded Modal Overlay - Centered in viewport */}
      {isExpanded && (
        <div
          className="animate-in fade-in fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200"
          onClick={handleBackdropClick}
          onKeyDown={handleBackdropKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`recipe-card-modal-title-${id}`}
        >
          <div className="animate-in zoom-in-95 max-h-[90vh] w-full max-w-4xl rounded-3xl bg-gradient-to-r from-[#29E7CD]/30 via-[#D925C7]/30 to-[#29E7CD]/30 p-[1px] shadow-2xl duration-200">
            <div
              ref={modalRef}
              className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-3xl bg-[#1f1f1f]/95 focus:outline-none"
              onClick={e => e.stopPropagation()}
              tabIndex={-1}
            >
              {/* Header with close button */}
              <div className="sticky top-0 z-20 flex items-start justify-between border-b border-[#2a2a2a] bg-gradient-to-r from-[#1f1f1f] to-[#2a2a2a]/50 p-4 backdrop-blur-sm">
                <div className="min-w-0 flex-1 pr-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h2
                      id={`recipe-card-modal-title-${id}`}
                      className="desktop:text-2xl text-xl font-bold text-white"
                    >
                      {title}
                    </h2>
                    {isSubRecipe && (
                      <span className="shrink-0 rounded-full bg-[#D925C7]/20 px-2 py-1 text-xs font-medium text-[#D925C7]">
                        Sub-Recipe
                      </span>
                    )}
                  </div>
                  {isSubRecipe && usedByMenuItems && usedByMenuItems.length > 0 && (
                    <div className="mt-2 mb-2">
                      <p className="text-xs text-gray-400">Used by:</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {usedByMenuItems.map(usage => (
                          <span
                            key={usage.menuItemId}
                            className="rounded-full bg-[#29E7CD]/10 px-2 py-0.5 text-xs text-[#29E7CD]"
                          >
                            {usage.menuItemName}
                            {usage.quantity > 1 && ` (${usage.quantity})`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-3" data-prep-input>
                    <PrepQuantityInput
                      value={prepQuantity}
                      onChange={setPrepQuantity}
                      min={1}
                      max={1000}
                    />
                  </div>
                </div>
                <button
                  ref={closeButtonRef}
                  onClick={onClick}
                  className="shrink-0 rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-[#2a2a2a] hover:text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                  aria-label="Close recipe card"
                >
                  <Icon icon={X} size="md" aria-hidden={true} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Layout: Method flows around ingredients (float-based wrap-around) */}
                <div className="mb-4">
                  {/* Ingredients Section - Float right on desktop, full width on mobile */}
                  <div className="desktop:float-right desktop:ml-4 desktop:mb-0 desktop:w-80 mb-4 w-full">
                    <h4 className="mb-2 text-base font-semibold text-white">Ingredients:</h4>
                    <div className="space-y-1.5">
                      {scaledIngredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg bg-[#0a0a0a] px-3 py-1.5"
                        >
                          <span className="text-xs text-gray-300">{ingredient.name}</span>
                          <div className="flex items-center gap-3 text-xs">
                            {prepQuantity > 1 && (
                              <span className="text-gray-500">
                                {ingredient.quantity} {ingredient.unit} × {prepQuantity} =
                              </span>
                            )}
                            <span className="font-medium text-white">
                              {formatScaledQuantity(ingredient.scaledQuantity, ingredient.unit)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Method Section - Flows around ingredients, wraps underneath */}
                  {methodSteps.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-base font-semibold text-white">Method:</h4>
                      <ol className="space-y-2">
                        {methodSteps.map((step, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#29E7CD]/20 text-xs font-medium text-[#29E7CD]">
                              {index + 1}
                            </span>
                            <span className="desktop:text-sm text-xs leading-relaxed text-gray-300">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Clear float on desktop */}
                  <div className="desktop:block desktop:clear-both hidden" />
                </div>

                {/* Notes Section - Full width below */}
                {notes.length > 0 && (
                  <div className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-3">
                    <h4 className="mb-1.5 text-xs font-semibold text-white">Notes:</h4>
                    <ul className="space-y-0.5">
                      {notes.map((note, index) => (
                        <li key={index} className="text-xs text-gray-400">
                          • {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
