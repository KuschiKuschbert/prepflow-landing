import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageHeader } from '../components/static/PageHeader';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import MenuBuilderClient from './components/MenuBuilderClient';
import { FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function MenuBuilderPage() {
  return (
    <ErrorBoundary>
      <ResponsivePageContainer>
        <div className="min-h-screen bg-transparent py-4 tablet:py-6">
          <PageHeader
            title="Menu Builder"
            subtitle="Create and manage your menus with drag-and-drop"
            icon={FileText}
            showLogo={true}
          />
          <MenuBuilderClient />
        </div>
      </ResponsivePageContainer>
    </ErrorBoundary>
  );
}
