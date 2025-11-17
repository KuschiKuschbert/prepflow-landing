'use client';

import { Icon } from '@/components/ui/Icon';
import { X, Edit } from 'lucide-react';
import { Dish } from '../types';

interface DishPreviewModalHeaderProps {
  dish: Dish;
  capitalizeDishName: (name: string) => string;
  onClose: () => void;
  onEdit: () => void;
}

export function DishPreviewModalHeader({
  dish,
  capitalizeDishName,
  onClose,
  onEdit,
}: DishPreviewModalHeaderProps) {
  return (
    <div className="sticky top-0 border-b border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 id="dish-modal-title" className="mb-2 text-2xl font-bold text-white">
            {capitalizeDishName(dish.dish_name)}
          </h2>
          {dish.description && <p className="text-gray-400">{dish.description}</p>}
        </div>
        <div className="ml-4 flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
            title="Edit dish (Press E)"
          >
            <Icon icon={Edit} size="sm" className="text-white" aria-hidden={true} />
            <span className="tablet:inline hidden">Edit</span>
            <span className="tablet:inline hidden text-xs opacity-70">(E)</span>
          </button>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
            aria-label="Close dish modal"
            title="Close (Press ESC)"
          >
            <Icon icon={X} size="md" aria-hidden={true} />
          </button>
        </div>
      </div>
    </div>
  );
}

