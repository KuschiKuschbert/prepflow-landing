'use client';

import { Icon } from '@/components/ui/Icon';
import { Globe, MoreVertical, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { CategoryDropdown } from './CategoryDropdown';
import { ReorderDropdown } from './ReorderDropdown';

interface MenuItemActionsProps {
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onEditRegion?: () => void;
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
  onEditRegion,
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      {/* --- DESKTOP: HOVER OVERLAY --- */}
      <div className="desktop:opacity-0 desktop:group-hover:opacity-100 tablet:flex hidden items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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

        {onEditRegion && (
          <button
            onClick={e => {
              e.stopPropagation();
              onEditRegion();
            }}
            className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--primary)]/20 hover:text-[var(--primary)]"
            aria-label="Edit Region"
            title="Edit Region"
          >
            <Icon icon={Globe} size="sm" />
          </button>
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

      {/* --- MOBILE: 3-DOT MENU --- */}
      <div className="tablet:hidden relative flex items-center">
        {!showMobileMenu ? (
          <button
            onClick={e => {
              e.stopPropagation();
              setShowMobileMenu(true);
            }}
            className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Show actions"
          >
            <Icon icon={MoreVertical} size="sm" />
          </button>
        ) : (
          <div
            className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1 shadow-lg"
            onClick={e => e.stopPropagation()}
          >
            {onMoveUp || onMoveDown ? (
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
            ) : null}

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

            {onEditRegion && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onEditRegion();
                  setShowMobileMenu(false);
                }}
                className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--primary)]/20 hover:text-[var(--primary)]"
                aria-label="Edit Region"
                title="Edit Region"
              >
                <Icon icon={Globe} size="sm" />
              </button>
            )}

            <button
              onClick={e => {
                e.stopPropagation();
                onRemove();
                setShowMobileMenu(false);
              }}
              className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--color-error)]/20 hover:text-[var(--color-error)]"
              aria-label="Remove item"
            >
              <Icon icon={Trash2} size="sm" />
            </button>

            <div className="mx-0.5 h-4 w-px bg-[var(--border)]" />

            <button
              onClick={e => {
                e.stopPropagation();
                setShowMobileMenu(false);
              }}
              className="rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
              aria-label="Close menu"
            >
              <Icon icon={X} size="sm" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
