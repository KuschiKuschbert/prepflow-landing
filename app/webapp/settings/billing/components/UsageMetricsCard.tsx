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
    <div className="mb-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Usage</h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Your current data usage vs tier limits
        </p>
      </div>

      <div className="tablet:grid-cols-3 desktop:grid-cols-4 grid grid-cols-1 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-4">
          <div className="flex items-center gap-2">
            <Icon icon={Package} size="md" className="text-[var(--primary)]" aria-hidden={true} />
            <div className="flex-1">
              <p className="text-xs text-[var(--foreground-subtle)]">Ingredients</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {subscriptionData.usage.ingredients}
                {subscriptionData.entitlements.limits?.ingredients && (
                  <span className="text-sm font-normal text-[var(--foreground-muted)]">
                    {' '}
                    / {subscriptionData.entitlements.limits.ingredients}
                  </span>
                )}
              </p>
              {subscriptionData.entitlements.limits?.ingredients && (
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--background)]">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--color-info)] transition-all"
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
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-4">
          <div className="flex items-center gap-2">
            <Icon
              icon={TrendingUp}
              size="md"
              className="text-[var(--color-info)]"
              aria-hidden={true}
            />
            <div className="flex-1">
              <p className="text-xs text-[var(--foreground-subtle)]">Recipes</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {subscriptionData.usage.recipes}
                {subscriptionData.entitlements.limits?.recipes && (
                  <span className="text-sm font-normal text-[var(--foreground-muted)]">
                    {' '}
                    / {subscriptionData.entitlements.limits.recipes}
                  </span>
                )}
              </p>
              {subscriptionData.entitlements.limits?.recipes && (
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--background)]">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--color-info)] to-[var(--accent)] transition-all"
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
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-4">
          <div className="flex items-center gap-2">
            <Icon icon={CreditCard} size="md" className="text-[var(--accent)]" aria-hidden={true} />
            <div>
              <p className="text-xs text-[var(--foreground-subtle)]">Menu Dishes</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {subscriptionData.usage.dishes}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
