'use client';

import { Icon } from '@/components/ui/Icon';
import { Edit, Trash2 } from 'lucide-react';
import { Dish } from '../types';

interface DishSidePanelActionsProps {
  dish: Dish;
  onEdit: (dish: Dish) => void;
  onDelete: (dish: Dish) => void;
}

export function DishSidePanelActions({ dish, onEdit, onDelete }: DishSidePanelActionsProps) {
  return (
    <div className="flex-shrink-0 space-y-3 border-t border-[var(--border)] p-6">
      <button
        onClick={() => onEdit(dish)}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--color-info)] px-4 py-3 text-sm font-medium text-[var(--button-active-text)] transition-all duration-200 hover:from-[var(--primary)]/80 hover:to-[var(--color-info)]/80"
        title="Edit dish (Press E)"
      >
        <Icon icon={Edit} size="sm" className="text-[var(--button-active-text)]" aria-hidden={true} />
        <span>Edit Dish</span>
      </button>
      <button
        onClick={() => onDelete(dish)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 px-4 py-3 text-sm font-medium text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/20"
        title="Delete dish"
      >
        <Icon icon={Trash2} size="sm" aria-hidden={true} />
        <span>Delete Dish</span>
      </button>
    </div>
  );
}
