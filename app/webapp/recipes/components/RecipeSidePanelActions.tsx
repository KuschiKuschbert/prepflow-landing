'use client';

import { Icon } from '@/components/ui/Icon';
import { Edit, Trash2 } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeSidePanelActionsProps {
  recipe: Recipe;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
}

export function RecipeSidePanelActions({
  recipe,
  onEditRecipe,
  onDeleteRecipe,
}: RecipeSidePanelActionsProps) {
  return (
    <div className="flex-shrink-0 space-y-3 border-t border-[var(--border)] p-6">
      <button
        onClick={() => onEditRecipe(recipe)}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--color-info)] px-4 py-3 text-sm font-medium text-[var(--button-active-text)] transition-all duration-200 hover:from-[var(--primary)]/80 hover:to-[var(--color-info)]/80"
        title="Edit recipe (Press E)"
      >
        <Icon icon={Edit} size="sm" className="text-[var(--button-active-text)]" aria-hidden={true} />
        <span>Edit Recipe</span>
      </button>
      <button
        onClick={() => onDeleteRecipe(recipe)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 px-4 py-3 text-sm font-medium text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/20"
        title="Delete recipe"
      >
        <Icon icon={Trash2} size="sm" aria-hidden={true} />
        <span>Delete Recipe</span>
      </button>
    </div>
  );
}
