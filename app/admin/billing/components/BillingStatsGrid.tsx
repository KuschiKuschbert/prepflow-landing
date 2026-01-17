import { Icon } from '@/components/ui/Icon';
import { AlertCircle, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';

interface BillingData {
  monthlyRecurringRevenue: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  failedPayments: number;
}

interface BillingStatsGridProps {
  data: BillingData | null;
}

export function BillingStatsGrid({ data }: BillingStatsGridProps) {
  return (
    <div className="tablet:grid-cols-3 desktop:grid-cols-4 grid grid-cols-1 gap-4">
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">MRR</h3>
          <Icon icon={DollarSign} size="md" className="text-green-400" />
        </div>
        <p className="text-3xl font-bold text-white">
          ${((data?.monthlyRecurringRevenue || 0) / 100).toFixed(2)}
        </p>
      </div>

      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Active</h3>
          <Icon icon={CheckCircle} size="md" className="text-green-400" />
        </div>
        <p className="text-3xl font-bold text-white">{data?.activeSubscriptions || 0}</p>
      </div>

      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Trials</h3>
          <Icon icon={TrendingUp} size="md" className="text-blue-400" />
        </div>
        <p className="text-3xl font-bold text-white">{data?.trialSubscriptions || 0}</p>
      </div>

      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Failed</h3>
          <Icon icon={AlertCircle} size="md" className="text-red-400" />
        </div>
        <p className="text-3xl font-bold text-white">{data?.failedPayments || 0}</p>
      </div>
    </div>
  );
}
