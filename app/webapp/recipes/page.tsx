'use client';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageHeader } from '../components/static/PageHeader';
import { RecipeBookDescription } from './components/RecipeBookDescription';
import { RecipeBookContent } from './components/RecipeBookContent';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function RecipesPage() {
  return (
    <ErrorBoundary>
      <ResponsivePageContainer>
        <div className="min-h-screen bg-transparent py-4 tablet:py-6">
          {/* Static Header - Renders Instantly */}
          <PageHeader
            title="Recipe Book"
            subtitle="Manage your saved recipes and create new dishes"
            icon={BookOpen}
            showLogo={true}
          />

          {/* Static Description - Renders Instantly */}
          <RecipeBookDescription />

          {/* Dynamic Content - Loads After Initial Render */}
          <RecipeBookContent />
        </div>
      </ResponsivePageContainer>
    </ErrorBoundary>
  );
}
