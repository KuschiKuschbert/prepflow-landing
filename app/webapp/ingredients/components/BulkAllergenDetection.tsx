'use client';

import { useConfirm } from '@/hooks/useConfirm';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Sparkles } from 'lucide-react';

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
      showError('Network error occurred while detecting allergens');
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
              ? 'cursor-not-allowed bg-[#2a2a2a] text-gray-400'
              : 'border border-[#29E7CD]/30 bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20 text-[#29E7CD] hover:border-[#29E7CD]/50 hover:from-[#29E7CD]/30 hover:to-[#D925C7]/30'
          }`}
          title="Detect allergens for ingredients missing them"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-[#29E7CD]" />
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
          <div className="rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-3 text-xs text-gray-400">
            <div className="space-y-1">
              <div>Processed: {progress.processed}</div>
              <div className="text-green-400">Successful: {progress.successful}</div>
              {progress.skipped > 0 && (
                <div className="text-yellow-400">Skipped: {progress.skipped}</div>
              )}
              {progress.failed > 0 && <div className="text-red-400">Failed: {progress.failed}</div>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}


