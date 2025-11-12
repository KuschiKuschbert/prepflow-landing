import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageHeader } from '../components/static/PageHeader';
import { RecipeBookDescription } from './components/RecipeBookDescription';
import { RecipeBookContent } from './components/RecipeBookContent';
import { AdaptiveContainer } from '../components/AdaptiveContainer';

export default function RecipesPage() {
  return (
    <ErrorBoundary>
      <AdaptiveContainer>
        <div className="min-h-screen bg-transparent py-4 sm:py-6">
          {/* Static Header - Renders Instantly */}
          <PageHeader
            title="Recipe Book"
            subtitle="Manage your saved recipes and create new dishes"
            icon="📖"
            showLogo={true}
          />

          {/* Static Description - Renders Instantly */}
          <RecipeBookDescription />

          {/* Dynamic Content - Loads After Initial Render */}
          <RecipeBookContent />
        </div>
      </AdaptiveContainer>
    </ErrorBoundary>
  );
}
