/**
 * Drag overlay content component for menu items
 */

import { Icon } from '@/components/ui/Icon';
import { ChefHat, Utensils } from 'lucide-react';
import type { MenuItem } from '@/lib/types/menu-builder';

interface DragOverlayContentProps {
  menuItem: MenuItem;
}

export function DragOverlayContent({ menuItem }: DragOverlayContentProps) {
  const isDish = !!menuItem.dish_id;
  const isRecipe = !!menuItem.recipe_id;

  // Match the exact structure of SortableMenuItem
  return (
    <div className="group flex cursor-grabbing items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl">
      <div className="flex flex-1 items-center gap-2">
        {isDish ? (
          <Icon icon={Utensils} size="sm" className="text-[var(--primary)]" />
        ) : isRecipe ? (
          <Icon icon={ChefHat} size="sm" className="text-[var(--accent)]" />
        ) : null}
        <div className="flex-1">
          {isDish ? (
            <>
              <div className="font-medium text-[var(--foreground)]">
                {menuItem.dishes?.dish_name || 'Unknown Dish'}
              </div>
              <div className="text-sm text-[var(--foreground-muted)]">
                ${menuItem.dishes?.selling_price.toFixed(2) || '0.00'}
              </div>
            </>
          ) : isRecipe ? (
            <>
              <div className="font-medium text-[var(--foreground)]">
                {menuItem.recipes?.recipe_name || 'Unknown Recipe'}
              </div>
            </>
          ) : (
            <div className="font-medium text-[var(--foreground)]">Unknown Item</div>
          )}
        </div>
      </div>
      {/* Spacer for delete button to match exact dimensions */}
      <div className="w-10" />
    </div>
  );
}
