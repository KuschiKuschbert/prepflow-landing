/**
 * Formatting Dashboard Component
 * Container component that combines ProcessingStatus and RecipeListSection for the formatting tab
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { Loader2, Sparkles } from 'lucide-react';
import { ProcessingStatus } from './ProcessingStatus';
import { RecipeListSection } from './RecipeListSection';

interface ProcessingStatus {
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
  geminiQuota?: {
    available: boolean;
    error?: string;
    quotaInfo?: string;
    isDailyLimit?: boolean;
    suggestedModel?: string;
  };
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
  rating?: number;
  dietary_tags?: string[];
}

interface FormattingDashboardProps {
  processing: ProcessingStatus | null;
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
  isResuming?: boolean;
  isProcessingStarting?: boolean;
  onProcessAllRecipes?: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

export function FormattingDashboard({
  processing,
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
  isResuming = false,
  isProcessingStarting = false,
  onProcessAllRecipes,
  onPause,
  onResume,
}: FormattingDashboardProps) {
  const isProcessing = processing?.isProcessing && !processing?.isPaused;
  const aiProvider = processing?.aiProvider || 'Unknown';
  const aiProviderModel = processing?.aiProviderModel || 'Unknown';
  const quotaExceeded = processing?.geminiQuota && !processing.geminiQuota.available;

  return (
    <div className="space-y-6">
      <ProcessingStatus
        processing={processing}
        isResuming={isResuming}
        onPause={onPause}
        onResume={onResume}
      />

      <div className="desktop:p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[var(--foreground)]">
          <Icon icon={Sparkles} size="md" className="text-[var(--primary)]" aria-hidden={true} />
          Recipes for Formatting
        </h2>

        <div className="mb-4 flex flex-wrap gap-3">
          {onProcessAllRecipes && (
            <button
              onClick={onProcessAllRecipes}
              disabled={isProcessingStarting || isProcessing || quotaExceeded}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-white transition-all hover:shadow-[var(--primary)]/25 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={
                quotaExceeded
                  ? 'Process all recipes disabled - Gemini API quota exceeded'
                  : 'Process all recipes with AI formatting'
              }
              title={
                quotaExceeded
                  ? 'Gemini API quota exceeded. Please check your billing at https://ai.dev/usage?tab=rate-limit'
                  : undefined
              }
            >
              {isProcessingStarting ? (
                <>
                  <Icon icon={Loader2} size="sm" className="animate-spin" aria-hidden={true} />
                  Starting...
                </>
              ) : quotaExceeded ? (
                <>
                  <Icon icon={Sparkles} size="sm" aria-hidden={true} />
                  Quota Exceeded
                </>
              ) : (
                <>
                  <Icon icon={Sparkles} size="sm" aria-hidden={true} />
                  Process All Recipes
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground-muted)]">
            <span>AI Provider:</span>
            <span className="font-semibold text-[var(--foreground)]">
              {aiProvider} {aiProviderModel !== 'Unknown' ? `(${aiProviderModel})` : ''}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {processing && processing.totalRecipes > 0 ? (
            <div className="text-sm text-[var(--foreground-muted)]">
              <span className="font-semibold text-[var(--foreground)]">
                {processing.totalRecipes.toLocaleString()}
              </span>{' '}
              recipe{processing.totalRecipes !== 1 ? 's' : ''} need formatting
              {totalRecipes > processing.totalRecipes && (
                <span className="text-[var(--foreground-muted)]">
                  {' '}
                  (out of {totalRecipes.toLocaleString()} total scraped recipe
                  {totalRecipes !== 1 ? 's' : ''})
                </span>
              )}
            </div>
          ) : totalRecipes > 0 ? (
            <div className="text-sm text-[var(--foreground-muted)]">
              All {totalRecipes.toLocaleString()} recipe{totalRecipes !== 1 ? 's' : ''} have been
              formatted
            </div>
          ) : (
            <div className="text-sm text-[var(--foreground-muted)]">
              No recipes available for formatting
            </div>
          )}
        </div>
      </div>

      <RecipeListSection
        recipes={recipes}
        loadingRecipes={loadingRecipes}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        formatFilter={formatFilter}
        setFormatFilter={setFormatFilter}
        onFetchRecipes={onFetchRecipes}
        page={page}
        pageSize={pageSize}
        totalRecipes={totalRecipes}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
