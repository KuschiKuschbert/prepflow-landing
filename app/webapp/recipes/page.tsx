import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageHeader } from '../components/static/PageHeader';
import { RecipeBookDescription } from './components/RecipeBookDescription';
import RecipesClient from './components/RecipesClient';
import { AdaptiveContainer } from '../components/AdaptiveContainer';

export default function RecipesPage() {
  return (
    <ErrorBoundary>
      <AdaptiveContainer>
        <div className="min-h-screen bg-transparent py-4 sm:py-6">
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
      </AdaptiveContainer>
    </ErrorBoundary>
  );
}
