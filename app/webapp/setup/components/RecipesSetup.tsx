'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ChefHat, Info, AlertTriangle, CheckCircle2, Check } from 'lucide-react';
import { logger } from '@/lib/logger';

interface RecipesSetupProps {
  setupProgress: {
    ingredients: boolean;
    recipes: boolean;
    equipment: boolean;
    country: boolean;
  };
  onProgressUpdate: (progress: {
    ingredients: boolean;
    recipes: boolean;
    equipment: boolean;
    country: boolean;
  }) => void;
}

export default function RecipesSetup({ setupProgress, onProgressUpdate }: RecipesSetupProps) {
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [recipesResult, setRecipesResult] = useState<string | null>(null);
  const [recipesError, setRecipesError] = useState<string | null>(null);
  const [isProduction, setIsProduction] = useState(false);

  // Check if we're in production
  useEffect(() => {
    const isProd =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'prepflow.org' ||
        window.location.hostname.includes('vercel.app') ||
        process.env.NODE_ENV === 'production');
    setIsProduction(isProd);
  }, []);

  const populateRecipes = async () => {
    setRecipesLoading(true);
    setRecipesError(null);
    setRecipesResult(null);

    try {
      const response = await fetch('/api/populate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ populateRecipes: true }),
      });

      const data = await response.json();

      if (response.ok) {
        setRecipesResult(data.message);
        onProgressUpdate({ ...setupProgress, recipes: true });
      } else {
        setRecipesError(data.error || 'Failed to populate recipes');
      }
    } catch (err) {
      logger.error('[RecipesSetup.tsx] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

      setRecipesError('Network error occurred');
    } finally {
      setRecipesLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-lg">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <Icon icon={ChefHat} size="xl" className="text-[var(--primary)]" aria-hidden={true} />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-[var(--foreground)]">Sample Recipes</h3>
        <p className="text-lg text-[var(--foreground-muted)]">
          Add sample recipes to get started with recipe management and COGS calculations
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/50 p-6">
          <h4 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Sample recipes include:</h4>
          <ul className="space-y-2 text-[var(--foreground-secondary)]">
            <li className="flex items-center space-x-2">
              <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
              <span>Classic dishes (Caesar Salad, Fish & Chips, Beef Burger)</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
              <span>Proper ingredient quantities and units</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
              <span>Yield calculations for different portion sizes</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
              <span>Ready for COGS calculations and pricing</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
              <span>Perfect examples for creating your own recipes</span>
            </li>
          </ul>
        </div>

        {isProduction && (
          <div className="mb-6 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 p-4 text-[var(--primary)]">
            <div className="flex items-start space-x-2">
              <Icon icon={Info} size="sm" className="text-[var(--primary)] flex-shrink-0 mt-0.5" aria-hidden={true} />
              <div className="flex-1">
                <p className="font-semibold">Development Feature</p>
                <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                  Test data seeding is only available in development mode. In production, you should
                  create recipes manually through the Recipes page.
                </p>
              </div>
            </div>
          </div>
        )}

        {recipesError && !isProduction && (
          <div className="mb-6 rounded-2xl border border-[var(--color-error)]/30 bg-red-900/20 p-4 text-red-300">
            <div className="flex items-center space-x-2">
              <Icon icon={AlertTriangle} size="sm" className="text-[var(--color-error)]" aria-hidden={true} />
              <span>{recipesError}</span>
            </div>
          </div>
        )}

        {recipesResult && (
          <div className="mb-6 rounded-2xl border border-[var(--color-success)]/30 bg-green-900/20 p-4 text-green-300">
            <div className="flex items-center space-x-2">
              <Icon icon={CheckCircle2} size="sm" className="text-[var(--color-success)]" aria-hidden={true} />
              <span>{recipesResult}</span>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={populateRecipes}
            disabled={recipesLoading || setupProgress.recipes || isProduction}
            className={`rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-200 ${
              setupProgress.recipes
                ? 'cursor-not-allowed bg-green-600 text-[var(--button-active-text)]'
                : recipesLoading
                  ? 'cursor-not-allowed bg-[var(--muted)] text-[var(--foreground-muted)]'
                  : 'bg-gradient-to-r from-[var(--primary)] to-[var(--color-info)] text-[var(--button-active-text)] shadow-lg hover:from-[var(--primary)]/80 hover:to-[var(--color-info)]/80 hover:shadow-xl'
            }`}
          >
            {setupProgress.recipes ? (
              <span className="flex items-center justify-center space-x-2">
                <Icon icon={CheckCircle2} size="sm" className="text-[var(--foreground)]" aria-hidden={true} />
                <span>Sample Recipes Added!</span>
              </span>
            ) : recipesLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-400"></div>
                <span>Adding Recipes...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <Icon icon={ChefHat} size="sm" className="text-[var(--foreground)]" aria-hidden={true} />
                <span>Add Sample Recipes</span>
              </span>
            )}
          </button>

          {!setupProgress.recipes && (
            <p className="mt-4 text-sm text-[var(--foreground-muted)]">
              This will add several sample recipes to help you get started
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
