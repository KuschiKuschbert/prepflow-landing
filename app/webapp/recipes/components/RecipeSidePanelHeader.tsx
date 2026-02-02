'use client';

import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';
import { Recipe } from '@/lib/types/recipes';

interface RecipeSidePanelHeaderProps {
  recipe: Recipe;
  capitalizeRecipeName: (name: string) => string;
  onClose: () => void;
}

export function RecipeSidePanelHeader({
  recipe,
  capitalizeRecipeName,
  onClose,
}: RecipeSidePanelHeaderProps) {
  return (
    <div className="flex-shrink-0 border-b border-[var(--border)] p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1 pr-4">
          <h2 id="recipe-panel-title" className="text-xl font-bold text-[var(--foreground)]">
            {capitalizeRecipeName(recipe.recipe_name)}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          aria-label="Close recipe panel"
        >
          <Icon icon={X} size="md" aria-hidden={true} />
        </button>
      </div>
    </div>
  );
}
