'use client';

import { Icon } from '@/components/ui/Icon';
import { BookOpen, Check } from 'lucide-react';
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
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-info)]/20 bg-[var(--color-info)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-info)]">
          <Icon icon={BookOpen} size="xs" aria-hidden={true} />
          Recipe
        </span>
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
