'use client';

import { useState, useCallback } from 'react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import dynamic from 'next/dynamic';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import type { Menu } from '../../menu-builder/types';

// Lazy load MenuBuilderClient to reduce initial bundle size (uses dnd-kit)
const MenuBuilderClient = dynamic(() => import('../../menu-builder/components/MenuBuilderClient'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

/**
 * Menu Builder tab component for Recipes page.
 * Wraps MenuBuilderClient without PageHeader/ResponsivePageContainer since parent provides those.
 *
 * @component
 * @returns {JSX.Element} Menu Builder tab content
 */
export default function MenuBuilderTab() {
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
      />
    </ErrorBoundary>
  );
}

