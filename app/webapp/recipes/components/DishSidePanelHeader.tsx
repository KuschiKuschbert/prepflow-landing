'use client';

import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';
import { Dish } from '@/lib/types/recipes';

interface DishSidePanelHeaderProps {
  dish: Dish;
  capitalizeDishName: (name: string) => string;
  onClose: () => void;
}

export function DishSidePanelHeader({
  dish,
  capitalizeDishName,
  onClose,
}: DishSidePanelHeaderProps) {
  return (
    <div className="flex-shrink-0 border-b border-[var(--border)] p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1 pr-4">
          <h2 id="dish-panel-title" className="mb-2 text-xl font-bold text-[var(--foreground)]">
            {capitalizeDishName(dish.dish_name)}
          </h2>
          {dish.description && (
            <p className="line-clamp-2 text-sm text-[var(--foreground-muted)]">
              {dish.description}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          aria-label="Close dish panel"
        >
          <Icon icon={X} size="md" aria-hidden={true} />
        </button>
      </div>
    </div>
  );
}
