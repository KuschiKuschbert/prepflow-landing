/**
 * Recipe List Section Component
 * Displays scraped recipes with search functionality in compact card grid layout
 */

'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { TablePagination } from '@/components/ui/TablePagination';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Filter,
  Loader2,
  Search,
  Star,
  Thermometer,
} from 'lucide-react';
// Using regular img tag for external recipe images (already optimized by source sites)

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
  rating?: number; // 1-5 rating if available
  dietary_tags?: string[];
}

interface RecipeListSectionProps {
  recipes: ScrapedRecipe[];
  loadingRecipes: boolean;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  sourceFilter: string;
  setSourceFilter: (sourceFilter: string) => void;
  onFetchRecipes: () => void;
  page: number;
  pageSize: number;
  totalRecipes: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const SOURCES = [
  { value: '', label: 'All Sources' },
  { value: 'allrecipes', label: 'AllRecipes' },
  { value: 'food-network', label: 'Food Network' },
  { value: 'epicurious', label: 'Epicurious' },
  { value: 'bon-appetit', label: 'Bon Appétit' },
  { value: 'tasty', label: 'Tasty' },
  { value: 'serious-eats', label: 'Serious Eats' },
  { value: 'food52', label: 'Food52' },
  { value: 'simply-recipes', label: 'Simply Recipes' },
  { value: 'smitten-kitchen', label: 'Smitten Kitchen' },
  { value: 'the-kitchn', label: 'The Kitchn' },
  { value: 'delish', label: 'Delish' },
];

const getSourceColor = (source: string): string => {
  const colors: Record<string, string> = {
    allrecipes: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'food-network': 'bg-red-500/20 text-red-300 border-red-500/30',
    epicurious: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'bon-appetit': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    tasty: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'serious-eats': 'bg-green-500/20 text-green-300 border-green-500/30',
    food52: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'simply-recipes': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    'smitten-kitchen': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'the-kitchn': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    delish: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  };
  return colors[source] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

const getRatingColor = (rating?: number): string => {
  if (!rating) return 'text-gray-400';
  if (rating >= 4.5) return 'text-green-400';
  if (rating >= 4.0) return 'text-yellow-400';
  return 'text-gray-400';
};

const formatSourceName = (source: string): string => {
  return source.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export function RecipeListSection({
  recipes,
  loadingRecipes,
  searchTerm,
  setSearchTerm,
  sourceFilter,
  setSourceFilter,
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

      {/* Search and Filter */}
      <div className="tablet:flex-row mb-4 flex flex-col gap-3">
        <div className="flex-1">
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
        <div className="tablet:w-48">
          <div className="relative">
            <Icon
              icon={Filter}
              size="sm"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--foreground-muted)]"
              aria-hidden={true}
            />
            <select
              value={sourceFilter}
              onChange={e => {
                setSourceFilter(e.target.value);
                onFetchRecipes();
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 pl-10 text-[var(--foreground)] focus:ring-2 focus:ring-[#29E7CD]"
            >
              {SOURCES.map(source => (
                <option key={source.value} value={source.value}>
                  {source.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loadingRecipes ? (
        <div className="py-8 text-center text-[var(--foreground-muted)]">Loading recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="py-8 text-center text-[var(--foreground-muted)]">
          {searchTerm || sourceFilter
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
          {/* Compact Card Grid */}
          <div className="tablet:grid-cols-2 desktop:grid-cols-3 large-desktop:grid-cols-4 grid grid-cols-1 gap-4">
            {recipes.map(recipe => {
              const isExpanded = expandedCards.has(recipe.id);
              const hasImage = !!recipe.image_url;

              return (
                <div
                  key={recipe.id}
                  className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-lg"
                >
                  {/* Header with Image/Title */}
                  <div className="mb-3 flex gap-3">
                    {hasImage && (
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={recipe.image_url!}
                          alt={recipe.recipe_name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={e => {
                            // Hide image on error
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 line-clamp-2 font-semibold text-[var(--foreground)]">
                        {recipe.recipe_name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Source Badge */}
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getSourceColor(recipe.source)}`}
                        >
                          {formatSourceName(recipe.source)}
                        </span>
                        {/* Rating */}
                        {recipe.rating && (
                          <div
                            className={`flex items-center gap-1 text-xs ${getRatingColor(recipe.rating)}`}
                          >
                            <Icon
                              icon={Star}
                              size="xs"
                              className="fill-current"
                              aria-hidden={true}
                            />
                            <span>{recipe.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <a
                      href={recipe.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
                      onClick={e => e.stopPropagation()}
                    >
                      <Icon icon={ExternalLink} size="sm" aria-label="View original recipe" />
                    </a>
                  </div>

                  {/* Description */}
                  {recipe.description && (
                    <p className="mb-2 line-clamp-2 text-xs text-[var(--foreground-muted)]">
                      {recipe.description}
                    </p>
                  )}

                  {/* Compact Metadata */}
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[var(--foreground-muted)]">
                    {recipe.total_time_minutes && (
                      <div className="flex items-center gap-1">
                        <Icon icon={Clock} size="xs" aria-hidden={true} />
                        <span>{recipe.total_time_minutes}m</span>
                      </div>
                    )}
                    {recipe.yield && (
                      <span>
                        {recipe.yield} {recipe.yield_unit || 'servings'}
                      </span>
                    )}
                    {recipe.category && (
                      <span className="rounded-full bg-[var(--muted)] px-2 py-0.5">
                        {recipe.category}
                      </span>
                    )}
                    {recipe.cuisine && (
                      <span className="rounded-full bg-[var(--muted)] px-2 py-0.5">
                        {recipe.cuisine}
                      </span>
                    )}
                    {(recipe.temperature_celsius || recipe.temperature_fahrenheit) && (
                      <div className="flex items-center gap-1">
                        <Icon icon={Thermometer} size="xs" aria-hidden={true} />
                        <span>
                          {recipe.temperature_unit === 'celsius' || !recipe.temperature_fahrenheit
                            ? `${recipe.temperature_celsius}°C`
                            : `${recipe.temperature_fahrenheit}°F`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Dietary Tags */}
                  {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {recipe.dietary_tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-[#29E7CD]/10 px-2 py-0.5 text-xs text-[#29E7CD]"
                        >
                          {tag}
                        </span>
                      ))}
                      {recipe.dietary_tags.length > 3 && (
                        <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-xs text-[var(--foreground-muted)]">
                          +{recipe.dietary_tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Ingredients Preview */}
                  <div className="mb-2">
                    <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
                      Ingredients ({recipe.ingredients.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 4).map((ing, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-xs text-[var(--foreground)]"
                        >
                          {typeof ing === 'string' ? ing : ing.original_text || ing.name}
                        </span>
                      ))}
                      {recipe.ingredients.length > 4 && (
                        <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-xs text-[var(--foreground-muted)]">
                          +{recipe.ingredients.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Collapsible Instructions */}
                  {recipe.instructions && recipe.instructions.length > 0 && (
                    <div className="mt-auto">
                      <button
                        onClick={() => toggleCard(recipe.id)}
                        className="flex w-full items-center justify-between rounded-lg bg-[var(--muted)] px-3 py-2 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface)]"
                      >
                        <span>Instructions ({recipe.instructions.length} steps)</span>
                        <Icon
                          icon={isExpanded ? ChevronUp : ChevronDown}
                          size="xs"
                          aria-hidden={true}
                        />
                      </button>
                      {isExpanded && (
                        <div className="mt-2 max-h-64 overflow-y-auto rounded-lg bg-[var(--muted)] p-3">
                          <ol className="list-inside list-decimal space-y-1 text-xs text-[var(--foreground)]">
                            {recipe.instructions.map((instruction, idx) => (
                              <li key={idx} className="pl-2">
                                {instruction}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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
