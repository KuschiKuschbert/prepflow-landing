/**
 * Recipe List Section Component
 * Displays scraped recipes with search functionality in compact card grid layout
 */

'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { TablePagination } from '@/components/ui/TablePagination';
import { Search, Loader2 } from 'lucide-react';
import { RecipeCard } from './RecipeListSection/components/RecipeCard';
import { SearchFilters } from './RecipeListSection/components/SearchFilters';

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
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  total_time_minutes?: number;
  temperature_celsius?: number;
  temperature_fahrenheit?: number;
  temperature_unit?: 'celsius' | 'fahrenheit';
  category?: string;
  cuisine?: string;
  image_url?: string;
  rating?: number;
  dietary_tags?: string[];
  scraped_at?: string;
  updated_at?: string;
}

interface RecipeListSectionProps {
  recipes: ScrapedRecipe[];
  loadingRecipes: boolean;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  sourceFilter: string;
  setSourceFilter: (sourceFilter: string) => void;
  formatFilter: 'all' | 'formatted' | 'unformatted';
  setFormatFilter: (formatFilter: 'all' | 'formatted' | 'unformatted') => void;
  onFetchRecipes: () => void;
  page: number;
  pageSize: number;
  totalRecipes: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function RecipeListSection({
  recipes,
  loadingRecipes,
  searchTerm,
  setSearchTerm,
  sourceFilter,
  setSourceFilter,
  formatFilter,
  setFormatFilter,
  onFetchRecipes,
  page,
  pageSize,
  totalRecipes,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: RecipeListSectionProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (recipeId: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.add(recipeId);
      }
      return next;
    });
  };

  return (
    <div className="desktop:p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
      <div className="tablet:flex-row tablet:items-center tablet:justify-between mb-4 flex flex-col gap-3">
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

      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        formatFilter={formatFilter}
        setFormatFilter={setFormatFilter}
        loadingRecipes={loadingRecipes}
        onFetchRecipes={onFetchRecipes}
      />

      {loadingRecipes ? (
        <div className="py-8 text-center text-[var(--foreground-muted)]">Loading recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="py-8 text-center text-[var(--foreground-muted)]">
          {searchTerm || sourceFilter || formatFilter !== 'all'
            ? 'No recipes found matching your search. Try different ingredients or filters!'
            : 'No recipes found. Scrape some recipes to get started!'}
        </div>
      ) : (
        <>
          <TablePagination
            page={page}
            totalPages={totalPages}
            total={totalRecipes}
            itemsPerPage={pageSize}
            onPageChange={onPageChange}
            onItemsPerPageChange={onPageSizeChange}
            className="mb-4"
          />
          <div className="tablet:grid-cols-2 desktop:grid-cols-3 large-desktop:grid-cols-4 grid grid-cols-1 gap-4">
            {recipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isExpanded={expandedCards.has(recipe.id)}
                onToggle={() => toggleCard(recipe.id)}
              />
            ))}
          </div>
          <TablePagination
            page={page}
            totalPages={totalPages}
            total={totalRecipes}
            itemsPerPage={pageSize}
            onPageChange={onPageChange}
            onItemsPerPageChange={onPageSizeChange}
            className="mt-4"
          />
        </>
      )}
    </div>
  );
}
