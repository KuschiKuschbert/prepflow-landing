'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageHeader } from '../components/static/PageHeader';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { FileText } from 'lucide-react';
import { Menu } from './types';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';

// Lazy load MenuBuilderClient to reduce initial bundle size (uses dnd-kit)
const MenuBuilderClient = dynamic(() => import('./components/MenuBuilderClient'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

export default function MenuBuilderPage() {
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const handleBackToList = useCallback(() => {
    setSelectedMenu(null);
  }, []);

  return (
    <ErrorBoundary>
      <ResponsivePageContainer>
        <div className="tablet:py-6 min-h-screen bg-transparent py-4">
          {selectedMenu ? (
            <PageHeader
              title={
                <>
                  {selectedMenu.menu_name}
                  <span className="mx-2 font-bold text-gray-500">|</span>
                  <span className="text-sm text-gray-500">Menu Builder</span>
                </>
              }
              subtitle={selectedMenu.description || undefined}
              backButton={true}
              onBack={handleBackToList}
            />
          ) : (
            <PageHeader
              title="Menu Builder"
              subtitle="Create and manage your menus with drag-and-drop"
              icon={FileText}
              showLogo={true}
            />
          )}
          <MenuBuilderClient
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            onBack={handleBackToList}
          />
        </div>
      </ResponsivePageContainer>
    </ErrorBoundary>
  );
}
