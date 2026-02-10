import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { auth0 } from '@/lib/auth0';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { Dish, Recipe } from '@/lib/types/recipes';
import { UtensilsCrossed } from 'lucide-react';
import { PageHeader } from '../components/static/PageHeader';
import { RecipeBookContent } from './components/RecipeBookContent';
import { RecipeBookDescription } from './components/RecipeBookDescription';

// Force dynamic rendering to prevent SSR hydration issues
export const dynamic = 'force-dynamic';

export default async function RecipesPage() {
  let initialDishes: Dish[] = [];
  let initialRecipes: Recipe[] = [];

  try {
    const session = await auth0.getSession();
    const email = session?.user?.email;

    if (email) {
      const supabase = createSupabaseAdmin();

      // Resolve user ID
      // Todo: Refactor this into a shared server helper
      const {
        data: { users },
      } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

      if (user) {
        const userId = user.id;

        // Fetch data in parallel
        const [dishesRes, recipesRes] = await Promise.all([
          supabase
            .from('dishes')
            .select('*')
            .eq('user_id', userId)
            .order('dish_name')
            // Match the pageSize=1000 from client
            .range(0, 999),
          supabase
            .from('recipes')
            .select('*')
            .eq('user_id', userId)
            .order('recipe_name')
            .range(0, 999),
        ]);

        if (dishesRes.data) initialDishes = dishesRes.data as Dish[];
        if (recipesRes.data) initialRecipes = recipesRes.data as Recipe[];

        if (dishesRes.error) logger.error('Error fetching initial dishes:', dishesRes.error);
        if (recipesRes.error) logger.error('Error fetching initial recipes:', recipesRes.error);
      }
    }
  } catch (error) {
    logger.error('Error in RecipesPage server handling:', error);
    // Fail gracefully, client will attempt refetch or show error
  }

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
          <RecipeBookContent initialDishes={initialDishes} initialRecipes={initialRecipes} />
        </div>
      </ResponsivePageContainer>
    </ErrorBoundary>
  );
}
