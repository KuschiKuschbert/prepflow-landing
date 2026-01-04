'use client';

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
    <div className="mb-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Available Plans</h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Choose the plan that fits your needs
        </p>
      </div>

      <div className="tablet:grid-cols-3 desktop:grid-cols-4 grid grid-cols-1 gap-4">
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
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                  : 'border-[var(--border)] bg-[var(--muted)]/20'
              }`}
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[var(--foreground)]">{tierNames[tier]}</h3>
                <p className="text-sm text-[var(--foreground-muted)]">{tierDescriptions[tier]}</p>
              </div>

              {isCurrentTier && (
                <div className="mb-4 flex items-center gap-2 text-[var(--primary)]">
                  <Icon icon={CheckCircle} size="sm" />
                  <span className="text-sm font-medium">Current Plan</span>
                </div>
              )}

              {isUpgrade && (
                <button
                  onClick={() => onUpgrade(tier)}
                  className="w-full rounded-lg bg-gradient-to-r from-[var(--primary)] via-[#FF6B00] to-[var(--accent)] px-4 py-2 font-medium text-[var(--button-active-text)] transition-all hover:shadow-lg"
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
