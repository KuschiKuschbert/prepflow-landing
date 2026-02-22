'use client';

import { Icon } from '@/components/ui/Icon';
import { UnifiedItem } from '@/lib/types/recipes';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CalculatorTab } from './CalculatorTab';

interface COGSCalculatorModalProps {
  isOpen: boolean;
  item: UnifiedItem | null;
  onClose: () => void;
}

export function COGSCalculatorModal({ isOpen, item, onClose }: COGSCalculatorModalProps) {
  const [_initialRecipeId, setInitialRecipeId] = useState<string>('');

  // Pre-select the recipe when modal opens
  useEffect(() => {
    if (isOpen && item) {
      if (item.itemType === 'recipe') {
        // For recipes, use the recipe ID directly
        setInitialRecipeId(item.id);
      } else {
        // For dishes, we would need to fetch dish details to get associated recipes
        // For now, start with empty selection - user can select recipe manually
        setInitialRecipeId('');
      }
    } else {
      setInitialRecipeId('');
    }
  }, [isOpen, item]);

  if (!isOpen || !item) {
    return null;
  }

  // Note: CalculatorTab doesn't accept props, so we'll need to modify it
  // or create a wrapper component. For now, this opens the calculator
  // and the user can manually select the recipe if needed.

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-h-[90vh] w-full max-w-7xl rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl">
        <div className="max-h-[90vh] w-full overflow-hidden rounded-3xl bg-[var(--surface)]/95">
          {/* Modal Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] p-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">COGS Calculator</h2>
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                {item.itemType === 'recipe' ? item.recipe_name : item.dish_name} (
                {item.itemType === 'recipe' ? 'Recipe' : 'Dish'})
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              aria-label="Close modal"
            >
              <Icon icon={X} size="lg" aria-hidden={true} />
            </button>
          </div>

          {/* Modal Content - Reuse CalculatorTab */}
          <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 100px)' }}>
            <CalculatorTab />
          </div>
        </div>
      </div>
    </div>
  );
}
