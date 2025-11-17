'use client';

import { useState } from 'react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageHeader } from '../components/static/PageHeader';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import MenuBuilderClient from './components/MenuBuilderClient';
import { FileText } from 'lucide-react';
import { Menu } from './types';

export default function MenuBuilderPage() {
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const handleBackToList = () => {
    setSelectedMenu(null);
  };

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
