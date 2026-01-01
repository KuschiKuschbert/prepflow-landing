/**
 * Recipe List Section Component
 * Displays scraped recipes with search functionality
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { Search, Loader2, ExternalLink } from 'lucide-react';

interface ScrapedRecipe {
  id: string;
  recipe_name: string;
  source: string;
  source_url: string;
  description?: string;
  ingredients: Array<{ name: string; original_text: string }>;
  instructions: string[];
  yield?: number;
  yield_unit?: string;
  category?: string;
  cuisine?: string;
  image_url?: string;
}

interface RecipeListSectionProps {
  recipes: ScrapedRecipe[];
  loadingRecipes: boolean;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  onFetchRecipes: () => void;
}

export function RecipeListSection({
  recipes,
  loadingRecipes,
  searchTerm,
  setSearchTerm,
  onFetchRecipes,
}: RecipeListSectionProps) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--foreground)]">
          <Icon icon={Search} size="md" aria-hidden={true} />
          Scraped Recipes
        </h2>
        <button
          onClick={onFetchRecipes}
          disabled={loadingRecipes}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
        >
          {loadingRecipes ? (
            <Icon icon={Loader2} size="sm" className="animate-spin" aria-hidden={true} />
          ) : (
            'Refresh'
          )}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onFetchRecipes();
            }
          }}
          placeholder="Search by ingredients (e.g., tomato, onion, garlic)"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-[#29E7CD]"
        />
      </div>

      {loadingRecipes ? (
        <div className="py-8 text-center text-[var(--foreground-muted)]">Loading recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="py-8 text-center text-[var(--foreground-muted)]">
          No recipes found. Scrape some recipes to get started!
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map(recipe => (
            <div
              key={recipe.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 transition-colors hover:bg-[var(--muted)]"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--foreground)]">{recipe.recipe_name}</h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-[var(--foreground-muted)]">
                    <span>{recipe.source}</span>
                    {recipe.category && <span>• {recipe.category}</span>}
                    {recipe.cuisine && <span>• {recipe.cuisine}</span>}
                    {recipe.yield && (
                      <span>
                        • {recipe.yield} {recipe.yield_unit || 'servings'}
                      </span>
                    )}
                  </div>
                </div>
                <a
                  href={recipe.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-[#29E7CD] hover:text-[#29E7CD]/80"
                >
                  <Icon icon={ExternalLink} size="sm" aria-label="View original recipe" />
                </a>
              </div>

              {recipe.description && (
                <p className="mb-2 text-sm text-[var(--foreground-muted)]">{recipe.description}</p>
              )}

              <div className="mt-2">
                <p className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
                  Ingredients ({recipe.ingredients.length}):
                </p>
                <div className="flex flex-wrap gap-1">
                  {recipe.ingredients.slice(0, 8).map((ing, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-[var(--muted)] px-2 py-1 text-xs text-[var(--foreground)]"
                    >
                      {typeof ing === 'string' ? ing : ing.original_text || ing.name}
                    </span>
                  ))}
                  {recipe.ingredients.length > 8 && (
                    <span className="rounded-full bg-[var(--muted)] px-2 py-1 text-xs text-[var(--foreground-muted)]">
                      +{recipe.ingredients.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
