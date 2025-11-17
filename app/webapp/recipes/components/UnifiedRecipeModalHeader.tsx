'use client';

import { Icon } from '@/components/ui/Icon';
import {
  X,
  Edit,
  Copy,
  Share2,
  Printer,
  Loader2,
  FileText,
  ChefHat,
  Calculator,
} from 'lucide-react';
import { Recipe } from '../types';

type ModalTab = 'preview' | 'ingredients' | 'cogs';

interface UnifiedRecipeModalHeaderProps {
  recipe: Recipe;
  activeTab: ModalTab;
  dishPortions: number;
  shareLoading: boolean;
  capitalizeRecipeName: (name: string) => string;
  onEditRecipe: (recipe: Recipe) => void;
  onShareRecipe: () => void;
  onPrint: () => void;
  onDuplicateRecipe: () => void;
  onClose: () => void;
  onSetActiveTab: (tab: ModalTab) => void;
  onDishPortionsChange: (portions: number) => void;
}

export function UnifiedRecipeModalHeader({
  recipe,
  activeTab,
  dishPortions,
  shareLoading,
  capitalizeRecipeName,
  onEditRecipe,
  onShareRecipe,
  onPrint,
  onDuplicateRecipe,
  onClose,
  onSetActiveTab,
  onDishPortionsChange,
}: UnifiedRecipeModalHeaderProps) {
  const tabs = [
    { id: 'preview' as ModalTab, label: 'Preview', icon: FileText },
    { id: 'ingredients' as ModalTab, label: 'Ingredients', icon: ChefHat },
    { id: 'cogs' as ModalTab, label: 'COGS', icon: Calculator },
  ];

  return (
    <div className="tablet:p-5 desktop:p-6 flex-shrink-0 border-b border-[#2a2a2a] p-4">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h2
            id="recipe-modal-title"
            className="tablet:text-xl desktop:text-2xl text-xl font-bold text-white"
          >
            {capitalizeRecipeName(recipe.recipe_name)}
          </h2>

          {/* Yield and Portions */}
          <div className="mt-2 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Yield:</span>
              <span className="font-medium text-white">
                {recipe.yield} {recipe.yield_unit}
              </span>
            </div>

            {activeTab === 'cogs' && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Portions:</span>
                <input
                  type="number"
                  value={dishPortions}
                  onChange={e => onDishPortionsChange(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-center text-sm font-medium text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                  min="1"
                />
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="ml-4 flex gap-2">
          <button
            onClick={() => onEditRecipe(recipe)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
            title="Edit recipe (Press E)"
          >
            <Icon icon={Edit} size="sm" className="text-white" aria-hidden={true} />
            <span className="tablet:inline hidden">Edit</span>
            <span className="tablet:inline hidden text-xs opacity-70">(E)</span>
          </button>
          <button
            onClick={onDuplicateRecipe}
            className="flex items-center gap-2 rounded-lg bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
            title="Duplicate recipe"
          >
            <Icon icon={Copy} size="sm" aria-hidden={true} />
            <span className="tablet:inline hidden">Duplicate</span>
          </button>
          <button
            onClick={onShareRecipe}
            disabled={shareLoading}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#10B981] to-[#059669] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#10B981]/80 hover:to-[#059669]/80 disabled:cursor-not-allowed disabled:opacity-50"
            title="Share recipe"
          >
            {shareLoading ? (
              <>
                <Icon
                  icon={Loader2}
                  size="sm"
                  className="animate-spin text-white"
                  aria-hidden={true}
                />
                <span className="tablet:inline hidden">Sharing...</span>
              </>
            ) : (
              <>
                <Icon icon={Share2} size="sm" className="text-white" aria-hidden={true} />
                <span className="tablet:inline hidden">Share</span>
              </>
            )}
          </button>
          <button
            onClick={onPrint}
            className="flex items-center gap-2 rounded-lg bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
            title="Print recipe"
          >
            <Icon icon={Printer} size="sm" aria-hidden={true} />
            <span className="tablet:inline hidden">Print</span>
          </button>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
            aria-label="Close recipe modal"
          >
            <Icon icon={X} size="md" aria-hidden={true} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#2a2a2a]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onSetActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-[#29E7CD] text-[#29E7CD]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon icon={tab.icon} size="sm" aria-hidden={true} />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
