/**
 * Recipe Scraper Component
 * UI for triggering recipe scraping and viewing scraped recipes
 *
 * @component
 * @returns {JSX.Element} Recipe scraper interface with comprehensive scraping controls
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { ComprehensiveScraperSection } from './RecipeScraper/ComprehensiveScraperSection';
import { FormattingDashboard } from './RecipeScraper/FormattingDashboard';
import { RecipeListSection } from './RecipeScraper/RecipeListSection';
import { AISpecialsTabs } from './RecipeScraper/AISpecialsTabs';

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
  scraped_at?: string; // ISO timestamp when recipe was scraped
  updated_at?: string; // ISO timestamp when recipe was last updated (formatted)
}

export function RecipeScraper() {
  const { showSuccess, showError } = useNotification();
  const { resetTimeout } = useSessionTimeout({
    enabled: true, // Always enabled (parent layout controls auth state)
  });

  // Tab state
  const [activeTab, setActiveTab] = useState<'scraping' | 'formatting'>('scraping');

  // Scraping state
  const [recipes, setRecipes] = useState<ScrapedRecipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [formatFilter, setFormatFilter] = useState<'all' | 'formatted' | 'unformatted'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [comprehensiveScraping, setComprehensiveScraping] = useState(false);
  const [comprehensiveStatus, setComprehensiveStatus] = useState<any>(null);
  const [statusPolling, setStatusPolling] = useState(false);

  // Formatting state
  const [processing, setProcessing] = useState<{
    isProcessing: boolean;
    isPaused: boolean;
    queueLength: number;
    activeProcessing: number;
    totalProcessed: number;
    totalRecipes: number;
    skippedFormatted?: number;
    progressPercent: number;
    aiProvider?: string;
    aiProviderModel?: string;
    lastError?: string;
    lastProcessedRecipe?: string;
    isStuck?: boolean;
    stuckReason?: string;
    healthStatus?: 'healthy' | 'warning' | 'error';
    processingDuration?: number;
    startedAt?: string;
  } | null>(null);
  const [isResuming, setIsResuming] = useState(false);
  const [isProcessingStarting, setIsProcessingStarting] = useState(false);
  const [processingPolling, setProcessingPolling] = useState(false);

  const fetchRecipes = async (pageNum: number = page, pageSizeNum: number = pageSize) => {
    setLoadingRecipes(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.set('search', searchTerm);
      }
      if (sourceFilter) {
        params.set('source', sourceFilter);
      }
      if (formatFilter !== 'all') {
        params.set('format', formatFilter);
      }
      params.set('page', pageNum.toString());
      params.set('pageSize', pageSizeNum.toString());

      const response = await fetch(`/api/recipe-scraper/recipes?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setRecipes(result.data.recipes || []);
        if (result.data.pagination) {
          setTotalRecipes(result.data.pagination.total || 0);
          setTotalPages(result.data.pagination.totalPages || 0);
          setPage(result.data.pagination.page || 1);
        }
      }
    } catch (error) {
      logger.error('[RecipeScraper] Error fetching recipes:', {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoadingRecipes(false);
    }
  };

  // Fetch processing status
  const fetchProcessingStatus = useCallback(async () => {
    try {
      const previousProcessing = processing?.isProcessing && !processing?.isPaused;
      const previousQueueLength = processing?.queueLength || 0;

      const response = await fetch('/api/recipe-scraper/process-recipes');
      const result = await response.json();
      if (result.success && result.data) {
        const status = result.data;
        setProcessing({
          isProcessing: status.isProcessing || false,
          isPaused: status.isPaused || false,
          queueLength: status.queueLength || 0,
          activeProcessing: status.activeProcessing || 0,
          totalProcessed: status.totalProcessed || 0,
          totalRecipes: status.totalRecipes || 0,
          skippedFormatted: status.skippedFormatted,
          progressPercent:
            status.totalRecipes > 0 ? (status.totalProcessed / status.totalRecipes) * 100 : 0,
          aiProvider: status.aiProvider,
          aiProviderModel: status.aiProviderModel,
          lastError: status.lastError,
          lastProcessedRecipe: status.lastProcessedRecipe,
          isStuck: status.isStuck,
          stuckReason: status.stuckReason,
          healthStatus: status.healthStatus,
          processingDuration: status.processingDuration,
          startedAt: status.startedAt,
        });

        // Extend session timeout when processing is active
        if (status.queueLength > 0 || status.activeProcessing > 0) {
          resetTimeout();
          logger.dev('[RecipeScraper] Processing active - session timeout extended');
        }

        // Check if processing just completed
        const currentProcessing = status.isProcessing && !status.isPaused;
        if (previousProcessing && !currentProcessing && status.queueLength === 0) {
          // Processing just completed - refresh recipe list
          logger.dev('[RecipeScraper] Processing completed, refreshing recipe list');
          fetchRecipes(page, pageSize);
        }

        // Auto-start/stop polling based on status
        if (currentProcessing) {
          setProcessingPolling(true);
        } else if (!status.isProcessing && status.queueLength === 0) {
          setProcessingPolling(false);
        }
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error fetching processing status:', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }, [resetTimeout, processing, page, pageSize, fetchRecipes]);

  // Load recipes when filters change (format, source, or search) - includes initial mount
  useEffect(() => {
    setPage(1); // Reset to page 1 when filters change
    fetchRecipes(1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formatFilter, sourceFilter, searchTerm]);

  // Check comprehensive scraping and processing status on mount
  useEffect(() => {
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
    fetchProcessingStatus(); // Also check processing status
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
            fetchRecipes(page, pageSize); // Refresh current page
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
  }, [statusPolling, page, pageSize]);

  // Poll processing status when formatting is active
  useEffect(() => {
    if (!processingPolling) return;

    const pollProcessingStatus = async () => {
      await fetchProcessingStatus();
    };

    pollProcessingStatus();
    const interval = setInterval(pollProcessingStatus, 10000); // Poll every 10 seconds (reduced frequency to avoid rate limits)

    return () => clearInterval(interval);
  }, [processingPolling, fetchProcessingStatus]);

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
      showSuccess('Pausing scraper... (progress will be saved)');

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
        showSuccess('Pause command sent! Scraper will pause at next checkpoint (progress saved).');

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
                showSuccess('✅ Scraper has paused successfully!');
                setStatusPolling(false);
              }
            }
          } catch (err) {
            logger.error('[RecipeScraper] Error fetching status after pause:', {
              error: err instanceof Error ? err.message : String(err),
            });
          }
        };

        // Start polling for status updates
        setTimeout(refreshStatus, 1000);
      } else {
        showError(result.message || 'Failed to pause scraping job');
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error pausing comprehensive scrape:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError(
        `Failed to pause scraping job: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handleResumeComprehensiveScrape = async () => {
    try {
      showSuccess('Resuming scraper...');

      const response = await fetch('/api/recipe-scraper/resume', {
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
        setComprehensiveStatus(result.data.status);
        setStatusPolling(true);
        showSuccess('Scraping job resumed! Continuing from saved progress.');
      } else {
        showError(result.message || 'Failed to resume scraping job');
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error resuming comprehensive scrape:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError(
        `Failed to resume scraping job: ${err instanceof Error ? err.message : String(err)}`,
      );
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

  // Formatting handlers
  const handleResumeFormatting = useCallback(async () => {
    setIsResuming(true);
    try {
      const response = await fetch('/api/recipe-scraper/process-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resume' }),
      });
      const result = await response.json();

      if (result.success) {
        showSuccess('Formatting resumed');
        setProcessingPolling(true);
        // Verify status after a short delay
        setTimeout(() => {
          fetchProcessingStatus();
        }, 1000);
      } else {
        showError(result.message || 'Failed to resume formatting');
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error resuming formatting:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError('Failed to resume formatting');
    } finally {
      setIsResuming(false);
    }
  }, [showSuccess, showError, fetchProcessingStatus]);

  const handlePauseFormatting = useCallback(async () => {
    try {
      const response = await fetch('/api/recipe-scraper/process-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pause' }),
      });
      const result = await response.json();

      if (result.success) {
        showSuccess('Formatting paused');
        fetchProcessingStatus();
      } else {
        showError(result.message || 'Failed to pause formatting');
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error pausing formatting:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError('Failed to pause formatting');
    }
  }, [showSuccess, showError, fetchProcessingStatus]);

  const handleProcessAllRecipes = useCallback(async () => {
    // Check if already processing
    if (processing?.isProcessing && !processing?.isPaused) {
      showError('Processing is already in progress');
      return;
    }

    setIsProcessingStarting(true);
    try {
      // Show optimistic feedback
      showSuccess('Starting recipe processing...');

      const response = await fetch('/api/recipe-scraper/process-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Processing started in background');
        setProcessingPolling(true);
        // Verify status after a short delay
        setTimeout(() => {
          fetchProcessingStatus();
        }, 1000);
      } else {
        showError(result.message || 'Failed to start processing');
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error starting processing:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError('Failed to start processing. Please try again.');
    } finally {
      setIsProcessingStarting(false);
    }
  }, [processing, showSuccess, showError, fetchProcessingStatus]);

  return (
    <div className="space-y-6">
      <AISpecialsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'scraping' ? (
        <>
          <ComprehensiveScraperSection
            comprehensiveScraping={comprehensiveScraping}
            comprehensiveStatus={comprehensiveStatus}
            onStartComprehensive={handleComprehensiveScrape}
            onStopComprehensive={handleStopComprehensiveScrape}
            onResumeComprehensive={handleResumeComprehensiveScrape}
            onRefreshStatus={handleRefreshStatus}
          />

          <RecipeListSection
            recipes={recipes}
            loadingRecipes={loadingRecipes}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sourceFilter={sourceFilter}
            setSourceFilter={setSourceFilter}
            formatFilter={formatFilter}
            setFormatFilter={setFormatFilter}
            onFetchRecipes={() => {
              setPage(1); // Reset to first page when refreshing/searching
              fetchRecipes(1, pageSize);
            }}
            page={page}
            pageSize={pageSize}
            totalRecipes={totalRecipes}
            totalPages={totalPages}
            onPageChange={newPage => {
              setPage(newPage);
              fetchRecipes(newPage, pageSize);
            }}
            onPageSizeChange={newPageSize => {
              setPageSize(newPageSize);
              setPage(1); // Reset to first page when changing page size
              fetchRecipes(1, newPageSize);
            }}
          />
        </>
      ) : (
        <FormattingDashboard
          processing={processing}
          recipes={recipes}
          loadingRecipes={loadingRecipes}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sourceFilter={sourceFilter}
          setSourceFilter={setSourceFilter}
          formatFilter={formatFilter}
          setFormatFilter={setFormatFilter}
          onFetchRecipes={() => {
            setPage(1); // Reset to first page when refreshing/searching
            fetchRecipes(1, pageSize);
          }}
          page={page}
          pageSize={pageSize}
          totalRecipes={totalRecipes}
          totalPages={totalPages}
          onPageChange={newPage => {
            setPage(newPage);
            fetchRecipes(newPage, pageSize);
          }}
          onPageSizeChange={newPageSize => {
            setPageSize(newPageSize);
            setPage(1); // Reset to first page when changing page size
            fetchRecipes(1, newPageSize);
          }}
          isResuming={isResuming}
          isProcessingStarting={isProcessingStarting}
          onProcessAllRecipes={handleProcessAllRecipes}
          onPause={handlePauseFormatting}
          onResume={handleResumeFormatting}
        />
      )}
    </div>
  );
}
