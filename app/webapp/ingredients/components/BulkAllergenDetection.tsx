'use client';

import { Icon } from '@/components/ui/Icon';
import { Sparkles } from 'lucide-react';
import { useBulkAllergenDetection } from './hooks/useBulkAllergenDetection';

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
  const { progress, detectAllergens, ConfirmDialog } = useBulkAllergenDetection({ onComplete });

  return (
    <>
      <ConfirmDialog />
      <div className="flex flex-col gap-2">
        <button
          onClick={detectAllergens}
          disabled={!!progress}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
            progress
              ? 'cursor-not-allowed bg-[var(--muted)] text-[var(--foreground-muted)]'
              : 'border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20 text-[var(--primary)] hover:border-[var(--primary)]/50 hover:from-[var(--primary)]/30 hover:to-[var(--accent)]/30'
          }`}
          title="Detect allergens for ingredients missing them"
        >
          <Icon icon={Sparkles} size="sm" className="text-current" aria-hidden={true} />
          <span>{progress ? 'Detecting Allergens...' : 'Detect Missing Allergens'}</span>
        </button>

        {progress && (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--foreground-muted)]">
            <div className="space-y-1">
              <div>Processed: {progress.processed}</div>
              <div className="text-[var(--color-success)]">Successful: {progress.successful}</div>
              {progress.skipped > 0 && (
                <div className="text-[var(--color-warning)]">Skipped: {progress.skipped}</div>
              )}
              {progress.failed > 0 && (
                <div className="text-[var(--color-error)]">Failed: {progress.failed}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
