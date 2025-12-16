'use client';

import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

interface BulkAllergenDetectionProps {
  onComplete?: () => void;
}

/**
 * Bulk allergen detection component.
 * Detects allergens for ingredients that don't have them.
 *
 * @component
 * @param {BulkAllergenDetectionProps} props - Component props
 * @returns {JSX.Element} Bulk allergen detection button
 */
export function BulkAllergenDetection({ onComplete }: BulkAllergenDetectionProps) {
  const { showConfirm, ConfirmDialog } = useConfirm();
  const { showSuccess, showError, showWarning } = useNotification();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{
    processed: number;
    successful: number;
    failed: number;
    skipped: number;
  } | null>(null);

  const handleDetectAllergens = async () => {
    const confirmed = await showConfirm({
      title: 'Detect Missing Allergens?',
      message:
        "This will detect allergens for all ingredients that don't have them yet. Ingredients with manually set allergens will be skipped. This may take a few minutes.",
      variant: 'info',
      confirmLabel: 'Detect Allergens',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setProgress(null);

    try {
      const response = await fetch('/api/ingredients/detect-missing-allergens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force: false }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { processed, successful, failed, skipped } = data.data;
        setProgress({ processed, successful, failed, skipped });

        if (successful > 0) {
          showSuccess(
            `Allergen detection complete: ${successful} ingredients updated, ${skipped} skipped, ${failed} failed`,
          );
        } else if (skipped === processed) {
          showWarning('All ingredients already have allergens or are manually set');
        } else {
          showWarning(`No allergens detected. ${failed > 0 ? `${failed} failed.` : ''}`);
        }

        if (onComplete) {
          onComplete();
        }
      } else {
        showError(data.error || data.message || 'Failed to detect allergens');
      }
    } catch (err) {
      logger.error('[BulkAllergenDetection] Error:', err);
      showError('Connection issue while detecting allergens. Give it another go, chef.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div className="flex flex-col gap-2">
        <button
          onClick={handleDetectAllergens}
          disabled={loading}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
            loading
              ? 'cursor-not-allowed bg-[var(--muted)] text-[var(--foreground-muted)]'
              : 'border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20 text-[var(--primary)] hover:border-[var(--primary)]/50 hover:from-[var(--primary)]/30 hover:to-[var(--accent)]/30'
          }`}
          title="Detect allergens for ingredients missing them"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-[var(--primary)]" />
              <span>Detecting...</span>
            </>
          ) : (
            <>
              <Icon icon={Sparkles} size="sm" className="text-current" aria-hidden={true} />
              <span>Detect Missing Allergens</span>
            </>
          )}
        </button>

        {progress && (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--foreground-muted)]">
            <div className="space-y-1">
              <div>Processed: {progress.processed}</div>
              <div className="text-[var(--color-success)]">Successful: {progress.successful}</div>
              {progress.skipped > 0 && (
                <div className="text-[var(--color-warning)]">Skipped: {progress.skipped}</div>
              )}
              {progress.failed > 0 && <div className="text-[var(--color-error)]">Failed: {progress.failed}</div>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
