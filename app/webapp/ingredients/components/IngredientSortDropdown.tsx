'use client';

import { Icon } from '@/components/ui/Icon';
import { ChevronDown, DollarSign, Package, Store, Tag, Type } from 'lucide-react';
import { type SortOption } from '../hooks/useIngredientFiltering';

interface IngredientSortDropdownProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  {
    value: 'name_asc',
    label: 'Name ↑',
    icon: <Icon icon={Type} size="xs" className="text-current" />,
  },
  {
    value: 'name_desc',
    label: 'Name ↓',
    icon: <Icon icon={Type} size="xs" className="text-current" />,
  },
  {
    value: 'brand_asc',
    label: 'Brand ↑',
    icon: <Icon icon={Tag} size="xs" className="text-current" />,
  },
  {
    value: 'brand_desc',
    label: 'Brand ↓',
    icon: <Icon icon={Tag} size="xs" className="text-current" />,
  },
  {
    value: 'cost_asc',
    label: 'Cost ↑',
    icon: <Icon icon={DollarSign} size="xs" className="text-current" />,
  },
  {
    value: 'cost_desc',
    label: 'Cost ↓',
    icon: <Icon icon={DollarSign} size="xs" className="text-current" />,
  },
  {
    value: 'supplier_asc',
    label: 'Supplier ↑',
    icon: <Icon icon={Store} size="xs" className="text-current" />,
  },
  {
    value: 'supplier_desc',
    label: 'Supplier ↓',
    icon: <Icon icon={Store} size="xs" className="text-current" />,
  },
  {
    value: 'stock_asc',
    label: 'Stock ↑',
    icon: <Icon icon={Package} size="xs" className="text-current" />,
  },
  {
    value: 'stock_desc',
    label: 'Stock ↓',
    icon: <Icon icon={Package} size="xs" className="text-current" />,
  },
];

export function IngredientSortDropdown({
  sortBy,
  onSortChange,
  isOpen,
  onToggle,
  onClose,
}: IngredientSortDropdownProps) {
  const currentSortOption = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--surface)] hover:text-[var(--primary)]"
      >
        {currentSortOption.icon}
        <span className="truncate">{currentSortOption.label}</span>
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
          <div className="absolute top-full left-0 z-50 mt-1.5 w-44 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl">
            <div className="p-1.5">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    onClose();
                  }}
                  className={`flex w-full items-center gap-1.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
                    sortBy === option.value
                      ? 'bg-[var(--primary)]/20 text-[var(--primary)]'
                      : 'text-[var(--foreground-secondary)] hover:bg-[var(--muted)]'
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                  {sortBy === option.value && <span className="ml-auto text-[var(--primary)]">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
