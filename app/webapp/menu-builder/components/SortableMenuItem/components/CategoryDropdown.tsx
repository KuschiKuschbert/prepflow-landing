'use client';

import { Icon } from '@/components/ui/Icon';
import { Move } from 'lucide-react';

interface CategoryDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onMoveToCategory: (category: string) => void;
  currentCategory: string;
  availableCategories: string[];
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Category dropdown component for moving menu items between categories.
 *
 * @component
 * @param {CategoryDropdownProps} props - Component props
 * @returns {JSX.Element} Category dropdown
 */
export function CategoryDropdown({
  isOpen,
  onToggle,
  onMoveToCategory,
  currentCategory,
  availableCategories,
  dropdownRef,
}: CategoryDropdownProps) {
  if (availableCategories.length <= 1) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={e => {
          e.stopPropagation();
          onToggle();
        }}
        onMouseDown={e => e.stopPropagation()}
        className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--primary)]"
        aria-label="Move to category"
      >
        <Icon icon={Move} size="sm" />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-1 min-w-[180px] rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-lg">
          <div className="p-2 text-xs font-medium tracking-wider text-[var(--foreground-muted)] uppercase">
            Move to Category
          </div>
          <div className="max-h-60 overflow-y-auto">
            {availableCategories
              .filter(cat => cat !== currentCategory)
              .map(cat => (
                <button
                  key={cat}
                  onClick={e => {
                    e.stopPropagation();
                    onMoveToCategory(cat);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--primary)]"
                >
                  {cat}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
