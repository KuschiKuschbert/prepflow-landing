'use client';

import { Icon } from '@/components/ui/Icon';
import { Edit, Trash2 } from 'lucide-react';

interface DishPreviewModalActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function DishPreviewModalActions({ onEdit, onDelete }: DishPreviewModalActionsProps) {
  return (
    <div className="flex gap-3 border-t border-[#2a2a2a] pt-6">
      <button
        onClick={onEdit}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
        title="Edit dish (Press E)"
      >
        <Icon icon={Edit} size="sm" className="text-white" aria-hidden={true} />
        <span>Edit</span>
        <span className="text-xs opacity-70">(E)</span>
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/20"
        title="Delete dish"
      >
        <Icon icon={Trash2} size="sm" aria-hidden={true} />
        <span>Delete</span>
      </button>
    </div>
  );
}
