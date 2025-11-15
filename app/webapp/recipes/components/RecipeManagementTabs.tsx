'use client';

import { Icon } from '@/components/ui/Icon';
import { Package, UtensilsCrossed } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export type RecipeManagementTab = 'dishes' | 'ingredients';

interface RecipeManagementTabsProps {
  activeTab: RecipeManagementTab;
  onTabChange: (tab: RecipeManagementTab) => void;
}

export function RecipeManagementTabs({ activeTab, onTabChange }: RecipeManagementTabsProps) {
  const pathname = usePathname();

  // Sync URL hash with active tab on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === 'dishes' || hash === 'ingredients') {
      if (hash !== activeTab) {
        onTabChange(hash as RecipeManagementTab);
      }
    } else if (hash === 'recipes' || hash === 'calculator') {
      // Redirect old recipes/calculator hash to dishes tab
      onTabChange('dishes');
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `${pathname}#dishes`);
      }
    } else if (!hash) {
      // Default to ingredients if no hash
      onTabChange('ingredients');
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `${pathname}#ingredients`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleTabChange = (tab: RecipeManagementTab) => {
    onTabChange(tab);
    // Update URL hash without causing navigation
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `${pathname}#${tab}`);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-1">
        <button
          onClick={() => handleTabChange('ingredients')}
          className={`flex items-center gap-2 rounded-xl px-4 py-3 font-medium transition-all duration-200 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none tablet:px-6 ${
            activeTab === 'ingredients'
              ? 'bg-[#29E7CD] text-black shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
          aria-pressed={activeTab === 'ingredients'}
          aria-label="View ingredients"
        >
          <Icon icon={Package} size="sm" />
          <span>Ingredients</span>
        </button>
        <button
          onClick={() => handleTabChange('dishes')}
          className={`flex items-center gap-2 rounded-xl px-4 py-3 font-medium transition-all duration-200 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none tablet:px-6 ${
            activeTab === 'dishes'
              ? 'bg-[#29E7CD] text-black shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
          aria-pressed={activeTab === 'dishes'}
          aria-label="View dishes and recipes"
        >
          <Icon icon={UtensilsCrossed} size="sm" />
          <span>Dishes & Recipes</span>
        </button>
      </div>
    </div>
  );
}
