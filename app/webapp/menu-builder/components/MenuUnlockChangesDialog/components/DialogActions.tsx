import { Icon } from '@/components/ui/Icon';
import { Calculator, Eye } from 'lucide-react';

interface DialogActionsProps {
  recalculating: boolean;
  onRecalculatePrices: () => void;
  onReviewChanges?: () => void;
  onDismiss: () => void;
  dismissButtonRef: React.RefObject<HTMLButtonElement>;
}

/**
 * Component for dialog action buttons
 */
export function DialogActions({
  recalculating,
  onRecalculatePrices,
  onReviewChanges,
  onDismiss,
  dismissButtonRef,
}: DialogActionsProps) {
  return (
    <div className="desktop:flex-row flex flex-col gap-3">
      <button
        onClick={onRecalculatePrices}
        disabled={recalculating}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon icon={Calculator} size="sm" aria-hidden={true} />
        <span>{recalculating ? 'Recalculating...' : 'Recalculate All Prices'}</span>
      </button>
      {onReviewChanges && (
        <button
          onClick={onReviewChanges}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-6 py-3 font-semibold text-gray-300 transition-all duration-200 hover:bg-[#2a2a2a]/60 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
        >
          <Icon icon={Eye} size="sm" aria-hidden={true} />
          <span>Review Changes</span>
        </button>
      )}
      <button
        ref={dismissButtonRef}
        onClick={onDismiss}
        className="flex flex-1 items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-6 py-3 font-semibold text-gray-300 transition-all duration-200 hover:bg-[#2a2a2a]/60 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
      >
        Dismiss
      </button>
    </div>
  );
}
