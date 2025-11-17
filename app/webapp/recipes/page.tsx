'use client';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { UtensilsCrossed } from 'lucide-react';
import { PageHeader } from '../components/static/PageHeader';
import { RecipeBookContent } from './components/RecipeBookContent';
import { RecipeBookDescription } from './components/RecipeBookDescription';

export const dynamic = 'force-dynamic';

export default function RecipesPage() {
  return (
    <ErrorBoundary>
      <ResponsivePageContainer>
        <div className="tablet:py-6 min-h-screen bg-transparent py-4">
          {/* Static Header - Renders Instantly */}
          <PageHeader
            title="Recipe & Cost Management"
            subtitle="Manage recipes, build dishes, and calculate costs"
            icon={UtensilsCrossed}
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
