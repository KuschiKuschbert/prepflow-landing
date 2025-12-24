'use client';

import { Icon } from '@/components/ui/Icon';
import { FileText, Package, UtensilsCrossed } from 'lucide-react';
import { usePathname } from 'next/navigation';

export type RecipeManagementTab = 'dishes' | 'ingredients' | 'menu-builder';

interface RecipeManagementTabsProps {
  activeTab: RecipeManagementTab;
  onTabChange: (tab: RecipeManagementTab) => void;
}

export function RecipeManagementTabs({ activeTab, onTabChange }: RecipeManagementTabsProps) {
  const pathname = usePathname();

  // Note: URL hash syncing is handled by parent RecipeBookContent component
  // to prevent duplicate logic and race conditions

  const handleTabChange = (tab: RecipeManagementTab) => {
    onTabChange(tab);
    // Update URL hash without causing navigation
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `${pathname}#${tab}`);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1">
        <button
          onClick={() => handleTabChange('ingredients')}
          className={`tablet:px-6 flex min-w-0 flex-shrink items-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none ${
            activeTab === 'ingredients'
              ? 'border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)] shadow-xl'
              : 'text-[var(--foreground-secondary)] hover:text-[var(--button-active-text)]'
          }`}
          aria-pressed={activeTab === 'ingredients'}
          aria-label="View ingredients"
        >
          <Icon icon={Package} size="sm" className="flex-shrink-0" />
          <span className="truncate">Ingredients</span>
        </button>
        <button
          onClick={() => handleTabChange('dishes')}
          className={`tablet:px-6 flex min-w-0 flex-shrink items-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none ${
            activeTab === 'dishes'
              ? 'border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)] shadow-xl'
              : 'text-[var(--foreground-muted)] hover:text-[var(--button-active-text)]'
          }`}
          aria-pressed={activeTab === 'dishes'}
          aria-label="View dishes and recipes"
        >
          <Icon icon={UtensilsCrossed} size="sm" className="flex-shrink-0" />
          <span className="truncate">Dishes & Recipes</span>
        </button>
        <button
          onClick={() => handleTabChange('menu-builder')}
          className={`tablet:px-6 flex min-w-0 flex-shrink items-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none ${
            activeTab === 'menu-builder'
              ? 'border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)] shadow-xl'
              : 'text-[var(--foreground-muted)] hover:text-[var(--button-active-text)]'
          }`}
          aria-pressed={activeTab === 'menu-builder'}
          aria-label="View menu builder"
        >
          <Icon icon={FileText} size="sm" className="flex-shrink-0" />
          <span className="truncate">Menu Builder</span>
        </button>
      </div>
    </div>
  );
}
