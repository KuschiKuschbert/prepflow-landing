import { Icon } from '@/components/ui/Icon';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { tierNames, tierDescriptions } from '../constants';
import type { TierSlug } from '@/lib/tier-config';
import type { SubscriptionData } from '../types';

interface TierComparisonCardProps {
  subscriptionData: SubscriptionData | null;
  onUpgrade: (tier: TierSlug) => void;
}

/**
 * Tier comparison card component
 */
export function TierComparisonCard({ subscriptionData, onUpgrade }: TierComparisonCardProps) {
  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Available Plans</h2>
        <p className="mt-1 text-sm text-gray-300">Choose the plan that fits your needs</p>
      </div>

      <div className="desktop:grid-cols-3 grid grid-cols-1 gap-4">
        {(['starter', 'pro', 'business'] as TierSlug[]).map(tier => {
          const isCurrentTier = subscriptionData?.subscription.tier === tier;
          const isUpgrade =
            subscriptionData &&
            (tier === 'pro' || tier === 'business') &&
            subscriptionData.subscription.tier !== tier;

          return (
            <div
              key={tier}
              className={`rounded-xl border p-6 ${
                isCurrentTier
                  ? 'border-[#29E7CD] bg-[#29E7CD]/10'
                  : 'border-[#2a2a2a] bg-[#2a2a2a]/20'
              }`}
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">{tierNames[tier]}</h3>
                <p className="text-sm text-gray-400">{tierDescriptions[tier]}</p>
              </div>

              {isCurrentTier && (
                <div className="mb-4 flex items-center gap-2 text-[#29E7CD]">
                  <Icon icon={CheckCircle} size="sm" />
                  <span className="text-sm font-medium">Current Plan</span>
                </div>
              )}

              {isUpgrade && (
                <button
                  onClick={() => onUpgrade(tier)}
                  className="w-full rounded-lg bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7] px-4 py-2 font-medium text-white transition-all hover:shadow-lg"
                >
                  Upgrade to {tierNames[tier]}
                  <Icon icon={ArrowRight} size="sm" className="ml-2 inline" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
