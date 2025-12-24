'use client';

import { Icon } from '@/components/ui/Icon';
import { ChefHat, UtensilsCrossed } from 'lucide-react';

interface RecipeBookTabsProps {
  activeTab: 'recipes' | 'dishes';
  onTabChange: (tab: 'recipes' | 'dishes') => void;
}

export function RecipeBookTabs({ activeTab, onTabChange }: RecipeBookTabsProps) {
  return (
    <div className="mb-6">
      <div className="flex space-x-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1">
        <button
          onClick={() => onTabChange('recipes')}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none ${
            activeTab === 'recipes'
              ? 'border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)] shadow-xl'
              : 'text-[var(--foreground-secondary)] hover:text-[var(--button-active-text)]'
          }`}
          aria-pressed={activeTab === 'recipes'}
          aria-label="View recipes"
        >
          <Icon icon={ChefHat} size="sm" />
          <span>Recipes</span>
        </button>
        <button
          onClick={() => onTabChange('dishes')}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none ${
            activeTab === 'dishes'
              ? 'border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)] shadow-xl'
              : 'text-[var(--foreground-secondary)] hover:text-[var(--button-active-text)]'
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
