import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { CheckCircle } from 'lucide-react';

interface ReactivateCancelledCardProps {
  isCancelled: boolean;
  cancelAtPeriodEnd: boolean;
  reactivating: boolean;
  onReactivate: () => void;
}

/**
 * Reactivate cancelled subscription card component
 */
export function ReactivateCancelledCard({
  isCancelled,
  cancelAtPeriodEnd,
  reactivating,
  onReactivate,
}: ReactivateCancelledCardProps) {
  if (!isCancelled || cancelAtPeriodEnd) return null;

  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Reactivate Subscription</h2>
        <p className="mt-1 text-sm text-gray-300">
          Your subscription has been cancelled. Reactivate it to continue using PrepFlow.
        </p>
      </div>

      <Button
        onClick={onReactivate}
        disabled={reactivating}
        variant="primary"
        className="flex items-center gap-2"
      >
        <Icon icon={CheckCircle} size="sm" />
        {reactivating ? 'Reactivating...' : 'Reactivate Subscription'}
      </Button>
    </div>
  );
}
