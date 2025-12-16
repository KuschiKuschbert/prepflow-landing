'use client';

import { Icon } from '@/components/ui/Icon';
import { Edit, Trash2 } from 'lucide-react';

interface DishPreviewModalActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function DishPreviewModalActions({ onEdit, onDelete }: DishPreviewModalActionsProps) {
  return (
    <div className="flex gap-3 border-t border-[var(--border)] pt-6">
      <button
        onClick={onEdit}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--color-info)] px-4 py-2 text-sm font-medium text-[var(--button-active-text)] transition-all duration-200 hover:from-[var(--primary)]/80 hover:to-[var(--color-info)]/80"
        title="Edit dish (Press E)"
      >
        <Icon icon={Edit} size="sm" className="text-[var(--button-active-text)]" aria-hidden={true} />
        <span>Edit</span>
        <span className="text-xs opacity-70">(E)</span>
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-2 rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 px-4 py-2 text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/20"
        title="Delete dish"
      >
        <Icon icon={Trash2} size="sm" aria-hidden={true} />
        <span>Delete</span>
      </button>
    </div>
  );
}
