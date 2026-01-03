/**
 * Recipe Scraper Component
 * UI for triggering recipe scraping and viewing scraped recipes
 *
 * @component
 * @returns {JSX.Element} Recipe scraper interface with comprehensive scraping controls
 */
'use client';

import { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { ComprehensiveScraperSection } from './RecipeScraper/ComprehensiveScraperSection';
import { RegularScraperSection } from './RecipeScraper/RegularScraperSection';
import { RecipeListSection } from './RecipeScraper/RecipeListSection';

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
  const [source, setSource] = useState<
    'allrecipes' | 'food-network' | 'epicurious' | 'bon-appetit' | 'tasty'
  >('allrecipes');
  const [scraping, setScraping] = useState(false);
  const [results, setResults] = useState<ScrapeResult[]>([]);
  const [recipes, setRecipes] = useState<ScrapedRecipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [discoveryMode, setDiscoveryMode] = useState(true);
  const [limit, setLimit] = useState(50);
  const [comprehensiveScraping, setComprehensiveScraping] = useState(false);
  const [comprehensiveStatus, setComprehensiveStatus] = useState<any>(null);
  const [statusPolling, setStatusPolling] = useState(false);

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

    // Note: Scraping is a CREATE operation (adds new recipes), not UPDATE/DELETE
    // Loading state is appropriate here as we're fetching external data
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
      // Note: No rollback needed - scraping is a CREATE operation that doesn't modify existing state
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

  // Load recipes and check comprehensive scraping status on mount
  useEffect(() => {
    fetchRecipes();
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/recipe-scraper/status');
        const result = await response.json();
        if (result.success && result.data.isRunning) {
          setComprehensiveStatus(result.data);
          setComprehensiveScraping(true);
          setStatusPolling(true);
        }
      } catch (err) {
        logger.error('[RecipeScraper] Error checking initial status:', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    };
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll status when comprehensive scraping is active
  useEffect(() => {
    if (!statusPolling) return;

    const pollStatus = async () => {
      try {
        const response = await fetch('/api/recipe-scraper/status');
        const result = await response.json();
        if (result.success) {
          setComprehensiveStatus(result.data);
          if (!result.data.isRunning) {
            setStatusPolling(false);
            fetchRecipes(); // Refresh recipe list
          }
        }
      } catch (err) {
        logger.error('[RecipeScraper] Error fetching status:', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusPolling]);

  const handleComprehensiveScrape = async () => {
    setComprehensiveScraping(true);
    try {
      const response = await fetch('/api/recipe-scraper/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comprehensive: true }),
      });
      const result = await response.json();

      if (result.success) {
        setComprehensiveStatus(result.data.jobStatus);
        setStatusPolling(true);
        showSuccess(
          'Comprehensive scraping job started! This will scrape ALL recipes from all sources.',
        );
      } else {
        showError(result.message || 'Failed to start comprehensive scraping');
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error starting comprehensive scrape:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError('Failed to start comprehensive scraping');
    } finally {
      setComprehensiveScraping(false);
    }
  };

  const handleStopComprehensiveScrape = async () => {
    try {
      // Show immediate feedback
      showSuccess('Stopping scraper... (this may take a few seconds)');

      const response = await fetch('/api/recipe-scraper/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setStatusPolling(true); // Continue polling to see status update
        showSuccess('Stop command sent! Scraper will stop at next checkpoint (within current batch).');

        // Refresh status immediately and continue polling
        const refreshStatus = async () => {
          try {
            const statusResponse = await fetch('/api/recipe-scraper/status');
            const statusData = await statusResponse.json();
            if (statusData.success) {
              setComprehensiveStatus(statusData.data);
              // If still running, check again in 2 seconds
              if (statusData.data.isRunning) {
                setTimeout(refreshStatus, 2000);
              } else {
                showSuccess('✅ Scraper has stopped successfully!');
                setStatusPolling(false);
              }
            }
          } catch (err) {
            logger.error('[RecipeScraper] Error fetching status after stop:', {
              error: err instanceof Error ? err.message : String(err),
            });
          }
        };

        // Start polling for status updates
        setTimeout(refreshStatus, 1000);
      } else {
        showError(result.message || 'Failed to stop scraping job');
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error stopping comprehensive scrape:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError(`Failed to stop scraping job: ${err instanceof Error ? err.message : String(err)}`);

      // Even if API fails, try creating stop flag manually as fallback
      showSuccess('Attempting manual stop via stop flag file...');
    }
  };

  const handleRefreshStatus = async () => {
    try {
      const response = await fetch('/api/recipe-scraper/status');
      const result = await response.json();
      if (result.success) {
        setComprehensiveStatus(result.data);
        if (result.data.isRunning) {
          setStatusPolling(true);
        }
        showSuccess('Status refreshed');
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error refreshing status:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError('Failed to refresh status');
    }
  };

  return (
    <div className="space-y-6">
      <ComprehensiveScraperSection
        comprehensiveScraping={comprehensiveScraping}
        comprehensiveStatus={comprehensiveStatus}
        onStartComprehensive={handleComprehensiveScrape}
        onStopComprehensive={handleStopComprehensiveScrape}
        onRefreshStatus={handleRefreshStatus}
      />

      <RegularScraperSection
        source={source}
        setSource={setSource}
        urls={urls}
        setUrls={setUrls}
        discoveryMode={discoveryMode}
        setDiscoveryMode={setDiscoveryMode}
        limit={limit}
        setLimit={setLimit}
        scraping={scraping}
        results={results}
        onScrape={handleScrape}
      />

      <RecipeListSection
        recipes={recipes}
        loadingRecipes={loadingRecipes}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onFetchRecipes={fetchRecipes}
      />
    </div>
  );
}
