/**
 * Recipe Scraper Component
 * UI for triggering recipe scraping and viewing scraped recipes
 */

'use client';

import { logger } from '@/lib/logger';
import { useEffect } from 'react';
import { AISpecialsTabs } from './RecipeScraper/AISpecialsTabs';
import { ComprehensiveScraperSection } from './RecipeScraper/ComprehensiveScraperSection';
import { FormattingDashboard } from './RecipeScraper/FormattingDashboard';
import { useComprehensiveScrapingHandlers } from './RecipeScraper/hooks/useComprehensiveScrapingHandlers';
import { useFormattingHandlers } from './RecipeScraper/hooks/useFormattingHandlers';
import { useProcessingStatus } from './RecipeScraper/hooks/useProcessingStatus';
import { useRecipeFetching } from './RecipeScraper/hooks/useRecipeFetching';
import { useRecipeScraperState } from './RecipeScraper/hooks/useRecipeScraperState';
import { useStatusPolling } from './RecipeScraper/hooks/useStatusPolling';
import { RecipeListSection } from './RecipeScraper/RecipeListSection';

export function RecipeScraper() {
  const state = useRecipeScraperState();

  const { fetchRecipes } = useRecipeFetching({
    page: state.page,
    pageSize: state.pageSize,
    searchTerm: state.searchTerm,
    sourceFilter: state.sourceFilter,
    formatFilter: state.formatFilter,
    setLoadingRecipes: state.setLoadingRecipes,
    setRecipes: state.setRecipes,
    setTotalRecipes: state.setTotalRecipes,
    setTotalPages: state.setTotalPages,
  });

  const { fetchProcessingStatus } = useProcessingStatus({
    processing: state.processing,
    setProcessing: state.setProcessing,
    setProcessingPolling: state.setProcessingPolling,
    fetchRecipes,
    page: state.page,
    pageSize: state.pageSize,
  });

  useStatusPolling({
    statusPolling: state.statusPolling,
    setComprehensiveStatus: state.setComprehensiveStatus,
    setStatusPolling: state.setStatusPolling,
    fetchRecipes,
    page: state.page,
    pageSize: state.pageSize,
    processingPolling: state.processingPolling,
    fetchProcessingStatus,
  });

  const {
    handleComprehensiveScrape,
    handleStopComprehensiveScrape,
    handleResumeComprehensiveScrape,
    handleRefreshStatus,
  } = useComprehensiveScrapingHandlers({
    setComprehensiveScraping: state.setComprehensiveScraping,
    setComprehensiveStatus: state.setComprehensiveStatus,
    setStatusPolling: state.setStatusPolling,
    fetchComprehensiveStatus: async () => {
      try {
        const response = await fetch('/api/recipe-scraper/status');
        const result = await response.json();
        if (result.success) {
          state.setComprehensiveStatus(result.data);
        }
      } catch (err) {
        logger.error('[RecipeScraper] Error fetching comprehensive status:', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    },
  });

  const { handleResumeFormatting, handlePauseFormatting, handleProcessAllRecipes } =
    useFormattingHandlers({
      processing: state.processing,
      setIsResuming: state.setIsResuming,
      setIsProcessingStarting: state.setIsProcessingStarting,
      setProcessingPolling: state.setProcessingPolling,
      fetchProcessingStatus,
    });

  // Load recipes when filters change
  useEffect(() => {
    state.setPage(1);
    fetchRecipes(1, state.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.formatFilter, state.sourceFilter, state.searchTerm]);

  // Check initial status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/recipe-scraper/status');
        const result = await response.json();
        if (result.success && result.data.isRunning) {
          state.setComprehensiveStatus(result.data);
          state.setComprehensiveScraping(true);
          state.setStatusPolling(true);
        }
      } catch (err) {
        logger.error('[RecipeScraper] Error checking initial status:', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    };
    checkStatus();
    fetchProcessingStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <AISpecialsTabs activeTab={state.activeTab} onTabChange={state.setActiveTab} />

      {state.activeTab === 'scraping' ? (
        <>
          <ComprehensiveScraperSection
            comprehensiveScraping={state.comprehensiveScraping}
            comprehensiveStatus={state.comprehensiveStatus}
            onStartComprehensive={handleComprehensiveScrape}
            onStopComprehensive={handleStopComprehensiveScrape}
            onResumeComprehensive={handleResumeComprehensiveScrape}
            onRefreshStatus={handleRefreshStatus}
          />

          <RecipeListSection
            recipes={state.recipes}
            loadingRecipes={state.loadingRecipes}
            searchTerm={state.searchTerm}
            setSearchTerm={state.setSearchTerm}
            sourceFilter={state.sourceFilter}
            setSourceFilter={state.setSourceFilter}
            formatFilter={state.formatFilter}
            setFormatFilter={state.setFormatFilter}
            onFetchRecipes={() => {
              state.setPage(1);
              fetchRecipes(1, state.pageSize);
            }}
            page={state.page}
            pageSize={state.pageSize}
            totalRecipes={state.totalRecipes}
            totalPages={state.totalPages}
            onPageChange={newPage => {
              state.setPage(newPage);
              fetchRecipes(newPage, state.pageSize);
            }}
            onPageSizeChange={newPageSize => {
              state.setPageSize(newPageSize);
              state.setPage(1);
              fetchRecipes(1, newPageSize);
            }}
          />
        </>
      ) : (
        <FormattingDashboard
          processing={state.processing}
          recipes={state.recipes}
          loadingRecipes={state.loadingRecipes}
          searchTerm={state.searchTerm}
          setSearchTerm={state.setSearchTerm}
          sourceFilter={state.sourceFilter}
          setSourceFilter={state.setSourceFilter}
          formatFilter={state.formatFilter}
          setFormatFilter={state.setFormatFilter}
          onFetchRecipes={() => {
            state.setPage(1);
            fetchRecipes(1, state.pageSize);
          }}
          page={state.page}
          pageSize={state.pageSize}
          totalRecipes={state.totalRecipes}
          totalPages={state.totalPages}
          onPageChange={newPage => {
            state.setPage(newPage);
            fetchRecipes(newPage, state.pageSize);
          }}
          onPageSizeChange={newPageSize => {
            state.setPageSize(newPageSize);
            state.setPage(1);
            fetchRecipes(1, newPageSize);
          }}
          isResuming={state.isResuming}
          isProcessingStarting={state.isProcessingStarting}
          onProcessAllRecipes={handleProcessAllRecipes}
          onPause={handlePauseFormatting}
          onResume={handleResumeFormatting}
        />
      )}
    </div>
  );
}
