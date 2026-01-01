/**
 * Recipe Scraper Component
 * UI for triggering recipe scraping and viewing scraped recipes
 */

'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Download, Search, Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

interface ScrapeResult {
  success: boolean;
  recipe?: {
    id: string;
    recipe_name: string;
    source: string;
    source_url: string;
    ingredients: Array<{ name: string; original_text: string }>;
  };
  error?: string;
  url: string;
}

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

export function RecipeScraper() {
  const { showSuccess, showError } = useNotification();
  const [urls, setUrls] = useState('');
  const [source, setSource] = useState<'allrecipes' | 'bbc-good-food' | 'food-network'>(
    'allrecipes',
  );
  const [scraping, setScraping] = useState(false);
  const [results, setResults] = useState<ScrapeResult[]>([]);
  const [recipes, setRecipes] = useState<ScrapedRecipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [discoveryMode, setDiscoveryMode] = useState(true);
  const [limit, setLimit] = useState(50);

  const handleScrape = async () => {
    if (!discoveryMode) {
      // Manual URL mode
      if (!urls.trim()) {
        showError('Please enter at least one recipe URL');
        return;
      }

      const urlList = urls
        .split('\n')
        .map(u => u.trim())
        .filter(Boolean);

      if (urlList.length === 0) {
        showError('Please enter at least one valid URL');
        return;
      }
    }

    setScraping(true);
    setResults([]);

    try {
      const requestBody: {
        source: string;
        urls?: string[];
        discovery: boolean;
        limit?: number;
      } = {
        source,
        discovery: discoveryMode,
      };

      if (!discoveryMode) {
        const urlList = urls
          .split('\n')
          .map(u => u.trim())
          .filter(Boolean);
        requestBody.urls = urlList;
      } else {
        requestBody.limit = limit;
      }

      const response = await fetch('/api/recipe-scraper/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (result.success) {
        setResults(result.data.results);
        const { success, errors } = result.data.summary;
        if (success > 0) {
          showSuccess(`Successfully scraped ${success} recipe(s)!`);
          // Refresh recipe list
          fetchRecipes();
        }
        if (errors > 0) {
          showError(`${errors} recipe(s) failed to scrape`);
        }
      } else {
        showError(result.message || 'Failed to scrape recipes');
      }
    } catch (error) {
      logger.error('[RecipeScraper] Error scraping recipes:', {
        error: error instanceof Error ? error.message : String(error),
      });
      showError('Failed to scrape recipes. Please try again.');
    } finally {
      setScraping(false);
    }
  };

  const fetchRecipes = async () => {
    setLoadingRecipes(true);
    try {
      const searchParam = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const response = await fetch(`/api/recipe-scraper/recipes${searchParam}`);
      const result = await response.json();

      if (result.success) {
        setRecipes(result.data.recipes || []);
      }
    } catch (error) {
      logger.error('[RecipeScraper] Error fetching recipes:', {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoadingRecipes(false);
    }
  };

  // Load recipes on mount
  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Scraper Section */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[var(--foreground)]">
          <Icon icon={Download} size="md" aria-hidden={true} />
          Scrape Recipes
        </h2>
        <p className="mb-4 text-sm text-[var(--foreground-muted)]">
          Enter recipe URLs to scrape and add them to the database
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
              Source
            </label>
            <select
              value={source}
              onChange={e =>
                setSource(e.target.value as 'allrecipes' | 'bbc-good-food' | 'food-network')
              }
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-[#29E7CD]"
            >
              <option value="allrecipes">AllRecipes</option>
              <option value="bbc-good-food">BBC Good Food</option>
              <option value="food-network">Food Network</option>
            </select>
          </div>

          <div>
            <label className="mb-3 flex items-center gap-2">
              <input
                type="checkbox"
                checked={discoveryMode}
                onChange={e => setDiscoveryMode(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--border)] text-[#29E7CD] focus:ring-[#29E7CD]"
              />
              <span className="text-sm font-medium text-[var(--foreground)]">
                Automatic Discovery (scrape popular recipes automatically)
              </span>
            </label>
          </div>

          {discoveryMode ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Number of Recipes to Scrape
              </label>
              <input
                type="number"
                value={limit}
                onChange={e =>
                  setLimit(Math.max(1, Math.min(200, parseInt(e.target.value, 10) || 50)))
                }
                min={1}
                max={200}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-[#29E7CD]"
              />
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                The scraper will automatically discover and scrape popular recipes from {source}
              </p>
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Recipe URLs (one per line)
              </label>
              <textarea
                value={urls}
                onChange={e => setUrls(e.target.value)}
                placeholder="https://www.allrecipes.com/recipe/12345&#10;https://www.allrecipes.com/recipe/67890"
                rows={4}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-[#29E7CD]"
              />
            </div>
          )}

          <button
            onClick={handleScrape}
            disabled={scraping || !urls.trim()}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {scraping ? (
              <>
                <Icon icon={Loader2} size="sm" className="animate-spin" aria-hidden={true} />
                Scraping...
              </>
            ) : (
              <>
                <Icon icon={Download} size="sm" aria-hidden={true} />
                Scrape Recipes
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium text-[var(--foreground)]">Results:</h3>
            {results.map((result, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 rounded-xl border p-3 ${
                  result.success
                    ? 'border-[#29E7CD]/20 bg-[#29E7CD]/10'
                    : 'border-[var(--color-error)]/20 bg-[var(--color-error)]/10'
                }`}
              >
                <Icon
                  icon={result.success ? CheckCircle2 : XCircle}
                  size="sm"
                  className={result.success ? 'text-[#29E7CD]' : 'text-[var(--color-error)]'}
                  aria-hidden={true}
                />
                <div className="flex-1">
                  {result.success && result.recipe ? (
                    <div>
                      <p className="font-medium text-[var(--foreground)]">
                        {result.recipe.recipe_name}
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        {result.recipe.source}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {result.error || 'Failed'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recipe List Section */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--foreground)]">
            <Icon icon={Search} size="md" aria-hidden={true} />
            Scraped Recipes
          </h2>
          <button
            onClick={fetchRecipes}
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
                fetchRecipes();
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
                  <p className="mb-2 text-sm text-[var(--foreground-muted)]">
                    {recipe.description}
                  </p>
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
    </div>
  );
}
