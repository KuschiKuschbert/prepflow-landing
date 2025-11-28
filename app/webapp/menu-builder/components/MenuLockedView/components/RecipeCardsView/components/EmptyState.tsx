/**
 * Empty state component for RecipeCardsView.
 */

import { Loader2, RefreshCw } from 'lucide-react';
import { logger } from '@/lib/logger';

interface EmptyStateProps {
  menuId: string;
  generating: boolean;
  loading: boolean;
  error: string | null;
  isGeneratingInBackground: boolean;
  onGenerate: () => void;
}

export function EmptyState({
  menuId,
  generating,
  loading,
  error,
  isGeneratingInBackground,
  onGenerate,
}: EmptyStateProps) {
  logger.dev('[EmptyState] Rendering empty state', {
    menuId,
    loading,
    generating,
    error,
    hasError: !!error,
  });

  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center">
      {isGeneratingInBackground ? (
        <>
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#29E7CD]" />
          <p className="mt-4 text-gray-400">
            Recipe cards are being generated in the background...
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Cards will appear automatically as they&apos;re ready. This typically takes 30-40
            seconds with parallel processing.
          </p>
          <p className="mt-2 text-xs text-gray-600">
            ⚡ Using parallel batch processing for faster generation
          </p>
        </>
      ) : (
        <>
          <p className="text-gray-400">No recipe cards generated yet.</p>
          <p className="mt-2 mb-6 text-sm text-gray-500">
            Recipe cards (including sub-recipes like sauces, marinades, and brines) are
            automatically generated when a menu is locked. You can also generate them manually
            below.
          </p>
          <p className="mb-6 text-xs text-gray-600">
            ⏱️ Generation typically takes 30-40 seconds with parallel processing (was 2-3 minutes).
          </p>
        </>
      )}
      <button
        type="button"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          logger.dev('[EmptyState] Generate button clicked!', { menuId, generating });
          if (!generating) {
            onGenerate();
          }
        }}
        disabled={generating || loading}
        className="mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Generate recipe cards for this menu"
      >
        {generating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Recipe Cards
          </>
        )}
      </button>
      {error && (
        <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-left">
          <p className="text-sm font-semibold text-red-400">Error:</p>
          <p className="mt-2 text-sm whitespace-pre-line text-red-300">{error}</p>
          <p className="mt-2 text-xs text-gray-500">
            Check the browser console (F12) for more details.
          </p>
        </div>
      )}
    </div>
  );
}
