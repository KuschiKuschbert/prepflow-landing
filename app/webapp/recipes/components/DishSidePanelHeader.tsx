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
    <div className="border-b border-[#2a2a2a] p-6 flex-shrink-0">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <h2 id="dish-panel-title" className="text-xl font-bold text-white mb-2">
            {capitalizeDishName(dish.dish_name)}
          </h2>
          {dish.description && (
            <p className="text-sm text-gray-400 line-clamp-2">{dish.description}</p>
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
