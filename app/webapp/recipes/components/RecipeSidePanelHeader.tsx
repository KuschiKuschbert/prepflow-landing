'use client';

import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';
import { Recipe } from '../types';

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
    <div className="flex-shrink-0 border-b border-[#2a2a2a] p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1 pr-4">
          <h2 id="recipe-panel-title" className="mb-2 text-xl font-bold text-white">
            {capitalizeRecipeName(recipe.name)}
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Yield:</span>
            <span className="font-medium text-white">
              {recipe.yield} {recipe.yield_unit}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          aria-label="Close recipe panel"
        >
          <Icon icon={X} size="md" aria-hidden={true} />
        </button>
      </div>
    </div>
  );
}
