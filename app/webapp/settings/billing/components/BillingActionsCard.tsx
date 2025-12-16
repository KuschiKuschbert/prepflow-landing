import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { CreditCard } from 'lucide-react';

interface BillingActionsCardProps {
  openingPortal: boolean;
  onOpenPortal: () => void;
}

/**
 * Billing actions card component
 */
export function BillingActionsCard({ openingPortal, onOpenPortal }: BillingActionsCardProps) {
  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Billing Management</h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Manage your payment method, view invoices, and update your subscription.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onOpenPortal}
          disabled={openingPortal}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Icon icon={CreditCard} size="sm" />
          {openingPortal ? 'Opening...' : 'Manage Billing'}
        </Button>
      </div>

      <p className="text-xs text-[var(--foreground-subtle)]">
        The billing portal allows you to update your payment method, view billing history, and
        manage your subscription.
      </p>
    </div>
  );
}
