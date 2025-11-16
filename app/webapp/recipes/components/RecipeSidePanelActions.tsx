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
    <div className="border-t border-[#2a2a2a] p-6 flex-shrink-0 space-y-3">
      <button
        onClick={() => onEditRecipe(recipe)}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
        title="Edit recipe (Press E)"
      >
        <Icon icon={Edit} size="sm" className="text-white" aria-hidden={true} />
        <span>Edit Recipe</span>
      </button>
      <button
        onClick={() => onDeleteRecipe(recipe)}
        className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
        title="Delete recipe"
      >
        <Icon icon={Trash2} size="sm" aria-hidden={true} />
        <span>Delete Recipe</span>
      </button>
    </div>
  );
}
