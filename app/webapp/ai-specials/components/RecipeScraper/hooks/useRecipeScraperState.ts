/**
 * Hook for managing recipe scraper state
 */

import { useState } from 'react';

import { ComprehensiveJobStatus, ScrapedRecipe } from '../types';

interface ProcessingState {
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
}

export function useRecipeScraperState() {
  const [activeTab, setActiveTab] = useState<'scraping' | 'formatting'>('scraping');
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
  const [comprehensiveStatus, setComprehensiveStatus] = useState<ComprehensiveJobStatus | null>(null);
  const [statusPolling, setStatusPolling] = useState(false);
  const [processing, setProcessing] = useState<ProcessingState | null>(null);
  const [isResuming, setIsResuming] = useState(false);
  const [isProcessingStarting, setIsProcessingStarting] = useState(false);
  const [processingPolling, setProcessingPolling] = useState(false);

  return {
    activeTab,
    setActiveTab,
    recipes,
    setRecipes,
    loadingRecipes,
    setLoadingRecipes,
    searchTerm,
    setSearchTerm,
    sourceFilter,
    setSourceFilter,
    formatFilter,
    setFormatFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalRecipes,
    setTotalRecipes,
    totalPages,
    setTotalPages,
    comprehensiveScraping,
    setComprehensiveScraping,
    comprehensiveStatus,
    setComprehensiveStatus,
    statusPolling,
    setStatusPolling,
    processing,
    setProcessing,
    isResuming,
    setIsResuming,
    isProcessingStarting,
    setIsProcessingStarting,
    processingPolling,
    setProcessingPolling,
  };
}
