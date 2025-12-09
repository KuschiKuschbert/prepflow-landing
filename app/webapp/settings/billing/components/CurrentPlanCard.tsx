import { Icon } from '@/components/ui/Icon';
import { CheckCircle } from 'lucide-react';
import { formatDate } from '../utils';
import type { SubscriptionData } from '../types';

interface CurrentPlanCardProps {
  subscriptionData: SubscriptionData;
}

/**
 * Current plan card component
 */
export function CurrentPlanCard({ subscriptionData }: CurrentPlanCardProps) {
  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Current Plan</h2>
        <p className="mt-1 text-sm text-gray-300">Your active subscription details</p>
      </div>

      <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
        <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4">
          <p className="text-xs text-gray-500">Plan</p>
          <p className="text-lg font-semibold text-white capitalize">
            {subscriptionData.subscription.tier}
          </p>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4">
          <p className="text-xs text-gray-500">Status</p>
          <div className="flex items-center gap-2">
            <Icon
              icon={CheckCircle}
              size="sm"
              className={
                subscriptionData.subscription.status === 'active'
                  ? 'text-green-400'
                  : 'text-yellow-400'
              }
              aria-hidden={true}
            />
            <p className="text-lg font-semibold text-white capitalize">
              {subscriptionData.subscription.status}
            </p>
          </div>
        </div>
        {subscriptionData.subscription.expires_at && (
          <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4">
            <p className="text-xs text-gray-500">Renewal Date</p>
            <p className="text-lg font-semibold text-white">
              {formatDate(subscriptionData.subscription.expires_at)}
            </p>
          </div>
        )}
        <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4">
          <p className="text-xs text-gray-500">Member Since</p>
          <p className="text-lg font-semibold text-white">
            {formatDate(subscriptionData.subscription.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
