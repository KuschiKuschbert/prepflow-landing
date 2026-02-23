'use client';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import type { Dish, Recipe } from '@/lib/types/recipes';
import type { Menu } from '@/lib/types/menu-builder';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';

// Lazy load MenuBuilderClient to reduce initial bundle size (uses dnd-kit)
const MenuBuilderClient = dynamic(() => import('../../menu-builder/components/MenuBuilderClient'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

interface MenuBuilderTabProps {
  initialDishes?: Dish[];
  initialRecipes?: Recipe[];
}

/**
 * Menu Builder tab component for Recipes page.
 * Wraps MenuBuilderClient without PageHeader/ResponsivePageContainer since parent provides those.
 *
 * @component
 * @returns {JSX.Element} Menu Builder tab content
 */
export default function MenuBuilderTab({
  initialDishes,
  initialRecipes,
}: MenuBuilderTabProps = {}) {
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const handleBackToList = useCallback(() => {
    setSelectedMenu(null);
  }, []);

  return (
    <ErrorBoundary>
      <MenuBuilderClient
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        onBack={handleBackToList}
        initialDishes={initialDishes}
        initialRecipes={initialRecipes}
      />
    </ErrorBoundary>
  );
}
