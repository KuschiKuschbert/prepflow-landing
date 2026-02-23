'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { Dish, Recipe } from '@/lib/types/recipes';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { IngredientsTab } from './IngredientsTab';
import { RecipeManagementTabs, type RecipeManagementTab } from './RecipeManagementTabs';

// Lazy load DishesClient to reduce initial bundle size (uses dnd-kit, heavy components)
const DishesClient = dynamic(() => import('./DishesClient'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

// Lazy load MenuBuilderTab to reduce initial bundle size (uses dnd-kit, heavy components)
const MenuBuilderTab = dynamic(() => import('./MenuBuilderTab'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

interface RecipeBookContentProps {
  initialDishes?: Dish[];
  initialRecipes?: Recipe[];
}

export function RecipeBookContent({ initialDishes, initialRecipes }: RecipeBookContentProps = {}) {
  const searchParams = useSearchParams();
  // Always start with 'ingredients' to ensure server/client hydration match
  // We'll update from hash in useEffect after mount
  const [activeTab, setActiveTab] = useState<RecipeManagementTab>('ingredients');
  const preselectedRecipeId = searchParams.get('recipe');

  // Initialize tab from hash and URL params after mount to prevent hydration mismatch
  useEffect(() => {
    const updateTabFromHash = () => {
      if (typeof window === 'undefined') return;

      // QR code deep link: ?recipe=id opens dishes tab with recipe preview
      if (preselectedRecipeId) {
        setActiveTab('dishes');
        return;
      }

      const hash = window.location.hash.slice(1);
      if (hash === 'dishes' || hash === 'ingredients' || hash === 'menu-builder') {
        setActiveTab(hash as RecipeManagementTab);
      } else if (hash === 'recipes' || hash === 'calculator') {
        // Redirect old recipes/calculator hash to dishes tab
        setActiveTab('dishes');
        window.history.replaceState(null, '', `${window.location.pathname}#dishes`);
      } else if (!hash) {
        setActiveTab('ingredients');
      }
    };

    // Set initial tab from hash
    updateTabFromHash();

    // Sync with URL hash changes (e.g., browser back/forward)
    const handleHashChange = () => {
      updateTabFromHash();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [preselectedRecipeId]);

  return (
    <div>
      <RecipeManagementTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {/* Render tab content - will update after mount if hash differs */}
      {activeTab === 'ingredients' && (
        <Suspense fallback={<PageSkeleton />}>
          <IngredientsTab />
        </Suspense>
      )}
      {activeTab === 'dishes' && (
        <DishesClient
          initialDishes={initialDishes}
          initialRecipes={initialRecipes}
          preselectedRecipeId={preselectedRecipeId}
        />
      )}
      {activeTab === 'menu-builder' && <MenuBuilderTab />}
    </div>
  );
}
