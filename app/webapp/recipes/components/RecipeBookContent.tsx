'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { IngredientsTab } from './IngredientsTab';
import { RecipeManagementTabs, type RecipeManagementTab } from './RecipeManagementTabs';

// Lazy load DishesClient to reduce initial bundle size (uses dnd-kit, heavy components)
const DishesClient = dynamic(() => import('./DishesClient'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

export function RecipeBookContent() {
  // Initialize with consistent default to prevent hydration mismatch
  // Use 'ingredients' as default, will be updated from URL hash in useEffect on client
  const [activeTab, setActiveTab] = useState<RecipeManagementTab>('ingredients');
  const [isMounted, setIsMounted] = useState(false);

  // Initialize from URL hash on client mount and sync with hash changes
  useEffect(() => {
    setIsMounted(true);

    const updateTabFromHash = () => {
      if (typeof window === 'undefined') return;

      const hash = window.location.hash.slice(1);
      if (hash === 'dishes' || hash === 'ingredients') {
        setActiveTab(hash as RecipeManagementTab);
      } else if (hash === 'recipes' || hash === 'calculator') {
        // Redirect old recipes/calculator hash to dishes tab
        setActiveTab('dishes');
        window.history.replaceState(null, '', `${window.location.pathname}#dishes`);
      } else if (!hash) {
        setActiveTab('ingredients');
      }
    };

    // Set initial tab from hash on mount
    updateTabFromHash();

    // Sync with URL hash changes (e.g., browser back/forward)
    const handleHashChange = () => {
      updateTabFromHash();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div>
      <RecipeManagementTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {/* Only render tab content after mount to prevent hydration mismatch */}
      {isMounted && (
        <>
          {activeTab === 'ingredients' && <IngredientsTab />}
          {activeTab === 'dishes' && <DishesClient />}
        </>
      )}
    </div>
  );
}
