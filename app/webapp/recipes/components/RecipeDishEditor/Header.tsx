'use client';

import { Icon } from '@/components/ui/Icon';
import { ArrowLeft } from 'lucide-react';

interface RecipeDishEditorHeaderProps {
  onClose: () => void;
  selectedItem: { name: string; type: 'recipe' | 'dish' } | null;
  capitalizeName: (name: string) => string;
}

export function RecipeDishEditorHeader({
  onClose,
  selectedItem,
  capitalizeName,
}: RecipeDishEditorHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          aria-label="Back to list"
        >
          <Icon icon={ArrowLeft} size="md" aria-hidden={true} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            {selectedItem ? capitalizeName(selectedItem.name) : 'Recipe & Dish Editor'}
          </h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            {selectedItem
              ? `Editing ${selectedItem.type === 'recipe' ? 'recipe' : 'dish'} ingredients`
              : 'Select a recipe or dish to edit its ingredients'}
          </p>
        </div>
      </div>
    </div>
  );
}
