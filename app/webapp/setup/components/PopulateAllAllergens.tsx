'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Sparkles, AlertTriangle, CheckCircle2, Check, X } from 'lucide-react';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';

export default function PopulateAllAllergens() {
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    total: number;
    processed: number;
    successful: number;
    failed: number;
    skipped: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dryRunResult, setDryRunResult] = useState<{
    total: number;
    to_process: number;
    skipped: number;
  } | null>(null);

  const runDryRun = async () => {
    setLoading(true);
    setError(null);
    setDryRunResult(null);

    try {
      const response = await fetch('/api/ingredients/populate-all-allergens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dry_run: true }),
      });

      const data = await response.json();

      if (response.ok && data.dry_run) {
        setDryRunResult(data.data);
      } else {
        setError(data.error || 'Failed to run dry run');
      }
    } catch (err) {
      logger.error('[PopulateAllAllergens.tsx] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const populateAllAllergens = async () => {
    const confirmed = await showConfirm({
      title: 'Auto-Detect Allergens?',
      message:
        "This will auto-detect allergens for ingredients that don't have manual entries. Might take a few minutes. Want me to get started?",
      variant: 'info',
      confirmLabel: 'Get Started',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setDryRunResult(null);

    try {
      const response = await fetch('/api/ingredients/populate-all-allergens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dry_run: false }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.data);
      } else {
        setError(data.error || data.message || 'Failed to populate allergens');
      }
    } catch (err) {
      logger.error('[PopulateAllAllergens.tsx] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-lg">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-[var(--foreground)]">What this does:</h4>
              <Icon icon={Sparkles} size="md" className="text-[var(--primary)]" aria-hidden={true} />
            </div>
            <ul className="space-y-2 text-[var(--foreground-secondary)]">
              <li className="flex items-center space-x-2">
                <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span>
                  Automatically detects allergens using keyword matching and AI (hybrid detection)
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span>
                  Only processes ingredients without manual allergens (won&apos;t overwrite)
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span>
                  Uses non-AI detection first (fast), falls back to AI for complex ingredients
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
                <span>Processes ingredients in batches to respect rate limits</span>
              </li>
            </ul>
          </div>

          {dryRunResult && (
            <div className="mb-6 rounded-2xl border border-[var(--color-info)]/30 bg-blue-900/20 p-4 text-blue-300">
              <div className="mb-2 flex items-center space-x-2">
                <Icon icon={AlertTriangle} size="sm" className="text-[var(--color-info)]" aria-hidden={true} />
                <span className="font-semibold">Dry Run Preview</span>
              </div>
              <ul className="space-y-1 text-sm">
                <li>Total ingredients: {dryRunResult.total}</li>
                <li>To process: {dryRunResult.to_process}</li>
                <li>Will skip (has manual allergens): {dryRunResult.skipped}</li>
              </ul>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-[var(--color-error)]/30 bg-red-900/20 p-4 text-red-300">
              <div className="flex items-center space-x-2">
                <Icon icon={AlertTriangle} size="sm" className="text-[var(--color-error)]" aria-hidden={true} />
                <span>{error}</span>
              </div>
            </div>
          )}

          {result && (
            <div className="mb-6 rounded-2xl border border-[var(--color-success)]/30 bg-green-900/20 p-4 text-green-300">
              <div className="mb-2 flex items-center space-x-2">
                <Icon icon={CheckCircle2} size="sm" className="text-[var(--color-success)]" aria-hidden={true} />
                <span className="font-semibold">Allergen Population Complete!</span>
              </div>
              <ul className="space-y-1 text-sm">
                <li>Total ingredients: {result.total}</li>
                <li>Processed: {result.processed}</li>
                <li className="flex items-center gap-2 text-[var(--color-success)]">
                  <Icon icon={Check} size="xs" className="text-[var(--color-success)]" aria-hidden={true} />
                  Successful: {result.successful}
                </li>
                {result.failed > 0 && (
                  <li className="flex items-center gap-2 text-[var(--color-error)]">
                    <Icon icon={X} size="xs" className="text-[var(--color-error)]" aria-hidden={true} />
                    Failed: {result.failed}
                  </li>
                )}
                <li>Skipped (has manual allergens): {result.skipped}</li>
              </ul>
            </div>
          )}

          <div className="tablet:flex-row flex flex-col gap-4">
            <button
              onClick={runDryRun}
              disabled={loading}
              className={`flex-1 rounded-2xl px-6 py-3 text-base font-semibold transition-all duration-200 ${
                loading
                  ? 'cursor-not-allowed bg-[var(--muted)] text-[var(--foreground-muted)]'
                  : 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--surface-variant)]'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-400"></div>
                  <span>Running...</span>
                </span>
              ) : (
                'Preview (Dry Run)'
              )}
            </button>

            <button
              onClick={populateAllAllergens}
              disabled={loading}
              className={`flex-1 rounded-2xl px-6 py-3 text-base font-semibold transition-all duration-200 ${
                loading
                  ? 'cursor-not-allowed bg-[var(--muted)] text-[var(--foreground-muted)]'
                  : 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)] shadow-lg hover:from-[var(--primary)]/80 hover:to-[var(--accent)]/80 hover:shadow-xl'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                  <span>Populating Allergens...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Icon icon={Sparkles} size="sm" className="text-[var(--foreground)]" aria-hidden={true} />
                  <span>Populate All Allergens</span>
                </span>
              )}
            </button>
          </div>

          {!loading && (
            <p className="mt-4 text-center text-sm text-[var(--foreground-muted)]">
              This operation can only be run once per hour. Use the preview button to see what would
              be processed.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
