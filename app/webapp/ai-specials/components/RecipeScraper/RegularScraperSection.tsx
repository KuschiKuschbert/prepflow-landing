/**
 * Regular Scraper Section Component
 * Handles manual URL and discovery mode scraping
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { Download, Loader2, CheckCircle2, XCircle } from 'lucide-react';

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

interface RegularScraperSectionProps {
  source: 'allrecipes' | 'food-network' | 'epicurious' | 'bon-appetit' | 'tasty';
  setSource: (
    source: 'allrecipes' | 'food-network' | 'epicurious' | 'bon-appetit' | 'tasty',
  ) => void;
  urls: string;
  setUrls: (urls: string) => void;
  discoveryMode: boolean;
  setDiscoveryMode: (discoveryMode: boolean) => void;
  limit: number;
  setLimit: (limit: number) => void;
  scraping: boolean;
  results: ScrapeResult[];
  onScrape: () => void;
}

export function RegularScraperSection({
  source,
  setSource,
  urls,
  setUrls,
  discoveryMode,
  setDiscoveryMode,
  limit,
  setLimit,
  scraping,
  results,
  onScrape,
}: RegularScraperSectionProps) {
  return (
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
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Source</label>
          <select
            value={source}
            onChange={e =>
              setSource(
                e.target.value as
                  | 'allrecipes'
                  | 'food-network'
                  | 'epicurious'
                  | 'bon-appetit'
                  | 'tasty',
              )
            }
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-[#29E7CD]"
          >
            <option value="allrecipes">AllRecipes</option>
            {/* <option value="bbc-good-food">BBC Good Food</option> - DISABLED - Terms of Service violation */}
            <option value="food-network">Food Network</option>
            <option value="epicurious">Epicurious</option>
            <option value="bon-appetit">Bon Appétit</option>
            <option value="tasty">Tasty</option>
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
          onClick={onScrape}
          disabled={scraping || (!discoveryMode && !urls.trim())}
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
                    <p className="text-xs text-[var(--foreground-muted)]">{result.recipe.source}</p>
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
  );
}
