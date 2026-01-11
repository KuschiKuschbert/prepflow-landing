/**
 * Hook for fetching recipes
 */

import { useCallback } from 'react';
import { logger } from '@/lib/logger';

interface FetchRecipesParams {
  page: number;
  pageSize: number;
  searchTerm: string;
  sourceFilter: string;
  formatFilter: 'all' | 'formatted' | 'unformatted';
  setLoadingRecipes: (loading: boolean) => void;
  setRecipes: (recipes: any[]) => void;
  setTotalRecipes: (total: number) => void;
  setTotalPages: (pages: number) => void;
}

export function useRecipeFetching({
  page,
  pageSize,
  searchTerm,
  sourceFilter,
  formatFilter,
  setLoadingRecipes,
  setRecipes,
  setTotalRecipes,
  setTotalPages,
}: FetchRecipesParams) {
  const fetchRecipes = useCallback(
    async (pageNum: number = page, pageSizeNum: number = pageSize) => {
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

        if (result.success && result.data) {
          setRecipes(result.data.recipes || []);
          setTotalRecipes(result.data.pagination?.total || 0);
          setTotalPages(result.data.pagination?.totalPages || 0);
        } else {
          logger.error('[Recipe Scraper] Failed to fetch recipes:', result);
          setRecipes([]);
          setTotalRecipes(0);
          setTotalPages(0);
        }
      } catch (error) {
        logger.error('[Recipe Scraper] Error fetching recipes:', {
          error: error instanceof Error ? error.message : String(error),
        });
        setRecipes([]);
        setTotalRecipes(0);
        setTotalPages(0);
      } finally {
        setLoadingRecipes(false);
      }
    },
    [page, pageSize, searchTerm, sourceFilter, formatFilter, setLoadingRecipes, setRecipes, setTotalRecipes, setTotalPages],
  );

  return { fetchRecipes };
}
