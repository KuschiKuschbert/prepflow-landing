'use client';

import { Icon } from '@/components/ui/Icon';
import { Check } from 'lucide-react';
import { formatRecipeDate } from '../../../utils/formatDate';

interface RecipeCardHeaderProps {
  recipeName: string;
  createdAt: string;
  isSelected: boolean;
  onSelect: () => void;
  capitalizeRecipeName: (name: string) => string;
}

/**
 * Recipe card header component (checkbox, name, date)
 */
export function RecipeCardHeader({
  recipeName,
  createdAt,
  isSelected,
  onSelect,
  capitalizeRecipeName,
}: RecipeCardHeaderProps) {
  return (
    <div className="mb-2 flex items-start justify-between">
      <div className="flex items-center">
        <button
          onClick={e => {
            e.stopPropagation();
            onSelect();
          }}
          className="mr-3 flex items-center justify-center transition-colors hover:text-[var(--primary)]"
          aria-label={`${isSelected ? 'Deselect' : 'Select'} recipe ${capitalizeRecipeName(recipeName)}`}
          title={isSelected ? 'Deselect recipe' : 'Select recipe'}
        >
          {isSelected ? (
            <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
          ) : (
            <div className="h-4 w-4 rounded border border-[var(--border)] bg-[var(--background)] transition-colors hover:border-[var(--primary)]/50" />
          )}
        </button>
        <h3 className="text-sm font-medium text-[var(--foreground)]">
          {capitalizeRecipeName(recipeName)}
        </h3>
      </div>
      <span
        className="text-xs text-[var(--foreground-subtle)]"
        title={`Created on ${formatRecipeDate(createdAt)}`}
      >
        {formatRecipeDate(createdAt)}
      </span>
    </div>
  );
}
