'use client';

import { Icon } from '@/components/ui/Icon';
import { Calculator, Eye } from 'lucide-react';

interface DialogActionsProps {
  onRecalculatePrices: () => void;
  onReviewChanges?: () => void;
  onDismiss: () => void;
  dismissButtonRef: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Component for dialog action buttons
 */
export function DialogActions({
  onRecalculatePrices,
  onReviewChanges,
  onDismiss,
  dismissButtonRef,
}: DialogActionsProps) {
  return (
    <div className="desktop:flex-row flex flex-col gap-3">
      <button
        onClick={onRecalculatePrices}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
      >
        <Icon icon={Calculator} size="sm" aria-hidden={true} />
        <span>Recalculate All Prices</span>
      </button>
      {onReviewChanges && (
        <button
          onClick={onReviewChanges}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/40 px-6 py-3 font-semibold text-[var(--foreground-secondary)] transition-all duration-200 hover:bg-[var(--muted)]/60 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
        >
          <Icon icon={Eye} size="sm" aria-hidden={true} />
          <span>Review Changes</span>
        </button>
      )}
      <button
        ref={dismissButtonRef}
        onClick={onDismiss}
        className="flex flex-1 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--muted)]/40 px-6 py-3 font-semibold text-[var(--foreground-secondary)] transition-all duration-200 hover:bg-[var(--muted)]/60 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
      >
        Dismiss
      </button>
    </div>
  );
}
