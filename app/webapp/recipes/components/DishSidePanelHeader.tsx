'use client';

import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';
import { Dish } from '../types';

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
    <div className="flex-shrink-0 border-b border-[#2a2a2a] p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1 pr-4">
          <h2 id="dish-panel-title" className="mb-2 text-xl font-bold text-white">
            {capitalizeDishName(dish.dish_name)}
          </h2>
          {dish.description && (
            <p className="line-clamp-2 text-sm text-gray-400">{dish.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          aria-label="Close dish panel"
        >
          <Icon icon={X} size="md" aria-hidden={true} />
        </button>
      </div>
    </div>
  );
}
