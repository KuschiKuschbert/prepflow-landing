'use client';

import { Icon } from '@/components/ui/Icon';
import { Trash2 } from 'lucide-react';
import { ReorderDropdown } from './ReorderDropdown';
import { CategoryDropdown } from './CategoryDropdown';

interface MenuItemActionsProps {
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onMoveToCategory?: (targetCategory: string) => void;
  availableCategories?: string[];
  currentCategory: string;
  isFirst: boolean;
  isLast: boolean;
  showReorderDropdown: boolean;
  setShowReorderDropdown: (show: boolean) => void;
  showCategoryDropdown: boolean;
  setShowCategoryDropdown: (show: boolean) => void;
  handleMoveToCategory: (category: string) => void;
  reorderDropdownRef: React.RefObject<HTMLDivElement | null>;
  categoryDropdownRef: React.RefObject<HTMLDivElement | null>;
  reorderButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Menu item actions component (reorder, move, delete).
 *
 * @component
 * @param {MenuItemActionsProps} props - Component props
 * @returns {JSX.Element} Menu item actions
 */
export function MenuItemActions({
  onRemove,
  onMoveUp,
  onMoveDown,
  onMoveToCategory,
  availableCategories = [],
  currentCategory,
  isFirst,
  isLast,
  showReorderDropdown,
  setShowReorderDropdown,
  showCategoryDropdown,
  setShowCategoryDropdown,
  handleMoveToCategory,
  reorderDropdownRef,
  categoryDropdownRef,
  reorderButtonRef,
}: MenuItemActionsProps) {
  return (
    <div className="desktop:opacity-0 desktop:group-hover:opacity-100 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
      <ReorderDropdown
        isOpen={showReorderDropdown}
        onToggle={() => setShowReorderDropdown(!showReorderDropdown)}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        isFirst={isFirst}
        isLast={isLast}
        dropdownRef={reorderDropdownRef}
        buttonRef={reorderButtonRef}
      />

      {onMoveToCategory && (
        <CategoryDropdown
          isOpen={showCategoryDropdown}
          onToggle={() => setShowCategoryDropdown(!showCategoryDropdown)}
          onMoveToCategory={handleMoveToCategory}
          currentCategory={currentCategory}
          availableCategories={availableCategories}
          dropdownRef={categoryDropdownRef}
        />
      )}

      <button
        onClick={e => {
          e.stopPropagation();
          onRemove();
        }}
        className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--color-error)]/20 hover:text-[var(--color-error)]"
        aria-label="Remove item"
      >
        <Icon icon={Trash2} size="sm" />
      </button>
    </div>
  );
}
