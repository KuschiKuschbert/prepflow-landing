/**
 * Recipe Card Component
 * Displays a single recipe card with ingredients, method, and notes
 * Expanded cards are displayed as centered modal overlays
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { formatScaledQuantity, scaleIngredients } from '../../../utils/recipeCardScaling';
import { RecipeCardCompact } from './RecipeCard/RecipeCardCompact';
import { RecipeCardIngredients } from './RecipeCard/RecipeCardIngredients';
import { RecipeCardMethod } from './RecipeCard/RecipeCardMethod';
import { RecipeCardModalHeader } from './RecipeCard/RecipeCardModalHeader';
import { RecipeCardNotes } from './RecipeCard/RecipeCardNotes';
import { RecipeCardQR } from './RecipeCard/RecipeCardQR';

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
  recipeId?: string | null;
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
  recipeId,
  usedByMenuItems,
}: RecipeCardProps) {
  const isSubRecipe = !!usedByMenuItems && usedByMenuItems.length > 0;
  const [prepQuantity, setPrepQuantity] = useState(1);
  const [showQR, setShowQR] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const scaledIngredients = scaleIngredients(ingredients, prepQuantity, baseYield);

  // Generate QR code URL for the recipe (deep link opens recipe in modal)
  const recipeUrl = recipeId
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/webapp/recipes?recipe=${recipeId}`
    : null;

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
      <RecipeCardCompact
        id={id}
        title={title}
        isSubRecipe={isSubRecipe}
        usedByMenuItems={usedByMenuItems}
        recipeUrl={recipeUrl}
        showQR={showQR}
        onToggleQR={() => setShowQR(!showQR)}
        onCardClick={handleCardClick}
        onKeyDown={handleKeyDown}
        isExpanded={isExpanded}
      />

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
          <div className="animate-in zoom-in-95 max-h-[90vh] w-full max-w-4xl rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl duration-200">
            <div
              ref={modalRef}
              className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-3xl bg-[var(--surface)]/95 focus:outline-none"
              onClick={e => e.stopPropagation()}
              tabIndex={-1}
            >
              {/* Header with close button */}
              <RecipeCardModalHeader
                id={id}
                title={title}
                isSubRecipe={isSubRecipe}
                usedByMenuItems={usedByMenuItems}
                prepQuantity={prepQuantity}
                onPrepQuantityChange={setPrepQuantity}
                onClose={onClick}
                closeButtonRef={closeButtonRef}
              />

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Layout: Method flows around ingredients (float-based wrap-around) */}
                <div className="mb-4">
                  {/* Ingredients Section - Float right on desktop, full width on mobile */}
                  <RecipeCardIngredients
                    ingredients={scaledIngredients}
                    prepQuantity={prepQuantity}
                    formatScaledQuantity={formatScaledQuantity}
                  />

                  {/* Method Section - Flows around ingredients, wraps underneath */}
                  <RecipeCardMethod methodSteps={methodSteps} />

                  {/* Clear float on desktop */}
                  <div className="desktop:block desktop:clear-both hidden" />
                </div>

                {/* Notes Section - Full width below */}
                <RecipeCardNotes notes={notes} />

                {/* QR Code Section - For printing/scanning */}
                {recipeUrl && <RecipeCardQR recipeUrl={recipeUrl} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
