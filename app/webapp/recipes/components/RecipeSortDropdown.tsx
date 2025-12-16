'use client';

import { ChevronDown, ArrowUpDown } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { RecipeSortField } from '../hooks/useRecipeFiltering';

interface RecipeSortDropdownProps {
  sortField: RecipeSortField;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: RecipeSortField, direction: 'asc' | 'desc') => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const SORT_OPTIONS: Array<{ value: RecipeSortField; label: string }> = [
  { value: 'name', label: 'Name' },
  { value: 'recommended_price', label: 'Recommended Price' },
  { value: 'profit_margin', label: 'Profit Margin' },
  { value: 'contributing_margin', label: 'Contributing Margin' },
  { value: 'created', label: 'Created Date' },
];

export function RecipeSortDropdown({
  sortField,
  sortDirection,
  onSortChange,
  isOpen,
  onToggle,
  onClose,
}: RecipeSortDropdownProps) {
  const currentSortLabel = SORT_OPTIONS.find(opt => opt.value === sortField)?.label || 'Sort';

  const handleSort = (field: RecipeSortField) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    onSortChange(field, newDirection);
    onClose();
  };

  return (
    <div className="tablet:w-auto relative w-full">
      <button
        onClick={onToggle}
        className="tablet:w-auto flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--border)] hover:bg-[var(--surface)]"
      >
        <Icon icon={ArrowUpDown} size="sm" className="text-current" aria-hidden={true} />
        <span className="truncate">{currentSortLabel}</span>
        <Icon
          icon={ChevronDown}
          size="xs"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden={true}
        />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden={true} />
          <div className="absolute top-full left-0 z-50 mt-1.5 w-56 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl">
            <div className="p-1.5">
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSort(option.value)}
                  className={`w-full rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
                    sortField === option.value
                      ? 'border border-[var(--primary)]/50 bg-[var(--primary)]/20 text-[var(--primary)]'
                      : 'text-[var(--foreground-secondary)] hover:bg-[var(--muted)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {sortField === option.value && (
                      <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
