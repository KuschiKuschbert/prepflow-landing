'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { CheckCircle, CreditCard, Package, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface SubscriptionData {
  subscription: {
    tier: string;
    status: string;
    expires_at: string | null;
    created_at: string | null;
  };
  entitlements: {
    tier: string;
    features: Record<string, boolean>;
  };
  usage: {
    ingredients: number;
    recipes: number;
    dishes: number;
  };
}

/**
 * Billing & Subscription section component.
 * Displays subscription details, usage metrics, and billing management options.
 *
 * @component
 * @returns {JSX.Element} Billing section
 */
export function BillingSection() {
  const { showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [openingPortal, setOpeningPortal] = useState(false);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const response = await fetch('/api/user/subscription');
        if (!response.ok) {
          throw new Error('Failed to load subscription');
        }

        const data = await response.json();
        setSubscriptionData(data);
      } catch (error) {
        logger.error('Failed to load subscription:', error);
        showError('Failed to load subscription information');
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, [showError]);

  const handleOpenPortal = async () => {
    setOpeningPortal(true);
    try {
      const response = await fetch('/api/billing/create-portal-session', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to open billing portal');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      logger.error('Failed to open billing portal:', error);
      showError(error instanceof Error ? error.message : 'Failed to open billing portal');
      setOpeningPortal(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-[#2a2a2a]" />
        <div className="h-4 w-64 animate-pulse rounded bg-[#2a2a2a]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {subscriptionData && (
        <>
          {/* Current Plan */}
          <div className="space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
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

          {/* Usage Metrics */}
          <div className="space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
            <div>
              <h2 className="text-xl font-semibold">Usage</h2>
              <p className="mt-1 text-sm text-gray-300">Your current data usage</p>
            </div>

            <div className="desktop:grid-cols-3 grid grid-cols-1 gap-4">
              <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4">
                <div className="flex items-center gap-2">
                  <Icon icon={Package} size="md" className="text-[#29E7CD]" aria-hidden={true} />
                  <div>
                    <p className="text-xs text-gray-500">Ingredients</p>
                    <p className="text-2xl font-bold text-white">
                      {subscriptionData.usage.ingredients}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4">
                <div className="flex items-center gap-2">
                  <Icon icon={TrendingUp} size="md" className="text-[#3B82F6]" aria-hidden={true} />
                  <div>
                    <p className="text-xs text-gray-500">Recipes</p>
                    <p className="text-2xl font-bold text-white">
                      {subscriptionData.usage.recipes}
                    </p>
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

          {/* Billing Actions */}
          <div className="space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
            <div>
              <h2 className="text-xl font-semibold">Billing Management</h2>
              <p className="mt-1 text-sm text-gray-300">
                Manage your payment method, view invoices, and update your subscription.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <form method="post" action="/api/billing/create-checkout-session">
                <input type="hidden" name="tier" value="starter" />
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 font-medium text-white transition-all hover:shadow-lg"
                >
                  Subscribe / Change Plan
                </button>
              </form>
              <button
                onClick={handleOpenPortal}
                disabled={openingPortal}
                className="rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-2 transition-colors hover:bg-[#2a2a2a]/60 disabled:opacity-50"
              >
                {openingPortal ? 'Opening...' : 'Manage Billing'}
              </button>
            </div>

            <p className="text-xs text-gray-500">
              The billing portal allows you to update your payment method, view billing history, and
              manage your subscription.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

