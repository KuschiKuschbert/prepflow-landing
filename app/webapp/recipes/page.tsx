import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageHeader } from '../components/static/PageHeader';
import { RecipeBookDescription } from './components/RecipeBookDescription';
import RecipesClient from './components/RecipesClient';

export default function RecipesPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-transparent p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Static Header - Renders Instantly */}
          <PageHeader
            title="Recipe Book"
            subtitle="Manage your saved recipes and create new ones"
            icon="📖"
            showLogo={true}
          />

          {/* Static Description - Renders Instantly */}
          <RecipeBookDescription />

          {/* Dynamic Content - Loads After Initial Render */}
          <RecipesClient />
        </div>
      </div>
    </ErrorBoundary>
  );
}
