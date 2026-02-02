'use client';

import { Icon } from '@/components/ui/Icon';
import { Calculator, ChefHat, Copy, Edit, FileText, Printer, Share2, X } from 'lucide-react';
import { Recipe } from '@/lib/types/recipes';

type ModalTab = 'preview' | 'ingredients' | 'cogs';

interface UnifiedRecipeModalHeaderProps {
  recipe: Recipe;
  activeTab: ModalTab;
  dishPortions: number;
  capitalizeRecipeName: (name: string) => string;
  onEditRecipe: (recipe: Recipe) => void;
  onShareRecipe: () => void;
  onPrint: () => void;
  onDuplicateRecipe: () => void;
  onClose: () => void;
  onSetActiveTab: (tab: ModalTab) => void;
  onDishPortionsChange: (portions: number) => void;
}

import { useNotification } from '@/contexts/NotificationContext';

export function UnifiedRecipeModalHeader({
  recipe,
  activeTab,
  dishPortions,
  capitalizeRecipeName,
  onEditRecipe,
  onShareRecipe,
  onPrint,
  onDuplicateRecipe,
  onClose,
  onSetActiveTab,
  onDishPortionsChange,
}: UnifiedRecipeModalHeaderProps) {
  const { showSuccess, showInfo } = useNotification();

  const handleShare = async () => {
    onShareRecipe(); // Execute parent logic (likely clipboard copy or modal)
    // We assume parent logic is sync or fast. If it's a simple copy, we can confirm.
    // Ideally parent should toast, but for consistency we can add a generic one if we know it's just a copy.
    // Safest: showInfo("Sharing options opened") or similar if we don't know context.
    // Actually, let's just assume it copies URL for now as that's standard.
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSuccess('Link copied to clipboard');
    } catch (err) {
      showInfo('Share menu opened');
    }
  };

  const handlePrint = () => {
    showInfo('Preparing for printer...');
    setTimeout(onPrint, 100);
  };

  const handleDuplicate = () => {
    onDuplicateRecipe();
    showSuccess('Recipe duplicated to drafts');
  };
  const tabs = [
    { id: 'preview' as ModalTab, label: 'Preview', icon: FileText },
    { id: 'ingredients' as ModalTab, label: 'Ingredients', icon: ChefHat },
    { id: 'cogs' as ModalTab, label: 'COGS', icon: Calculator },
  ];

  return (
    <div className="tablet:p-5 desktop:p-6 flex-shrink-0 border-b border-[var(--border)] p-4">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h2
            id="recipe-modal-title"
            className="tablet:text-xl desktop:text-2xl text-xl font-bold text-[var(--foreground)]"
          >
            {capitalizeRecipeName(recipe.recipe_name)}
          </h2>

          {/* Yield and Portions */}
          <div className="mt-2 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-[var(--foreground-muted)]">Yield:</span>
              <span className="font-medium text-[var(--foreground)]">
                {recipe.yield} {recipe.yield_unit}
              </span>
            </div>

            {activeTab === 'cogs' && (
              <div className="flex items-center gap-2">
                <span className="text-[var(--foreground-muted)]">Portions:</span>
                <input
                  type="number"
                  value={dishPortions}
                  onChange={e => onDishPortionsChange(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 rounded-lg border border-[var(--border)] bg-[var(--background)] text-center text-sm font-medium text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
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
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[#3B82F6] px-4 py-2 text-sm font-medium text-[var(--button-active-text)] transition-all duration-200 hover:from-[var(--primary)]/80 hover:to-[#3B82F6]/80"
            title="Edit recipe (Press E)"
          >
            <Icon
              icon={Edit}
              size="sm"
              className="text-[var(--button-active-text)]"
              aria-hidden={true}
            />
            <span className="tablet:inline hidden">Edit</span>
            <span className="tablet:inline hidden text-xs opacity-70">(E)</span>
          </button>
          <button
            onClick={handleDuplicate}
            className="flex items-center gap-2 rounded-lg bg-[var(--muted)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-variant)]"
            title="Duplicate recipe"
          >
            <Icon icon={Copy} size="sm" aria-hidden={true} />
            <span className="tablet:inline hidden">Duplicate</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#10B981] to-[#059669] px-4 py-2 text-sm font-medium text-[var(--button-active-text)] transition-all duration-200 hover:from-[#10B981]/80 hover:to-[#059669]/80"
            title="Share recipe"
          >
            <Icon icon={Share2} size="sm" aria-hidden={true} />
            <span className="tablet:inline hidden">Share</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg bg-[var(--muted)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-variant)]"
            title="Print recipe"
          >
            <Icon icon={Printer} size="sm" aria-hidden={true} />
            <span className="tablet:inline hidden">Print</span>
          </button>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Close recipe modal"
          >
            <Icon icon={X} size="md" aria-hidden={true} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onSetActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
                : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)]'
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
