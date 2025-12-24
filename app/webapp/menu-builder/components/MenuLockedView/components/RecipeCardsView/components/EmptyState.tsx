'use client';

/**
 * Empty state component for RecipeCardsView.
 */

import { Loader2, RefreshCw, Zap, Clock } from 'lucide-react';
import { logger } from '@/lib/logger';
import { Icon } from '@/components/ui/Icon';

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
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
      {isGeneratingInBackground ? (
        <>
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--primary)]" />
          <p className="mt-4 text-[var(--foreground-muted)]">
            Recipe cards are being generated in the background...
          </p>
          <p className="mt-2 text-sm text-[var(--foreground-subtle)]">
            Cards will appear automatically as they&apos;re ready. This typically takes 30-40
            seconds with parallel processing.
          </p>
          <p className="mt-2 flex items-center justify-center gap-1 text-xs text-[var(--foreground-subtle)]">
            <Icon icon={Zap} size="xs" className="text-[var(--primary)]" aria-hidden={true} />
            Using parallel batch processing for faster generation
          </p>
        </>
      ) : (
        <>
          <p className="text-[var(--foreground-muted)]">No recipe cards generated yet.</p>
          <p className="mt-2 mb-6 text-sm text-[var(--foreground-subtle)]">
            Recipe cards (including sub-recipes like sauces, marinades, and brines) are
            automatically generated when a menu is locked. You can also generate them manually
            below.
          </p>
          <p className="mb-6 flex items-center justify-center gap-1 text-xs text-[var(--foreground-subtle)]">
            <Icon icon={Clock} size="xs" className="text-[var(--primary)]" aria-hidden={true} />
            Generation typically takes 30-40 seconds with parallel processing (was 2-3 minutes).
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
        className="mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="mt-4 rounded-lg border border-[var(--color-error)]/50 bg-[var(--color-error)]/10 p-4 text-left">
          <p className="text-sm font-semibold text-[var(--color-error)]">Error:</p>
          <p className="mt-2 text-sm whitespace-pre-line text-red-300">{error}</p>
          <p className="mt-2 text-xs text-[var(--foreground-subtle)]">
            Check the browser console (F12) for more details.
          </p>
        </div>
      )}
    </div>
  );
}
