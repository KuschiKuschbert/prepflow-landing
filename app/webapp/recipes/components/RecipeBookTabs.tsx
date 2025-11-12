'use client';

import { ChefHat, UtensilsCrossed } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface RecipeBookTabsProps {
  activeTab: 'recipes' | 'dishes';
  onTabChange: (tab: 'recipes' | 'dishes') => void;
}

export function RecipeBookTabs({ activeTab, onTabChange }: RecipeBookTabsProps) {
  return (
    <div className="mb-6">
      <div className="flex space-x-1 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-1">
        <button
          onClick={() => onTabChange('recipes')}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all duration-200 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none ${
            activeTab === 'recipes'
              ? 'bg-[#29E7CD] text-black shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
          aria-pressed={activeTab === 'recipes'}
          aria-label="View recipes"
        >
          <Icon icon={ChefHat} size="sm" />
          <span>Recipes</span>
        </button>
        <button
          onClick={() => onTabChange('dishes')}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all duration-200 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none ${
            activeTab === 'dishes'
              ? 'bg-[#29E7CD] text-black shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
          aria-pressed={activeTab === 'dishes'}
          aria-label="View dishes"
        >
          <Icon icon={UtensilsCrossed} size="sm" />
          <span>Dishes</span>
        </button>
      </div>
    </div>
  );
}
