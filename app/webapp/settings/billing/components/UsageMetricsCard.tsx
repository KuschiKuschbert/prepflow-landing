import { Icon } from '@/components/ui/Icon';
import { CreditCard, Package, TrendingUp } from 'lucide-react';
import { getUsagePercentage } from '../utils';
import type { SubscriptionData } from '../types';

interface UsageMetricsCardProps {
  subscriptionData: SubscriptionData;
}

/**
 * Usage metrics card component
 */
export function UsageMetricsCard({ subscriptionData }: UsageMetricsCardProps) {
  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Usage</h2>
        <p className="mt-1 text-sm text-gray-300">Your current data usage vs tier limits</p>
      </div>

      <div className="desktop:grid-cols-3 grid grid-cols-1 gap-4">
        <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4">
          <div className="flex items-center gap-2">
            <Icon icon={Package} size="md" className="text-[#29E7CD]" aria-hidden={true} />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Ingredients</p>
              <p className="text-2xl font-bold text-white">
                {subscriptionData.usage.ingredients}
                {subscriptionData.entitlements.limits?.ingredients && (
                  <span className="text-sm font-normal text-gray-400">
                    {' '}
                    / {subscriptionData.entitlements.limits.ingredients}
                  </span>
                )}
              </p>
              {subscriptionData.entitlements.limits?.ingredients && (
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#0a0a0a]">
                  <div
                    className="h-full bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] transition-all"
                    style={{
                      width: `${getUsagePercentage(
                        subscriptionData.usage.ingredients,
                        subscriptionData.entitlements.limits?.ingredients,
                      )}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4">
          <div className="flex items-center gap-2">
            <Icon icon={TrendingUp} size="md" className="text-[#3B82F6]" aria-hidden={true} />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Recipes</p>
              <p className="text-2xl font-bold text-white">
                {subscriptionData.usage.recipes}
                {subscriptionData.entitlements.limits?.recipes && (
                  <span className="text-sm font-normal text-gray-400">
                    {' '}
                    / {subscriptionData.entitlements.limits.recipes}
                  </span>
                )}
              </p>
              {subscriptionData.entitlements.limits?.recipes && (
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#0a0a0a]">
                  <div
                    className="h-full bg-gradient-to-r from-[#3B82F6] to-[#D925C7] transition-all"
                    style={{
                      width: `${getUsagePercentage(
                        subscriptionData.usage.recipes,
                        subscriptionData.entitlements.limits?.recipes,
                      )}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4">
          <div className="flex items-center gap-2">
            <Icon icon={CreditCard} size="md" className="text-[#D925C7]" aria-hidden={true} />
            <div>
              <p className="text-xs text-gray-500">Menu Dishes</p>
              <p className="text-2xl font-bold text-white">{subscriptionData.usage.dishes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
