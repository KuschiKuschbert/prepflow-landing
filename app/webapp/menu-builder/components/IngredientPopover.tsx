/**
 * Ingredient Popover Component
 * Displays ingredients in a popover positioned near the clicked row
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { X } from 'lucide-react';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { IngredientList } from './IngredientPopover/components/IngredientList';
import { RecipeSourcesList } from './IngredientPopover/components/RecipeSourcesList';
import { useIngredientData } from './IngredientPopover/hooks/useIngredientData';
import { usePopoverCloseHandlers } from './IngredientPopover/hooks/usePopoverCloseHandlers';
import { usePopoverPosition } from './IngredientPopover/hooks/usePopoverPosition';

interface IngredientPopoverProps {
  isOpen: boolean;
  menuItemId: string;
  menuItemName: string;
  menuItemType: 'dish' | 'recipe';
  mousePosition: { x: number; y: number } | null;
  onClose: () => void;
}

export function IngredientPopover({
  isOpen,
  menuItemId,
  menuItemName,
  menuItemType,
  mousePosition,
  onClose,
}: IngredientPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { ingredients, recipeSources, loading, error } = useIngredientData(
    isOpen,
    menuItemId,
    menuItemType,
  );
  const popoverPosition = usePopoverPosition(isOpen, mousePosition);
  usePopoverCloseHandlers(isOpen, onClose);

  if (!isOpen || !mousePosition || !popoverPosition) return null;

  const popoverContent = (
    <div
      ref={popoverRef}
      data-ingredient-popover
      className="fixed z-[75] flex max-h-[500px] w-[400px] flex-col rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl"
      style={{
        left: `${popoverPosition.left}px`,
        top: `${popoverPosition.top}px`,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popover-title"
    >
      <div className="flex max-h-[500px] w-full flex-col overflow-hidden rounded-2xl bg-[var(--surface)]/95">
        <PopoverHeader menuItemName={menuItemName} menuItemType={menuItemType} onClose={onClose} />
        <PopoverContent
          loading={loading}
          error={error}
          ingredients={ingredients}
          recipeSources={recipeSources}
        />
      </div>
    </div>
  );

  if (typeof window !== 'undefined') {
    return createPortal(popoverContent, document.body);
  }
  return null;
}

function PopoverHeader({ menuItemName, menuItemType, onClose }: any) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
      <div className="min-w-0 flex-1">
        <h3 id="popover-title" className="truncate text-sm font-semibold text-[var(--foreground)]">
          {menuItemName}
        </h3>
        <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
          {menuItemType === 'dish' ? 'Dish' : 'Recipe'} ingredients
        </p>
      </div>
      <button
        onClick={onClose}
        className="ml-2 flex-shrink-0 rounded-full p-1 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
        aria-label="Close"
      >
        <Icon icon={X} size="sm" aria-hidden={true} />
      </button>
    </div>
  );
}

function PopoverContent({ loading, error, ingredients, recipeSources }: any) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {loading ? (
        <div className="space-y-2">
          <LoadingSkeleton variant="list" />
        </div>
      ) : error ? (
        <div className="py-4 text-center">
          <p className="text-sm text-[var(--color-error)]">{error}</p>
        </div>
      ) : ingredients.length === 0 && recipeSources.length === 0 ? (
        <div className="py-4 text-center">
          <p className="text-sm text-[var(--foreground-muted)]">No ingredients found</p>
        </div>
      ) : (
        <div className="space-y-4">
          <RecipeSourcesList recipeSources={recipeSources} />
          <IngredientList ingredients={ingredients} />
        </div>
      )}
    </div>
  );
}
