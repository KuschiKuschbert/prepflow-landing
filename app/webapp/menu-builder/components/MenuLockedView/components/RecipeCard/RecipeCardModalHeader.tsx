/**
 * Recipe Card Modal Header Component
 * Header section of the expanded modal view
 */
'use client';

import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';
import { PrepQuantityInput } from '../PrepQuantityInput';

interface RecipeCardModalHeaderProps {
  id: string;
  title: string;
  isSubRecipe: boolean;
  usedByMenuItems?: Array<{
    menuItemId: string;
    menuItemName: string;
    quantity: number;
  }>;
  prepQuantity: number;
  onPrepQuantityChange: (value: number) => void;
  onClose: (() => void) | undefined;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export function RecipeCardModalHeader({
  id,
  title,
  isSubRecipe,
  usedByMenuItems,
  prepQuantity,
  onPrepQuantityChange,
  onClose,
  closeButtonRef,
}: RecipeCardModalHeaderProps) {
  return (
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
            onChange={onPrepQuantityChange}
            min={1}
            max={1000}
          />
        </div>
      </div>
      <button
        ref={closeButtonRef}
        onClick={() => onClose?.()}
        className="shrink-0 rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-[#2a2a2a] hover:text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
        aria-label="Close recipe card"
      >
        <Icon icon={X} size="md" aria-hidden={true} />
      </button>
    </div>
  );
}
